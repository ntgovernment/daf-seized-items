# Seized Items Card Listing

## Frontend Build Guide for Squiz Matrix

Version: 2.3  
Date: 2026-06-27  
Source page: https://nt.gov.au/marine/fisheries-compliance/seized-fishing-items

## 1. Purpose

Use this guide to build or replicate a card-based listing in Squiz Matrix with minimal setup time.

Primary use cases:

- Seized fishing items listing.
- Any similar listing page that uses card tiles sourced from metadata.

## 2. CMS Field Contract (Use as-is)

Metadata schema:

- Schema name: Metadata schema - seized items
- Section: Details

Required fields:

| System name                  | Friendly name        | Type   | Required | Rules                                               |
| ---------------------------- | -------------------- | ------ | -------- | --------------------------------------------------- |
| seized_item_name             | Item                 | Text   | Yes      | Max length based on card title line-clamp           |
| seized_item_type             | Type                 | Select | Yes      | Allowed values: Crab pot, Dilly, Drag net, Cast net |
| seized_item_id_number        | ID number            | Text   | Yes      | Must be unique per active item                      |
| seized_item_date_time_seized | Date and time seized | Date   | Yes      | If time is needed, switch to Date and Time          |
| seized_item_location_seized  | Location seized      | Text   | Yes      | Minimum 2 characters                                |
| seized_item_collect_by       | Collect by           | Date   | Yes      | Must be on/after seized date                        |

Optional fields:

| System name | Friendly name  | Type                          | Required | Notes                                                                    |
| ----------- | -------------- | ----------------------------- | -------- | ------------------------------------------------------------------------ |
| image_url   | Image          | Asset/Text (project standard) | No       | Frontend uses `%asset_url%` for image source in standard listing outputs |
| image_alt   | Image alt text | Text                          | No       | Fallback to Item when blank                                              |

## 3. Card Mapping (UI to Metadata)

Display order on card:

1. Item (title)
2. Type (chip/label)
3. ID number
4. Date and time seized
5. Location seized
6. Collect by

Squiz keyword mapping:

- `%asset_metadata_seized_item_name%` -> Item
- `%asset_metadata_seized_item_type%` -> Type
- `%asset_metadata_seized_item_id_number%` -> ID number
- `%asset_metadata_seized_item_date_time_seized^date_format:d F Y%` -> Date and time seized display
- `%asset_metadata_seized_item_location_seized%` -> Location seized
- `%asset_metadata_seized_item_collect_by^date_format:d F Y%` -> Collect by display
- `%asset_url%` -> image source URL

Current Squiz card item markup:

```html
<div class="seized-items__item">
  <article class="seized-card" aria-labelledby="item-166-title">
    <div class="seized-card__media" data-rich-media="true" data-ratio="16:9">
      <img
        src="%asset_url%"
        alt="Seized %asset_metadata_seized_item_name% at %asset_metadata_seized_item_location_seized%"
        loading="lazy"
        width="353"
        height="199"
      />
    </div>

    <div
      class="seized-card__meta-bar"
      data-show-tag="true"
      data-show-date="true"
    >
      <p class="seized-card__type-chip">%asset_metadata_seized_item_type%</p>
      <time
        datetime="2026-05-24T12:00:00+09:30"
        class="seized-card__seized-date"
        >%asset_metadata_seized_item_date_time_seized^date_format:d F Y%</time
      >
    </div>

    <div class="seized-card__body" data-type="Default">
      <h2 id="item-166-title" class="seized-card__title">
        %asset_metadata_seized_item_name%
      </h2>

      <dl class="seized-card__meta">
        <div class="seized-card__meta-row">
          <dt>ID number</dt>
          <dd>%asset_metadata_seized_item_id_number%</dd>
        </div>
        <div class="seized-card__meta-row">
          <dt>Date and time seized</dt>
          <dd>
            <time
              datetime="%asset_metadata_seized_item_date_time_seized^date_format:d F Y%"
              >%asset_metadata_seized_item_date_time_seized^date_format:d F
              Y%</time
            >
          </dd>
        </div>
        <div class="seized-card__meta-row">
          <dt>Location seized</dt>
          <dd>%asset_metadata_seized_item_location_seized%</dd>
        </div>
        <div class="seized-card__meta-row">
          <dt>Collect by</dt>
          <dd>
            <time
              datetime="%asset_metadata_seized_item_collect_by^date_format:d F Y%"
              >%asset_metadata_seized_item_collect_by^date_format:d F Y%</time
            >
          </dd>
        </div>
      </dl>
    </div>
  </article>
</div>
```

