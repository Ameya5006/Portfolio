# Undeployed portfolio redesign

Local review branch: `redesign/immersive-portfolio`.

Do not push or deploy this branch until Ameya explicitly approves deployment. The connected Vercel project may build on a remote push.

## Changes

- Fixed Three.js sculpture scene with reflective material, pointer lighting and an image fallback.
- Oversized filled/outlined name, followed only by the role line and adjacent playground/résumé buttons in the hero.
- Graphite/ivory surfaces and a continuous vertical project showcase. Each description sits beside its artwork on desktop and precedes the artwork on mobile; all four projects are available by normal scrolling.
- Lenis and GSAP ScrollTrigger for desktop motion; native touch scrolling and reduced-motion support.
- Accessible HTML content, native project links, optional category filters, skill disclosures, full-screen native-dialog navigation, résumé and contact links.
- Existing project, technology, experience and certification values preserved exactly from baseline commit `715756e9f90e98bc6dcf429d9aa612b953b44986`; the guard compares parsed data, ignoring code formatting.
- SIH updated at Ameya's request to **6th out of 590 teams**, with the previous Top 100 university-level milestone shown as progression. The sports wording is unchanged. The linked résumé PDF itself has not been edited.

## Review

```bash
npm ci
npm run build
npm run verify:content
npm run check:interactions
npm run check:design
```

`npm run review` builds `review/Ameya-Portfolio-Preview.html`. Open it in a browser to review without deploying or starting a server. It bundles JavaScript, CSS, the sculpture fallback and résumé. Google Fonts is optional; ordinary system fonts remain available offline.

For normal development: `npm run dev -- --host 127.0.0.1`.

## Verification limits

Build, content invariants and functional DOM checks pass. The inspection browser cannot reach this environment's local server, so actual visual layout, live WebGL output, touch hardware behavior and Lighthouse scores have not been validated.

Before release, review at 320/390/768/1440/1920px, use 200% zoom, test keyboard and touch, check Safari/iOS and Chrome/Android, and test reduced motion and WebGL context loss. Profile the animation before claiming frame-rate or Lighthouse results.

The standalone preview intentionally bundles the graphics engine into one file for convenient review. The production Vite build keeps it in a separate optional chunk. The renderer consumes GSAP's frame clock when the optional motion module is available and otherwise uses a local RAF fallback. GPU image-displacement transitions and fluid simulation are proposals, not implemented features.

## Readability and motion revision

- Body text is now 16–17px, with stronger light/dark foreground colors, clearer labels and larger control text. The hero no longer fades on scroll. Opaque toolkit/contact surfaces protect text from the canvas. The filled/outlined name, role line, two hero actions and continuous project flow remain.
- A three-strand 3D signal lattice with 12 instanced traveling lights accompanies the original sculpture. A vector current field supplies a complementary visual that works without WebGL.
- Project illustrations respond to pointer position and scroll depth; descriptions do not. Chart bars, health traces and ocean contours animate within their existing illustrations.
- Headings reveal with a staggered accent line. Buttons have restrained magnetic motion and light sweeps. AI, leadership and contact artwork gain secondary motion. Credential rows gain directional hover fills.
- The pause control and reduced-motion preference disable enhancements; decorative loops pause outside the viewport or while the menu is open. The new controller removes observers, callbacks and active entrance animations on cleanup.
- The standalone résumé now uses a generated PDF Blob URL even when its source string is double-quoted; a strict regression check covers this.
- Contrast token checks: ten specified pairs range from 6.84:1 to 11.95:1. This is not a full-page WCAG certification, browser render test or Lighthouse audit.

Visual references inspected: [ZRK](https://www.zrk.technology/) for cinematic product presentation; [DKTON](https://dkton.at/) for bold entrance and pulsing forms; [Peryton](https://www.peryton-film.com/) for atmospheric depth. Their assets, copy and implementations are not copied.
