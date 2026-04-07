import { useEffect, useRef, useState } from 'react';
import UserNavbar from '../../components/userDashboard/UserNavbar';
import './VRPreview.css';

const CATEGORIES = [
  { id: 'all',           label: 'All Services',    icon: '🌐' },
  { id: 'plumbing',      label: 'Plumbing',         icon: '🔧' },
  { id: 'electrical',   label: 'Electrical',        icon: '⚡' },
  { id: 'interior',     label: 'Interior Design',   icon: '🛋️' },
  { id: 'hvac',         label: 'HVAC / AC',         icon: '❄️' },
  { id: 'roofing',      label: 'Roofing',           icon: '🏗️' },
  { id: 'landscaping',  label: 'Landscaping',       icon: '🌳' },
];

const DEMO_SCENES = [
  {
    id: 's1',
    category: 'plumbing',
    title: 'Under-Sink Plumbing Inspection',
    description: 'Explore a 360° view of typical under-sink pipework. Identify common leak points and valve locations.',
    thumbnail: '🔧',
    bgGradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f2d4a 50%, #1a3050 100%)',
    spots: [
      { x: 30, y: 55, label: 'Main shutoff valve', detail: 'Turn this clockwise to stop water flow in emergencies.' },
      { x: 62, y: 40, label: 'P-trap joint',        detail: 'This U-bend holds water to block sewer gases. Check for cracks or limescale.' },
      { x: 75, y: 65, label: 'Supply line',         detail: 'Braided stainless lines last 5–8 years. Replace if corroded.' },
    ],
    badge: '360°',
    badgeColor: '#2563eb',
  },
  {
    id: 's2',
    category: 'electrical',
    title: 'Consumer Unit / Fuse Board',
    description: 'A safe virtual walk-around of a residential consumer unit. Learn about circuit breakers, RCDs and labelling.',
    thumbnail: '⚡',
    bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    spots: [
      { x: 25, y: 45, label: 'Main switch',         detail: 'Isolates the entire property. Red = off, Green = on.' },
      { x: 55, y: 35, label: 'RCD protection',      detail: 'Residual Current Device — trips within 30ms to prevent electrocution.' },
      { x: 70, y: 60, label: 'MCB circuit breakers', detail: 'Each breaker protects one circuit. Tripped = white showing on switch.' },
    ],
    badge: 'AR',
    badgeColor: '#7c3aed',
  },
  {
    id: 's3',
    category: 'interior',
    title: 'Living Room Redesign Preview',
    description: 'Virtually walk through a stunning living room makeover before committing to a design. Rotate to see every angle.',
    thumbnail: '🛋️',
    bgGradient: 'linear-gradient(135deg, #2d1b4e 0%, #1a0e30 40%, #3d2468 100%)',
    spots: [
      { x: 20, y: 60, label: 'Feature wall',  detail: 'Deep navy limewash finish with subtle texture. Cost est. $280–$420.' },
      { x: 50, y: 70, label: 'Flooring',      detail: 'Engineered oak herringbone. Warm underfoot, easy maintenance.' },
      { x: 75, y: 45, label: 'Lighting plan', detail: 'Layered lighting: ambient, task, accent. Scene-controlled via smart switch.' },
    ],
    badge: 'VR',
    badgeColor: '#dc2626',
  },
  {
    id: 's4',
    category: 'hvac',
    title: 'Ducted AC System Overview',
    description: 'Trace your complete ducted HVAC system from the outdoor unit to every vent — spot issues before they escalate.',
    thumbnail: '❄️',
    bgGradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
    spots: [
      { x: 35, y: 40, label: 'Condenser unit',  detail: 'Located outside. Clear 50cm clearance all around for airflow.' },
      { x: 60, y: 55, label: 'Air handler',      detail: 'Contains evaporator coil & blower. Filter should be changed every 3 months.' },
      { x: 20, y: 65, label: 'Return air grille', detail: 'Never block this grille — restricts airflow and strains the system.' },
    ],
    badge: '360°',
    badgeColor: '#0891b2',
  },
  {
    id: 's5',
    category: 'roofing',
    title: 'Roof Ridge & Valley Inspection',
    description: 'Safely inspect your roof from ground level. Identify missing tiles, ridge capping issues and gutter blockages.',
    thumbnail: '🏗️',
    bgGradient: 'linear-gradient(135deg, #422006 0%, #7c2d12 50%, #9a3412 100%)',
    spots: [
      { x: 50, y: 25, label: 'Ridge capping',   detail: 'Mortar capping seals the apex. Cracks allow water ingress.' },
      { x: 30, y: 55, label: 'Valley flashing',  detail: 'Metal flashing channels rain at roof junctions. Check for rust.' },
      { x: 72, y: 70, label: 'Gutter overflow',  detail: 'Blocked gutters cause fascia rot and foundation flooding.' },
    ],
    badge: 'AR',
    badgeColor: '#ea580c',
  },
  {
    id: 's6',
    category: 'landscaping',
    title: 'Garden Makeover — Before & After',
    description: 'See your garden transformed with AR overlay. Explore planting layouts, paving designs and outdoor lighting.',
    thumbnail: '🌳',
    bgGradient: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #166534 100%)',
    spots: [
      { x: 25, y: 65, label: 'Retaining wall',   detail: 'Engineered sleeper wall with 1° lean. Structural fill behind each course.' },
      { x: 55, y: 40, label: 'Planting bed',      detail: 'Native species mix: low water, year-round colour, attracts pollinators.' },
      { x: 76, y: 60, label: 'Outdoor lighting',  detail: 'Low-voltage LED path lights on dusk-to-dawn sensor. IP65 rated.' },
    ],
    badge: 'VR',
    badgeColor: '#16a34a',
  },
];

