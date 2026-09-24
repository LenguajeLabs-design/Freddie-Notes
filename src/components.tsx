import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent, ReactNode } from 'react'
import type { Note, NoteFilter, SyncState } from './types'
import { deriveTitle, formatListDate, formatLongDate, isToday, plainTextFromHtml, tagsFromText, timestampMillis } from './lib'
import { ArchiveIcon, BackIcon, BulletIcon, CheckIcon, CheckListIcon, CloseIcon, LinkIcon, MoonIcon, MoreIcon, NoteIcon, NumberedIcon, PinIcon, PlusIcon, SearchIcon, SettingsIcon, SunIcon, TrashIcon } from './icons'

export function SyncBadge({ state }: { state: SyncState }) {
  const labels: Record<SyncState, string> = { synced: 'Synced', syncing: 'Syncing', offline: 'Offline', demo: 'Local demo' }
  return <div className={`sync-badge ${state}`}><span className="sync-dot" />{labels[state]}</div>
}

export function Sidebar({ active, onFilter, onNew, onSearch, tags, theme, onTheme, onSettings }: {
  active: NoteFilter
  onFilter: (filter: NoteFilter, tag?: string) => void
  onNew: () => void
  onSearch: () => void
  tags: string[]
  theme: 'light' | 'dark'
  onTheme: () => void
  onSettings: () => void
}) {
  return <aside className="sidebar">
    <div className="brand-row"><div className="brand-mark"><NoteIcon size={17} /></div><span>Quiet Notes</span><button className="icon-button brand-add" aria-label="New note" onClick={onNew}><PlusIcon size={18} /></button></div>
    <button className="search-entry" onClick={onSearch}><SearchIcon size={17} /><span>Search</span><kbd>⌘ K</kbd></button>
    <nav className="side-nav" aria-label="Notes views">
      <NavItem icon={<NoteIcon />} label="All Notes" active={active === 'all'} onClick={() => onFilter('all')} />
      <NavItem icon={<PinIcon />} label="Pinned" active={active === 'pinned'} onClick={() => onFilter('pinned')} />
      <NavItem icon={<SunIcon />} label="Today" active={active === 'today'} onClick={() => onFilter('today')} />
      <NavItem icon={<ArchiveIcon />} label="Archive" active={active === 'archive'} onClick={() => onFilter('archive')} />
    </nav>
    <div className="sidebar-section-title"><span>Tags</span><span className="tag-count">{tags.length}</span></div>
    <div className="tag-list">{tags.length ? tags.map((tag) => <button className={`tag-nav ${active === 'tag' ? 'selected' : ''}`} key={tag} onClick={() => onFilter('tag', tag)}><span>#</span>{tag}</button>) : <span className="muted small-copy">Tags appear as you use #hashtags</span>}</div>
    <div className="sidebar-spacer" />
    <nav className="side-nav bottom-nav">
      <NavItem icon={<TrashIcon />} label="Trash" active={active === 'trash'} onClick={() => onFilter('trash')} />
      <NavItem icon={<SettingsIcon />} label="Settings" active={false} onClick={onSettings} />
      <button className="nav-item" onClick={onTheme}>{theme === 'light' ? <MoonIcon /> : <SunIcon />}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span></button>
    </nav>
  </aside>
}

function NavItem({ icon, label, active, onClick }: { icon: ReactNode, label: string, active: boolean, onClick: () => void }) {
  return <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>{icon}<span>{label}</span></button>
}

export function MobileHeader({ onSearch, onNew, onFilter, filter }: { onSearch: () => void, onNew: () => void, onFilter: (filter: NoteFilter) => void, filter: NoteFilter }) {
  return <header className="mobile-header"><div className="mobile-title"><div className="brand-mark"><NoteIcon size={16} /></div><span>Notes</span></div><div className="mobile-header-actions"><button className="icon-button" aria-label="Search" onClick={onSearch}><SearchIcon /></button><button className="primary-icon" aria-label="New note" onClick={onNew}><PlusIcon /></button></div><div className="mobile-filters"><button className={filter === 'all' ? 'selected' : ''} onClick={() => onFilter('all')}>All</button><button className={filter === 'pinned' ? 'selected' : ''} onClick={() => onFilter('pinned')}>Pinned</button><button className={filter === 'today' ? 'selected' : ''} onClick={() => onFilter('today')}>Today</button><button className={filter === 'tag' ? 'selected' : ''} onClick={() => onFilter('tag')}>Tags</button></div></header>
}

export function NoteList({ notes, selectedId, onSelect, onNew, filter, search, onClearSearch }: { notes: Note[], selectedId: string | null, onSelect: (note: Note) => void, onNew: () => void, filter: NoteFilter, search: string, onClearSearch: () => void }) {
  return <section className="note-list-column">
    <div className="list-heading"><div><span className="eyebrow">{search ? 'Search results' : filter === 'all' ? 'All notes' : filter === 'tag' ? 'Tagged notes' : filter[0].toUpperCase() + filter.slice(1)}</span><h1>{search ? `${notes.length} ${notes.length === 1 ? 'result' : 'results'}` : filter === 'all' ? 'Your notes' : filter === 'trash' ? 'Recently deleted' : filter[0].toUpperCase() + filter.slice(1)}</h1></div><button className="new-note-button" onClick={onNew}><PlusIcon size={16} />New note</button></div>
    {search && <div className="search-summary"><SearchIcon size={15} /><span>{search}</span><button aria-label="Clear search" onClick={onClearSearch}><CloseIcon size={14} /></button></div>}
    <div className="notes-scroll">{notes.length ? notes.map((note) => <NotePreview key={note.id} note={note} selected={note.id === selectedId} onClick={() => onSelect(note)} />) : <EmptyList filter={filter} search={search} onNew={onNew} />}</div>
  </section>
}

function NotePreview({ note, selected, onClick }: { note: Note, selected: boolean, onClick: () => void }) {
  const title = deriveTitle(note.title, note.plainText)
  return <button className={`note-preview ${selected ? 'selected' : ''}`} onClick={onClick}><div className="preview-top"><span className="preview-title">{title}</span>{note.pinned && <PinIcon className="preview-pin" size={14} />}</div><p>{note.plainText || 'Start writing something…'}</p><span className="preview-time">{formatListDate(note.updatedAt)}</span></button>
}

function EmptyList({ filter, search, onNew }: { filter: NoteFilter, search: string, onNew: () => void }) {
  return <div className="empty-list"><div className="empty-icon"><NoteIcon size={20} /></div><h3>{search ? 'Nothing found' : filter === 'trash' ? 'Trash is empty' : 'No notes here yet'}</h3><p>{search ? 'Try a different word or tag.' : 'Make room for a thought.'}</p>{!search && filter !== 'trash' && <button className="text-button" onClick={onNew}>Write a note <span>→</span></button>}</div>
}

export function Editor({ note, onChange, onBack, onDelete, onRestore, onPin, onArchive, onCloseMobile }: { note: Note, onChange: (note: Note) => void, onBack: () => void, onDelete: () => void, onRestore: () => void, onPin: () => void, onArchive: () => void, onCloseMobile?: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLInputElement>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== note.content) editorRef.current.innerHTML = note.content || '<p></p>'
    if (titleRef.current && document.activeElement !== titleRef.current) titleRef.current.value = note.title
  }, [note.id, note.content, note.title])

  function emitChange() {
    if (!editorRef.current) return
    const html = editorRef.current.innerHTML
    const plainText = plainTextFromHtml(html)
    onChange({ ...note, content: html, plainText, tags: tagsFromText(`${note.title} ${plainText}`) })
  }

  function exec(command: string, value?: string) {
    editorRef.current?.focus()
    document.execCommand(command, false, value)
    emitChange()
  }

  function submitLink(event: FormEvent) {
    event.preventDefault()
    exec('createLink', linkUrl)
    setLinkUrl('')
    setLinkOpen(false)
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      setLinkOpen(true)
    }
  }

  const deleted = Boolean(note.deletedAt)
  return <article className="editor-column">
    <div className="editor-toolbar-top"><button className="back-button" onClick={onBack}><BackIcon size={19} /><span>Notes</span></button><div className="editor-top-actions"><span className="saved-copy">{note.updatedAt ? `Edited ${formatListDate(note.updatedAt)}` : ''}</span><button className="icon-button" onClick={() => setMenuOpen((value) => !value)} aria-label="More options"><MoreIcon /></button>{menuOpen && <div className="more-menu"><button onClick={onPin}><PinIcon size={15} />{note.pinned ? 'Unpin note' : 'Pin note'}</button><button onClick={onArchive}><ArchiveIcon size={15} />{note.archived ? 'Move to notes' : 'Archive note'}</button>{deleted ? <button onClick={onRestore}><CheckIcon size={15} />Restore note</button> : <button className="danger-item" onClick={onDelete}><TrashIcon size={15} />Move to trash</button>}</div>}</div></div>
    <div className="editor-scroll"><div className="editor-inner"><div className="editor-date">{formatLongDate(note.updatedAt)}</div><input ref={titleRef} className="note-title-input" placeholder="Untitled note" defaultValue={note.title} onChange={(event) => onChange({ ...note, title: event.target.value, tags: tagsFromText(`${event.target.value} ${note.plainText}`) })} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); editorRef.current?.focus() } }} />
      {deleted && <div className="trashed-note"><TrashIcon size={15} />This note is in Trash. <button onClick={onRestore}>Restore it</button></div>}
      <div ref={editorRef} className={`rich-editor ${focused ? 'focused' : ''}`} contentEditable={!deleted} suppressContentEditableWarning role="textbox" aria-label="Note content" data-placeholder="Start writing…" onFocus={() => setFocused(true)} onBlur={() => { setFocused(false); emitChange() }} onInput={emitChange} onKeyDown={handleEditorKeyDown} />
      {!deleted && (focused || note.plainText.length > 0) && <div className="format-bar"><button aria-label="Bold" onMouseDown={(e) => { e.preventDefault(); exec('bold') }}><strong>B</strong></button><button aria-label="Italic" onMouseDown={(e) => { e.preventDefault(); exec('italic') }}><em>I</em></button><span className="bar-divider" /><button aria-label="Bulleted list" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList') }}><BulletIcon size={18} /></button><button aria-label="Numbered list" onMouseDown={(e) => { e.preventDefault(); exec('insertOrderedList') }}><NumberedIcon size={18} /></button><button aria-label="Checklist" onMouseDown={(e) => { e.preventDefault(); exec('insertUnorderedList') }}><CheckListIcon size={18} /></button><button aria-label="Link" onMouseDown={(e) => { e.preventDefault(); setLinkOpen(true) }}><LinkIcon size={18} /></button>{linkOpen && <form className="link-popover" onSubmit={submitLink}><input autoFocus value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} placeholder="Paste a link" type="url"/><button type="submit">Add</button></form>}</div>}
    </div></div>
  </article>
}

