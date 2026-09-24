import type { Note } from './types'

export function asDate(value: Note['updatedAt'] | null | undefined) {
  if (!value) return new Date(0)
  if (value instanceof Date) return value
  if (typeof value === 'string') return new Date(value)
  return value.toDate()
}

export function timestampMillis(value: Note['updatedAt'] | null | undefined) {
  if (!value) return 0
  return asDate(value).getTime()
}

export function plainTextFromHtml(html: string) {
  const element = document.createElement('div')
  element.innerHTML = html
  return (element.innerText || element.textContent || '').replace(/\u00a0/g, ' ').replace(/\n{3,}/g, '\n\n').trim()
}

export function tagsFromText(text: string) {
  return [...new Set([...text.matchAll(/(?:^|\s)#([a-z0-9_-]+)/gi)].map((match) => match[1].toLowerCase()))]
}

export function deriveTitle(title: string, plainText: string) {
  if (title.trim()) return title.trim()
  const firstLine = plainText.split(/\n/).map((line) => line.trim()).find(Boolean)
  return firstLine ? firstLine.slice(0, 72) : 'Untitled note'
}

export function formatListDate(value: Note['updatedAt']) {
  const date = asDate(value)
  const today = new Date()
  const sameDay = date.toDateString() === today.toDateString()
  if (sameDay) return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

export function formatLongDate(value: Note['updatedAt']) {
  const date = asDate(value)
  return date.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })
}

export function isToday(value: Note['updatedAt']) {
  const date = asDate(value)
  return date.toDateString() === new Date().toDateString()
}

export function makeNote(id: string): Note {
  const now = new Date()
  return {
    id,
    title: '',
    content: '<p></p>',
    plainText: '',
    createdAt: now,
    updatedAt: now,
    pinned: false,
    archived: false,
    tags: [],
    deletedAt: null,
  }
}
