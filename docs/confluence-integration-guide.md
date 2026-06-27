# Seized Items Card Component – Integration Guide

## Overview

The Seized Items Card Component is a responsive, accessible card-based listing for displaying seized fishing items in Squiz Matrix. This page documents the complete integration across Squiz Matrix, GitHub, and supporting systems.

---

## Squiz Matrix Components

### 1. Metadata Schema

**Metadata schema - seized items** (Asset ID: #1619057)

The metadata schema defines all required and optional fields for seized items:

**Required Fields:**

- `seized_item_name` — Item name (text)
- `seized_item_type` — Type of item (select: Crab pot, Dilly, Drag net, Cast net)
- `seized_item_id_number` — Unique identifier (text)
- `seized_item_date_time_seized` — Date/time of seizure (date/datetime)
- `seized_item_location_seized` — Location seized (text, min 2 chars)
- `seized_item_collect_by` — Collection deadline (date, must be ≥ seizure date)

**Optional Fields:**

- `image_url` — Item image (asset/text)
- `image_alt` — Alternative text for image (text, defaults to item name)

### 2. Data Folder

**Seized items** (Asset ID: #1617850)

All seized item metadata records are stored in this data folder. This folder contains the source data that is displayed by the asset listing.

### 3. Asset Listing

**Squiz Listing - seized items** (Asset ID: #1619073)

Live URL: [https://nt.gov.au/marine/fisheries-compliance/seized-fishing-items/configuration/listing-seized-items](https://nt.gov.au/marine/fisheries-compliance/seized-fishing-items/configuration/listing-seized-items)

This is the Squiz Matrix asset listing that renders seized items using:

- The **Data Folder** (#1617850) as the source
- The **Metadata Schema** (#1619057) to structure the data
- The **Git File Bridge** asset (#1619134) to serve the frontend code

---

## Frontend Code

### GitHub Repository

**[ntgovernment/daf-seized-items](https://github.com/ntgovernment/daf-seized-items)**

The complete source code, technical specifications, and documentation are maintained in GitHub.

**Repository Structure:**

```
seized-items/
├── README.md                                    # Project overview & usage
├── LICENSE                                      # MIT License
├── package.json                                 # Local scripts + dependencies
├── vite.config.mjs                              # Vite dev server config
├── docs/
│   ├── seized-items-card-layout-technical-spec.md  # Technical specs
│   └── confluence-integration-guide.md              # This integration guide
├── implementation/
│   ├── seized-items-cards.html                  # Squiz-ready markup fragment
│   ├── seized-items-cards.css                   # Squiz-ready card styles
│   ├── seized-items-cards.js                    # Squiz-ready card script
│   ├── form-overrides.css                       # Squiz-ready form overrides
│   └── form-overrides-tokens.css                # Squiz-safe token bridge
└── src/
    ├── index.html                               # Main HTML markup
   ├── styles/
   │   ├── seized-items-cards.css               # Styling & responsive layout
   │   ├── form-overrides.css                   # Form control overrides
   │   └── form-overrides-tokens.css            # Token aliases for form overrides
    └── scripts/
      ├── seized-items-cards.js                # Card listing enhancements
      └── form-overrides.js                    # Form interaction enhancements
```

**Branches:**

- `main` — Production-ready code (default branch)
- Feature branches — Short-lived branches merged into `main` via PR

### Git File Bridge Asset

**GitHub - daf-seized-items** (Asset ID: #1619134)

This Git File Bridge asset serves the frontend code from the GitHub repository directly into Squiz Matrix. It bridges the following files:

| GitHub File                            | Served Path    | Purpose                               |
| -------------------------------------- | -------------- | ------------------------------------- |
| `src/index.html`                       | HTML markup    | Card component structure              |
| `src/styles/seized-items-cards.css`    | CSS stylesheet | Card styling & responsive layout      |
| `src/styles/form-overrides.css`        | CSS stylesheet | Matrix form control overrides         |
| `src/styles/form-overrides-tokens.css` | CSS stylesheet | Token alias bridge for form overrides |
| `src/scripts/seized-items-cards.js`    | JavaScript     | Client-side enhancements              |
| `src/scripts/form-overrides.js`        | JavaScript     | Matrix form enhancement behavior      |

**Configuration:**

- **Repository:** `ntgovernment/daf-seized-items`
- **Branch:** `main`
- **Webhook:** Configured for automatic updates on push

---

## Design System

The card design follows the **NTG Design System**.

**Design Reference:** [View in Figma](https://www.figma.com/design/pztoZYJOfhXlFLRtU47qNd/NTG-Design-System?node-id=2672-822&m=dev) (node-id: 2672-822)

The design specifies:

- Responsive grid (1 → 2 → 3 columns)
- Semantic card layout
- Status indicators (due soon / overdue)
- Accessible color scheme & typography
- Lazy-loaded images

---

## Responsive Breakpoints

| Device  | Columns | CSS Width                      |
| ------- | ------- | ------------------------------ |
| Mobile  | 1       | < 48rem (768px)                |
| Tablet  | 2       | 48rem – 75rem (768px – 1200px) |
| Desktop | 3       | ≥ 75rem (1200px)               |

---

## CSS Variables & Theming

Customize the card appearance by editing CSS variables in `src/styles/seized-items-cards.css`:

```css
:root {
  --clr-bg-default: #ffffff; /* Card background */
  --clr-border-subtle: #d3d3d7; /* Card border */
  --clr-text-default: #1f1e27; /* Primary text */
  --clr-text-secondary: #4a4955; /* Secondary text */
  --clr-link-default: #1f1f5f; /* Links & headings */
  --clr-status-info-bg: #e4f0f8; /* Info badge background */
  --clr-status-info: #107cc0; /* Info badge color */
  --clr-status-warning-text: #7a5a00; /* Due soon status color */
  --clr-status-danger-text: #8b1f1f; /* Overdue status color */
  --surface-alt: #f7f7f9; /* Alternative surface color */
}
```

### Form Overrides Token Dependency

Form overrides consume NT design tokens via npm package dependency:

- `@ntgovernment/web-design-tokens`

Registry setup:

- Project `.npmrc` config points `@ntgovernment` to `https://npm.pkg.github.com`
- A GitHub token with package read access is required for install in CI/local

Delivery model:

- Local/Vite: token package is resolved through `src/styles/form-overrides-tokens.css`
- Squiz/Git File Bridge: committed token bridge files are served before form overrides to avoid runtime npm dependency resolution

Files:

- `src/styles/form-overrides-tokens.css`
- `implementation/form-overrides-tokens.css`
- `Publish seized item _ NT.GOV.AU_files/form-overrides-tokens.css`

### Matrix Form Styling Coverage

Matrix backend form styling is delivered through:

- `src/styles/form-overrides.css`
- `src/styles/form-overrides-tokens.css`
- `src/scripts/form-overrides.js`

Implemented control coverage:

- Dropdowns: `select.select-enhanced`
- Text inputs: `input[type="text"].form-control.sq-form-field` inside `.sq-metadata-contents-wrapper`

Dropdown implementation details:

- Chevron icon uses stroked SVG at 16.67px width and 9px height
- Icon is applied to both base `select` and `select.select-enhanced`
- Form width constraint is applied at container level: `form#page_asset_builder_1619140 { max-width: 480px; width: 100%; }`

Text input states are token-aligned with the NT design system:

- Base control shape matches Figma reference: 52px height, 48px minimum, 16px inset, 480px max width
- Default state uses 1px outline (`--clr-border-strong-02`) with no border radius
- Focus state keeps outline treatment (no additional glow)
- Error state uses `--form-status-error` outline with error background
- Success state uses `--form-status-success` outline with success background

This styling matches Squiz metadata markup patterns that may include a hidden field before the visible input (`input[type="hidden"] + input[type="text"]`).

Label and helper text treatment in Matrix wrappers:

- Label text: 16px Lato, weight 700
- Helper text: 14px Lato, color `--clr-text-alt`
- Required annotation: ` (Required)` appended via `.required::after` with danger token color
- Labels are left-aligned across Matrix wrappers (`label`, `.sq-limbo-field`, and nested label spans)
- `.sq-limbo-field` applies `margin-top: 16px` for label-to-field spacing

Wrapper alignment treatment in Matrix wrappers:

- `.sq-backend-data` and `.sq-metadata-wrapper` are top-aligned wrapper columns
- `.sq-metadata-contents-wrapper` is a top-aligned column (`flex-direction: column; align-items: flex-start; justify-content: flex-start`)

Delivery sync requirement:

- Keep `implementation/form-overrides.css` and `Publish seized item _ NT.GOV.AU_files/form-overrides.css` synchronized so captured Squiz exports render the same form control styling.

---

## Deployment & Updates

### Making Changes

1. **Clone the repository:**

   ```bash
   git clone https://github.com/ntgovernment/daf-seized-items.git
   ```

2. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes** to HTML, CSS, or JavaScript

4. **Commit with semantic messages:**

   ```bash
   git commit -m "feat: add new card variant"
   ```

5. **Push and create a pull request:**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Merge to `main` after review**

### Deployment to Squiz Matrix

Once changes are merged to the `main` branch:

1. The **Git File Bridge** (#1619134) automatically detects the update
2. The webhook triggers a sync
3. Updated HTML, CSS, and JavaScript are served in Squiz Matrix
4. Changes are live on [https://nt.gov.au/marine/fisheries-compliance/seized-fishing-items](https://nt.gov.au/marine/fisheries-compliance/seized-fishing-items) within seconds

---

## Troubleshooting

### Cards Not Displaying

1. **Check the Data Folder** (#1617850) — Ensure seized items have been created with complete metadata
2. **Verify the Asset Listing** (#1619073) — Confirm it's configured to use the correct data folder & metadata schema
3. **Check the Git File Bridge** (#1619134) — Ensure it's linked to the correct GitHub branch (`main`)

### Styling Issues

1. Verify CSS variables in `src/styles/seized-items-cards.css`
2. Check browser console for CSS load errors
3. Clear browser cache and hard-refresh the page

### Data Not Updating

1. Ensure metadata is saved in the **Data Folder** (#1617850)
2. Confirm metadata uses the **Metadata Schema** (#1619057)
3. The asset listing caches data — clear Squiz Matrix cache if needed

---

## Related Assets

| Asset                                | ID       | Type            | Purpose                         |
| ------------------------------------ | -------- | --------------- | ------------------------------- |
| Metadata schema - seized items       | #1619057 | Metadata Schema | Define data structure           |
| Seized items                         | #1617850 | Data Folder     | Store item records              |
| Squiz Listing - seized items         | #1619073 | Asset Listing   | Render cards in Squiz Matrix    |
| GitHub - daf-seized-items            | #1619134 | Git File Bridge | Serve frontend code from GitHub |
| Seized Items Card Component (GitHub) | —        | Repository      | Source code & documentation     |

---

## License

MIT License. See the [LICENSE file](https://github.com/ntgovernment/daf-seized-items/blob/main/LICENSE) in the GitHub repository for details.

---

**Last Updated:** 2026-06-25  
**Maintained By:** Fisheries Compliance (NT Government)  
**Repository:** [ntgovernment/daf-seized-items](https://github.com/ntgovernment/daf-seized-items)
