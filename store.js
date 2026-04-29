// Iron Room — localStorage data layer
// Schema v1
//
// Per-user namespaced under `ir.<uid>.*`:
//   ir.<uid>.workouts         { [date]: { workoutId, exercises: { [exId]: [{w, r}] } } }
//   ir.<uid>.checkins         { [weekNumber]: { weight, waist, avgCals, workoutsDone, notes } }
//   ir.<uid>.measurements     { [date]: { weight, bf, waist, chest, arms, thighs } }
//   ir.<uid>.nutrition        { [date]: { meals: int, protein: bool, water: bool, sleep: bool, ... } }
//   ir.<uid>.photos           [{ date, dataUrl }]
//   ir.<uid>.startDate        ISO date string

window.IR_Store = (function(){
  const KEY = (uid, k) => `ir.${uid}.${k}`;

  function read(uid, k, fallback) {
    try {
      const raw = localStorage.getItem(KEY(uid, k));
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function write(uid, k, v) {
    try { localStorage.setItem(KEY(uid, k), JSON.stringify(v)); } catch (e) {}
  }

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0,10);
  }

  function getStartDate(uid) {
    return read(uid, 'startDate', null);
  }

  function setStartDate(uid, date) {
    write(uid, 'startDate', date);
  }

  function weekNumber(uid) {
    const start = getStartDate(uid);
    if (!start) return 1;
    const days = Math.floor((new Date() - new Date(start)) / (1000*60*60*24));
    return Math.min(6, Math.max(1, Math.floor(days / 7) + 1));
  }

  function getStartingStats(uid) { return read(uid, 'startingStats', {}); }
  function setStartingStats(uid, data) { write(uid, 'startingStats', { ...getStartingStats(uid), ...data }); }

  function getWorkouts(uid) { return read(uid, 'workouts', {}); }
  function setWorkout(uid, date, data) {
    const all = getWorkouts(uid); all[date] = data; write(uid, 'workouts', all);
  }
  function getWorkout(uid, date) { return getWorkouts(uid)[date] || null; }

  function getCheckins(uid) { return read(uid, 'checkins', {}); }
  function setCheckin(uid, week, data) {
    const all = getCheckins(uid); all[week] = { ...(all[week]||{}), ...data }; write(uid, 'checkins', all);
  }

  function getMeasurements(uid) { return read(uid, 'measurements', {}); }
  function setMeasurement(uid, date, data) {
    const all = getMeasurements(uid); all[date] = { ...(all[date]||{}), ...data }; write(uid, 'measurements', all);
  }

  function getNutrition(uid) { return read(uid, 'nutrition', {}); }
  function setNutrition(uid, date, data) {
    const all = getNutrition(uid); all[date] = { ...(all[date]||{}), ...data }; write(uid, 'nutrition', all);
  }

  function getPhotos(uid) { return read(uid, 'photos', []); }
  function addPhoto(uid, dataUrl) {
    const arr = getPhotos(uid);
    arr.unshift({ date: todayISO(), dataUrl });
    write(uid, 'photos', arr.slice(0, 12));
  }
  function removePhoto(uid, date) {
    const arr = getPhotos(uid).filter(p => p.date !== date);
    write(uid, 'photos', arr);
  }

  // Streak: consecutive days (within last 30) where workouts[date] exists OR rest day
  function getStreak(uid) {
    const w = getWorkouts(uid);
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 60; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i);
      const iso = d.toISOString().slice(0,10);
      const dow = d.getDay();
      if (dow === 0) { // rest day counts as "ok"
        if (i === 0) streak++; else continue;
      } else if (w[iso] && w[iso].completed) {
        streak++;
      } else if (i === 0) {
        // today not yet done; don't break streak
      } else {
        break;
      }
    }
    return streak;
  }

  // PRs: max weight × reps per exercise
  function getPRs(uid) {
    const w = getWorkouts(uid);
    const pr = {};
    Object.values(w).forEach(session => {
      if (!session.exercises) return;
      Object.entries(session.exercises).forEach(([exId, sets]) => {
        sets.forEach(s => {
          if (!s || !s.w) return;
          if (!pr[exId] || s.w > pr[exId].w || (s.w === pr[exId].w && s.r > pr[exId].r)) {
            pr[exId] = { w: s.w, r: s.r, date: session.date };
          }
        });
      });
    });
    return pr;
  }

  function exportAll(uid) {
    return {
      uid, exportedAt: new Date().toISOString(),
      workouts: getWorkouts(uid),
      checkins: getCheckins(uid),
      measurements: getMeasurements(uid),
      nutrition: getNutrition(uid),
      photos: getPhotos(uid),
    };
  }

  function clearAll(uid) {
    ['workouts','checkins','measurements','nutrition','photos','startDate'].forEach(k => {
      localStorage.removeItem(KEY(uid, k));
    });
  }

  return {
    todayISO, getStartDate, setStartDate, weekNumber,
    getStartingStats, setStartingStats,
    getWorkouts, getWorkout, setWorkout,
    getCheckins, setCheckin,
    getMeasurements, setMeasurement,
    getNutrition, setNutrition,
    getPhotos, addPhoto, removePhoto,
    getStreak, getPRs,
    exportAll, clearAll,
  };
})();
