---
version: alpha
name: tagver
description: >-
  The visual identity of tagver: a tag planted at the root of a commit line,
  drawn in ink with one green accent on the last commit, the calculated
  version. Light and dark themes. Colour tokens without a suffix are the
  light theme; tokens with `-dark` are the dark theme.
colors:
  primary: "#1F9D63"
  primary-dark: "#3DD68C"
  ink: "#15191F"
  ink-dark: "#E8ECF1"
  paper: "#F4F6F8"
  paper-dark: "#0F1216"
  text-2: "#3D4654"
  text-2-dark: "#A3ADBA"
  tile: "#15191F"
  on-tile: "#E8ECF1"
  on-tile-accent: "#3DD68C"
typography:
  wordmark:
    fontFamily: Geist Mono
    fontSize: 128px
    fontWeight: 600
    lineHeight: 1
    letterSpacing: -0.04em
  tagline:
    fontFamily: Geist
    fontSize: 40px
    fontWeight: 500
    lineHeight: 1.25
  example:
    fontFamily: Geist Mono
    fontSize: 27px
    fontWeight: 400
    lineHeight: 1.25
  example-version:
    fontFamily: Geist Mono
    fontSize: 27px
    fontWeight: 600
    lineHeight: 1.25
rounded:
  none: 0px
  tile: 200px
  tile-16: 160px
  full: 9999px
spacing:
  grid: 1024px
  stroke: 64px
  stroke-tile: 96px
  dot-root: 72px
  dot-commit: 52px
  dot-version: 80px
  social-mark: 520px
  social-text-x: 620px
  social-accent-bar: 104px
components:
  mark:
    textColor: "{colors.ink}"
    size: "{spacing.grid}"
  mark-dark:
    textColor: "{colors.ink-dark}"
    size: "{spacing.grid}"
  mark-version:
    backgroundColor: "{colors.primary}"
    size: "{spacing.dot-version}"
  mark-version-dark:
    backgroundColor: "{colors.primary-dark}"
    size: "{spacing.dot-version}"
  favicon:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.on-tile}"
    rounded: "{rounded.tile}"
    size: "{spacing.grid}"
  favicon-16:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.on-tile}"
    rounded: "{rounded.tile-16}"
    size: 16px
  apple-touch-icon:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.on-tile}"
    rounded: "{rounded.none}"
    size: 180px
  favicon-version:
    backgroundColor: "{colors.on-tile-accent}"
  social-image:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: 1200px
    height: 630px
  social-image-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-dark}"
    width: 1200px
    height: 630px
  social-preview:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    width: 1280px
    height: 640px
  social-preview-dark:
    backgroundColor: "{colors.paper-dark}"
    textColor: "{colors.ink-dark}"
    width: 1280px
    height: 640px
  social-wordmark:
    textColor: "{colors.ink}"
    typography: "{typography.wordmark}"
  social-wordmark-dark:
    textColor: "{colors.ink-dark}"
    typography: "{typography.wordmark}"
  social-tagline:
    textColor: "{colors.text-2}"
    typography: "{typography.tagline}"
  social-tagline-dark:
    textColor: "{colors.text-2-dark}"
    typography: "{typography.tagline}"
  social-example:
    textColor: "{colors.text-2}"
    typography: "{typography.example}"
  social-example-dark:
    textColor: "{colors.text-2-dark}"
    typography: "{typography.example}"
  social-example-version:
    textColor: "{colors.primary}"
    typography: "{typography.example-version}"
  social-example-version-dark:
    textColor: "{colors.primary-dark}"
    typography: "{typography.example-version}"
  accent-bar:
    backgroundColor: "{colors.primary}"
    rounded: "{rounded.full}"
    width: "{spacing.social-accent-bar}"
    height: 10px
  accent-bar-dark:
    backgroundColor: "{colors.primary-dark}"
    rounded: "{rounded.full}"
    width: "{spacing.social-accent-bar}"
    height: 10px
---

# tagver design system

tagver is a CLI, so its design system is its brand: the mark, the favicons and
the social images. The tokens above are the normative values. The assets in
[`docs/user/assets/`](docs/user/assets/) are drawn from them, and
[`docs/user/docs.yml`](docs/user/docs.yml) gives wyrd.foo the logo, favicon
and social image. Pages that show tagver, such as the wyrd.foo product page,
use their own design system around the mark.

## Overview

The mark shows what tagver does. A tag is planted at the root of a commit
line. Commits follow it, and the last commit, in the accent colour, is the
version that tagver calculates from the tag and the commit height.

- **Plain and technical.** Ink line work with round caps and joins, one
  accent, no gradients, no shadows.
- **One accent.** Green marks the calculated version and nothing else. It
  means "released".
- **Light and dark.** Every asset has a light and a dark form. The favicon
  sits on an ink tile, so one favicon reads on both browser themes.

## Colors

Each colour has a light value and a `-dark` value for the dark theme, the
same split as `logo.svg` and `logo-dark.svg`.

