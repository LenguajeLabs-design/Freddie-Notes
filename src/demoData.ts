import type { Note } from './types'

const day = 24 * 60 * 60 * 1000
const now = Date.now()

export const starterNotes: Note[] = [
  {
    id: 'welcome',
    title: 'A place to put things down',
    content: '<p>Ideas, reminders, half-formed thoughts. They can all live here for a while.</p><p><strong>Quiet Notes</strong> stays out of the way so you can get back to the thing that matters.</p>',
    plainText: 'Ideas, reminders, half-formed thoughts. They can all live here for a while. Quiet Notes stays out of the way so you can get back to the thing that matters.',
    createdAt: new Date(now - day * 2),
    updatedAt: new Date(now - 1000 * 60 * 42),
    pinned: true,
    archived: false,
    tags: ['ideas'],
    deletedAt: null,
  },
  {
    id: 'morning',
    title: 'Morning pages',
    content: '<p>Start with the smallest useful thing. A clear desk, a glass of water, ten quiet minutes.</p>',
    plainText: 'Start with the smallest useful thing. A clear desk, a glass of water, ten quiet minutes.',
    createdAt: new Date(now - day),
    updatedAt: new Date(now - 1000 * 60 * 60 * 3),
    pinned: false,
    archived: false,
    tags: ['personal'],
    deletedAt: null,
  },
  {
    id: 'release',
    title: 'Release checklist',
    content: '<ul><li>Read the copy once out loud</li><li>Check the mobile view</li><li>Send the link to Maya</li></ul>',
    plainText: 'Read the copy once out loud\nCheck the mobile view\nSend the link to Maya',
    createdAt: new Date(now - day * 4),
    updatedAt: new Date(now - day * 2),
    pinned: false,
    archived: false,
    tags: ['work'],
    deletedAt: null,
  },
]
