# Seized Items Card Listing

## Frontend Build Guide for Squiz Matrix

Version: 2.2  
Date: 2026-06-25  
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
- Height: 40px (40px minimum)
- Padding: 8px top/bottom, 12px left/right
- Max-width: 100%
- Chevron icon: 16px × 16px, positioned 12px from right edge

**Typography:**
- Font family: Lato
- Font size: 16px
- Font weight: 400
- Line height: 24px

**Colors:**
- Background: `var(--clr-bg-default, #ffffff)`
- Border: `var(--clr-border-strong-02, #333333)`
- Text: `var(--clr-text-default, #1f1e27)`
- Focus/Hover: Same border color with box-shadow outline

**Interactive States:**
- Hover: Border color remains same, cursor changes to pointer
- Focus: Box-shadow outline applied, border color consistent
- Disabled: Background set to `var(--clr-bg-disabled, #f5f5f5)`, opacity reduced to 0.6

### Label & Field Wrapper Styling

**Label Container:** `sq-limbo-field`
- Display: flex column with 8px gap
- Width: 100%
- Label text: 14px Lato, weight 600, line-height 20px

**Wrapper Classes:**
- `sq-backend-data`: Full-width flex column with 8px gap
- `sq-metadata-wrapper`: Full-width flex column with 8px gap
- `sq-metadata-contents-wrapper`: Full-width flex layout

**Helper Text:** `sq-metadata-description`
- Font: 12px Lato, weight 400
- Line height: 16px
- Color: `var(--clr-text-alt, #999999)`
- Margin top: 4px

### Implementation Notes

- All form overrides use CSS custom properties for theming consistency
- Dropdown styling removes native browser appearance for cross-browser consistency
- Focus states include visible outline for accessibility compliance
- Enhanced select class is optional; standard select styling is applied as fallback

### File Location

`src/styles/form-overrides.css`

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