| Token | Use |
| --- | --- |
| `ink` | The mark's line work and dots, and the wordmark. |
| `paper` | The background of the social images. The logo itself has no background. |
| `text-2` | The tagline and the example on the social images. |
| `primary` | The version dot, the accent bar under the wordmark and the calculated version in the example. |
| `tile` | The favicon and Apple touch icon background, in both themes. |
| `on-tile` | The mark on `tile`. |
| `on-tile-accent` | The version dot on `tile`. |

Contrast, as WCAG ratios:

| Pair | Ratio |
| --- | --- |
| `ink` on `paper` | 16.28:1 |
| `text-2` on `paper` | 8.80:1 |
| `primary` on `paper` | 3.20:1 |
| `ink-dark` on `paper-dark` | 15.83:1 |
| `text-2-dark` on `paper-dark` | 8.27:1 |
| `primary-dark` on `paper-dark` | 10.01:1 |
| `on-tile` on `tile` | 14.86:1 |
| `on-tile-accent` on `tile` | 9.40:1 |

`primary` meets 3:1 for graphics and large text, but not 4.5:1 for normal
text. In the light theme it is used only for shapes and for text at 24px or
larger.

## Typography

Geist Mono sets the wordmark and the example; Geist sets the tagline. The
name `tagver` is always lower case and set in monospace, because it is the
command a reader types. Fallbacks are `ui-monospace` and `system-ui`.

| Token | Where |
| --- | --- |
| `wordmark` | `tagver` on the social images. |
| `tagline` | "SemVer from your Git tags." on the social images. |
| `example` | The tag and the height in the example, `1.0.0 +3 →`. |
| `example-version` | The calculated version in the example, `1.0.1-alpha.0.3`, in `primary`. |

The example matches the mark: the tagged commit and three more commits give a
height of 3, and tagver's default pre-release identifiers give
`1.0.1-alpha.0.3`.

## Layout

The mark is drawn on a `grid` of 1024 by 1024 units, the `viewBox` of every
square asset. Its shapes, in grid units:

- The tag pole is at x 176, from y 208 down to the commit line at y 816.
- The tag body runs from x 176 to x 400, with its point at x 496, y 304. Its
  hole is a dot of radius 32 at x 272, y 304.
- The commit line runs from x 176 to x 848 at y 816.
- The root dot (radius `dot-root`) is at x 176; two commit dots (radius
  `dot-commit`) are at x 400 and x 624; the version dot (radius
  `dot-version`) is at x 848.
- The whole mark moves by (-4, -24) so its visual centre is the grid centre.

Social images use a 1200 by 630 artboard. The 1280 by 640 GitHub preview
centres the same artboard.

- The mark is `social-mark` (520px) square at x 56, y 55.
- Text starts at `social-text-x` (620px). The wordmark baseline is at y 292,
  the accent bar at y 324, the tagline baseline at y 400 and the example
  baseline at y 462.

## Elevation & Depth

The mark is flat. There are no shadows, gradients or outlines. Hierarchy comes
from colour: `ink` for structure, `primary` for the result.

## Shapes

Every line has round caps and round joins. Line work is `stroke` (64 units)
in the logo and `stroke-tile` (96 units) on the favicon tile, so the mark
keeps its weight at small sizes.

| Token | Where |
| --- | --- |
| `tile` | The favicon tile corner, 200 units of 1024. |
| `tile-16` | The 16px favicon tile corner, 160 units of 1024. |
| `none` | The Apple touch icon, because iOS rounds it. |
| `full` | The accent bar. |

## Components

- **Logo.** `mark` on a transparent background, in `logo.svg` (`ink`,
  `primary`) and `logo-dark.svg` (`ink-dark`, `primary-dark`). It has the tag
  hole and both commit dots.
- **Favicon.** `favicon` in `favicon.svg`: a heavier mark on the ink tile,
  with a solid tag, no hole and no commit dots between the root and the
  version, so it reads at 16 and 32px. `favicon-16.svg`, `favicon-32.png` and
  `favicon.ico` (16, 32 and 48px) are fixed-size forms of it.
- **Apple touch icon.** `apple-touch-icon` in `apple-touch-icon.png`, 180px.
  At this size the tag is an outline with its hole.
- **Social image.** `social-image` and `social-image-dark`: the mark on the
  left; the wordmark, the accent bar, the tagline and the example on the
  right. wyrd.foo uses `social-image.png` as its `og:image`.
- **Social preview.** `social-preview` and `social-preview-dark`: the social
  image at GitHub's 1280 by 640 size, for the repository's social preview
  setting.
- **README.** The README shows `logo.svg`, or `logo-dark.svg` for a dark
  colour scheme, 160px wide and centred.

## Do's and Don'ts

- Do keep `primary` on the version dot, the accent bar and the calculated
  version only.
- Do use the `-dark` asset on a dark background and the light asset on a light
  one; use the favicon tile where the background is not known.
- Do write `tagver` in lower case, in a monospace face.
- Do keep the example consistent with the mark and with tagver's real output.
- Don't add shadows, gradients, outlines or a second accent hue.
- Don't use the outlined tag with a hole below 64px; use the favicon form.
- Don't set normal-size text in `primary` on `paper`; it is below 4.5:1.
- Don't stretch, rotate or recolour the mark outside these tokens.
