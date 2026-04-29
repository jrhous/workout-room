// Iron Room iPad — screens
const { useState: uS, useEffect: uE, useMemo: uM } = React;

// ─── HOME ─────────────────────────────────────────────
function HomeScreen({ users, onPickUser, onMenu, currentUid }) {
  const today = new Date();
  const dow = today.getDay();
  const todayWorkoutId = window.IR_WEEK[dow];
  const todayWorkout = window.IR_PROGRAM[todayWorkoutId];
  const dayName = window.IR_DAYNAMES[dow];

  const quoteIndex = today.getDate() % window.IR_QUOTES.length;
  const quote = window.IR_QUOTES[quoteIndex];

  const menuItems = [
    { key: 'today',     ttl: <>TODAY'S<br/><span className="red">WORK</span></>, num: 'FILE 01', feature: true },
    { key: 'checkin',   ttl: <>WEEKLY<br/>CHECK-IN</>, num: 'FILE 02' },
    { key: 'measure',   ttl: <>BODY<br/><span className="red">STATS</span></>, num: 'FILE 03' },
    { key: 'progress',  ttl: <>PROGRESS<br/>CHART</>, num: 'FILE 04' },
    { key: 'prs',       ttl: <>PERSONAL<br/><span className="red">RECORDS</span></>, num: 'FILE 05' },
    { key: 'history',   ttl: <>WORKOUT<br/>HISTORY</>, num: 'FILE 06' },
    { key: 'nutrition', ttl: <>DAILY<br/><span className="red">FUEL</span></>, num: 'FILE 07' },
    { key: 'compare',   ttl: <>VS.<br/>COMPARE</>, num: 'FILE 08' },
    { key: 'photos',    ttl: <>PROGRESS<br/><span className="red">PHOTOS</span></>, num: 'FILE 09' },
  ];

  return (
    <div className="screen">
      <div className="home-hero">
        <div>
          <div className="kicker">▌ THE IRON ROOM · {dayName}</div>
          <h1>READY <span className="red">/</span> SET <span className="red">/</span> LIFT</h1>
        </div>
        <div className="stamp">DO WORK</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18}}>
        <div className="section-ttl" style={{gridColumn:'span 2'}}>WHO'S LIFTING <span className="badge">TAP TO PICK</span></div>
        {users.map(u => {
          const streak = window.IR_Store.getStreak(u.id);
          const done = window.IR_Store.getWorkout(u.id, window.IR_Store.todayISO())?.completed;
          return (
            <div key={u.id}
                 className={"user-card" + (currentUid === u.id ? " active" : "")}
                 onClick={()=>onPickUser(u.id)}>
              <div className="corner">{u.id === 'christian' ? 'C' : 'J'}</div>
              <div className="name">{u.name}</div>
              <div className="stat-row">
                <div className="stat"><div className="lab">HEIGHT</div><div className="val">{u.height}</div></div>
                <div className="stat"><div className="lab">START</div><div className="val">{u.startWeight ? u.startWeight + ' LB' : '—'}</div></div>
                <div className="stat"><div className="lab">TODAY</div><div className="val" style={{color: done ? 'var(--blood)' : 'var(--bone)'}}>{done ? 'DONE' : 'OPEN'}</div></div>
              </div>
              <div className="streak">
                <span className="num">{streak}</span>
                <span className="lab">DAY STREAK</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="scroll" style={{marginBottom: 14}}>
        <div className="section-ttl">PROTOCOL <span className="badge">TAP IN</span></div>
        <div className="menu-grid">
          {menuItems.map(m => (
            <div key={m.key} className={"menu-tile" + (m.feature ? " feature" : "")} onClick={()=>onMenu(m.key)}>
              <div className="num">{m.num}</div>
              <div className="ttl">{m.ttl}</div>
              <div className="arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      <div className="creed-strip">
        <div className="small">CREED</div>
        <div className="big">{quote}</div>
        <div className="small">DAY {today.getDate()}</div>
      </div>
    </div>
  );
}

// ─── TODAY ────────────────────────────────────────────
function TodayScreen({ user, onBack, onSwitchUser }) {
  const now = new Date();
  const dow = now.getDay();
  const wid = window.IR_WEEK[dow];
  const workout = window.IR_PROGRAM[wid];
  const today = window.IR_Store.todayISO();
  const [session, setSession] = uS(window.IR_Store.getWorkout(user.id, today) || { workoutId: wid, date: today, exercises: {}, completed: false });
  const [modal, setModal] = uS(null); // { exercise, setIndex, initial }

  uE(() => {
    window.IR_Store.setWorkout(user.id, today, session);
  }, [session]);

  if (workout.kind === 'rest') {
    return <RestScreen user={user} onBack={onBack} onSwitchUser={onSwitchUser} />;
  }

  const isCardio = workout.kind === 'cardio';
  const exercises = isCardio ? workout.segments.map(s => ({ ...s, sets: 1, reps: s.target })) : workout.exercises;

  function logSet(exId, idx, data) {
    const next = { ...session };
    next.exercises = { ...next.exercises };
    next.exercises[exId] = [...(next.exercises[exId] || [])];
    next.exercises[exId][idx] = { ...data, date: today };
    setSession(next);
    setModal(null);
  }

  function totalDone() {
    let done = 0, total = 0;
    exercises.forEach(ex => {
      total += ex.sets;
      const arr = session.exercises[ex.id] || [];
      done += arr.filter(s => s).length;
    });
    return { done, total };
  }
  const { done, total } = totalDone();

  function markComplete() {
    const next = { ...session, completed: true };
    setSession(next);
  }

  return (
    <div className="screen">
      <TopBar
        title={<>{workout.title} <span className="red">/</span> {workout.day}</>}
        crumb={`▌ ${user.name} · WEEK ${window.IR_Store.weekNumber(user.id)}`}
        user={user} onBack={onBack} onSwitchUser={onSwitchUser}
      />
      <div className="today-hero">
        <div>
          <h2>{workout.title}</h2>
          <div className="sub">{workout.sub}</div>
          <div className="focus">{workout.focus}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="num">{workout.code}</div>
          <div style={{fontFamily:'JetBrains Mono', fontSize: 13, color:'var(--bone)', opacity: 0.7, letterSpacing:'0.18em'}}>
            {done} / {total} SETS
          </div>
        </div>
      </div>

      <div className="scroll">
        {exercises.map(ex => {
          const sets = session.exercises[ex.id] || [];
          return (
            <div key={ex.id} className="ex-row">
              <div>
                <div className="ex-name">{ex.name.toUpperCase()}</div>
                <div className="ex-target">TARGET {ex.sets} × {ex.reps}</div>
              </div>
              <div className="sets-bar">
                {Array.from({length: ex.sets}).map((_, i) => {
                  const s = sets[i];
                  const label = s ? (s.skipped ? 'SKIP' : `${s.w || '—'} × ${s.r}`) : 'TAP';
                  return (
                    <div key={i} className={"set-cell" + (s ? " done" : " empty")}
                         onClick={()=>setModal({ exercise: ex, setIndex: i, initial: s })}>
                      <div style={{fontSize:9, opacity:0.7, letterSpacing:'0.18em'}}>SET {i+1}</div>
                      <div>{label}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {done === total && total > 0 && !session.completed && (
          <button className="btn lg" style={{width:'100%', marginTop: 8}} onClick={markComplete}>
            FINISH WORKOUT — DO WORK ✓
          </button>
        )}
        {session.completed && (
          <div className="completed-banner">
            <span className="small">DONE</span>
            <span className="big">EARNED IT. RESPECT THE WORK.</span>
            <span className="small">{today}</span>
          </div>
        )}
      </div>

      {modal && (
        <SetLogModal
          exercise={modal.exercise}
          setIndex={modal.setIndex}
          initial={modal.initial}
          onSave={(data)=>logSet(modal.exercise.id, modal.setIndex, data)}
          onClose={()=>setModal(null)}
        />
      )}
    </div>
  );
}

// ─── REST DAY ─────────────────────────────────────────
function RestScreen({ user, onBack, onSwitchUser }) {
  return (
    <div className="screen">
      <TopBar title={<>SUNDAY <span className="red">/</span> REST</>} crumb={`▌ ${user.name} · RECOVERY`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="rest-hero">
        <div className="kicker">▌ DAY 07 · NO LIFT</div>
        <h2>REST.<br/>EARN IT.</h2>
        <div className="creed">REST DAYS ARE GROWTH DAYS. DON'T SKIP THEM.</div>
      </div>
      <div className="scroll">
        <div className="section-ttl">RECOVERY PROTOCOL <span className="badge">DO THIS</span></div>
        <div className="rest-list">
          <div className="item">SLEEP 7–9 HRS · NON-NEGOTIABLE</div>
          <div className="item">WATER 0.75–1 GAL</div>
          <div className="item">PROTEIN 170G+</div>
          <div className="item">WALK · 20 MIN EASY · OPTIONAL</div>
          <div className="item">STRETCH · MOBILITY · 10 MIN</div>
          <div className="item">PLAN TOMORROW · MON = PUSH</div>
        </div>
      </div>
    </div>
  );
}

// ─── WEEKLY CHECK-IN ──────────────────────────────────
function CheckinScreen({ user, onBack, onSwitchUser }) {
  const [data, setData] = uS(window.IR_Store.getCheckins(user.id));
  function set(week, field, value) {
    const next = { ...data, [week]: { ...(data[week]||{}), [field]: value } };
    setData(next);
    window.IR_Store.setCheckin(user.id, week, { [field]: value });
  }
  return (
    <div className="screen">
      <TopBar title={<>WEEKLY <span className="red">/</span> CHECK-IN</>} crumb={`▌ ${user.name} · MEASURED IS MANAGED`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        <div className="section-ttl">6-WEEK LOG <span className="badge">TAP TO LOG</span></div>
        <table className="kv">
          <thead><tr>
            <th>WEEK</th><th>BODYWEIGHT (LBS)</th><th>WAIST (IN)</th><th>AVG CALS</th><th>WORKOUTS /6</th><th style={{width:'34%'}}>NOTES</th>
          </tr></thead>
          <tbody>
            {[1,2,3,4,5,6].map(w => {
              const d = data[w] || {};
              return (
                <tr key={w}>
                  <td className="lab">W{w}</td>
                  <td><InlineNum value={d.weight} onChange={v=>set(w,'weight',v)} /></td>
                  <td><InlineNum value={d.waist} onChange={v=>set(w,'waist',v)} step={0.25} /></td>
                  <td><InlineNum value={d.avgCals} onChange={v=>set(w,'avgCals',v)} step={50} /></td>
                  <td><InlineNum value={d.workoutsDone} onChange={v=>set(w,'workoutsDone',v)} max={6} /></td>
                  <td><InlineText value={d.notes} onChange={v=>set(w,'notes',v)} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InlineNum({ value, onChange, step = 1, max }) {
  const [local, setLocal] = uS(value == null ? '' : String(value));
  uE(() => { setLocal(value == null ? '' : String(value)); }, [value]);
  const commit = () => {
    if (local === '') { onChange(null); return; }
    let n = Number(local);
    if (isNaN(n)) { onChange(null); return; }
    if (max != null) n = Math.min(max, n);
    onChange(n);
  };
  return (
    <input
      type="number"
      inputMode="decimal"
      step={step}
      value={local}
      onChange={e=>setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={e=>{ if (e.key === 'Enter') e.target.blur(); }}
      onFocus={e=>e.target.select()}
      placeholder="—"
      style={{background:'transparent', border:'none', outline:'none', color:'var(--bone)', fontFamily:'JetBrains Mono', fontSize:14, fontWeight:700, width:'100%', textAlign:'center'}}
    />
  );
}

function InlineText({ value, onChange }) {
  return (
    <input
      type="text"
      value={value || ''}
      onChange={e=>onChange(e.target.value)}
      placeholder="—"
      style={{background:'transparent', border:'none', outline:'none', color:'var(--bone)', fontFamily:'Barlow Condensed', fontSize:14, width:'100%'}}
    />
  );
}

// ─── BODY MEASUREMENTS ────────────────────────────────
function MeasurementsScreen({ user, onBack, onSwitchUser }) {
  const all = window.IR_Store.getMeasurements(user.id);
  const today = window.IR_Store.todayISO();
  const [m, setM] = uS(all[today] || {});

  function update(k, v) {
    const next = { ...m, [k]: v };
    setM(next);
    window.IR_Store.setMeasurement(user.id, today, { [k]: v });
  }
  const fields = [
    ['weight', 'BODYWEIGHT (LBS)', 1],
    ['bf',     'BODYFAT % (EST)',  0.5],
    ['waist',  'WAIST (IN)',       0.25],
    ['chest',  'CHEST (IN)',       0.25],
    ['arms',   'ARMS (IN)',        0.25],
    ['thighs', 'THIGHS (IN)',      0.25],
  ];

  const dates = Object.keys(all).sort().reverse().slice(0, 8);

  return (
    <div className="screen">
      <TopBar title={<>BODY <span className="red">/</span> STATS</>} crumb={`▌ ${user.name} · TODAY ${today}`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        <div className="section-ttl">TODAY'S READING <span className="badge">{today}</span></div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 18}}>
          {fields.map(([k, lab, step]) => (
            <div key={k} className="card-shell" style={{display:'grid', gridTemplateColumns:'1fr auto', alignItems:'center', gap: 12}}>
              <div>
                <div style={{fontFamily:'Barlow Condensed', fontWeight:800, letterSpacing:'0.2em', fontSize:11, color:'var(--blood)'}}>{lab}</div>
                <div style={{fontFamily:'JetBrains Mono', fontSize:24, fontWeight:700, color:'var(--bone)'}}>{m[k] ?? '—'}</div>
              </div>
              <NumStepper value={m[k]} onChange={v=>update(k, v)} step={step} />
            </div>
          ))}
        </div>

        <div className="section-ttl">RECENT LOGS <span className="badge">LAST 8</span></div>
        {dates.length === 0 ? (
          <div style={{padding: 18, fontFamily:'Barlow Condensed', letterSpacing:'0.2em', color:'var(--steel)', textAlign:'center'}}>NO HISTORY YET — START LOGGING.</div>
        ) : (
          <table className="kv">
            <thead><tr>
              <th>DATE</th><th>WT</th><th>BF%</th><th>WAIST</th><th>CHEST</th><th>ARMS</th><th>THIGHS</th>
            </tr></thead>
            <tbody>
              {dates.map(d => {
                const r = all[d];
                return (
                  <tr key={d}>
                    <td className="lab">{d.slice(5)}</td>
                    <td>{r.weight ?? '—'}</td>
                    <td>{r.bf ?? '—'}</td>
                    <td>{r.waist ?? '—'}</td>
                    <td>{r.chest ?? '—'}</td>
                    <td>{r.arms ?? '—'}</td>
                    <td>{r.thighs ?? '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ─── NUTRITION ────────────────────────────────────────
function NutritionScreen({ user, onBack, onSwitchUser }) {
  const today = window.IR_Store.todayISO();
  const [data, setData] = uS(window.IR_Store.getNutrition(user.id)[today] || {});

  const items = [
    { k: 'protein',  ttl: 'PROTEIN',   v: '170+ g · 30–50/meal' },
    { k: 'calories', ttl: 'CALORIES',  v: '~1,900–2,000' },
    { k: 'fat',      ttl: 'FAT',       v: '~60g' },
    { k: 'carbs',    ttl: 'CARBS',     v: 'fill remainder' },
    { k: 'water',    ttl: 'WATER',     v: '0.75–1 gal' },
    { k: 'sleep',    ttl: 'SLEEP',     v: '7–9 hrs' },
    { k: 'noBooze',  ttl: 'NO BOOZE',  v: 'optional · earn it' },
    { k: 'noSugar',  ttl: 'NO SUGAR',  v: 'optional · stay locked in' },
  ];

  function toggle(k) {
    const next = { ...data, [k]: !data[k] };
    setData(next);
    window.IR_Store.setNutrition(user.id, today, { [k]: next[k] });
  }

  const doneCount = items.filter(i => data[i.k]).length;

  return (
    <div className="screen">
      <TopBar title={<>DAILY <span className="red">/</span> FUEL</>} crumb={`▌ ${user.name} · ${doneCount} / ${items.length} HIT`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        <div className="section-ttl">TARGETS <span className="badge">{today}</span></div>
        <div className="nut-grid">
          {items.map(it => (
            <div key={it.k} className={"nut-tile" + (data[it.k] ? " done" : "")} onClick={()=>toggle(it.k)}>
              <div>
                <div className="k">{it.ttl}</div>
                <div className="v">{it.v}</div>
              </div>
              <div className="check">{data[it.k] ? '✓' : ''}</div>
            </div>
          ))}
        </div>
        <div className="creed-strip" style={{marginTop:18}}>
          <div className="small">RULE</div>
          <div className="big">YOU CAN'T OUT-TRAIN A BAD DIET.</div>
          <div className="small">EAT CLEAN</div>
        </div>
      </div>
    </div>
  );
}

// ─── PROGRESS CHARTS ──────────────────────────────────
function ProgressScreen({ user, onBack, onSwitchUser }) {
  const checkins = window.IR_Store.getCheckins(user.id);
  const wPts = [1,2,3,4,5,6].map(w => checkins[w]?.weight ? { x: w, y: Number(checkins[w].weight) } : null).filter(Boolean);
  const wsPts = [1,2,3,4,5,6].map(w => checkins[w]?.waist ? { x: w, y: Number(checkins[w].waist) } : null).filter(Boolean);
  const woPts = [1,2,3,4,5,6].map(w => checkins[w]?.workoutsDone != null ? { x: w, y: Number(checkins[w].workoutsDone) } : null).filter(Boolean);

  return (
    <div className="screen">
      <TopBar title={<>PROGRESS <span className="red">/</span> 6-WEEK</>} crumb={`▌ ${user.name} · MEASURED = MANAGED`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll" style={{display:'flex', flexDirection:'column', gap: 14}}>
        <LineChart points={wPts} label="BODYWEIGHT (LBS)" />
        <LineChart points={wsPts} label="WAIST (IN)" />
        <LineChart points={woPts} label="WORKOUTS DONE / 6" ymin={0} ymax={6} />
      </div>
    </div>
  );
}

// ─── PRs ──────────────────────────────────────────────
function PRsScreen({ user, onBack, onSwitchUser }) {
  const prs = window.IR_Store.getPRs(user.id);
  // Map exercise ids → names from program
  const exMap = {};
  Object.values(window.IR_PROGRAM).forEach(w => (w.exercises || []).forEach(e => exMap[e.id] = e.name));
  const rows = Object.entries(prs).map(([exId, pr]) => ({ name: exMap[exId] || exId, ...pr }));
  rows.sort((a,b) => b.w - a.w);

  return (
    <div className="screen">
      <TopBar title={<>PERSONAL <span className="red">/</span> RECORDS</>} crumb={`▌ ${user.name} · BEAT YOURSELF`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        {rows.length === 0 ? (
          <div style={{padding: 22, textAlign:'center', color:'var(--steel)', fontFamily:'Barlow Condensed', letterSpacing:'0.2em'}}>NO PRs YET — GO LIFT SOMETHING.</div>
        ) : rows.map((r, i) => (
          <div key={i} className="pr-row">
            <div className="ex">{r.name.toUpperCase()}</div>
            <div className="pr">{r.w} LB × {r.r}</div>
            <div className="date">{r.date || ''}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────
function HistoryScreen({ user, onBack, onSwitchUser }) {
  const all = window.IR_Store.getWorkouts(user.id);
  const dates = Object.keys(all).sort().reverse();

  return (
    <div className="screen">
      <TopBar title={<>WORKOUT <span className="red">/</span> HISTORY</>} crumb={`▌ ${user.name} · ${dates.length} SESSIONS`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        {dates.length === 0 ? (
          <div style={{padding: 22, textAlign:'center', color:'var(--steel)', fontFamily:'Barlow Condensed', letterSpacing:'0.2em'}}>NO HISTORY YET — TODAY IS DAY ONE.</div>
        ) : dates.map(d => {
          const s = all[d];
          const w = window.IR_PROGRAM[s.workoutId];
          const totalSets = Object.values(s.exercises || {}).reduce((acc, arr) => acc + arr.filter(Boolean).length, 0);
          return (
            <div key={d} className="history-row">
              <div className="date">{d}</div>
              <div>
                <div className={"day " + (s.completed ? "done" : "")}>{w?.title || '—'}</div>
                <div className="ex-summary">{totalSets} SETS LOGGED</div>
              </div>
              <div style={{fontFamily:'Barlow Condensed', fontWeight:800, letterSpacing:'0.18em', fontSize:11, color:'var(--blood)'}}>{w?.day}</div>
              <div className={"check " + (s.completed ? "done" : "")} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── COMPARE ──────────────────────────────────────────
function CompareScreen({ users, onBack, onSwitchUser }) {
  const stats = users.map(u => {
    const c = window.IR_Store.getCheckins(u.id);
    const m = window.IR_Store.getMeasurements(u.id);
    const w = window.IR_Store.getWorkouts(u.id);
    const totalDone = Object.values(w).filter(x => x.completed).length;
    const streak = window.IR_Store.getStreak(u.id);
    const latestMeas = Object.keys(m).sort().reverse()[0];
    const latest = m[latestMeas] || {};
    const wkPts = [1,2,3,4,5,6].map(wk => c[wk]?.weight ? { x: wk, y: Number(c[wk].weight) } : null).filter(Boolean);
    const startW = u.startWeight || (wkPts[0]?.y);
    const curW = latest.weight || (wkPts[wkPts.length-1]?.y);
    return { user: u, latest, totalDone, streak, startW, curW, wkPts };
  });

  return (
    <div className="screen">
      <TopBar title={<>VS. <span className="red">/</span> COMPARE</>} crumb="▌ HEAD-TO-HEAD" onBack={onBack} right={<div style={{width:1}}/>} />
      <div className="scroll">
        <div className="compare-grid">
          {stats.map((s, i) => (
            <div key={i} className="compare-col">
              <h3>{s.user.name} <span className="red">/</span></h3>
              <div className="compare-stat"><span className="lab">CURRENT WT</span><span className="val">{s.curW || '—'} LB</span></div>
              <div className="compare-stat"><span className="lab">START WT</span><span className="val">{s.startW || '—'} LB</span></div>
              <div className="compare-stat"><span className="lab">Δ DELTA</span><span className="val">{s.startW && s.curW ? (s.curW - s.startW > 0 ? '+' : '') + (s.curW - s.startW).toFixed(1) : '—'} LB</span></div>
              <div className="compare-stat"><span className="lab">WORKOUTS DONE</span><span className="val">{s.totalDone}</span></div>
              <div className="compare-stat"><span className="lab">STREAK</span><span className="val">{s.streak} D</span></div>
              <div className="compare-stat"><span className="lab">WAIST</span><span className="val">{s.latest.waist || '—'} IN</span></div>
            </div>
          ))}
        </div>
        <div style={{marginTop:14}}>
          <LineChart
            points={stats[0].wkPts.map(p => ({ x: p.x, y: p.y }))}
            label={`${stats[0].user.name} — BODYWEIGHT`}
          />
        </div>
        <div style={{marginTop:14}}>
          <LineChart
            points={stats[1].wkPts.map(p => ({ x: p.x, y: p.y }))}
            label={`${stats[1].user.name} — BODYWEIGHT`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── PHOTOS ───────────────────────────────────────────
function PhotosScreen({ user, onBack, onSwitchUser }) {
  const [photos, setPhotos] = uS(window.IR_Store.getPhotos(user.id));
  function add(dataUrl) {
    window.IR_Store.addPhoto(user.id, dataUrl);
    setPhotos(window.IR_Store.getPhotos(user.id));
  }
  function remove(date) {
    window.IR_Store.removePhoto(user.id, date);
    setPhotos(window.IR_Store.getPhotos(user.id));
  }
  return (
    <div className="screen">
      <TopBar title={<>PROGRESS <span className="red">/</span> PHOTOS</>} crumb={`▌ ${user.name} · ${photos.length} / 12 STORED`} user={user} onBack={onBack} onSwitchUser={onSwitchUser} />
      <div className="scroll">
        <div className="photo-grid">
          <PhotoCapture onCapture={add} />
          {photos.map(p => (
            <div key={p.date} className="photo-tile">
              <img src={p.dataUrl} alt={p.date} />
              <div className="x" onClick={()=>remove(p.date)}>×</div>
              <div className="meta"><span>{p.date}</span><span>{user.name.slice(0,1)}</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  HomeScreen, TodayScreen, RestScreen, CheckinScreen,
  MeasurementsScreen, NutritionScreen, ProgressScreen,
  PRsScreen, HistoryScreen, CompareScreen, PhotosScreen,
});
