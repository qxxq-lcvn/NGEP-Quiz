/*
 * NGEP Quiz — content & brand data.
 *
 * All facts come from the official program site: https://ngep.idt.edu.kh
 * (Overview, Journey and FAQ pages). Edit this file to add or change questions;
 * no build step is needed.
 */
window.NGEP = window.NGEP || {};

/*
 * Official NGEP / CADT palette (unchanged from the spec).
 * `onColor` is the text colour placed on top of `headerBg`, chosen for contrast:
 * dark ink on Emerald and Gold, white on the others.
 */
window.NGEP.PALETTE = [
  {
    name: "NGEP Emerald Green",
    headerBg: "#20BF55",
    accentBg: "rgba(32, 191, 85, 0.12)",
    accentText: "#15803D",
    btnColor: "#20BF55",
    borderColor: "#16A34A",
    onColor: "#0F2A1A"
  },
  {
    name: "CADT Tech Blue",
    headerBg: "#0066FF",
    accentBg: "rgba(0, 102, 255, 0.12)",
    accentText: "#0052CC",
    btnColor: "#0066FF",
    borderColor: "#0252CA",
    onColor: "#FFFFFF"
  },
  {
    name: "NGEP Teal/Cyan",
    headerBg: "#00A896",
    accentBg: "rgba(0, 168, 150, 0.12)",
    accentText: "#028090",
    btnColor: "#00A896",
    borderColor: "#028090",
    onColor: "#FFFFFF"
  },
  {
    name: "Electric Coral",
    headerBg: "#FF5964",
    accentBg: "rgba(255, 89, 100, 0.12)",
    accentText: "#D93843",
    btnColor: "#FF5964",
    borderColor: "#E03643",
    onColor: "#FFFFFF"
  },
  {
    name: "IDT Gold/Amber",
    headerBg: "#FFB703",
    accentBg: "rgba(255, 183, 3, 0.15)",
    accentText: "#B47800",
    btnColor: "#FFB703",
    borderColor: "#D49700",
    onColor: "#2A1D00"
  }
];

/*
 * Question pool. Schema:
 *   id           unique string (used by the no-repeat shuffle bag)
 *   category     { en, km } label shown as a chip — never a number
 *   question     question text
 *   options      exactly 4 answers; order is shuffled at runtime
 *   correctIndex index into `options` of the right answer
 *   explanation  shown on the result screen
 *   source       which page of ngep.idt.edu.kh the fact comes from
 */
