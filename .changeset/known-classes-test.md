---
---

Nothing released on npm: the fixes are in registry blocks, which update with the docs-hosted registry. The Code editor block's wavy underlines under an error or a warning take the negative and notice text colours again, and the agent blocks' hollow "stopped" mark takes the colour of the working one; their `decoration-ws-*` and `border-ws-static-inverse-background` classes compiled to nothing. A new test fails on any `typography-*` or `-ws-` class in the source or in the specs' code that compiles to nothing.
