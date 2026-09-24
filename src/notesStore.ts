import { useEffect, useMemo, useRef, useState } from 'react'
import {
  addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc,
} from 'firebase/firestore'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, db, firebaseConfigured, googleProvider, keepSession } from './firebase'
import { starterNotes } from './demoData'
import type { Note, SyncState } from './types'
import { timestampMillis } from './lib'

const demoKey = 'quiet-notes-demo'

function makeNoteId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function readDemoNotes() {
  try {
    const stored = localStorage.getItem(demoKey)
    return stored ? JSON.parse(stored) as Note[] : starterNotes
  } catch {
    return starterNotes
  }
}

function writeDemoNotes(notes: Note[]) {
  localStorage.setItem(demoKey, JSON.stringify(notes))
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(firebaseConfigured)

  useEffect(() => {
    if (!auth) return
    void keepSession()
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  return { user, loading, configured: firebaseConfigured }
}

export async function signIn() {
  if (!auth) return
  await signInWithPopup(auth, googleProvider)
}

export async function signOutUser() {
  if (auth) await signOut(auth)
}

export function useNotes(user: User | null) {
  const [notes, setNotes] = useState<Note[]>(() => firebaseConfigured ? [] : readDemoNotes())
  const [syncState, setSyncState] = useState<SyncState>(firebaseConfigured ? 'syncing' : 'demo')
  const [error, setError] = useState('')
  const writeTimers = useRef<Record<string, number>>({})

  useEffect(() => {
    if (!db || !user) {
      if (!firebaseConfigured) setNotes(readDemoNotes())
      setSyncState(firebaseConfigured ? 'offline' : 'demo')
      return
    }

    setSyncState(navigator.onLine ? 'syncing' : 'offline')
    const notesRef = collection(db, 'users', user.uid, 'notes')
    const notesQuery = query(notesRef, orderBy('updatedAt', 'desc'))
    return onSnapshot(notesQuery, { includeMetadataChanges: true }, (snapshot) => {
      setNotes(snapshot.docs.map((item) => ({ id: item.id, ...item.data() } as Note)))
      setSyncState(!navigator.onLine ? 'offline' : snapshot.metadata.hasPendingWrites ? 'syncing' : 'synced')
      setError('')
    }, () => {
      setError('Could not reach your notes. Your local changes are still safe.')
      setSyncState('offline')
    })
  }, [user])

  useEffect(() => {
    const online = () => setSyncState(firebaseConfigured ? 'syncing' : 'demo')
    const offline = () => setSyncState('offline')
    window.addEventListener('online', online)
    window.addEventListener('offline', offline)
    return () => {
      window.removeEventListener('online', online)
      window.removeEventListener('offline', offline)
    }
  }, [])

  const activeNotes = useMemo(() => [...notes].sort((a, b) => timestampMillis(b.updatedAt) - timestampMillis(a.updatedAt)), [notes])

  function saveNote(note: Note) {
    const next = { ...note, updatedAt: new Date() }
    setNotes((current) => current.some((item) => item.id === note.id) ? current.map((item) => item.id === note.id ? next : item) : [next, ...current])
    setSyncState(firebaseConfigured ? 'syncing' : 'demo')
    if (!db || !user) {
      const nextNotes = readDemoNotes().some((item) => item.id === next.id) ? readDemoNotes().map((item) => item.id === next.id ? next : item) : [next, ...readDemoNotes()]
      writeDemoNotes(nextNotes)
      return
    }
    const firestore = db
    const currentUser = user
    window.clearTimeout(writeTimers.current[note.id])
    writeTimers.current[note.id] = window.setTimeout(() => {
      void setDoc(doc(firestore, 'users', currentUser.uid, 'notes', note.id), { ...next, updatedAt: serverTimestamp(), createdAt: note.createdAt }, { merge: true }).catch(() => {
        setError('Your edit is saved locally and will retry when you are back online.')
        setSyncState('offline')
      })
    }, 450)
  }

  async function createNote() {
    const id = makeNoteId()
    const note = { id, ...({ title: '', content: '<p></p>', plainText: '', createdAt: new Date(), updatedAt: new Date(), pinned: false, archived: false, tags: [], deletedAt: null } as Omit<Note, 'id'>) }
    setNotes((current) => [note, ...current])
    if (db && user) await setDoc(doc(db, 'users', user.uid, 'notes', id), { ...note, createdAt: serverTimestamp(), updatedAt: serverTimestamp() })
    else writeDemoNotes([note, ...readDemoNotes()])
    return note
  }

  async function deleteNote(note: Note) {
    saveNote({ ...note, deletedAt: new Date() })
  }

  async function restoreNote(note: Note) {
    saveNote({ ...note, deletedAt: null })
  }

  return { notes: activeNotes, syncState, error, saveNote, createNote, deleteNote, restoreNote }
}
