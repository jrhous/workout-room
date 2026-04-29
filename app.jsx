// Iron Room iPad — app shell & router
const { useState: aS, useEffect: aE } = React;

function App() {
  const users = window.IR_USERS;
  const [view, setView] = aS(() => ({ screen: 'home', uid: localStorage.getItem('ir.lastUid') || 'christian' }));

  aE(() => { localStorage.setItem('ir.lastUid', view.uid); }, [view.uid]);

  const user = users.find(u => u.id === view.uid) || users[0];

  function go(screen, uid) {
    setView(v => ({ screen, uid: uid || v.uid }));
  }
  function home() { go('home'); }
  function switchUser() { go('home'); }

  // Auto-jump to Today when user is picked from home (only if a workout exists for today)
  function pickUser(uid) {
    setView({ screen: 'today', uid });
  }

  let content;
  switch (view.screen) {
    case 'home':
      content = <HomeScreen users={users} currentUid={view.uid} onPickUser={pickUser} onMenu={(k)=>{
        const map = {
          today: 'today', checkin: 'checkin', measure: 'measure', progress: 'progress',
          prs: 'prs', history: 'history', nutrition: 'nutrition', compare: 'compare', photos: 'photos',
        };
        go(map[k] || 'home');
      }} />;
      break;
    case 'today':       content = <TodayScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'checkin':     content = <CheckinScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'measure':     content = <MeasurementsScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'progress':    content = <ProgressScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'prs':         content = <PRsScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'history':     content = <HistoryScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'nutrition':   content = <NutritionScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    case 'compare':     content = <CompareScreen users={users} onBack={home} onSwitchUser={switchUser} />; break;
    case 'photos':      content = <PhotosScreen user={user} onBack={home} onSwitchUser={switchUser} />; break;
    default:            content = <HomeScreen users={users} currentUid={view.uid} onPickUser={pickUser} onMenu={(k)=>go(k)} />;
  }

  return (
    <div className="stage">
      <div className="app">{content}</div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
