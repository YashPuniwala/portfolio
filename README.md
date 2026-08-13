# Client Showcase

https://github.com/RahulGosh/rahul_portfolio

analyze this project and import it, after importing do these changes

Build a new testimonials section for my site matching the reference image exactly (attached). Only add/build this testimonials section — do not modify the hero, navbar, About section, or any other existing part of the site.

## Layout & Design
- Dark background matching the site's existing theme (near-black, consistent with the rest of the site).
- Two horizontal rows of testimonial cards, positioned one above the other.
- Each card:
  - Dark card background, slightly lighter than the page background (subtle contrast).
  - Thin 0.5-1px border, low-opacity light gray/white, fully rounded corners (~16-18px radius).
  - Padding inside the card (~24px).
  - Quote text at the top, in white/light gray, wrapped in double quotes, medium-large font size, comfortable line height.
  - Below the quote, a small circular avatar with the person's initials (muted dark gray circle background, light gray initials text) sitting next to their name in white/light gray text — avatar and name aligned horizontally, avatar on the left.
- A small centered label above both rows: "Hover a row to pause it" (muted gray, small font) — or adjust this label if the section ends up using autoplay-on-scroll instead of hover-pause on your device/breakpoint (see mobile note below).

## Marquee/Ticker Behavior
- Row 1 scrolls continuously to the left, looping infinitely (seamless loop — no visible jump or gap when it restarts).
- Row 2 scrolls continuously to the right, looping infinitely, at a slightly different speed than Row 1 (so the two rows don't feel mechanically identical — e.g. Row 1 at ~20-24s per loop, Row 2 at ~26-30s per loop).
- On hover, whichever row the cursor is over should pause its scroll animation (CSS `animation-play-state: paused` on hover, or equivalent), so the user can read the cards without them sliding away. The other row keeps scrolling.
- Duplicate each row's card set at least once in the DOM (render the array twice back-to-back) so the infinite scroll loop has no visible seam — this is required for a smooth `translateX` loop technique to work.
- On mobile/touch devices where hover doesn't apply, either: keep the auto-scroll running continuously without a pause interaction, or pause on tap/touch-hold — pick whichever fits the existing site's mobile interaction patterns. Adjust or remove the "Hover a row to pause it" label on mobile accordingly since hover doesn't apply there.

## Content — Longer Testimonial Text
The reference image shows short one-line quotes, but my actual testimonials are longer (roughly 2-4 sentences each). Adjust the card sizing and text handling accordingly:
- Widen each card enough to comfortably fit 3-5 lines of wrapped text without feeling cramped (test actual card width against real content length rather than copying the reference image's narrower card width exactly).
- Allow the quote text to wrap naturally across multiple lines — do not truncate, clamp, or ellipsis-cut the testimonial text; the full quote should be readable within the card.
- Because card widths will vary slightly with different quote lengths, make sure the marquee scroll speed and spacing still look even and consistent regardless of individual card width differences (use consistent gap spacing between cards, e.g. 16-20px, regardless of each card's content length).
- If any testimonial ends up significantly longer than the others, consider capping card height with the text still fully visible (increase card height rather than clamping text) so the row height stays reasonably consistent, but prioritize showing the full quote over strict uniform card height.

## Technical Preferences
- Implement the infinite scroll using CSS `@keyframes` translateX animation on a flex row containing the duplicated card set, `animation: scrollLeft Ns linear infinite` (and `scrollRight` for the second row) — this is the most performant approach for a smooth continuous marquee.
- Respect `prefers-reduced-motion`: disable the continuous scroll animation for users with that setting enabled, and instead display the cards in a static wrapped grid/row layout so the content is still accessible without motion.
- Use the site's existing fonts, spacing scale, and color tokens for consistency with the rest of the site (don't introduce new colors outside the current dark theme's palette).

## Important Constraints
- This is a new, additive section — do not modify the hero, navbar, About section, or any other existing part of the site.
- Match the visual style of the reference image (card design, avatar style, spacing, dark theme) as closely as possible, only adjusting sizing/wrapping as needed to accommodate the longer real testimonial text as described above.

my theme is black and white
so experience section is black and below it we have testimonials so what i want you to do is make that white backgorund
match color wiht others

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5d93a421-1ac8-4aac-81d9-e942de68f858).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
