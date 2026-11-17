# Composition: the screen has to work blurred

The goal of every screen is a composition that is right, not a list of rules that was followed. A
screen can satisfy every rule in this skill and still look assembled; another can break one on
purpose and look designed. What decides is how it reads optically, as a whole.

## The blur test

Blur the screen until no word can be read. What is left are masses: dark and light, big and
small, dense and empty. A good screen is coherent at that level, and that coherence is what people
feel before they read anything. If the blurred screen is coherent, the sharp one almost always is;
if it is not, no amount of correct tokens or aligned pixels will save it.

Do it for real, not in your head. Render the screen in the browser, then:

```js
// In the page (DevTools, a preview tool's script runner): look, then remove it
document.documentElement.style.filter = 'blur(6px) grayscale(1)';
// … take a screenshot and judge it …
document.documentElement.style.filter = '';
```

Grayscale takes colour out of the judgement first; look at colour separately afterwards.

## What a coherent blurred screen shows

- **One focal mass.** The eye lands on one place first: the page title with its key figure, the
  hero number, the one thing the screen is for. Two masses of equal weight competing means the
  screen has no lead. Nothing in a corner should be darker or bigger than the focal point by
  accident.
- **Weight matches importance.** The heaviest masses are the most important things. A dark band of
  secondary text, a heavy border around something minor or a large icon pulls weight it has not
  earned.
- **Even rhythm.** Gaps between related things are equal; gaps between groups are equal and
  larger. Blurred, the screen shows clear bands and blocks with a steady beat, not clumps and
  holes.
- **Even density within a region.** A card, a column, a panel each has one texture. One very dense
  corner next to a near-empty one reads as two screens glued together.
- **Shared edges.** Blocks line up into a few strong vertical and horizontal edges: the left axis,
  column edges, the right edge of actions. Ragged edges show immediately when blurred.
- **Space that is meant.** Empty space sits around the focal point and between groups, where it
  separates; it never pools at the bottom of a card or between a label and what it labels.
- **Size follows the container.** In a roomy container a title can be large; in a tight one it
  shrinks toward the text it heads. Blurred, a title that is too big for its card looks like a
  blot; one that is too small for its page looks lost.

## Then unblur and check the detail

Only after the blurred screen is right, look at it sharp: the three text colours by job
([text-colour.md](text-colour.md)), the control sizes ([sizing.md](sizing.md)), the type styles by
container ([typography.md](typography.md)), the states. These are where consistency across a whole
product comes from, and they are the parts of Wideset that should not vary.

## How the rest of this skill relates

The other references are knowledge, not limits: tables of sizes, roles and containers that usually
produce a coherent screen, with the reason for each. Use them as the starting point. When the
blurred screen shows that following one makes the composition worse (a hero that should be larger,
a dense tool that wants a step down, an empty state that needs more air), change it and say what
you changed and why in the report. What stays fixed are the system's own decisions: tokens, the
text colours by job, status colours only for meaning, one control height per screen, the type
styles that exist.

## In the workflow

1. Build the screen.
2. Render it and run the blur test. Fix the composition until the blurred screen is coherent.
3. Unblur and check the detail.
4. Report the composition choices and any departure from the tables, with the reason.