## 4. Listing Behavior

Data and sort:

- Render one card per item record.
- Sort descending by date_and_time_seized.
- Filters are optional; if used, start with Type and Location.

Card states:

- is-overdue: collect_by before today.
- is-due-soon: collect_by within 7 days.
- default: all other records.

Implementation note:

- Current markup does not include a visible status element. State classes can still be applied on `seized-card` for visual treatment if required.

Responsive grid:

- Mobile: 1 column.
- Tablet (>= 48rem): 2 columns.
- Desktop (>= 75rem): 3 columns.

Empty state:

- Show: No seized items are currently listed.

## 5. Visual and Content Rules

- Keep card labels exactly: ID number, Date and time seized, Location seized, Collect by.
- Metadata rows use a two-column layout: label on the left, value on the right.
- Value content in the right column is left-aligned.
- Use title case for Type values.
- Keep date display consistent with NT style:
  - Date/time: D MMMM YYYY at h:mma when using a Date and Time field
  - Date: D MMMM YYYY
- Do not show internal notes on frontend.

## 6. Accessibility Checklist

- Card title uses semantic heading.
- Metadata labels are programmatically tied to values.
- Keyboard focus order follows visual order.
- Color contrast meets WCAG 2.2 AA.
- Status meaning is not color-only; keep text labels (for example, Overdue, Due soon).
- Images include alt text or fallback text.

## 7. Form Styling Enhancements (Figma Design)

### Overview

Enhanced form styling has been implemented in `src/styles/form-overrides.css` to match the NTG Design System Figma specifications. These styles apply to Squiz Matrix form elements used for editing seized item metadata.

### Select (Dropdown) Styling

**Class:** `select.select-enhanced`

**Dimensions & Spacing:**

- Min-height: 48px
- Width: Auto-sized from longest option text (with 100% fallback before enhancement)
- Padding: 8px top/bottom, 16px left/right
- Right padding: 48px (to clear icon space)
- Max-width: 100%
- Chevron icon: 16.67px × 9px, positioned 16px from right edge

**Typography:**

- Font family: Lato
- Font size: 16px
- Font weight: 400
- Line height: 24px

**Colors:**

- Background: `var(--clr-bg-default, #ffffff)`
- Border: `var(--clr-border-strong-02, #1f1e27)`
- Text: `var(--clr-text-default, #1f1e27)`
- Focus/Hover: Same border color with tokenized focus shadow

**Interactive States:**

- Hover: Border color remains same, cursor changes to pointer
- Focus: Box-shadow outline applied, border color consistent
- Disabled: Background set to `var(--clr-bg-shade-alt, #f5f5f5)`, text muted, pointer events removed
- Validation states via `data-status`, `is-valid`, `is-invalid`, and `aria-invalid` keep the same unified border color

### TextInput Styling

**Target Markup:** `input[type="text"].form-control.sq-form-field` (including hidden-field adjacency patterns such as `input[type="hidden"] + input[type="text"]`) inside `.sq-metadata-contents-wrapper`

**Dimensions & Spacing:**

- Height: 52px
- Min-height: 48px
- Width: 100%
- Padding: 0 top/bottom, 16px left/right

**Typography:**

- Font family: Lato
- Font size: 16px
- Font weight: 400
- Line height: 24px

**Colors:**

- Background: `var(--clr-bg-default, #ffffff)`
- Outline (default): `var(--clr-border-strong-02, #1f1e27)`
- Outline (hover): `var(--clr-border-strong-02, #1f1e27)`
- Placeholder: `var(--clr-text-alt, #666774)`

**Interactive States:**

- Focus: keeps 1px strong outline with no glow
- Disabled: `var(--form-bg-disabled, #f5f5f5)` with subtle outline and muted text (`var(--clr-text-alt, #666774)`)
- Validation (error/success): keeps unified outline color for consistency across all form elements

