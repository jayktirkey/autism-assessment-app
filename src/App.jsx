import { useState, useEffect } from 'react';
import Home from './pages/Home.jsx';
import Assessment from './pages/Assessment.jsx';
import Results from './pages/Results.jsx';
import Activities from './pages/Activities.jsx';
import Progress from './pages/Progress.jsx';
import Disclaimer from './components/Disclaimer.jsx';

const PAGES = { home: Home, assessment: Assessment, results: Results, activities: Activities, progress: Progress };

function getHashPage() {
  const hash = window.location.hash.replace('#', '');
  return PAGES[hash] ? hash : 'home';
}

export default function App() {
  const [page, setPage] = useState(getHashPage());
  useEffect(() => {
    function handleHash() { setPage(getHashPage()); }
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  function navigate(target) {
    window.location.hash = target;
    setPage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const PageComponent = PAGES[page] || Home;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-emerald-50">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('home')} className="font-bold text-teal-700 text-lg">DevScreen</button>
          <div className="flex gap-1 sm:gap-2 text-sm">
            {[{l:'Home',t:'home'},{l:'Assess',t:'assessment'},{l:'Results',t:'results'},{l:'Activities',t:'activities'},{l:'Progress',t:'progress'}].map(({l,t}) => (
              <button key={t} onClick={() => navigate(t)} className={`px-2 sm:px-3 py-1.5 rounded-lg font-medium transition-colors ${page === t ? 'bg-teal-100 text-teal-700' : 'text-slate-600 hover:bg-slate-100'}`}>{l}</button>
            ))}
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8 print:p-0"><PageComponent navigate={navigate} /></main>
      <footer className="border-t border-slate-200 bg-white/50 mt-12 print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-6"><Disclaimer compact /></div>
      </footer>
    </div>
  );
}
