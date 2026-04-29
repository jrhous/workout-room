// Iron Room — workout program data
window.IR_PROGRAM = {
  push: {
    id: 'push', day: 'MON', code: '01', title: 'PUSH', sub: 'Chest · Shoulders · Tri', focus: 'HEAVY + HYPERTROPHY', kind: 'lift',
    exercises: [
      { id: 'bench',     name: 'Bench Press',       sets: 4, reps: 8 },
      { id: 'incdb',     name: 'Incline DB Press',  sets: 3, reps: 10 },
      { id: 'shldr',     name: 'Shoulder Press',    sets: 3, reps: 10 },
      { id: 'flyes',     name: 'Cable Flyes',       sets: 3, reps: 12 },
      { id: 'tripush',   name: 'Tricep Pushdowns',  sets: 3, reps: 12 },
      { id: 'lats',      name: 'Lateral Raises',    sets: 3, reps: 15 },
    ],
  },
  hiit: {
    id: 'hiit', day: 'TUE', code: '02', title: 'HIIT', sub: 'Treadmill ~25 min', focus: 'EMPTY THE TANK', kind: 'cardio',
    segments: [
      { id: 'warm',   name: 'Warmup walk',       target: '5 MIN' },
      { id: 'sprint', name: 'Sprint intervals',  target: '8 × 30s/90s' },
      { id: 'cool',   name: 'Cooldown walk',     target: '5 MIN' },
    ],
  },
  pull: {
    id: 'pull', day: 'WED', code: '03', title: 'PULL', sub: 'Back · Biceps', focus: 'BUILD THE BACK', kind: 'lift',
    exercises: [
      { id: 'lat',    name: 'Lat Pulldown',     sets: 4, reps: 8 },
      { id: 'srow',   name: 'Seated Row',       sets: 4, reps: 10 },
      { id: 'sarow',  name: 'Single-Arm Row',   sets: 3, reps: 10 },
      { id: 'face',   name: 'Face Pulls',       sets: 3, reps: 15 },
      { id: 'curl',   name: 'Bicep Curls',      sets: 3, reps: 12 },
      { id: 'hamr',   name: 'Hammer Curls',     sets: 3, reps: 12 },
    ],
  },
  steady: {
    id: 'steady', day: 'THU', code: '04', title: 'STEADY', sub: 'Incline Walk 35–45 min', focus: 'SHOW UP ANYWAY', kind: 'cardio',
    segments: [
      { id: 'walk', name: 'Incline Walk', target: '3.5 MPH · 8–10%' },
    ],
  },
  legs: {
    id: 'legs', day: 'FRI', code: '05', title: 'LEGS', sub: 'Lower Body · Core', focus: 'EARN THE WEEKEND', kind: 'lift',
    exercises: [
      { id: 'gob',  name: 'Goblet/DB Squats',         sets: 4, reps: 10 },
      { id: 'rdl',  name: 'Romanian Deadlifts',       sets: 4, reps: 10 },
      { id: 'lp',   name: 'Leg Press / Split Squats', sets: 3, reps: 12 },
      { id: 'calf', name: 'Calf Raises',              sets: 4, reps: 15 },
      { id: 'hlr',  name: 'Hanging Leg Raises',       sets: 3, reps: 12 },
      { id: 'plk',  name: 'Plank (sec)',              sets: 3, reps: 45 },
    ],
  },
  full: {
    id: 'full', day: 'SAT', code: '06', title: 'FULL BODY', sub: 'Circuit + 20min Steady', focus: 'FINISH THE WEEK', kind: 'lift',
    exercises: [
      { id: 'sq',  name: 'Squats',          sets: 3, reps: 10 },
      { id: 'pu',  name: 'Push-ups',        sets: 3, reps: 10 },
      { id: 'rw',  name: 'Rows',            sets: 3, reps: 10 },
      { id: 'sp',  name: 'Shoulder Press',  sets: 3, reps: 10 },
      { id: 'tm',  name: 'Steady Treadmill', sets: 1, reps: '20 MIN', cardio: true },
    ],
  },
  rest: {
    id: 'rest', day: 'SUN', code: '07', title: 'REST', sub: 'Recovery & Repair', focus: 'GROW', kind: 'rest',
  },
};

// Day-of-week → workout id
window.IR_WEEK = ['rest', 'push', 'hiit', 'pull', 'steady', 'legs', 'full']; // Sun=0 → rest
window.IR_DAYNAMES = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

window.IR_QUOTES = [
  'SHOW UP. SUIT UP. LIFT.',
  'NO ZERO DAYS.',
  'EARN IT.',
  'MEASURED IS MANAGED.',
  'PUSH \u2018TIL YOU CAN\u2019T.',
  'EMPTY THE TANK.',
  'COMFORT IS THE ENEMY.',
  'RESPECT THE REPS.',
  'SLEEP IS A WEAPON.',
  'ONE MORE.',
  'HARD CHOICES, EASY LIFE.',
  'DO. WORK.',
];

window.IR_NUTRITION = [
  { k: 'Calories',   v: '~1,900–2,000' },
  { k: 'Protein (g)', v: '170+ (1g/lb)' },
  { k: 'Fat (g)',     v: '~60' },
  { k: 'Carbs (g)',   v: 'fill remainder' },
  { k: 'Water',       v: '0.75–1 gal' },
  { k: 'Sleep (hrs)', v: '7–9' },
];

window.IR_USERS = [
  { id: 'christian', name: 'CHRISTIAN', height: "6'0\"", startWeight: 200 },
  { id: 'johnny',    name: 'JOHNNY',    height: "5'9\"", startWeight: null },
];
