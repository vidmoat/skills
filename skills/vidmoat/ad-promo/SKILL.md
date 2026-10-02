---
name: ad-promo
description: "Ads and promos: the product in use within 2 seconds, proof, one next action, supplied facts only. Use for commercials, launches, e-commerce, unboxing and social ads (Director type ad_promo)."
license: Apache-2.0 (scripts) and CC-BY-4.0 (text); see LICENSE
metadata:
  version: "1.0.0"
  owner: "vidmoat"
  category: "craft"
---

# Ad and promo

Connect a specific audience need to the product in use, show proof, then one clear next action.

## Workflow

1. **Plan against the full duration.** Give each scene a purpose and a timing before building. A target duration authorizes selection, not unintelligible sped-up dialogue.
2. **Open on the product or the problem** in the first 2 seconds, not a logo.
3. **Feature beats.** A close shot plus 3 to 5 words naming the benefit (not the spec), each landing on a cut (`addTitle` role `callout`). Show the important action or product change rather than repeating one screenshot behind slogans; let demonstrations finish.
4. **Facts.** Use supplied facts only: never invent prices, offers, benefits or claims. An offer card needs the user's actual offer. If the user explicitly requests a fictional demo, choose a clearly fictional product and demonstrate an understandable workflow; do not keep asking for real assets or present invented results as customer evidence.
5. **Look.** Grade clean and true to the product's colour; never push a stylised grade onto product colour.
6. **Close.** The call to action sits over picture in the last 1.5 to 2.5 s, not over black (`addTitle` role `end_card` only when a card serves the brand). A clean hold on the product can beat a logo card.
7. **Hit a stated duration exactly** (`trimClip`, `setSpeed` on footage without dialogue).

## Gotchas

- Check product orientation first: a 0/90/180/270 rotation may be needed and dimensions alone cannot tell you.
- Designed interfaces and procedural graphics (`addHtmlElement`) are valid ways to show a workflow without paid generation.
- Brand assets and product details are preserved exactly; read the brand kit before choosing colours.

For e-commerce and unboxing structure, read [references/ecommerce-product.md](references/ecommerce-product.md).

Related skills: titles, colour-grade, media-sourcing, motion-graphics. Specialists: ad-director, brand-guardian.
