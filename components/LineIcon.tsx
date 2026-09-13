import type { ReactNode } from 'react'

/**
 * The line icons used across the landing pages (/new-patient-comprehensive-care-visit
 * and /nervous-patients): pillar badges, "who is this for" cards, reassurance
 * chips, booking cards and the alternate paths at the foot.
 *
 * Kept as one map rather than inline <svg> blocks so the pages stay readable,
 * and so every mark is drawn on the same 24px grid at the same 1.5 stroke.
 * Colour and size come from CSS — each path uses currentColor, so a badge only
 * has to set `color`.
 */
const icons = {
  clock: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></>,
  list: <><path d="M9 5.5h7.5a1.5 1.5 0 0 1 1.5 1.5v11a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 18V7a1.5 1.5 0 0 1 1.5-1.5H9Z" /><path d="M9 4.5h4v2H9zM9.5 11h5M9.5 14.5h3.5" /></>,
  person: <><circle cx="12" cy="8.5" r="3.2" /><path d="M5.8 19.2a6.6 6.6 0 0 1 12.4 0" /></>,
  heart: <path d="M12 19s-6.5-3.9-6.5-8.3A3.7 3.7 0 0 1 12 8.4a3.7 3.7 0 0 1 6.5 2.3C18.5 15.1 12 19 12 19Z" />,
  tooth: <path d="M8.2 4.6C6 4.6 5 6.3 5 8.4c0 3 1.3 4.2 1.8 7 .3 1.9.7 3.6 1.8 3.6 1.4 0 1.2-3.4 3.4-3.4s2 3.4 3.4 3.4c1.1 0 1.5-1.7 1.8-3.6.5-2.8 1.8-4 1.8-7 0-2.1-1-3.8-3.2-3.8-1.6 0-2.3.8-3.8.8s-2.2-.8-3.8-.8Z" />,
  alert: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.8v5M12 15.8h.01" /></>,
  hourglass: <><path d="M7 4.5h10M7 19.5h10" /><path d="M8 4.5c0 4 4 4.6 4 7.5 0 2.9-4 3.5-4 7.5M16 4.5c0 4-4 4.6-4 7.5 0 2.9 4 3.5 4 7.5" /></>,
  options: <><path d="M5 8h9M5 16h6" /><circle cx="17" cy="8" r="2.2" /><circle cx="14" cy="16" r="2.2" /></>,
  steps: <><path d="M4.5 18.5h4v-4h4v-4h4v-4" /><path d="M4.5 18.5v-2" /></>,
  shield: <><path d="M12 4.2 18 6.4v4.9c0 3.6-2.4 6.6-6 7.6-3.6-1-6-4-6-7.6V6.4Z" /><path d="M9.4 11.9 11.3 14l3.4-3.7" /></>,
  cloud: <path d="M7.6 17.5h8.9a3.4 3.4 0 0 0 .4-6.8 5 5 0 0 0-9.6-1.1 3.5 3.5 0 0 0 .3 7Z" />,
  feather: <><path d="M18.5 5.5c-6 0-9.6 3.2-10.6 7.1L6 18.5" /><path d="M8 15.5h4.4c3.2 0 6.1-2.6 6.1-6" /></>,
  hand: <><path d="M9.5 12V6.6a1.4 1.4 0 0 1 2.8 0V12" /><path d="M12.3 11V5.6a1.4 1.4 0 0 1 2.8 0V12" /><path d="M15.1 11.8V8.4a1.4 1.4 0 0 1 2.8 0v6.1c0 3-2.2 5-5.2 5s-4-1.2-5-2.8l-1.9-3a1.4 1.4 0 0 1 2.3-1.6l1.2 1.5" /></>,
  calendar: <><rect x="4.5" y="5.8" width="15" height="13.7" rx="2" /><path d="M4.5 10h15M9 4.2v3M15 4.2v3" /></>,
  phone: <path d="M8.4 4.8 10 8.1l-1.7 1.6a11 11 0 0 0 5 5l1.6-1.7 3.3 1.6v3a1.6 1.6 0 0 1-1.8 1.6C10.6 18.6 5.4 13.4 4.8 6.6A1.6 1.6 0 0 1 6.4 4.8Z" />,
  siren: <><path d="M6 17.5a6 6 0 0 1 12 0Z" /><path d="M4.5 20h15M12 5.5V3.5M6.6 7.3 5.2 5.9M17.4 7.3l1.4-1.4" /></>,
  sparkle: <path d="M12 4.5 13.6 9l4.5 1.6-4.5 1.6L12 16.7l-1.6-4.5L5.9 10.6 10.4 9Z" />,
  search: <><circle cx="10.8" cy="10.8" r="5.8" /><path d="m15.2 15.2 4.3 4.3" /></>,
  chat: <><path d="M5 5.5h9.5A1.5 1.5 0 0 1 16 7v5.5a1.5 1.5 0 0 1-1.5 1.5H9.8L6.5 16.8V14H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z" /><path d="M16 9h3a1.5 1.5 0 0 1 1.5 1.5V16a1.5 1.5 0 0 1-1.5 1.5h-1.5v2.7l-3.3-2.7H11" /></>,
  headphones: <><path d="M5 15.5V12a7 7 0 0 1 14 0v3.5" /><rect x="4" y="14" width="3.6" height="5.6" rx="1.2" /><rect x="16.4" y="14" width="3.6" height="5.6" rx="1.2" /></>,
  pause: <><circle cx="12" cy="12" r="8.5" /><path d="M10 9v6M14 9v6" /></>,
  droplet: <path d="M12 4.5s-5.5 6-5.5 9.6a5.5 5.5 0 0 0 11 0C17.5 10.5 12 4.5 12 4.5Z" />,
} satisfies Record<string, ReactNode>

export type IconName = keyof typeof icons

export default function LineIcon({ name }: { name: IconName }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {icons[name]}
    </svg>
  )
}
