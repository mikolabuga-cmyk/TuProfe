# Why TuProfe Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the selected Why TuProfe section as a responsive editorial split with a three-card cascade matching the supplied reference and TuProfe brand system.

**Architecture:** Keep the work scoped to the existing React component and stylesheet. Add one pure layout-mapping helper so card roles and themes are explicit and testable, then render the reference-inspired composition from that model.

**Tech Stack:** React 19, Vite 6, CSS Grid, Node test runner.

## Global Constraints

- Preserve existing Ukrainian copy and brand colors.
- Use Montserrat and existing Phosphor/brand SVG assets only.
- Keep scroll motion on transform and opacity.
- Collapse rotations and overlap below 768px.

---

### Task 1: Benefit Layout Model

**Files:**
- Modify: `src/uiState.test.js`
- Modify: `src/uiState.js`

**Interfaces:**
- Consumes: benefit tuples `[number, title, copy]`.
- Produces: `buildWhyFeatureLayout(benefits)` returning cards with `number`, `title`, `copy`, `slot`, and `tone`.

- [ ] Add a failing test for the three reference card slots and TuProfe tones.
- [ ] Run `npm test` and confirm the missing export failure.
- [ ] Implement the pure mapping helper.
- [ ] Run `npm test` and confirm all tests pass.

### Task 2: Editorial Section Markup And Styling

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: `buildWhyFeatureLayout(whyBenefits)`.
- Produces: `.why-layout`, `.why-story`, `.why-proof`, and `.why-stack` responsive section structure.

- [ ] Replace the four-tile bento markup with the two-column editorial composition.
- [ ] Add double-bezel cascade cards, proof metrics, brand accents, hover states, and mobile collapse.
- [ ] Run `npm test` and `npm run build`.

### Task 3: Visual Verification

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Consumes: browser screenshots at desktop and mobile widths.
- Produces: a passing visual QA note for this section.

- [ ] Reload the local preview and capture the selected section at desktop size.
- [ ] Capture the section below 768px and verify clean stacking without overflow.
- [ ] Fix visible P0/P1/P2 issues and rerun tests/build.
- [ ] Record the final comparison in `design-qa.md`.

