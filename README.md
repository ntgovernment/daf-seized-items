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

## Design System

This component is built according to the **NTG Design System**. The card design is defined in the Figma design system:

**[View Card Design in Figma](https://www.figma.com/design/pztoZYJOfhXlFLRtU47qNd/NTG-Design-System?node-id=2672-822&m=dev)** (node-id: 2672-822)

Refer to this design file for visual specifications, interactions, and component variants.

## Project Structure

```
.
├── README.md                                    # This file
├── LICENSE                                      # MIT License
├── .gitignore                                   # Git ignore rules
├── docs/
│   └── seized-items-card-layout-technical-spec.md  # Technical specifications
└── src/
    ├── index.html                               # Main HTML markup
    ├── styles/
    │   └── seized-items-cards.css               # Styling and responsive layout
    └── scripts/
        └── seized-items-cards.js                # Client-side enhancements
```

## Usage

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

## JavaScript Enhancements

The JavaScript file provides minimal client-side enhancements:

- Sets a `data-js-enhanced` attribute on the grid for debugging
- Validates grid presence before initialization

No templating or dynamic rendering is performed—all markup is server-rendered by Squiz Matrix.

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