### Label & Field Wrapper Styling

**Label Container:** `sq-limbo-field`

- Display: flex column with 8px gap
- Width: 100%
- Top margin: 16px
- Text alignment: left (including nested label spans)
- Label text: 16px Lato, weight 700, line-height 24px
- Required marker: appended text ` (Required)` using status danger color and body-sm typography

**Wrapper Classes:**

- `sq-backend-data`: Full-width flex column with 8px gap
- `sq-metadata-wrapper`: Full-width flex column with 8px gap
- `sq-metadata-contents-wrapper`: Full-width top-aligned flex column (`flex-direction: column; align-items: flex-start; justify-content: flex-start`)

**Form Container Width:**

- `form#page_asset_builder_1619140`: width 100%, max-width 680px (increased from 480px to accommodate horizontal date pickers)

**Helper Text:** `sq-metadata-description`

- Font: 14px Lato, weight 400
- Line height: 20px
- Color: `var(--clr-text-alt, #666774)`
- Margin top: 0

### Date Input Styling

**Class:** `.sq-metadata-date-wrapper .sq-inline-fields-wrapper.bottom-margin`

**Layout:**

- Display: flex horizontal row with 8px gap
- Flex-wrap: enabled for responsive behavior
- Alignment: center vertical alignment

**Dropdown Sizing:**

- Width: auto (adjusted to content)
- Min-width: fit-content
- Flex-shrink: 0 (prevents content clipping)

**Hidden Elements:**

Matrix date fields include optional helper rows that are hidden by default:

- "OR IN ... from now" row (duration input + period dropdown)
- "OR keywords" row (creation/update date shortcuts)

These are hidden using sibling selectors to keep only the main date picker dropdowns visible.

**Implementation:**

All date/time dropdowns (day, month, year, hour, minute) display in a single horizontal row with optimized widths based on their content. The form width was increased to 680px to prevent wrapping of the last dropdown element.

### Implementation Notes

- All form overrides use CSS custom properties for theming consistency
- Dropdown styling removes native browser appearance for cross-browser consistency
- TextInput now follows an outline-based state model from Figma (no additional focus glow)
- Enhanced select class is optional; standard select styling is applied as fallback
- Select widths are auto-adjusted by JavaScript using the longest dropdown option text
- TextInput enhancement is scoped to Matrix metadata wrappers to avoid unintended global Bootstrap `.form-control` overrides
- Form width cap is applied at container level (`form#page_asset_builder_1619140`) instead of per-field caps
- Form token aliases are defined locally in `src/styles/form-overrides-tokens.css`
- A unified border token (`--form-border-unified`) is used across text inputs, textareas, and selects in all interaction states
- Squiz-safe fallback delivery uses committed token bridge files in `implementation/form-overrides-tokens.css`
- Captured delivery styles in `Publish seized item _ NT.GOV.AU_files/form-overrides.css` are kept in sync with `implementation/form-overrides.css`

### File Location

`src/styles/form-overrides.css`
`src/styles/form-overrides-tokens.css`

## 8. Reuse Recipe for Similar Listings

When a new listing request comes in, repeat this pattern:

1. Create/duplicate metadata schema with the same field naming convention.
2. Confirm required fields and select options.
3. Map fields to the same card slot order.
4. Reuse grid breakpoints and card class model.
5. Apply page-specific sort/filter logic only.
6. Validate accessibility checklist.
7. Add 3 sample cards for design QA.
8. Run content parity check against source data.

## 9. Definition of Done

Frontend is complete when:

- Field contract is implemented exactly.
- 3 viewport layouts are verified (mobile/tablet/desktop).
- Empty state and status states are verified.
- Date formatting is correct.
- Accessibility checklist passes.
- Content team can add a new record without developer help.

## 10. Quick Reference

Class model:

- seized-items
- seized-items\_\_grid
- seized-items\_\_item
- seized-card
- seized-card\_\_media
- seized-card\_\_meta-bar
- seized-card\_\_type-chip
- seized-card\_\_seized-date
- seized-card\_\_body
- seized-card\_\_title
- seized-card\_\_meta
- seized-card\_\_meta-row
- is-due-soon
- is-overdue

Type options:

- Crab pot
- Dilly
- Drag net
- Cast net