export function SearchOverlay({ value, onChange, onClose, notes, onSelect }: { value: string, onChange: (value: string) => void, onClose: () => void, notes: Note[], onSelect: (note: Note) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => { inputRef.current?.focus() }, [])
  const results = value.trim() ? notes.filter((note) => `${note.title} ${note.plainText} ${note.tags.join(' ')}`.toLowerCase().includes(value.toLowerCase())).slice(0, 5) : []
  return <div className="search-overlay" role="dialog" aria-modal="true" onClick={onClose}><div className="search-modal" onClick={(event) => event.stopPropagation()}><div className="search-modal-input"><SearchIcon size={20} /><input ref={inputRef} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search your notes" onKeyDown={(event) => { if (event.key === 'Escape') onClose(); if (event.key === 'Enter' && results[0]) { onSelect(results[0]); onClose() } }} /><kbd>ESC</kbd><button onClick={onClose} aria-label="Close search"><CloseIcon size={18} /></button></div>{value && <div className="search-results">{results.length ? results.map((note) => <button key={note.id} onClick={() => { onSelect(note); onClose() }}><span className="result-title">{deriveTitle(note.title, note.plainText)}</span><span className="result-preview">{note.plainText}</span></button>) : <p className="no-results">No notes found</p>}</div>}<div className="search-hint"><span>Search title, note content, and tags</span><span><kbd>↵</kbd> Open note</span></div></div></div>
}

