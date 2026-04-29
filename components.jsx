// Iron Room iPad — shared UI components
const { useState, useEffect, useRef, useMemo } = React;

// ─── TopBar ───────────────────────────────────────────
function TopBar({ title, crumb, user, onBack, onSwitchUser, right }) {
  return (
    <div className="topbar">
      {onBack ? (
        <button className="back" onClick={onBack}>← BACK</button>
      ) : <div style={{width:1}} />}
      <div>
        {crumb && <div className="crumb">{crumb}</div>}
        <div className="ttl">{title}</div>
      </div>
      {right || (user && (
        <button className="who" onClick={onSwitchUser}>
          USER · <span className="name">{user.name}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Set Log Modal — keyboard input ──────────────────
function SetLogModal({ exercise, setIndex, initial, onSave, onClose }) {
  const [w, setW] = useState(initial?.w != null ? String(initial.w) : '');
  const [r, setR] = useState(initial?.r != null ? String(initial.r) : (typeof exercise.reps === 'number' ? String(exercise.reps) : ''));
  const wRef = useRef(null);
  useEffect(() => { wRef.current?.focus(); wRef.current?.select(); }, []);

  const save = () => onSave({ w: Number(w) || 0, r: Number(r) || 0 });

  return (
    <div className="modal-bg" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        <div className="modal-sub">SET {setIndex + 1} · TARGET {exercise.sets} × {exercise.reps}</div>
        <div className="modal-ttl">{exercise.name.toUpperCase()} <span className="red">/</span> LOG IT</div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12, marginTop: 16}}>
          <div className="big-input">
            <div className="lab">WEIGHT (LBS)</div>
            <input
              ref={wRef}
              type="number"
              inputMode="decimal"
              value={w}
              onChange={e=>setW(e.target.value)}
              onFocus={e=>e.target.select()}
              placeholder="0"
            />
          </div>
          <div className="big-input">
            <div className="lab">REPS</div>
            <input
              type="number"
              inputMode="numeric"
              value={r}
              onChange={e=>setR(e.target.value)}
              onFocus={e=>e.target.select()}
              onKeyDown={e=>{ if (e.key === 'Enter') save(); }}
              placeholder="0"
            />
          </div>
        </div>

        <div className="modal-foot">
          <button className="btn dark" onClick={onClose}>CANCEL</button>
          <button className="btn ghost" onClick={()=>onSave({ w: 0, r: 0, skipped: true })}>SKIP SET</button>
          <button className="btn lg" onClick={save}>LOG IT</button>
        </div>
      </div>
    </div>
  );
}

// ─── Number input (inline, for measurements) ─────────
function NumStepper({ value, onChange, step = 1, suffix = '' }) {
  const [local, setLocal] = useState(value == null ? '' : String(value));
  useEffect(() => { setLocal(value == null ? '' : String(value)); }, [value]);
  const commit = () => {
    const n = local === '' ? null : Number(local);
    onChange(n == null || isNaN(n) ? null : n);
  };
  return (
    <div className="num-input">
      <input
        type="number"
        inputMode="decimal"
        value={local}
        onChange={e=>setLocal(e.target.value)}
        onBlur={commit}
        onKeyDown={e=>{ if (e.key === 'Enter') { e.target.blur(); } }}
        onFocus={e=>e.target.select()}
        placeholder="—"
      />
      {suffix && <span className="suffix">{suffix}</span>}
    </div>
  );
}

// ─── Tiny line chart ──────────────────────────────────
function LineChart({ points, label, ymin, ymax }) {
  // points: [{x: 1, y: 200}, ...]
  if (!points || points.length === 0) {
    return (
      <div className="chart">
        <div className="section-ttl" style={{borderBottom:'none', marginBottom: 4, fontSize: 16}}>{label}</div>
        <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--steel)', fontFamily:'Barlow Condensed', fontWeight:700, letterSpacing: '0.2em'}}>NO DATA YET — LOG A CHECK-IN</div>
      </div>
    );
  }
  const W = 600, H = 200, P = 24;
  const xs = points.map(p=>p.x);
  const ys = points.map(p=>p.y);
  const minX = Math.min(...xs, 1), maxX = Math.max(...xs, 6);
  const minY = ymin ?? Math.min(...ys) - 2;
  const maxY = ymax ?? Math.max(...ys) + 2;
  const x = v => P + ((v - minX) / Math.max(1, (maxX - minX))) * (W - 2*P);
  const y = v => H - P - ((v - minY) / Math.max(1, (maxY - minY))) * (H - 2*P);

  const path = points.map((p,i)=>`${i===0?'M':'L'}${x(p.x).toFixed(1)},${y(p.y).toFixed(1)}`).join(' ');

  return (
    <div className="chart">
      <div className="section-ttl" style={{borderBottom:'none', marginBottom: 4, fontSize: 16}}>{label}</div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        {/* grid */}
        {[1,2,3,4,5,6].map(w=>(
          <line key={w} x1={x(w)} x2={x(w)} y1={P} y2={H-P} stroke="rgba(244,241,234,0.08)" />
        ))}
        <line x1={P} x2={W-P} y1={H-P} y2={H-P} stroke="rgba(244,241,234,0.2)" />
        {/* line */}
        <path d={path} fill="none" stroke="#e10600" strokeWidth="3" />
        {/* dots */}
        {points.map((p,i)=>(
          <g key={i}>
            <circle cx={x(p.x)} cy={y(p.y)} r="6" fill="#e10600" />
            <text x={x(p.x)} y={y(p.y) - 12} textAnchor="middle" fill="#f4f1ea" fontFamily="JetBrains Mono" fontSize="11" fontWeight="700">{p.y}</text>
          </g>
        ))}
      </svg>
      <div className="axis-labels">
        {[1,2,3,4,5,6].map(w=><span key={w}>W{w}</span>)}
      </div>
    </div>
  );
}

// ─── Photo capture / upload tile ──────────────────────
function PhotoCapture({ onCapture }) {
  const inputRef = useRef(null);
  const handle = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onCapture(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="photo-empty" onClick={()=>inputRef.current?.click()}>
      <span style={{fontSize:38, lineHeight:1}}>+</span>
      <span style={{fontSize:14, letterSpacing:'0.2em'}}>ADD PHOTO</span>
      <input ref={inputRef} type="file" accept="image/*" capture="environment" onChange={handle} style={{display:'none'}} />
    </div>
  );
}

Object.assign(window, { TopBar, SetLogModal, NumStepper, LineChart, PhotoCapture });
