# Interactive TuProfe Footer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reference-matched TuProfe footer with a functional newsletter and draggable, reorderable official brand shapes.

**Architecture:** Keep reusable interaction logic in `uiState.js` as pure functions and render the footer state inside the existing React component. Pointer handlers convert client coordinates into bounded collage coordinates, while CSS owns hover lift, responsive typography, and the editorial layout.

**Tech Stack:** React 19, Vite 6, Pointer Events, Phosphor Icons, Node test runner.

## Global Constraints

- Use only official SVGs from `public/brand/` for collage graphics.
- Preserve Montserrat and the existing TuProfe color tokens.
- Drag motion uses transform/position updates without page overflow.
- Newsletter submission remains a local prototype interaction.

---

### Task 1: Interaction Contracts

**Files:**
- Modify: `src/uiState.test.js`
- Modify: `src/uiState.js`

**Interfaces:**
- Produces: `validateNewsletter(email)`, `clampFooterShapePosition(position, size, bounds)`, and `raiseFooterShape(shapes, id)`.

- [ ] Add failing tests for blank/invalid/valid email, bounded drag coordinates, and front ordering.
- [ ] Run `npm test` and confirm missing exports fail.
- [ ] Implement the three pure helpers.
- [ ] Run `npm test` and confirm all tests pass.

### Task 2: Footer UI

**Files:**
- Modify: `src/App.jsx`
- Modify: `src/styles.css`

**Interfaces:**
- Consumes: the Task 1 helpers and official brand SVG paths.
- Produces: newsletter form state, editorial footer layout, and draggable collage stage.

- [ ] Replace the compact footer with the newsletter, statement, links, social controls, collage, and legal row.
- [ ] Add pointer capture handlers that clamp movement and reorder the active shape.
- [ ] Add desktop and mobile styling that matches the reference and TuProfe brand system.
- [ ] Run `npm test` and `npm run build`.

### Task 3: Browser QA

**Files:**
- Modify: `design-qa.md`

**Interfaces:**
- Produces: verified desktop/mobile screenshots and interaction evidence.

- [ ] Capture the footer at desktop width and compare hierarchy, spacing, and graphics to the reference.
- [ ] Submit invalid and valid newsletter states.
- [ ] Drag one SVG and verify its bounded position and increased layer order.
- [ ] Verify the mobile footer has no horizontal overflow.
- [ ] Record the final result in `design-qa.md`.

