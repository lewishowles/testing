# `@lewishowles/testing`

Shared testing utilities, covering Vitest helpers, Vue component mounting, and Playwright config presets.

## Requirements

- Node 22+ / Bun
- Peer dependencies vary by subpath — see each doc

## Installation

```bash
bun add -d @lewishowles/testing
```

## Subpaths

| Subpath                           | Purpose                                             | Docs                                     |
| --------------------------------- | --------------------------------------------------- | ---------------------------------------- |
| `@lewishowles/testing/vue`        | Component mounting and app context for Vitest       | [docs/vue.md](docs/vue.md)               |
| `@lewishowles/testing/vitest`     | Browser API mocks, Pinia setup, console suppression | [docs/vitest.md](docs/vitest.md)         |
| `@lewishowles/testing/playwright` | Config presets and component test mount helper      | [docs/playwright.md](docs/playwright.md) |
