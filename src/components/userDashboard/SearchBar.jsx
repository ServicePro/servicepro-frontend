import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

// ── Emergency intent detection ──────────────────────────────────────────────
const EMERGENCY_WORDS = ['urgent','immediate','emergency','asap','quick','fast','help','broken','burst','flood','leak','fire','now'];
const SERVICE_DETECT = [
  [['plumb','pipe','water','tap','drain'], 'plumbing'],
  [['electric','power','wire','circuit','fuse'], 'electrical'],
  [['lock','key','locked','door'], 'locksmith'],
  [['ac','heat','cool','hvac','air condition'], 'hvac'],
  [['appliance','fridge','washer','oven','machine'], 'appliance'],
  [['roof','ceiling','tile'], 'roofing'],
  [['pest','bug','rat','cockroach','insect'], 'pest'],
  [['flood','damp','mold','damage'], 'water_damage'],
];
function detectEmergency(q) {
  const lower = q.toLowerCase();
  const isUrgent = EMERGENCY_WORDS.some(w => lower.includes(w));
  if (!isUrgent) return null;
  for (const [keywords, type] of SERVICE_DETECT) {
    if (keywords.some(k => lower.includes(k))) return type;
  }
  return 'general';
}
// ─────────────────────────────────────────────────────────────────────────────

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const wrapRef = useRef(null);
  const { t } = useLang();

  const doSearch = () => {
    const q = query.trim();
    setSuggestions([]);
    const emergencyType = detectEmergency(q);
    if (emergencyType) {
      navigate(`/emergency${emergencyType !== 'general' ? '?q=' + emergencyType : ''}`);
    } else if (q) {
      navigate(`/services?q=${encodeURIComponent(q)}`);
    } else {
      navigate('/services');
    }
  };

  useEffect(() => {
    const q = query.trim();
    if (!q) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`${API}/api/services/search/suggestions?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setSuggestions([]); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} style={{ display: 'flex', gap: '8px', width: '100%', position: 'relative' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <input
          type="text"
          placeholder={t.heroSearch}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          className="search-input"
          style={{ width: '100%' }}
        />
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute', top: '110%', left: 0, right: 0,
            background: '#fff', border: '1px solid #f0f0f0',
            borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            zIndex: 999, overflow: 'hidden'
          }}>
            {suggestions.map((item) => (
              <Link
                key={item._id}
                to={`/services?q=${encodeURIComponent(item.name)}`}
                onClick={() => { setQuery(item.name); setSuggestions([]); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px 16px', textDecoration: 'none', color: '#111827',
                  fontSize: '0.9rem', borderBottom: '1px solid #f5f5f5',
                  transition: 'background 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#fff7ed'}
                onMouseLeave={(e) => e.currentTarget.style.background = ''}
              >
                <span style={{ color: '#F97316', fontSize: '0.8rem' }}>🔍</span>
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
      <button
        onClick={doSearch}
        style={{
          background: '#F97316', color: '#fff', border: 'none',
          borderRadius: '10px', padding: '0 20px', fontWeight: 700,
          fontSize: '0.95rem', cursor: 'pointer', whiteSpace: 'nowrap'
        }}
      >
        {t.search}
      </button>
    </div>
  );
};

export default SearchBar;