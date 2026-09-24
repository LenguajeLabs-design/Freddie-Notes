import type { Timestamp } from 'firebase/firestore'

export type NoteTime = Timestamp | Date | string

export type Note = {
  id: string
  title: string
  content: string
  plainText: string
  createdAt: NoteTime
  updatedAt: NoteTime
  pinned: boolean
  archived: boolean
  tags: string[]
  deletedAt: NoteTime | null
}

export type NoteFilter = 'all' | 'pinned' | 'today' | 'archive' | 'trash' | 'tag'

export type SyncState = 'synced' | 'syncing' | 'offline' | 'demo'
