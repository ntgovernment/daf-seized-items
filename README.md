# Seized Items Card Component

A responsive card-based listing component for displaying seized fishing items, built with semantic HTML, accessible CSS, and progressive JavaScript enhancements.

## Purpose

This component is designed for use in **Squiz Matrix** to display seized fishing items with metadata. It renders server-side via asset listing and metadata keywords, requiring minimal client-side setup.

## Features

- **Responsive grid layout** — Adapts from 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- **Accessible markup** — Semantic HTML with ARIA labels and live regions
- **Card design** — Clean, modern card layout with media, metadata bar, and action footer
- **Status indicators** — Visual flags for items due soon or overdue
- **Lazy-loaded images** — Optimized for performance
- **Form control overrides** — NTG Design System aligned form inputs, dropdowns, and labels with external icon suppression for form anchors

## Design System

This component is built according to the **NTG Design System**. The card design is defined in the Figma design system:

**[View Card Design in Figma](https://www.figma.com/design/pztoZYJOfhXlFLRtU47qNd/NTG-Design-System?node-id=2672-822&m=dev)** (node-id: 2672-822)

Refer to this design file for visual specifications, interactions, and component variants.

## Project Structure

```
.
├── README.md                                    # This file
├── LICENSE                                      # MIT License
├── package.json                                 # Local dev scripts and dependencies
├── vite.config.mjs                              # Vite dev server config
├── docs/
│   ├── seized-items-card-layout-technical-spec.md  # Technical specifications
│   ├── confluence-integration-guide.md             # Matrix + GitHub integration notes
│   └── confluence-markup.txt                       # Confluence wiki markup export
├── implementation/
│   ├── seized-items-cards.html                  # Squiz-ready markup fragment
│   ├── seized-items-cards.css                   # Squiz-ready card styles
│   ├── seized-items-cards.js                    # Squiz-ready card script
│   ├── form-overrides.css                       # Squiz-ready form overrides
│   └── form-overrides-tokens.css                # Squiz-safe token bridge
└── src/
    ├── index.html                               # Main HTML markup
    ├── styles/
    │   ├── seized-items-cards.css               # Styling and responsive layout
    │   ├── form-overrides.css                   # Form control overrides
    │   └── form-overrides-tokens.css            # Token aliases for form overrides
    └── scripts/
        ├── seized-items-cards.js                # Card listing enhancements
        └── form-overrides.js                    # Form interaction enhancements
```

## Usage

### Local Development (HMR)

Use Vite to serve this workspace with live reload/HMR support:

```bash
npm install
npm run dev
```

Vite will start the dev server and automatically open:

```text
http://localhost:5173/src/index.html
```

This is the component-only development page with clean markup. The production capture file (`Publish seized item _ NT.GOV.AU.html`) is also accessible during development but is not tracked in git (it's in `.gitignore` as it's a saved production page with NT.GOV assets).

### Updating Production HTML

When you update `Publish seized item _ NT.GOV.AU.html` from production, ensure the CSS and JS references point to the `src` folder for development:

```html
<!-- CSS Reference (line ~351) -->
<link rel="stylesheet" href="./src/styles/form-overrides.css" />

<!-- JS Reference (line ~781) -->
<script src="./src/scripts/form-overrides.js"></script>
```

This ensures you're always working with the latest source files during development. The production asset files in `Publish seized item _ NT.GOV.AU_files/` are kept for reference but not used in development.

### HTML Integration

Include the HTML, CSS, and JS files in your page:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Seized Fishing Items</title>
    <link rel="stylesheet" href="./styles/seized-items-cards.css" />
  </head>
  <body>
    <!-- Your seized items markup here (see src/index.html) -->
    <script src="./scripts/seized-items-cards.js"></script>
  </body>
</html>
```

### Squiz Matrix Integration

For **Squiz Matrix CMS** integration, use the following metadata schema:

**Schema name:** Metadata schema - seized items  
**Section:** Details

#### Required Fields

| System name                  | Friendly name        | Type   | Rules                                               |
| ---------------------------- | -------------------- | ------ | --------------------------------------------------- |
| seized_item_name             | Item                 | Text   | Max length based on card title line-clamp           |
| seized_item_type             | Type                 | Select | Allowed values: Crab pot, Dilly, Drag net, Cast net |
| seized_item_id_number        | ID number            | Text   | Must be unique per active item                      |
| seized_item_date_time_seized | Date and time seized | Date   | If time is needed, switch to Date and Time          |
| seized_item_location_seized  | Location seized      | Text   | Minimum 2 characters                                |
| seized_item_collect_by       | Collect by           | Date   | Must be on/after seized date                        |

#### Optional Fields

| System name | Friendly name  | Type                          | Notes                                                                    |
| ----------- | -------------- | ----------------------------- | ------------------------------------------------------------------------ |
| image_url   | Image          | Asset/Text (project standard) | Frontend uses `%asset_url%` for image source in standard listing outputs |
| image_alt   | Image alt text | Text                          | Fallback to Item when blank                                              |

## CSS Variables

The component uses CSS custom properties for theming. Customize colors in the `:root` selector of `src/styles/seized-items-cards.css`:

```css
--clr-bg-default: #ffffff;
--clr-border-subtle: #d3d3d7;
--clr-text-default: #1f1e27;
--clr-text-secondary: #4a4955;
--clr-link-default: #1f1f5f;
--clr-status-info-bg: #e4f0f8;
--clr-status-info: #107cc0;
--clr-status-warning-text: #7a5a00;
--clr-status-danger-text: #8b1f1f;
--surface-alt: #f7f7f9;
```

## Changelog

- 2026-06-27: Updated form button styles to match NTG Figma design — dark navy primary (#1F1F5F), Lato 700 16px, inline-flex layout, padding 16px × 24px, sharp corners, hover #C33826, active #A22F20. Squiz backend commit controls (`.sq-commit-button`, `.sq-btn-large`, `.sq-btn-green`) receive matching overrides. Added 48px top margin to `.sq-backend-section-table`.

## JavaScript Enhancements

The JavaScript file provides minimal client-side enhancements:

- Sets a `data-js-enhanced` attribute on the grid for debugging
- Validates grid presence before initialization

No templating or dynamic rendering is performed—all markup is server-rendered by Squiz Matrix.

For Matrix backend forms, `src/scripts/form-overrides.js` progressively enhances controls by:

- Adding `select-enhanced` to `<select>` controls
- Applying validation state classes (`is-valid` / `is-invalid`)
- Improving accessibility wiring for error/helper messaging

Text inputs in Matrix metadata wrappers are styled via CSS selectors in `src/styles/form-overrides.css` (no extra JavaScript class is required).

## Form Overrides And Tokens

Form styling is split into two files:

- `src/styles/form-overrides-tokens.css` defines local token aliases and fallbacks (no runtime package import)
- `src/styles/form-overrides.css` applies practical control styles and Matrix-specific wrappers

Current Matrix form override coverage includes:

- Enhanced dropdown styling via `select.select-enhanced`
- Auto-width dropdown sizing based on the longest option text (applied by `src/scripts/form-overrides.js`)
- Enhanced text input styling for `input[type="text"].form-control.sq-form-field` in `.sq-metadata-contents-wrapper`
- Figma-aligned text input structure: 52px control height, 48px minimum height, 16px horizontal inset, 480px max-width
- Unified form border color across default/focus/disabled/validation states via `--form-border-unified`
- Label, helper, and required indicator styling aligned to Matrix wrapper structure (`.sq-limbo-field`, `.sq-metadata-description`, `.required`)
- Required field indicators: Asterisk (`*`) replaced with "(Required)" text inline with labels via CSS `::before`
- Metadata warnings: "Currently empty" messages with alert icons positioned below fields
 - Dynamic warning visibility: Warnings automatically hide when fields are filled by toggling a hide class (`.sq-warning-hidden`) in `src/scripts/form-overrides.js`
   - Supports native `input` / `change` events, jQuery `change` handlers and `select2:select` events to ensure Select2-enhanced selects are detected
   - Hiding is implemented by adding `.sq-warning-hidden` so CSS specificity and `!important` rules are respected
- Left-aligned label treatment for Matrix label wrappers (`label`, `.sq-limbo-field`, and nested label spans)
- Top-aligned metadata wrapper layout for Matrix backend fields (`.sq-backend-data`, `.sq-metadata-wrapper`, `.sq-metadata-contents-wrapper`)
- Label wrapper spacing update: `.sq-limbo-field` now applies a 16px top margin

### Required Field Indicators

- Display "(Required)" text instead of asterisk
- Font: 14px Lato, weight 400
- Color: `--clr-status-danger` (#a60f37)
- Position: Inline with label (line breaks hidden)
- Implementation: CSS `::before` pseudo-element on `.sq-backend-warning:not(.sq-metadata-warning)`

### Metadata Warnings

Backend metadata warnings (e.g., "Currently empty") feature:

- 20×20px alert icon (SVG mask) in danger color
- 14px Lato, weight 400, positioned below fields
- Absolute positioning: `top: 80px` for text inputs, `top: 88px` for dropdowns/dates
- Dynamic visibility controlled by JavaScript
- Automatically hidden when fields contain values
- Detects dropdown/date fields using CSS `:has()` selector

The same token bridge pattern is mirrored in Squiz delivery files under `implementation/`.

## Responsive Breakpoints

- **Mobile (< 48rem / 768px):** 1 column
- **Tablet (48rem – 75rem / 768px – 1200px):** 2 columns
- **Desktop (≥ 75rem / 1200px):** 3 columns

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- ES6 JavaScript features (optional enhancements only)

## License

MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions or support, contact Fisheries Compliance (NT Government).
