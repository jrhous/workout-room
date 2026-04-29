window.IronTracker = (function(){

  const PUSH = [
    ['Bench Press', '4 × 8'],
    ['Incline DB Press', '3 × 10'],
    ['Shoulder Press', '3 × 10'],
    ['Cable Flyes', '3 × 12'],
    ['Tricep Pushdowns', '3 × 12'],
    ['Lateral Raises', '3 × 15'],
  ];
  const PULL = [
    ['Lat Pulldown', '4 × 8'],
    ['Seated Row', '4 × 10'],
    ['Single-Arm Row', '3 × 10'],
    ['Face Pulls', '3 × 15'],
    ['Bicep Curls', '3 × 12'],
    ['Hammer Curls', '3 × 12'],
  ];
  const LEGS = [
    ['Goblet/DB Squats', '4 × 10'],
    ['Romanian Deadlifts', '4 × 10'],
    ['Leg Press / Split Squats', '3 × 12'],
    ['Calf Raises', '4 × 15'],
    ['Hanging Leg Raises', '3 × 12'],
    ['Plank (sec)', '3 × 45'],
  ];
  const CIRCUIT = [
    ['Squats (circuit)', '3 × 10'],
    ['Push-ups (circuit)', '3 × 10'],
    ['Rows (circuit)', '3 × 10'],
    ['Shoulder Press (circuit)', '3 × 10'],
    ['Steady Treadmill', '20 MIN'],
  ];
  const HIIT = [
    ['Warmup walk', '5 MIN'],
    ['Sprint intervals', '8 × 30s/90s'],
    ['Cooldown walk', '5 MIN'],
  ];
  const STEADY = [
    ['Incline Walk', '3.5 MPH · 8–10%'],
  ];

  function liftTable(rows){
    let html = `<table class="log">
      <thead><tr>
        <th style="width:24%">Exercise</th>
        <th style="width:9%">Target</th>
        <th>Set 1 (lbs × reps)</th>
        <th>Set 2 (lbs × reps)</th>
        <th>Set 3 (lbs × reps)</th>
        <th>Set 4 (lbs × reps)</th>
        <th style="width:14%">Notes / RPE</th>
      </tr></thead><tbody>`;
    for (const [ex, t] of rows) {
      html += `<tr>
        <td class="exname">${ex}</td>
        <td class="target">${t}</td>
        <td class="fill"></td><td class="fill"></td><td class="fill"></td><td class="fill"></td>
        <td class="fill"></td>
      </tr>`;
    }
    html += '</tbody></table>';
    return html;
  }

  function cardioTable(rows){
    let html = `<table class="log">
      <thead><tr>
        <th style="width:26%">Segment</th>
        <th style="width:18%">Time / Pace</th>
        <th>Distance (mi)</th>
        <th>Avg HR</th>
        <th>Calories</th>
        <th style="width:10%">Felt 1–10</th>
        <th style="width:14%">Notes</th>
      </tr></thead><tbody>`;
    for (const [ex, t] of rows) {
      html += `<tr>
        <td class="exname">${ex}</td>
        <td class="target">${t}</td>
        <td class="fill"></td><td class="fill"></td><td class="fill"></td>
        <td class="fill"></td><td class="fill"></td>
      </tr>`;
    }
    html += '</tbody></table>';
    return html;
  }

  function pageHead(name, weekLabel, weekNum) {
    const totalLabel = weekLabel === 'SUMMARY' ? 'PROGRESS REPORT' : `6-WEEK PROTOCOL`;
    return `<div class="page-head">
      <div class="id-block">
        <div class="kicker">▌ THE IRON ROOM</div>
        <div>FILE: ${name.toUpperCase()}-TRK-${weekNum}</div>
        <div>REV.01 · 2026</div>
      </div>
      <div class="name-block">
        <h1>${name.toUpperCase()} <span class="red">/</span> ${weekLabel}</h1>
        <span class="sub">${totalLabel} · LOG IT OR LOSE IT</span>
      </div>
      <div class="week-block">
        <div class="stamp">${weekNum}<small>${weekLabel === 'SUMMARY' ? 'OVERVIEW' : 'OF SIX'}</small></div>
      </div>
    </div>`;
  }

  function dateStrip() {
    return `<div class="date-strip">
      <div class="field"><span class="lab">DATE RANGE</span><span class="fill" style="min-width:280px;"></span></div>
      <div class="field"><span class="lab">BW START</span><span class="fill" style="min-width:80px;"></span><span style="color:var(--bone); opacity:0.6;">LBS</span></div>
      <div class="field"><span class="lab">BW END</span><span class="fill" style="min-width:80px;"></span><span style="color:var(--bone); opacity:0.6;">LBS</span></div>
      <div class="field"><span class="lab">RPE AVG</span><span class="fill" style="min-width:60px;"></span></div>
    </div>`;
  }

  function dayHeader(num, dayName, mainLabel, focus) {
    return `<div class="day-row">
      <div class="num">${num}</div>
      <div class="label">${dayName} <span class="pipe">/</span> ${mainLabel}<span class="focus">${focus}</span></div>
    </div>`;
  }

  function summaryPage(name) {
    return `<section class="page" data-screen-label="01 ${name} Summary">
      ${pageHead(name, 'SUMMARY', '01')}
      <div class="summary-grid" style="margin-top:14px;">
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div class="panel">
            <div class="panel-title">Starting Stats <span class="badge">DAY 0</span></div>
            <div class="kv">
              <span class="k">Height</span><span class="v preset">5'9"</span>
              <span class="k">Starting Weight (lbs)</span><span class="v"></span>
              <span class="k">Starting BF % (est.)</span><span class="v"></span>
              <span class="k">Waist (in)</span><span class="v"></span>
              <span class="k">Chest (in)</span><span class="v"></span>
              <span class="k">Arms (in)</span><span class="v"></span>
              <span class="k">Thighs (in)</span><span class="v"></span>
            </div>
          </div>
          <div class="panel">
            <div class="panel-title">Daily Nutrition <span class="badge">FUEL</span></div>
            <div class="kv">
              <span class="k">Calories</span><span class="v preset">~1,900–2,000</span>
              <span class="k">Protein (g)</span><span class="v preset">170+ (1g/lb)</span>
              <span class="k">Fat (g)</span><span class="v preset">~60</span>
              <span class="k">Carbs (g)</span><span class="v preset">FILL REMAINDER</span>
              <span class="k">Water</span><span class="v preset">0.75–1 GAL</span>
              <span class="k">Sleep (hrs)</span><span class="v preset">7–9</span>
            </div>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:14px;">
          <div class="panel" style="flex:1;">
            <div class="panel-title">Weekly Check-Ins <span class="badge">MEASURE IT</span></div>
            <table class="checkin">
              <thead><tr>
                <th>Week</th><th>Bodyweight (lbs)</th><th>Waist (in)</th><th>Avg Calories</th><th>Workouts /6</th><th style="width:30%">Notes</th>
              </tr></thead>
              <tbody>
                ${[1,2,3,4,5,6].map(w=>`<tr><td class="weeklab">W${w}</td><td></td><td></td><td></td><td></td><td></td></tr>`).join('')}
                <tr class="total"><td class="weeklab">Δ TOTAL</td><td></td><td></td><td></td><td></td><td></td></tr>
              </tbody>
            </table>
          </div>
          <div class="creed-block">
            <span>Add weight or reps every week.</span>
            <span>Log every set. Measured = managed.</span>
            <span>Protein at every meal. 30–50g.</span>
            <span>Aim 1–1.5 lbs/week loss. Faster = muscle loss.</span>
            <span>Re-check Wk 4. If stuck, drop cals 150 (NOT exercise).</span>
            <span>Rest days are growth days. Don't skip.</span>
            <span>Sleep is non-negotiable.</span>
            <span>Show up. Suit up. Lift.</span>
          </div>
        </div>
      </div>
      <div class="slogan-band">
        <span class="small">PROTOCOL</span>
        <span class="big">SIX WEEKS · ZERO QUIT</span>
        <span class="small">EARN IT</span>
      </div>
      <div class="page-foot"><span>${name.toUpperCase()} · 6-WEEK TRACKER</span><span>P.01 / 07 · SUMMARY</span></div>
    </section>`;
  }

  function weekPageA(name, week) {
    return `<section class="page" data-screen-label="${String(week+1).padStart(2,'0')} ${name} Wk${week} A">
      ${pageHead(name, `WEEK ${week}`, String(week).padStart(2,'0'))}
      ${dateStrip()}
      ${dayHeader('01','MON','PUSH — Chest · Shoulders · Tri','HEAVY + HYPERTROPHY')}
      ${liftTable(PUSH)}
      ${dayHeader('02','TUE','HIIT — Treadmill (~25 min)','EMPTY THE TANK')}
      ${cardioTable(HIIT)}
      ${dayHeader('03','WED','PULL — Back · Biceps','BUILD THE BACK')}
      ${liftTable(PULL)}
      <div class="page-foot"><span>${name.toUpperCase()} · WEEK ${week} · MON–WED</span><span>P.${String(week*1+1).padStart(2,'0')} / 07</span></div>
    </section>`;
  }

  function weekPageB(name, week) {
    return `<section class="page" data-screen-label="${String(week+1).padStart(2,'0')} ${name} Wk${week} B">
      ${pageHead(name, `WEEK ${week} · CONT.`, String(week).padStart(2,'0'))}
      ${dayHeader('04','THU','STEADY CARDIO — Incline Walk (35–45 min)','SHOW UP ANYWAY')}
      ${cardioTable(STEADY)}
      ${dayHeader('05','FRI','LEGS — Lower Body · Core','EARN THE WEEKEND')}
      ${liftTable(LEGS)}
      ${dayHeader('06','SAT','FULL BODY + CARDIO — Circuit + 20min','FINISH THE WEEK')}
      ${liftTable(CIRCUIT)}
      <div class="page-foot"><span>${name.toUpperCase()} · WEEK ${week} · THU–SAT</span><span>P.${String(week*1+1).padStart(2,'0')}b / 07</span></div>
    </section>`;
  }

  function render(name) {
    const root = document.getElementById('tracker-root');
    let html = summaryPage(name);
    // Each week is 1 page combining Mon-Sat condensed (the original PDF used 2 pages/week,
    // but for an A4 daily fill-in we keep it dense — using only weekPageA which has Mon/Tue/Wed)
    // To keep total at 7 pages (1 summary + 6 weeks), each week is ONE page covering all 6 days.
    for (let w = 1; w <= 6; w++) {
      html += weekPageCombined(name, w);
    }
    root.innerHTML = html;
    document.title = `${name} — Iron Room Tracker`;
  }

  function weekPageCombined(name, week) {
    // Single A4 landscape page with all 6 days, two columns.
    return `<section class="page" data-screen-label="${String(week+1).padStart(2,'0')} ${name} Week ${week}">
      ${pageHead(name, `WEEK ${week}`, String(week).padStart(2,'0'))}
      ${dateStrip()}
      <div class="day-cols">
        <div style="display:flex; flex-direction:column; gap:6px; min-height:0;">
          ${dayHeader('01','MON','PUSH','HEAVY')}
          ${liftTableCompact(PUSH)}
          ${dayHeader('03','WED','PULL','BACK & BI')}
          ${liftTableCompact(PULL)}
          ${dayHeader('05','FRI','LEGS','NO SKIP')}
          ${liftTableCompact(LEGS)}
        </div>
        <div style="display:flex; flex-direction:column; gap:6px; min-height:0;">
          ${dayHeader('02','TUE','HIIT — Treadmill','SPRINT')}
          ${cardioTableCompact(HIIT)}
          ${dayHeader('04','THU','STEADY — Incline Walk','RECOVER')}
          ${cardioTableCompact(STEADY)}
          ${dayHeader('06','SAT','FULL BODY + 20min STEADY','FINISH')}
          ${liftTableCompact(CIRCUIT)}
        </div>
      </div>
      <div class="page-foot"><span>${name.toUpperCase()} · WEEK ${week} OF 6 · LOG EVERY SET</span><span>P.${String(week+1).padStart(2,'0')} / 07</span></div>
    </section>`;
  }

  function liftTableCompact(rows) {
    let html = `<table class="log">
      <thead><tr>
        <th style="width:30%">Exercise</th>
        <th style="width:11%">Target</th>
        <th>S1 (lbs×reps)</th>
        <th>S2</th>
        <th>S3</th>
        <th>S4</th>
        <th style="width:13%">RPE / Notes</th>
      </tr></thead><tbody>`;
    for (const [ex, t] of rows) {
      html += `<tr>
        <td class="exname">${ex}</td>
        <td class="target">${t}</td>
        <td class="fill"></td><td class="fill"></td><td class="fill"></td><td class="fill"></td>
        <td class="fill"></td>
      </tr>`;
    }
    html += '</tbody></table>';
    return html;
  }

  function cardioTableCompact(rows) {
    let html = `<table class="log">
      <thead><tr>
        <th style="width:30%">Segment</th>
        <th style="width:22%">Time / Pace</th>
        <th>Dist</th>
        <th>HR</th>
        <th>Cals</th>
        <th style="width:11%">Felt</th>
        <th style="width:13%">Notes</th>
      </tr></thead><tbody>`;
    for (const [ex, t] of rows) {
      html += `<tr>
        <td class="exname">${ex}</td>
        <td class="target">${t}</td>
        <td class="fill"></td><td class="fill"></td><td class="fill"></td>
        <td class="fill"></td><td class="fill"></td>
      </tr>`;
    }
    html += '</tbody></table>';
    return html;
  }

  return { render };
})();
