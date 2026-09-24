import { useEffect, useMemo, useState } from 'react'
import type { Note, NoteFilter } from './types'
import { isToday } from './lib'
import { signIn, signOutUser, useAuth, useNotes } from './notesStore'
import { Editor, MobileEditorHeader, MobileHeader, SearchOverlay, SettingsPanel, Sidebar, SignIn, SyncBadge, NoteList } from './components'
import { NoteIcon, SearchIcon, SettingsIcon } from './icons'

function App() {
  const { user, loading, configured } = useAuth()
  const { notes, syncState, error, saveNote, createNote, deleteNote, restoreNote } = useNotes(user)
  const [filter, setFilter] = useState<NoteFilter>('all')
  const [activeTag, setActiveTag] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('quiet-notes-theme') as 'light' | 'dark') || 'light')

  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('quiet-notes-theme', theme) }, [theme])

  useEffect(() => {
    function shortcut(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'n') { event.preventDefault(); void handleNew() }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  })

  const tags = useMemo(() => [...new Set(notes.flatMap((note) => note.tags))].sort(), [notes])
  const visibleNotes = useMemo(() => notes.filter((note) => {
    if (filter === 'trash') return Boolean(note.deletedAt)
    if (note.deletedAt || (filter !== 'archive' && note.archived)) return false
    if (filter === 'pinned') return note.pinned
    if (filter === 'today') return isToday(note.updatedAt)
    if (filter === 'archive') return note.archived
    if (filter === 'tag') return activeTag ? note.tags.includes(activeTag) : true
    return true
  }).filter((note) => {
    if (!search.trim()) return true
    const haystack = `${note.title} ${note.plainText} ${note.tags.join(' ')}`.toLowerCase()
    return haystack.includes(search.toLowerCase())
  }), [notes, filter, activeTag, search])

  const selectedNote = notes.find((note) => note.id === selectedId) || visibleNotes[0] || null

  async function handleNew() {
    const note = await createNote()
    setFilter('all')
    setSelectedId(note.id)
  }

  function handleFilter(next: NoteFilter, tag = '') {
    setFilter(next); setActiveTag(tag); setSearch(''); setSelectedId(null); setSettingsOpen(false)
  }

  function updateNote(next: Note) { void saveNote(next) }

  if (loading) return <div className="loading-screen"><div className="brand-mark"><span /></div></div>
  if (configured && !user) return <SignIn onSignIn={() => void signIn()} />

  return <div className="app-shell">
    <Sidebar active={filter} onFilter={handleFilter} onNew={handleNew} onSearch={() => setSearchOpen(true)} tags={tags} theme={theme} onTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} onSettings={() => setSettingsOpen(true)} />
    <div className="mobile-shell"><MobileHeader onSearch={() => setSearchOpen(true)} onNew={handleNew} onFilter={handleFilter} filter={filter} /></div>
    <div className="app-main">
      <NoteList notes={visibleNotes} selectedId={selectedNote?.id || null} onSelect={(note) => setSelectedId(note.id)} onNew={handleNew} filter={filter} search={search} onClearSearch={() => setSearch('')} />
      <div className={`editor-wrap ${selectedNote && selectedId ? 'has-note' : ''}`}>
        {selectedNote ? <><div className="mobile-only"><MobileEditorHeader onBack={() => setSelectedId(null)} onMenu={() => setSettingsOpen(true)} /></div><Editor note={selectedNote} onChange={updateNote} onBack={() => setSelectedId(null)} onDelete={() => void deleteNote(selectedNote)} onRestore={() => void restoreNote(selectedNote)} onPin={() => updateNote({ ...selectedNote, pinned: !selectedNote.pinned })} onArchive={() => updateNote({ ...selectedNote, archived: !selectedNote.archived })} /></> : <div className="editor-empty"><div className="empty-orb"><span>✦</span></div><h2>Make room for a thought.</h2><p>Select a note or start a new one.</p><button className="primary-button" onClick={handleNew}>New note <span>⌘ N</span></button></div>}
      </div>
    </div>
    {!selectedId && <nav className="mobile-bottom-nav" aria-label="Mobile navigation"><button className="active" onClick={() => handleFilter('all')}><NoteIcon size={18} /><span>Notes</span></button><button onClick={() => setSearchOpen(true)}><SearchIcon size={18} /><span>Search</span></button><button onClick={() => setSettingsOpen(true)}><SettingsIcon size={18} /><span>Settings</span></button></nav>}
    <div className="status-row"><SyncBadge state={syncState} />{error && <span className="error-copy">{error}</span>}{!configured && <span className="demo-copy">Connect Firebase in .env.local to sync across devices.</span>}</div>
    {settingsOpen && <SettingsPanel email={user?.email || undefined} theme={theme} onTheme={() => setTheme((value) => value === 'light' ? 'dark' : 'light')} onSignOut={() => void signOutUser()} onClose={() => setSettingsOpen(false)} />}
    {searchOpen && <SearchOverlay value={search} onChange={setSearch} onClose={() => setSearchOpen(false)} notes={notes.filter((note) => !note.deletedAt)} onSelect={(note) => { setSelectedId(note.id); setFilter('all') }} />}
  </div>
}

export default App
