---
---

Nothing released: in `packages/design-system/src/blocks/`, which neither the npm package nor the registry ships, the Code editor's wavy underlines under an error or a warning take the negative and notice text colours again, and the agent screens' hollow "stopped" mark takes the colour of the working one; their `decoration-ws-*` and `border-ws-static-inverse-background` classes compiled to nothing. A new test fails on any `typography-*` or `-ws-` class in the source or in the specs' code that compiles to nothing.
