# Technical Specification: NGEP Quiz (Khmer Edition)

**Project:** Interactive NGEP/CADT single-question MCQ quiz game
**Platform:** Static web (HTML5, CSS3, ES2020 JavaScript), no build step
**Content source:** <https://ngep.idt.edu.kh> (Overview, Journey, FAQ)
**Status:** Production v1.0, replacing the prototype plan in `technical_development_plan.md`

---

## 1. Concept

A quiz game for classrooms, booths and Next-Gen Day, played one turn at a time:

1. **Dice gate.** The player rolls a 3D die. The screen is framed as *Khla Khlouk* (ខ្លាឃ្លោក), the Khmer New Year dice game.
2. **Hidden question identity.** One question is drawn from the pool. No numbers or counts are shown.
3. **Question card.** The card header takes one of the five official NGEP/CADT colours. Answers are rounded pills labelled with Khmer letters ក ខ គ ឃ.
4. **Instant result.** The screen shows Correct or Not quite, highlights the chosen and correct answers, explains the fact and links to the source. Correct answers get lotus-petal confetti and a roneat run; wrong answers get a kong gong.
5. **Loop.** "Roll for the next player" returns to the dice.

## 2. Changes from the prototype plan

| Area | Prototype plan | Production |
| :--- | :--- | :--- |
| Theme | FigJam dotted canvas | Khmer traditional: silk and lacquer surfaces, sompot diamond lattice, kbach corner scrolls, gold temple-lintel fringe, Angkor and sugar-palm skyline |
| Palette | 5 NGEP/CADT colours | **Same 5 colours, unchanged**, plus an `onColor` per entry for readable header text |
| Typography | Inter | Kantumruy Pro (Khmer and Latin UI) and Moul (Khmer display) |
| Language | English | Bilingual UI (English and Khmer); questions in English |
| Questions | Generic Cambodian tech | 16 questions on NGEP itself, each tied to a page on the program site |
| Styling | Tailwind CDN | Hand-written CSS. The Tailwind Play CDN is not meant for production. |
| Randomness | Random each roll | Shuffle bag: no repeats until the pool is used up, saved across reloads |
| Player cursor | Hard-coded "Diana" | Generic "Player" tag, no name input |
| Sound | Generic synth | Khmer-instrument-inspired: roneat mallet, kong gong, pentatonic scale, mute toggle |
| Accessibility | none | Radio semantics, focus management, live-region announcements, reduced motion, dark mode, keyboard play |
| Dice | Plain | Ivory faces with a gold inlay; the 1 and 4 pips are red, as on traditional Asian dice |

## 3. Brand palette

Stored in `assets/js/data.js` as `NGEP.PALETTE`. A different colour from the previous turn is picked on every roll.

| Name | Header / button | Accent text | Border | Text on header |
| :--- | :--- | :--- | :--- | :--- |
| NGEP Emerald Green | `#20BF55` | `#15803D` | `#16A34A` | `#0F2A1A` |
| CADT Tech Blue | `#0066FF` | `#0052CC` | `#0252CA` | `#FFFFFF` |
| NGEP Teal/Cyan | `#00A896` | `#028090` | `#028090` | `#FFFFFF` |
| Electric Coral | `#FF5964` | `#D93843` | `#E03643` | `#FFFFFF` |
| IDT Gold/Amber | `#FFB703` | `#B47800` | `#D49700` | `#2A1D00` |

At runtime `app.js` writes the active entry to CSS custom properties: `--brand`, `--brand-head`, `--brand-on`, `--brand-accent-bg`, `--brand-ink` and `--brand-border`.
The supporting neutrals are silk parchment (`#FBF5E9`) in light mode and black-and-gold lacquer (`#0C1126`) in dark mode. They only frame the brand colours.

## 4. Khmer design language

| Motif | Where | Built with |
| :--- | :--- | :--- |
| Lotus (ផ្កាឈូក) | Logo mark, favicon, "Did you know?" icon, confetti petals | SVG symbol `#i-lotus`, `confetti.shapeFromPath` |
| Kbach scroll (ក្បាច់) | Four gold card corners | SVG symbol `#i-kbach`, mirrored with CSS |
| Temple lintel fringe | Gold teeth under every card header | CSS background (inline SVG tile) |
| Sompot hol lattice | Page background, silk sheen on headers | Masked SVG tile, tinted by `--pattern` |
| Angkor prasat and sugar palms | Fixed skyline at the page bottom, with a sunset disc | SVG symbols `#tower` and `#palm` |
| Khmer letters and numerals | Answer keys ក ខ គ ឃ; "You rolled ៥" | Unicode Khmer |
| Gilded frame | Inner hairline around the card; gold ring on buttons | CSS pseudo-element and box-shadow |

## 5. Question model

```json
{
  "id": "q_structure",
  "category": { "en": "Program Journey", "km": "ដំណើរកម្មវិធី" },
  "question": "What is the correct order of the NGEP program structure?",
  "options": ["Training → Project Development → Competition & Showcase", "…", "…", "…"],
  "correctIndex": 0,
  "explanation": "Learn, build, showcase: …",
  "source": "Journey"
}
```

The pool covers the program's name and purpose, the Code/Connectivity/Commerce pillars, mission and vision, program structure, the tracks and eligibility, the Batch III schedule, project development phases, Next-Gen Day (Pitching Day Sept 23, Showcase Day Sept 25, CADT Innovation Conference Hall), fees, Orientation Day and certificates.

## 6. State and flow

```
dice ──roll()──▶ question ──submitAnswer()──▶ result ──nextTurn()──▶ dice
```

- `roll()` picks a face from 1 to 6 and spins the cube forward to it with at least two full turns on each axis over 1.6 s. It then applies a new palette, draws a question, shuffles the answers and shows the question view.
- `drawQuestion()` pops from the shuffle bag (`localStorage["ngep-quiz:bag"]`) and refills it when empty. If storage is blocked, it falls back to memory.
- Only one view is visible at a time (`hidden`). Focus moves to each view's heading so screen readers announce the change.

## 7. Resilience

- Scripts are classic `defer` scripts, not ES modules, so the page runs from `file://` as well as over HTTP.
- If the confetti CDN fails, the game still runs without confetti.
- If the Google Fonts CDN fails, the page falls back to Noto Sans Khmer or the system UI font.
- If Web Audio is unavailable or the player has muted it, the game runs silently.
- Every `localStorage` access is wrapped in try/catch.

## 8. Next steps

1. Add a Khmer translation (`question_km`, `options_km`) and a language toggle.
2. Add a presenter mode for projecting at events with a larger layout.
3. Self-host fonts and confetti with a service worker so booths work offline.
4. Add an optional score or leaderboard using a shared backend, if events need it.