function VRScene({ scene, onClose }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [dragging, setDragging]   = useState(false);
  const [lastPos, setLastPos]     = useState({ x: 0, y: 0 });
  const [activeSpot, setActiveSpot] = useState(null);
  const [arMode, setArMode]         = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => { setDragging(true); setLastPos({ x: e.clientX, y: e.clientY }); };
  const handleMouseMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setRotation((r) => ({ x: Math.max(-30, Math.min(30, r.x - dy * 0.3)), y: r.y + dx * 0.4 }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };
  const handleMouseUp = () => setDragging(false);

  // Touch handlers
  const handleTouchStart = (e) => { const t = e.touches[0]; setDragging(true); setLastPos({ x: t.clientX, y: t.clientY }); };
  const handleTouchMove  = (e) => {
    if (!dragging) return;
    const t = e.touches[0];
    const dx = t.clientX - lastPos.x;
    const dy = t.clientY - lastPos.y;
    setRotation((r) => ({ x: Math.max(-30, Math.min(30, r.x - dy * 0.3)), y: r.y + dx * 0.4 }));
    setLastPos({ x: t.clientX, y: t.clientY });
  };

  const autoRotate = useRef(null);
  const rotY = useRef(0);
  useEffect(() => {
    if (!dragging) {
      autoRotate.current = requestAnimationFrame(function loop() {
        rotY.current += 0.12;
        setRotation((r) => ({ ...r, y: r.y + 0.12 }));
        autoRotate.current = requestAnimationFrame(loop);
      });
    }
    return () => cancelAnimationFrame(autoRotate.current);
  }, [dragging]);

  return (
    <div className={`vr-scene-overlay${fullscreen ? ' vr-fullscreen' : ''}`}>
      <div
        className={`vr-scene-container${dragging ? ' vr-grabbing' : ''}`}
        ref={containerRef}
        style={{ background: scene.bgGradient }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* 360° env layer */}
        <div
          className="vr-env-layer"
          style={{ transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` }}
        >
          {/* Grid lines simulating a panorama */}
          <div className="vr-grid-h" />
          <div className="vr-grid-v" />

          {/* AR scanner lines */}
          {arMode && <div className="vr-ar-scan" />}

          {/* Hotspots */}
          {scene.spots.map((spot, i) => (
            <div
              key={i}
              className={`vr-hotspot${activeSpot === i ? ' vr-hotspot-active' : ''}`}
              style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
              onClick={(e) => { e.stopPropagation(); setActiveSpot(activeSpot === i ? null : i); }}
            >
              <div className="vr-hotspot-pin">i</div>
              {activeSpot === i && (
                <div className="vr-hotspot-popup">
                  <strong>{spot.label}</strong>
                  <p>{spot.detail}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* HUD */}
        <div className="vr-hud-top">
          <span className="vr-hud-title">{scene.title}</span>
          <span className="vr-scene-badge" style={{ background: scene.badgeColor }}>{scene.badge}</span>
        </div>

        <div className="vr-hud-bottom">
          <span className="vr-hint">🖱 Drag to rotate · Click pins for info</span>
          <div className="vr-hud-btns">
            <button
              className={`vr-hud-btn${arMode ? ' vr-hud-btn-on' : ''}`}
              onClick={(e) => { e.stopPropagation(); setArMode(!arMode); }}
              title="Toggle AR overlay"
            >
              {arMode ? '🟢 AR ON' : '⚪ AR'}
            </button>
            <button
              className="vr-hud-btn"
              onClick={(e) => { e.stopPropagation(); setFullscreen(!fullscreen); }}
              title="Toggle fullscreen"
            >
              {fullscreen ? '⊡ Exit' : '⛶ Full'}
            </button>
            <button
              className="vr-hud-btn vr-hud-close"
              onClick={(e) => { e.stopPropagation(); onClose(); }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VRPreview() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeScene, setActiveScene]       = useState(null);
  const [hoveredId, setHoveredId]           = useState(null);

  const filtered = activeCategory === 'all'
    ? DEMO_SCENES
    : DEMO_SCENES.filter((s) => s.category === activeCategory);

  return (
    <>
      <UserNavbar />
      <div className="vr-root">
        <div className="vr-page-header">
          <div>
            <h1>🥽 VR / AR Service Preview</h1>
            <p>Explore your service area in 360° — inspect, plan, and decide with confidence before booking</p>
          </div>
          <div className="vr-tech-badges">
            <span className="vr-tech-badge" style={{ background: '#1e40af22', color: '#1e40af' }}>🌐 360° View</span>
            <span className="vr-tech-badge" style={{ background: '#6d28d922', color: '#6d28d9' }}>🥽 VR Mode</span>
            <span className="vr-tech-badge" style={{ background: '#be185d22', color: '#be185d' }}>📱 AR Overlay</span>
          </div>
        </div>

        {/* Feature highlight strip */}
        <div className="vr-features-strip">
          {[
            { icon: '🔍', label: 'Virtual Inspection',   desc: 'See exactly what needs fixing before the technician arrives' },
            { icon: '🎯', label: '360° Demos',            desc: 'Full spherical view of service environments' },
            { icon: '📌', label: 'Interactive Hotspots',  desc: 'Click any point to get expert info and cost estimates' },
            { icon: '📱', label: 'AR Overlay',            desc: 'Augmented reality highlights problem areas in real-time' },
          ].map((f) => (
            <div className="vr-feature-card" key={f.label}>
              <span className="vr-feature-icon">{f.icon}</span>
              <strong>{f.label}</strong>
              <small>{f.desc}</small>
            </div>
          ))}
        </div>

        {/* Category filter */}
        <div className="vr-cat-filter">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`vr-cat-btn${activeCategory === c.id ? ' vr-cat-active' : ''}`}
              onClick={() => setActiveCategory(c.id)}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Scene grid */}
        <div className="vr-scenes-grid">
          {filtered.map((scene) => (
            <div
              key={scene.id}
              className={`vr-scene-card${hoveredId === scene.id ? ' vr-scene-hovered' : ''}`}
              onMouseEnter={() => setHoveredId(scene.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => setActiveScene(scene)}
            >
              <div className="vr-scene-thumb" style={{ background: scene.bgGradient }}>
                <span className="vr-scene-emoji">{scene.thumbnail}</span>
                <div className="vr-scene-ring" />
                <div className="vr-scene-ring vr-scene-ring2" />
                <span className="vr-card-badge" style={{ background: scene.badgeColor }}>
                  {scene.badge}
                </span>
                <div className="vr-scene-overlay-label">
                  <span>▶ Launch {scene.badge} Preview</span>
                </div>
              </div>
              <div className="vr-scene-info">
                <h3>{scene.title}</h3>
                <p>{scene.description}</p>
                <div className="vr-scene-meta">
                  <span>📌 {scene.spots.length} hotspots</span>
                  <span className="vr-cat-tag">{CATEGORIES.find((c) => c.id === scene.category)?.icon} {CATEGORIES.find((c) => c.id === scene.category)?.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Active viewer */}
        {activeScene && (
          <VRScene scene={activeScene} onClose={() => setActiveScene(null)} />
        )}
      </div>
    </>
  );
}