export function SettingsPanel({ email, theme, onTheme, onSignOut, onClose }: { email?: string, theme: 'light' | 'dark', onTheme: () => void, onSignOut: () => void, onClose: () => void }) {
  return <div className="settings-scrim" role="dialog" aria-modal="true" onClick={onClose}><div className="settings-panel" onClick={(event) => event.stopPropagation()}><div className="settings-header"><div><span className="eyebrow">Preferences</span><h2>Settings</h2></div><button className="icon-button" onClick={onClose} aria-label="Close settings"><CloseIcon /></button></div><div className="settings-block"><span className="settings-label">Account</span><div className="account-row"><div className="avatar">{email?.[0]?.toUpperCase() || 'Q'}</div><div><strong>{email || 'Local demo'}</strong><span>{email ? 'Google account' : 'Stored on this device'}</span></div></div>{email && <button className="outline-button" onClick={onSignOut}>Sign out</button>}</div><div className="settings-block"><span className="settings-label">Appearance</span><button className="setting-row" onClick={onTheme}>{theme === 'light' ? <SunIcon /> : <MoonIcon />}<span>Theme</span><em>{theme === 'light' ? 'Light' : 'Dark'}</em></button></div><div className="settings-block"><span className="settings-label">Sync</span><p className="settings-copy">Your notes sync automatically across signed-in devices. Offline edits are saved and sent when you’re back online.</p></div></div></div>
}

export function SignIn({ onSignIn }: { onSignIn: () => void }) {
  return <main className="auth-screen"><div className="auth-card"><div className="brand-mark large"><NoteIcon size={23} /></div><h1>Quiet Notes</h1><p>Thoughts, wherever you are.</p><button className="google-button" onClick={onSignIn}><span className="google-g">G</span>Continue with Google</button><span className="auth-footnote">Your notes stay private to your account.</span></div></main>
}

export function MobileEditorHeader({ onBack, onMenu }: { onBack: () => void, onMenu: () => void }) {
  return <div className="mobile-editor-header"><button className="back-button" onClick={onBack}><BackIcon size={20} /><span>Notes</span></button><button className="icon-button" onClick={onMenu}><MoreIcon /></button></div>
}
