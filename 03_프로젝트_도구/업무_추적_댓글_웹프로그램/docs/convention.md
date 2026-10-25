# Implementation Conventions

- Runtime: Node.js 24 built-in modules and browser-native JavaScript; keep the MVP free of installation dependencies.
- Naming: files use kebab-case, functions and variables use camelCase, constants use `UPPER_SNAKE_CASE`.
- Data: SQLite records are the source of truth; uploaded binaries remain outside the public asset directory.
- API: JSON APIs validate inputs server-side and enforce authorization before returning work or attachment data.
- Audit: mutations that affect work history write an `activity_events` record in the same transaction as domain changes.
- UI: compact desktop-first layout, semantic controls, escaped user content, and responsive single-column fallback.
- Verification: run `npm run check` after source changes.