window.NGEP.QUESTIONS = [
  {
    id: "q_name",
    category: { en: "The Program", km: "កម្មវិធី" },
    question: "What does NGEP stand for?",
    options: [
      "Next-Gen Engagement Program",
      "Next-Generation Education Platform",
      "National Graduate Employment Project",
      "New-Gen Entrepreneurship Partnership"
    ],
    correctIndex: 0,
    explanation:
      "NGEP is the Next-Gen Engagement Program: a semester-break program at CADT for aspiring digital students.",
    source: "Overview"
  },
  {
    id: "q_cohorts",
    category: { en: "The Program", km: "កម្មវិធី" },
    question: "NGEP promotes knowledge sharing between which two groups of students?",
    options: [
      "Senior and junior cohorts",
      "Students and their parents",
      "Local and international exchange students",
      "Graduates and employers"
    ],
    correctIndex: 0,
    explanation:
      "The program connects senior and junior cohorts, supports academic readiness through mentoring and coaching, and gives students a platform to develop ideas for real-world challenges.",
    source: "Overview"
  },
  {
    id: "q_pillars",
    category: { en: "Why Join", km: "ហេតុអ្វីចូលរួម" },
    question: "“Why join Next-Gen?” rests on three pillars: Code, Connectivity and…",
    options: ["Commerce", "Culture", "Cloud", "Competition"],
    correctIndex: 0,
    explanation:
      "Code builds technical expertise, Connectivity builds networks, and Commerce encourages innovation, entrepreneurship and real-world application.",
    source: "Overview"
  },
  {
    id: "q_connectivity",
    category: { en: "Why Join", km: "ហេតុអ្វីចូលរួម" },
    question: "Which NGEP pillar is about building networks, collaboration and knowledge sharing?",
    options: ["Connectivity", "Code", "Commerce", "Community"],
    correctIndex: 0,
    explanation:
      "Connectivity is about networks and collaboration. Code covers technical and problem-solving skills; Commerce covers entrepreneurship.",
    source: "Overview"
  },
  {
    id: "q_mission",
    category: { en: "Mission", km: "បេសកកម្ម" },
    question: "Which statement is NGEP’s mission?",
    options: [
      "To connect scholars and foster collaboration on real-world projects, so they can create and showcase impactful innovations",
      "To replace university degrees with short online courses",
      "To recruit students directly into government ministries",
      "To host an annual international hackathon abroad"
    ],
    correctIndex: 0,
    explanation:
      "The mission focuses on connecting scholars and collaborating on real-world projects that are showcased as impactful innovations.",
    source: "Overview"
  },
  {
    id: "q_vision",
    category: { en: "Vision", km: "ចក្ខុវិស័យ" },
    question: "NGEP’s vision is to empower future…",
    options: ["Technology leaders", "Civil servants", "Professional athletes", "Financial analysts"],
    correctIndex: 0,
    explanation:
      "The vision: to empower future technology leaders through collaborative learning, innovation, leadership and advanced ICT skills.",
    source: "Overview"
  },
  {
    id: "q_structure",
    category: { en: "Program Journey", km: "ដំណើរកម្មវិធី" },
    question: "What is the correct order of the NGEP program structure?",
    options: [
      "Training → Project Development → Competition & Showcase",
      "Competition → Training → Project Development",
      "Project Development → Showcase → Training",
      "Showcase → Training → Competition"
    ],
    correctIndex: 0,
    explanation:
      "Learn, build, showcase: Phase 1 is Training, Phase 2 is Project Development, and Phase 3 is Competition & Showcase.",
    source: "Journey"
  },
  {
    id: "q_uni_weeks",
    category: { en: "Program Journey", km: "ដំណើរកម្មវិធី" },
    question: "How long is the training on the University track?",
    options: ["5 weeks", "1 week", "3 weeks", "12 weeks"],
    correctIndex: 0,
    explanation:
      "University-track students attend an orientation, then 5 weeks of morning training, then the 2-day Next-Gen Day event. The Highschool track trains for 1 week.",
    source: "FAQ"
  },
  {
    id: "q_highschool",
    category: { en: "Who Can Apply", km: "អ្នកដែលអាចដាក់ពាក្យ" },
    question: "Which high school students can apply for the Highschool track?",
    options: [
      "Grades 10–11 from partner schools",
      "Grades 7–9 only",
      "Grade 12 graduates only",
      "Any student aged 13 or above"
    ],
    correctIndex: 0,
    explanation:
      "The Highschool track is for grade 10 or 11 students from partner schools. The University track is open to university students in any year.",
    source: "FAQ"
  },
  {
    id: "q_afternoon",
    category: { en: "Batch III", km: "ជំនាន់ទី៣" },
    question: "In Batch III, when are the project development sessions held?",
    options: [
      "Afternoons, 1:00 PM – 3:00 PM",
      "Mornings, 9:00 AM – 12:15 PM",
      "Evenings, 6:00 PM – 8:00 PM",
      "Weekends only"
    ],
    correctIndex: 0,
    explanation:
      "Training classes run in the morning (9:00 AM – 12:15 PM). Teams build their projects with a mentor in the afternoon (1:00 PM – 3:00 PM).",
    source: "Journey"
  },
  {
    id: "q_phases",
    category: { en: "Project Development", km: "ការអភិវឌ្ឍគម្រោង" },
    question: "The project development phases are Planning, Design, Implementation, Testing and…",
    options: ["Documentation", "Deployment", "Marketing", "Fundraising"],
    correctIndex: 0,
    explanation:
      "The five phases are Planning, Design, Implementation, Testing and Documentation. Each team is supported by a mentor throughout.",
    source: "Journey"
  },
  {
    id: "q_pitching",
    category: { en: "Next-Gen Day", km: "ថ្ងៃ Next-Gen" },
    question: "What happens on September 23rd, 2026?",
    options: ["Pitching Day", "Showcase Day", "Orientation Day", "Graduation ceremony"],
    correctIndex: 0,
    explanation:
      "Next-Gen Day has two parts: Pitching Day on Sept 23rd and Showcase Day on Sept 25th, both starting at 8:00 AM.",
    source: "Journey"
  },
  {
    id: "q_venue",
    category: { en: "Next-Gen Day", km: "ថ្ងៃ Next-Gen" },
    question: "Where is the Batch III Competition & Showcase held?",
    options: [
      "CADT Innovation, Conference Hall",
      "Koh Pich Exhibition Center",
      "Olympic Stadium",
      "Online only"
    ],
    correctIndex: 0,
    explanation:
      "Teams pitch, give live demos and are judged at the CADT Innovation Conference Hall, Bridge 2, National Road 6A, Phnom Penh.",
    source: "Journey"
  },
  {
    id: "q_fee",
    category: { en: "Joining", km: "ការចូលរួម" },
    question: "How much does the program cost for CADT students?",
    options: [
      "It is free of charge",
      "The same competition fee as everyone else",
      "A monthly tuition fee",
      "A fee paid only for the certificate"
    ],
    correctIndex: 0,
    explanation:
      "CADT students join for free. Other Highschool and University participants pay a competition fee to compete on Next-Gen Day.",
    source: "FAQ"
  },
  {
    id: "q_orientation",
    category: { en: "Orientation Day", km: "ថ្ងៃតម្រង់ទិស" },
    question: "Which activity takes place on Orientation Day?",
    options: [
      "Team formation and a mentors meetup",
      "Judges’ evaluation",
      "Awards & recognition",
      "Final live demo"
    ],
    correctIndex: 0,
    explanation:
      "Orientation Day (July 30th, 2026) covers the program overview, team formation, a mentors meetup and the project briefing.",
    source: "Home"
  },
  {
    id: "q_certificate",
    category: { en: "Benefits", km: "អត្ថប្រយោជន៍" },
    question: "What do participants receive after meeting all the program requirements?",
    options: [
      "A certificate of completion",
      "A university degree",
      "A guaranteed job offer",
      "A free laptop"
    ],
    correctIndex: 0,
    explanation:
      "Participants who submit their work and meet all the requirements receive a certificate of completion, along with new connections and a team-built prototype.",
    source: "FAQ"
  }
];
