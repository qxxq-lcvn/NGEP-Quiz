/*
 * NGEP Quiz — game flow.
 *
 * Dice screen → (roll) → question card → (submit) → result → (roll again) → dice screen.
 * Question numbers are never shown. A shuffle bag kept in localStorage makes every
 * question appear once before any repeats, even across page reloads on a kiosk.
 */
(() => {
  "use strict";

  const { PALETTE, QUESTIONS, Sound } = window.NGEP;

  const OPTION_KEYS = ["ក", "ខ", "គ", "ឃ"];
  const KHMER_DIGITS = "០១២៣៤៥៦៧៨៩";
  const ROLL_MS = 1600;
  const SITE_URL = "https://ngep.idt.edu.kh/";

  const PIPS = {
    1: ["c"],
    2: ["tl", "br"],
    3: ["tl", "c", "br"],
    4: ["tl", "tr", "bl", "br"],
    5: ["tl", "tr", "c", "bl", "br"],
    6: ["tl", "tr", "ml", "mr", "bl", "br"]
  };
  // Cube rotation (deg) that brings each face to the front.
  const FACE_ROTATION = {
    1: { x: 0, y: 0 },
    2: { x: 0, y: -90 },
    3: { x: -90, y: 0 },
    4: { x: 90, y: 0 },
    5: { x: 0, y: 90 },
    6: { x: 0, y: 180 }
  };
  const REST_TILT = { x: -14, y: 18 };

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- storage (falls back to memory when localStorage is blocked) ---------- */

  const store = (() => {
    const memory = new Map();
    const prefix = "ngep-quiz:";
    return {
      get(key, fallback) {
        try {
          const raw = localStorage.getItem(prefix + key);
          if (raw !== null) return JSON.parse(raw);
        } catch (_) {
          /* storage unavailable */
        }
        return memory.has(key) ? memory.get(key) : fallback;
      },
      set(key, value) {
        memory.set(key, value);
        try {
          localStorage.setItem(prefix + key, JSON.stringify(value));
        } catch (_) {
          /* storage unavailable */
        }
      }
    };
  })();

  /* ---------- helpers ---------- */

  const $ = (selector) => document.querySelector(selector);
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const toKhmerNumber = (n) => String(n).replace(/\d/g, (d) => KHMER_DIGITS[d]);

  function h(tag, attrs = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === false || value == null) continue;
      if (key === "class") node.className = value;
      else node.setAttribute(key, value === true ? "" : value);
    }
    node.append(...children.filter((c) => c != null));
    return node;
  }

  function icon(id, className = "icon") {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", className);
    svg.setAttribute("aria-hidden", "true");
    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", "#" + id);
    svg.append(use);
    return svg;
  }

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  /* ---------- elements & state ---------- */

  const els = {
    card: $("#card"),
    views: {
      dice: $("#view-dice"),
      question: $("#view-question"),
      result: $("#view-result")
    },
    dice: $("#dice"),
    diceStage: $("#dice-stage"),
    rollBtn: $("#roll-btn"),
    rollLabel: $("#roll-btn .btn__label"),
    rollNote: $("#roll-note"),
    form: $("#quiz-form"),
    qCategory: $("#q-category"),
    qText: $("#q-text"),
    options: $("#options"),
    submitBtn: $("#submit-btn"),
    rHead: $("#view-result .card__head"),
    rIcon: $("#r-icon use"),
    rTitle: $("#r-title"),
    rTitleKm: $("#r-title-km"),
    rGreeting: $("#r-greeting"),
    rQuestion: $("#r-question"),
    rOptions: $("#r-options"),
    rExplain: $("#r-explain"),
    rSource: $("#r-source"),
    nextBtn: $("#next-btn"),
    soundBtn: $("#sound-btn"),
    soundIcon: $("#sound-btn use"),
    announcer: $("#announcer"),
    themeMeta: $('meta[name="theme-color"]')
  };

  const state = {
    view: "dice",
    rolling: false,
    paletteIndex: 1,
    rotation: { ...REST_TILT },
    current: null,
    selected: null
  };

  /* ---------- palette ---------- */

  function applyPalette(index) {
    const p = PALETTE[index];
    const root = document.documentElement.style;
    root.setProperty("--brand", p.btnColor);
    root.setProperty("--brand-head", p.headerBg);
    root.setProperty("--brand-on", p.onColor);
    root.setProperty("--brand-accent-bg", p.accentBg);
    root.setProperty("--brand-ink", p.accentText);
    root.setProperty("--brand-border", p.borderColor);
    if (els.themeMeta) els.themeMeta.setAttribute("content", p.headerBg);
    state.paletteIndex = index;
  }

  function pickPalette() {
    if (PALETTE.length < 2) return 0;
    let i;
    do i = Math.floor(Math.random() * PALETTE.length);
    while (i === state.paletteIndex);
    return i;
  }

  /* ---------- question bag ---------- */

  function drawQuestion() {
    const ids = QUESTIONS.map((q) => q.id);
    const last = store.get("last", null);
    let bag = store.get("bag", []).filter((id) => ids.includes(id));
    if (bag.length === 0) {
      bag = shuffle(ids);
      // bag is drawn from the end — don't open a new round with the question just asked
      if (bag.length > 1 && bag[bag.length - 1] === last) {
        [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
      }
    }
    const id = bag.pop();
    store.set("bag", bag);
    store.set("last", id);
    const question = QUESTIONS.find((q) => q.id === id);
    return {
      ...question,
      choices: shuffle(question.options.map((text, i) => ({ text, correct: i === question.correctIndex })))
    };
  }

  /* ---------- views ---------- */

  function showView(name) {
    for (const [key, view] of Object.entries(els.views)) {
      view.hidden = key !== name;
    }
    state.view = name;
    document.body.dataset.view = name;
    // views differ in height; bring the top of the card back into view if it scrolled away
    if (els.card.getBoundingClientRect().top < 0) {
      window.scrollTo({
        top: window.scrollY + els.card.getBoundingClientRect().top - 16,
        behavior: reducedMotion.matches ? "auto" : "smooth"
      });
    }
  }

  function announce(message) {
    els.announcer.textContent = "";
    // new text on the next frame so screen readers re-announce identical messages
    requestAnimationFrame(() => (els.announcer.textContent = message));
  }

  /* ---------- dice ---------- */

  function buildDice() {
    for (const face of els.dice.querySelectorAll(".face")) {
      const value = Number(face.dataset.face);
      face.append(...PIPS[value].map((pos) => h("span", { class: `pip pip--${pos}` })));
    }
    setDiceRotation(state.rotation);
  }

  function setDiceRotation({ x, y }) {
    els.dice.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;
  }

  async function roll() {
    if (state.rolling || state.view !== "dice") return;
    state.rolling = true;
    Sound.unlock();

    const quick = reducedMotion.matches;
    const face = 1 + Math.floor(Math.random() * 6);
    const target = FACE_ROTATION[face];
    const next = {
      x: Math.ceil(state.rotation.x / 360) * 360 + 720 + target.x + REST_TILT.x,
      y: Math.ceil(state.rotation.y / 360) * 360 + 1080 + target.y + REST_TILT.y
    };
    state.rotation = next;

    els.rollBtn.disabled = true;
    els.rollBtn.setAttribute("aria-busy", "true");
    els.rollLabel.textContent = "Rolling…";
    els.rollNote.textContent = " ";
    els.diceStage.classList.add("is-rolling");
    setDiceRotation(next);
    Sound.roll(ROLL_MS);

    await wait(quick ? 250 : ROLL_MS);
    els.diceStage.classList.remove("is-rolling");
    Sound.land();
    els.rollNote.textContent = `You rolled ${face} · ទទួលបាន ${toKhmerNumber(face)}`;
    announce(`You rolled ${face}. Here is your question.`);
    await wait(quick ? 150 : 650);

    applyPalette(pickPalette());
    state.current = drawQuestion();
    state.selected = null;
    renderQuestion();
    showView("question");
    els.qText.focus({ preventScroll: true });

    els.rollBtn.disabled = false;
    els.rollBtn.removeAttribute("aria-busy");
    els.rollLabel.textContent = "Roll the dice";
    state.rolling = false;
  }

  /* ---------- question ---------- */

  function renderCategory(target, category) {
    target.replaceChildren(
      h("span", {}, category.en),
      h("span", { class: "chip__sep", "aria-hidden": "true" }, "·"),
      h("span", { class: "km", lang: "km" }, category.km)
    );
  }

  function renderQuestion() {
    const q = state.current;
    renderCategory(els.qCategory, q.category);
    els.qText.textContent = q.question;
    els.options.replaceChildren(
      ...q.choices.map((choice, i) =>
        h(
          "label",
          { class: "option" },
          h("input", { type: "radio", name: "answer", value: String(i), class: "sr-only" }),
          h("span", { class: "option__key", lang: "km", "aria-hidden": "true" }, OPTION_KEYS[i]),
          h("span", { class: "option__text" }, choice.text)
        )
      )
    );
    els.submitBtn.disabled = true;
  }

  function selectOption(index) {
    const input = els.options.querySelectorAll('input[name="answer"]')[index];
    if (!input) return;
    input.checked = true;
    input.focus({ preventScroll: true });
    onAnswerChange(index);
  }

  function onAnswerChange(index) {
    state.selected = index;
    els.submitBtn.disabled = false;
    Sound.tick(index);
  }

  /* ---------- result ---------- */

  function submitAnswer() {
    if (state.selected == null || state.view !== "question") return;
    const q = state.current;
    const correct = q.choices[state.selected].correct;
    renderResult(correct);
    showView("result");
    els.rTitle.focus({ preventScroll: true });

    if (correct) {
      Sound.success();
      celebrate();
    } else {
      Sound.fail();
    }
    const answer = q.choices.find((c) => c.correct).text;
    announce(correct ? `Correct! ${answer}.` : `Not quite. The correct answer is: ${answer}.`);
  }

  function renderResult(correct) {
    const q = state.current;
    els.card.dataset.result = correct ? "correct" : "incorrect";
    els.rIcon.setAttribute("href", correct ? "#i-check" : "#i-x");
    els.rTitle.textContent = correct ? "Correct!" : "Not quite";
    els.rTitleKm.textContent = correct ? "ត្រឹមត្រូវ!" : "មិនទាន់ត្រឹមត្រូវទេ";
    els.rGreeting.textContent = correct
      ? "Well done!"
      : "Good try. Here’s the right answer.";
    els.rQuestion.textContent = q.question;

    els.rOptions.replaceChildren(
      ...q.choices.map((choice, i) => {
        const isChosen = i === state.selected;
        let status = "is-muted";
        let tag = null;
        if (choice.correct) {
          status = "is-correct";
          tag = h("span", { class: "tag" }, isChosen ? "Your answer" : "Correct answer");
        } else if (isChosen) {
          status = "is-wrong";
          tag = h("span", { class: "tag" }, "Your answer");
        }
        const key = choice.correct || isChosen
          ? h("span", { class: "option__key" }, icon(choice.correct ? "i-check" : "i-x", "icon icon--sm"))
          : h("span", { class: "option__key", lang: "km", "aria-hidden": "true" }, OPTION_KEYS[i]);
        return h(
          "li",
          { class: `option option--static ${status}` },
          key,
          h("span", { class: "option__text" }, choice.text, tag)
        );
      })
    );

    els.rExplain.textContent = q.explanation;
    els.rSource.textContent = `ngep.idt.edu.kh · ${q.source}`;
    els.rSource.href = SITE_URL;
  }

  function celebrate() {
    if (reducedMotion.matches || typeof window.confetti !== "function") return;
    const colors = PALETTE.map((p) => p.headerBg);
    let shapes = ["circle", "square"];
    try {
      // lotus-petal confetti
      const petal = window.confetti.shapeFromPath({ path: "M0 6C3 0 9 0 12 6C9 12 3 12 0 6Z" });
      shapes = [petal, petal, "circle"];
    } catch (_) {
      /* older confetti build: keep default shapes */
    }
    const base = { colors, shapes, scalar: 1.15, ticks: 220, disableForReducedMotion: true };
    window.confetti({ ...base, particleCount: 110, spread: 85, startVelocity: 42, origin: { y: 0.35 } });
    setTimeout(() => {
      window.confetti({ ...base, particleCount: 45, angle: 60, spread: 60, origin: { x: 0, y: 0.7 } });
      window.confetti({ ...base, particleCount: 45, angle: 120, spread: 60, origin: { x: 1, y: 0.7 } });
    }, 220);
  }

  function nextTurn() {
    delete els.card.dataset.result;
    els.rollNote.textContent = " ";
    showView("dice");
    els.rollBtn.focus({ preventScroll: true });
  }

  /* ---------- sound toggle ---------- */

  function setMuted(muted) {
    Sound.setMuted(muted);
    store.set("muted", muted);
    els.soundBtn.setAttribute("aria-pressed", String(!muted));
    els.soundBtn.setAttribute("aria-label", muted ? "Sound off. Turn sound on" : "Sound on. Turn sound off");
    els.soundIcon.setAttribute("href", muted ? "#i-sound-off" : "#i-sound-on");
  }

  /* ---------- events ---------- */

  function isTyping(target) {
    return target instanceof HTMLElement && (target.isContentEditable || (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) && target.type !== "radio"));
  }

  function onKeydown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || isTyping(event.target)) return;
    const onControl = event.target instanceof HTMLElement && event.target.closest("button, a");
    const activate = event.key === "Enter" || event.key === " ";

    if (state.view === "dice" && activate && !onControl) {
      event.preventDefault();
      roll();
    } else if (state.view === "question" && /^[1-4]$/.test(event.key)) {
      event.preventDefault();
      selectOption(Number(event.key) - 1);
    } else if (state.view === "result" && activate && !onControl) {
      event.preventDefault();
      nextTurn();
    }
  }

  function init() {
    setMuted(store.get("muted", false));
    applyPalette(state.paletteIndex);
    buildDice();
    showView("dice");

    els.rollBtn.addEventListener("click", roll);
    els.form.addEventListener("change", (e) => {
      if (e.target.name === "answer") onAnswerChange(Number(e.target.value));
    });
    els.form.addEventListener("submit", (e) => {
      e.preventDefault();
      submitAnswer();
    });
    els.nextBtn.addEventListener("click", nextTurn);
    els.soundBtn.addEventListener("click", () => {
      setMuted(!Sound.isMuted());
      Sound.unlock();
      if (!Sound.isMuted()) Sound.tick(2);
    });
    document.addEventListener("keydown", onKeydown);
    document.documentElement.classList.add("js-ready");
  }

  init();
})();
