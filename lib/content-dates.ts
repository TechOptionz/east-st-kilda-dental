/**
 * When a page's content last genuinely changed, for pages where we know.
 *
 * Read by app/sitemap.ts (as <lastmod>) and by the pages themselves (as
 * dateModified in their structured data), so the two can never disagree.
 *
 * Only pages whose copy was actually rewritten belong here, with the date it
 * happened. The sitemap deliberately stamps nothing on every other URL: a build
 * time on every page tells Google the whole site changed on each deploy, which
 * teaches it to ignore lastmod altogether. Update an entry when a page's
 * content changes — not for a styling or layout change.
 */
export const CONTENT_UPDATED: Record<string, { iso: string; label: string }> = {
  '/dental-faqs': { iso: '2026-09-13', label: 'September 2026' },
  '/emergency-dentist': { iso: '2026-09-13', label: 'September 2026' },
  '/nervous-patients': { iso: '2026-09-13', label: 'September 2026' },
  '/new-patient-comprehensive-care-visit': { iso: '2026-09-13', label: 'September 2026' },
}
