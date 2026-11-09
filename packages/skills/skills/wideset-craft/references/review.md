# Review: is it sharp?

Run this on every screen before calling it done, and on any screen someone asks you to review.
Look at it rendered, in light and dark, at 1280px and 390px. Code review alone misses half of it.

## 1. The squint test

Blur the screen (or look at a small screenshot). Answer in one sentence: what is the most
important thing here, and what do I do next? If you cannot, stop and fix the composition: remove
competing accents, reduce sizes, add space around the focal point. Nothing below matters until
this passes.

## 2. The scored checklist

Score each line 2 (yes), 1 (mostly) or 0 (no). Total out of 30; **below 26 (85%) is not done**.
Report the score and the lines below 2.

| #   | Check                                                                                                   |
| --- | ------------------------------------------------------------------------------------------------------- |
| 1   | One control height across the screen; no mixed `size` props ([sizing](sizing.md))                       |
| 2   | One page heading; each title sized by its container; everything else flat ([typography](typography.md)) |
| 3   | Hierarchy by colour and weight; three text greys, no opacity hacks                                      |
| 4   | Five spacing levels, visibly different; only `ws` steps ([spacing](spacing.md))                         |
| 5   | Content width chosen for the screen type; nothing stretched edge to edge without reason                 |
| 6   | One left axis for title, sections and content                                                           |
| 7   | One accent: one filled primary per view; status colours only for status ([colour](surfaces.md))         |
| 8   | One surface language; no card in card; no decorative shadows or tints                                   |
| 9   | Right component for each job; right container for the task ([components](components-and-actions.md))    |
| 10  | Action hierarchy and placement; verb + object labels; destructive actions kept apart                    |
| 11  | Empty, loading, error and long-content states designed                                                  |
| 12  | Numbers right-aligned, tabular, consistent; dates and amounts formatted ([data](data.md))               |
| 13  | No custom motion; components' motion untouched ([motion](motion.md))                                    |
| 14  | Works in dark mode and at 390px without changes to the code                                             |
| 15  | Accessible basics: labels on every control, visible focus, headings in order, errors announced          |

## 3. Remove before you add

When a screen feels generic, the fix is almost never another element. In order, try:

1. Remove a surface (a card, a border, a background tint).
2. Remove a colour (an accent that is not the primary action).
3. Remove a size (one more text size, one more control size).
4. Remove an element (a decorative icon, a redundant label, a second description).
5. Add space around what is left.

## Common tells of generated UI

- Mixed control heights in one row, including a text `LinkButton` beside a `Button`.
- A 48px page title above 14px content, and a 20px intro paragraph in between.
- Every button filled; or the primary not the rightmost.
- Cards inside cards; a card around a single line.
- A form stretched to 1200px.
- Blank cells, "N/A", or a spinner where the layout should be.
- Icons on every button and every heading.
- Brand colour on headings, borders and icons.
- Hand-built badges, empty states or key-value grids next to the Wideset components that do it.
