import type { ReactNode, SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }
const icon = (path: ReactNode, props: IconProps) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={props.size ?? 18} height={props.size ?? 18} aria-hidden="true" {...props}>{path}</svg>

export const SearchIcon = (p: IconProps) => icon(<><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4 4"/></>, p)
export const PlusIcon = (p: IconProps) => icon(<><path d="M12 5v14M5 12h14"/></>, p)
export const PinIcon = (p: IconProps) => icon(<path d="m15.5 4.5 4 4-3 1.5v4l-3 3-1-4-4-4 3-3h4zM12 17l-3 3"/>, p)
export const NoteIcon = (p: IconProps) => icon(<><path d="M5 4.8A1.8 1.8 0 0 1 6.8 3h10.4A1.8 1.8 0 0 1 19 4.8v14.4a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 19.2z"/><path d="M8 8h8M8 12h8M8 16h4"/></>, p)
export const ArchiveIcon = (p: IconProps) => icon(<><path d="M4 7h16v12H4zM3 4h18v3H3zM9 11h6"/></>, p)
export const TrashIcon = (p: IconProps) => icon(<><path d="M4 7h16M10 11v5M14 11v5M6 7l1 13h10l1-13M9 7V4h6v3"/></>, p)
export const SettingsIcon = (p: IconProps) => icon(<><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.5V20a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.6-1H6.2v-2.5h.2A1.7 1.7 0 0 0 8 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.5V5a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1Z"/></>, p)
export const MoreIcon = (p: IconProps) => icon(<><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>, p)
export const BackIcon = (p: IconProps) => icon(<path d="m15 18-6-6 6-6"/>, p)
export const SunIcon = (p: IconProps) => icon(<><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>, p)
export const MoonIcon = (p: IconProps) => icon(<path d="M20.5 15.2A8.5 8.5 0 0 1 8.8 3.5 8.5 8.5 0 1 0 20.5 15.2Z"/>, p)
export const CheckIcon = (p: IconProps) => icon(<path d="m5 12 4.5 4.5L19 7"/>, p)
export const CloseIcon = (p: IconProps) => icon(<><path d="m6 6 12 12M18 6 6 18"/></>, p)
export const LinkIcon = (p: IconProps) => icon(<><path d="M10 13.5a4 4 0 0 0 5.7.1l2-2a4 4 0 0 0-5.7-5.7l-1.1 1.1"/><path d="M14 10.5a4 4 0 0 0-5.7-.1l-2 2A4 4 0 0 0 12 18.1l1.1-1.1"/></>, p)
export const BulletIcon = (p: IconProps) => icon(<><circle cx="5" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="5" cy="17" r="1" fill="currentColor" stroke="none"/><path d="M9 7h10M9 12h10M9 17h10"/></>, p)
export const NumberedIcon = (p: IconProps) => icon(<><path d="M9 7h10M9 12h10M9 17h10"/><path d="M4 6.5h1v2M4 11.5c1.5-1 2.5.5 1.5 1.1L4 14h2"/><path d="M4 16.5h2l-2 3h2"/></>, p)
export const CheckListIcon = (p: IconProps) => icon(<><path d="m4 7 1.5 1.5L8 6M10 7h10M4 12l1.5 1.5L8 11M10 12h10M4 17l1.5 1.5L8 16M10 17h10"/></>, p)
