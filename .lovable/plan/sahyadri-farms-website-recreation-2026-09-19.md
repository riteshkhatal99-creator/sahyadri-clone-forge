# Sahyadri Farms website recreation

## Goal
Recreate the authorized Sahyadri Farms public website as closely as possible, replacing the blank page with a responsive implementation that matches the reference site's content, structure, styling, imagery, navigation, and interactions.

## Build scope
- Reproduce the global header, desktop dropdown navigation, mobile navigation, typography, spacing, color palette, buttons, and footer.
- Rebuild the homepage in the same section order with matching visible copy, imagery, statistics, crop/product areas, story content, news/updates, calls to action, and responsive behavior.
- Add the main public pages linked from the reference navigation, using shared layouts and matching page-specific content and visuals.
- Download authorized public brand imagery into the project so the recreation does not depend on temporary hotlinks.
- Preserve accessible structure, keyboard-friendly menus, appropriate image text, and mobile layouts.

## Technical details
- Keep the existing TanStack Start routing structure and create a route for each reproduced page.
- Define the complete visual system in `src/styles.css` with semantic tokens; use reusable React sections for repeated navigation, footer, page banners, cards, and content bands.
- Match source-site interactions with React state and CSS transitions while respecting reduced-motion preferences.
- Add unique page metadata for every recreated route.
- Verify the result at desktop and mobile sizes, test navigation and menus, and resolve all preview/build errors.

## Validation
- Compare screenshots against the live reference at equivalent viewport sizes.
- Check for missing assets, overflow, clipped text, broken links, and menu behavior.
- Confirm every route renders and the final preview reports no build or runtime errors.
