# NGEP Quiz · ល្បែងសំណួរ NGEP

A single-question dice quiz about the **Next-Gen Engagement Program (NGEP)** at CADT, with a Khmer traditional theme.
Players roll a Khla Khlouk–style die, answer one question drawn at random, and see the result with an explanation.

All question content comes from the official program site: <https://ngep.idt.edu.kh> (Overview, Journey and FAQ).

## Run it

There is no build step. The page is plain HTML, CSS and JavaScript.

- **Quickest:** double-click `index.html`. It works from `file://`.
- **Local server** (recommended for kiosks and testing):

  ```bash
  python -m http.server 5173
  ```

  Then open <http://localhost:5173>.

- **Deploy:** upload the folder to any static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, or a CADT web server).

The page needs an internet connection for Google Fonts (Kantumruy Pro, Moul) and the confetti library (jsDelivr).
Without them it still works: fonts fall back to system Khmer fonts and the confetti is skipped.

## Project layout

```
index.html            markup, SVG ornament sprite (lotus, kbach, prasat, sugar palm)
assets/css/styles.css Khmer theme, light and dark modes, responsive layout
assets/js/data.js     brand palette + question pool  ← edit questions here
assets/js/audio.js    Web Audio sound effects (roneat mallet, kong gong, dice clicks)
assets/js/app.js      game flow: dice → question → result
assets/img/            Next-Gen 3 logo, favicon, touch icon
docs/TECHNICAL_SPEC.md design and technical specification
```

## Editing questions

Open `assets/js/data.js` and add an object to `QUESTIONS`:

```js
{
  id: "q_unique_id",                       // must be unique
  category: { en: "Next-Gen Day", km: "ថ្ងៃ Next-Gen" },
  question: "Your question?",
  options: ["Right answer", "Wrong", "Wrong", "Wrong"],  // exactly 4
  correctIndex: 0,                          // index of the right answer in `options`
  explanation: "Shown on the result screen.",
  source: "FAQ"                             // page on ngep.idt.edu.kh
}
```

Answer order is shuffled every turn, so the correct answer can sit anywhere in `options`.
The pool can be any size.

## Background music

Put a music file at `assets/audio/bgm.mp3`. It loops at 25% volume and starts on the player's first click or key press, because browsers block audio that plays on its own.
A music button (♫) appears next to the sound button only when the file exists. The on/off choice is remembered on the device, and the music pauses while the tab is hidden.
Use only music you are allowed to redistribute, and add any credit the licence asks for.

## How it plays

| Control | Action |
| :--- | :--- |
| Roll button, <kbd>Space</kbd> or <kbd>Enter</kbd> | Roll the dice |
| Click an answer, or <kbd>1</kbd>–<kbd>4</kbd> | Pick an answer (labelled ក ខ គ ឃ) |
| Submit button or <kbd>Enter</kbd> | Submit |
| "Roll for the next player", <kbd>Space</kbd> or <kbd>Enter</kbd> | Back to the dice |

- **15-second timer** on every question. The ring turns coral and ticks for the last 5 seconds.
  When time runs out, a picked answer is submitted; with no pick, the result shows "Time's up!" and the right answer.
  Change `QUESTION_SECONDS` in `assets/js/app.js` to adjust it.
- **No question numbers** are shown anywhere.
- **No repeats until the pool is used up.** A shuffle bag in `localStorage` deals every question once before reshuffling, even across page reloads. A new round never opens with the question just asked.
  To reset it, clear site data or run `localStorage.clear()` in the console.
- The sound on/off setting is remembered on the device.

## Accessibility

- Answers are real radio buttons with visible focus rings.
- Results are announced to screen readers through a live region.
- `prefers-reduced-motion` shortens the dice roll and turns off confetti and other animation.
- Text colour on each brand header is picked for contrast: dark ink on Emerald and Gold, white on Blue, Teal and Coral.
- Follows the system light or dark mode.
