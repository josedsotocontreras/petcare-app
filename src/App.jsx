import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase.js";

// ============================================================
// DATA LAYER
// ============================================================
const SPECIES_DATA = {
  perro: {
    label: "Perro", icon: "🐕",
    breeds: [
      { name: "Labrador Retriever", size: "Grande", lifespan: "10-12 años", activity: "Alto", character: "Amigable, activo, confiable", specialCare: "Control de peso, ejercicio diario", commonDiseases: ["Displasia de cadera", "Obesidad", "Problemas articulares"] },
      { name: "Golden Retriever", size: "Grande", lifespan: "10-12 años", activity: "Alto", character: "Gentil, inteligente, confiable", specialCare: "Cepillado frecuente, ejercicio", commonDiseases: ["Cáncer", "Displasia de cadera", "Problemas cardíacos"] },
      { name: "Bulldog Francés", size: "Pequeño", lifespan: "10-12 años", activity: "Bajo", character: "Juguetón, alerta, adaptable", specialCare: "No exponer al calor, limpiar pliegues", commonDiseases: ["Problemas respiratorios", "Alergias cutáneas"] },
      { name: "Pastor Alemán", size: "Grande", lifespan: "9-13 años", activity: "Alto", character: "Leal, inteligente, valiente", specialCare: "Ejercicio intenso, socialización temprana", commonDiseases: ["Displasia de cadera", "Bloat", "Degeneración medular"] },
      { name: "Beagle", size: "Mediano", lifespan: "12-15 años", activity: "Alto", character: "Curioso, amigable, determinado", specialCare: "Control de peso, ejercicio diario", commonDiseases: ["Obesidad", "Epilepsia", "Hipotiroidismo"] },
      { name: "Poodle", size: "Variable", lifespan: "12-15 años", activity: "Moderado", character: "Inteligente, activo, orgulloso", specialCare: "Corte regular, estimulación mental", commonDiseases: ["Displasia de cadera", "Problemas oculares"] },
      { name: "Chihuahua", size: "Muy pequeño", lifespan: "14-16 años", activity: "Moderado", character: "Alerta, vivaz, leal", specialCare: "Protección del frío, dental", commonDiseases: ["Problemas dentales", "Hidrocefalia", "Hipoglucemia"] },
      { name: "Mestizo / Sin raza", size: "Variable", lifespan: "12-15 años", activity: "Moderado", character: "Variable", specialCare: "Cuidados generales", commonDiseases: ["Enfermedades comunes caninas"] },
    ],
    vaccines: [
      { name: "Polivalente (DA2PP)", type: "obligatoria", ageMonths: 2, intervalMonths: 12, description: "Distemper, Adenovirus, Parvovirus, Parainfluenza" },
      { name: "Rabia", type: "obligatoria", ageMonths: 3, intervalMonths: 12, description: "Vacuna antirrábica obligatoria por ley" },
      { name: "Bordetella", type: "opcional", ageMonths: 3, intervalMonths: 6, description: "Tos de las perreras" },
      { name: "Leptospirosis", type: "opcional", ageMonths: 3, intervalMonths: 12, description: "Prevención de leptospirosis" },
    ],
    dewormingIntervalMonths: 3,
  },
  gato: {
    label: "Gato", icon: "🐈",
    breeds: [
      { name: "Persa", size: "Mediano", lifespan: "12-17 años", activity: "Bajo", character: "Tranquilo, afectuoso, reservado", specialCare: "Cepillado diario, limpieza ocular", commonDiseases: ["Problemas renales", "Problemas respiratorios"] },
      { name: "Siamés", size: "Mediano", lifespan: "15-20 años", activity: "Alto", character: "Vocal, social, curioso", specialCare: "Estimulación mental, compañía", commonDiseases: ["Amiloidosis hepática", "Problemas respiratorios"] },
      { name: "Maine Coon", size: "Grande", lifespan: "12-15 años", activity: "Moderado", character: "Gentil, juguetón, sociable", specialCare: "Cepillado semanal, control cardíaco", commonDiseases: ["Cardiomiopatía hipertrófica", "Displasia de cadera"] },
      { name: "Doméstico / Sin raza", size: "Mediano", lifespan: "13-17 años", activity: "Moderado", character: "Variable", specialCare: "Cuidados generales", commonDiseases: ["Enfermedad renal", "Hipertiroidismo"] },
    ],
    vaccines: [
      { name: "Triple Felina (FVRCP)", type: "obligatoria", ageMonths: 2, intervalMonths: 12, description: "Rinotraqueítis, Calicivirus, Panleucopenia" },
      { name: "Rabia", type: "obligatoria", ageMonths: 3, intervalMonths: 12, description: "Vacuna antirrábica" },
      { name: "FeLV (Leucemia Felina)", type: "opcional", ageMonths: 2, intervalMonths: 12, description: "Leucemia viral felina" },
    ],
    dewormingIntervalMonths: 3,
  },
  ave: {
    label: "Ave", icon: "🐦",
    breeds: [
      { name: "Periquito", size: "Pequeño", lifespan: "7-10 años", activity: "Alto", character: "Social, juguetón, ruidoso", specialCare: "Compañía, jaula amplia", commonDiseases: ["Psitacosis", "Aspergilosis"] },
      { name: "Loro", size: "Mediano-Grande", lifespan: "20-50 años", activity: "Alto", character: "Inteligente, social, vocal", specialCare: "Estimulación mental, socialización", commonDiseases: ["Psitacosis", "Proventricular"] },
      { name: "Canario", size: "Pequeño", lifespan: "10-15 años", activity: "Moderado", character: "Tranquilo, independiente", specialCare: "Canto, luz natural", commonDiseases: ["Ácaros", "Respiratorias"] },
    ],
    vaccines: [],
    dewormingIntervalMonths: 6,
  },
  reptil: {
    label: "Reptil", icon: "🦎",
    breeds: [
      { name: "Iguana Verde", size: "Grande", lifespan: "10-15 años", activity: "Bajo", character: "Independiente, territorial", specialCare: "UVB, temperatura adecuada, dieta vegetal", commonDiseases: ["MBD", "Parásitos internos"] },
      { name: "Leopard Gecko", size: "Pequeño", lifespan: "10-20 años", activity: "Moderado", character: "Dócil, nocturno", specialCare: "Temperatura, suplementos de calcio", commonDiseases: ["Cryptosporidium", "Estomatitis"] },
      { name: "Tortuga de tierra", size: "Mediano", lifespan: "50-100 años", activity: "Bajo", character: "Tranquilo, solitario", specialCare: "Hibernación, dieta variada, UVB", commonDiseases: ["Neumonía", "Parásitos"] },
    ],
    vaccines: [],
    dewormingIntervalMonths: 6,
  },
  roedor: {
    label: "Roedor", icon: "🐹",
    breeds: [
      { name: "Hámster Sirio", size: "Pequeño", lifespan: "2-3 años", activity: "Nocturno/Alto", character: "Solitario, curioso", specialCare: "Jaula individual, rueda de ejercicio", commonDiseases: ["Diabetes", "Papiloma"] },
      { name: "Cobaya / Cuy", size: "Pequeño-Mediano", lifespan: "4-7 años", activity: "Moderado", character: "Social, vocal", specialCare: "Vitamina C diaria, compañía", commonDiseases: ["Escorbuto", "URI"] },
      { name: "Conejo", size: "Mediano", lifespan: "8-12 años", activity: "Moderado", character: "Social, curioso, territorial", specialCare: "Espacio para correr, dieta alta en fibra", commonDiseases: ["Mixomatosis", "VHD"] },
    ],
    vaccines: [
      { name: "Mixomatosis (Conejo)", type: "obligatoria", ageMonths: 2, intervalMonths: 12, description: "Solo para conejos" },
      { name: "VHD (Conejo)", type: "obligatoria", ageMonths: 3, intervalMonths: 12, description: "Enfermedad hemorrágica viral del conejo" },
    ],
    dewormingIntervalMonths: 6,
  },
};

// ============================================================
// UTILITIES
// ============================================================
const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const now = new Date();
  const birth = new Date(birthDate);
  let totalMonths = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (totalMonths < 0) totalMonths = 0;
  if (totalMonths < 12) return `${totalMonths} meses`;
  const y = Math.floor(totalMonths / 12);
  const m = totalMonths % 12;
  return m > 0 ? `${y} años ${m} meses` : `${y} años`;
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
};

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const daysUntil = (date) => Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));

const getUrgencyColor = (days) => {
  if (days < 0) return "#ef4444";
  if (days <= 7) return "#f97316";
  if (days <= 30) return "#eab308";
  return "#22c55e";
};

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #faf7f2; --surface: #ffffff; --surface2: #f5f0e8;
    --border: #e8e0d0; --text: #2d2418; --text2: #6b5d4f; --text3: #9e8c7a;
    --primary: #5b8a6f; --primary-light: #e8f3ed; --primary-dark: #3d6b52;
    --accent: #d4845a; --danger: #ef4444; --warning: #f59e0b; --success: #22c55e;
    --radius: 16px; --radius-sm: 10px;
    --shadow: 0 2px 16px rgba(45,36,24,0.08); --shadow-lg: 0 8px 32px rgba(45,36,24,0.12);
    --font: 'Nunito', sans-serif; --font-display: 'Fraunces', serif; --nav-h: 72px;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); overflow-x: hidden; }
  input, select, textarea {
    font-family: var(--font); background: var(--surface2); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); padding: 10px 14px; font-size: 15px; color: var(--text);
    width: 100%; outline: none; transition: border-color .2s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--primary); background: var(--surface); }
  button { font-family: var(--font); cursor: pointer; border: none; }
  .btn-primary { background: var(--primary); color: white; padding: 12px 24px; border-radius: 50px; font-size: 15px; font-weight: 700; transition: all .2s; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91,138,111,.35); }
  .btn-primary:disabled { opacity: .6; cursor: not-allowed; transform: none; }
  .btn-secondary { background: var(--surface2); color: var(--text2); padding: 10px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; border: 1.5px solid var(--border); transition: all .2s; }
  .btn-secondary:hover { background: var(--border); }
  .btn-ghost { background: transparent; color: var(--text2); padding: 8px 16px; border-radius: 50px; font-size: 14px; font-weight: 600; transition: all .2s; }
  .btn-ghost:hover { background: var(--surface2); }
  .btn-danger { background: #fef2f2; color: var(--danger); padding: 10px 20px; border-radius: 50px; font-size: 14px; font-weight: 600; border: 1.5px solid #fecaca; transition: all .2s; }
  .btn-danger:hover { background: #fee2e2; }
  .card { background: var(--surface); border-radius: var(--radius); border: 1.5px solid var(--border); box-shadow: var(--shadow); }
  .section-title { font-family: var(--font-display); font-size: 22px; font-weight: 700; color: var(--text); margin-bottom: 16px; }
  .badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 50px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .5px; }
  .badge-green { background: #dcfce7; color: #16a34a; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes scaleIn { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .anim-fadeup { animation: fadeUp .4s ease both; }
  .anim-fadein { animation: fadeIn .3s ease both; }
  .anim-scale { animation: scaleIn .3s ease both; }
  .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(45,36,24,.45); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeIn .2s ease; }
  .modal { background: var(--surface); border-radius: 24px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; box-shadow: var(--shadow-lg); animation: scaleIn .25s ease; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 700; color: var(--text2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  .bottom-nav { position: fixed; bottom: 0; left: 0; right: 0; height: var(--nav-h); background: var(--surface); border-top: 1.5px solid var(--border); display: flex; align-items: center; justify-content: space-around; z-index: 100; padding-bottom: env(safe-area-inset-bottom); }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; padding: 8px 16px; border-radius: 14px; cursor: pointer; transition: all .2s; color: var(--text3); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px; min-width: 60px; background: transparent; border: none; }
  .nav-item.active { color: var(--primary); background: var(--primary-light); }
  .nav-item:hover:not(.active) { background: var(--surface2); }
  ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
  .tag { display:inline-flex; align-items:center; background:var(--surface2); border:1px solid var(--border); border-radius:50px; padding:3px 10px; font-size:12px; font-weight:600; color:var(--text2); gap:4px; }
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; gap:16px; }
  .empty-icon { font-size:64px; opacity:.5; }
  .empty-title { font-size:20px; font-weight:800; color:var(--text2); }
  .empty-sub { font-size:14px; color:var(--text3); max-width:260px; line-height:1.6; }
  .alert-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; border-radius: var(--radius-sm); border-left: 4px solid; background: white; margin-bottom: 10px; }
  .timeline-item { display:flex; gap:16px; padding:12px 0; position:relative; }
  .timeline-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
  .vaccine-row { display:flex; align-items:center; gap:12px; padding:12px 16px; border-radius:12px; border:1.5px solid var(--border); margin-bottom:10px; background:white; transition:all .2s; }
  .vaccine-row:hover { border-color:var(--primary); }
  .page-header { background: var(--surface); border-bottom: 1.5px solid var(--border); padding: 20px 20px 16px; position: sticky; top: 0; z-index: 50; }
  .page-content { padding: 20px; padding-bottom: calc(var(--nav-h) + 24px); }
  .app-wrap { max-width: 600px; margin: 0 auto; min-height: 100vh; position: relative; background: var(--bg); }
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .chip-group { display:flex; flex-wrap:wrap; gap:8px; }
  .chip { padding:6px 14px; border-radius:50px; font-size:13px; font-weight:600; border: 1.5px solid var(--border); background:var(--surface2); cursor:pointer; transition:all .15s; color:var(--text2); }
  .chip.active { background:var(--primary); border-color:var(--primary); color:white; }
  .fab { position:fixed; bottom:calc(var(--nav-h) + 20px); right:20px; width:56px; height:56px; border-radius:50%; background:var(--primary); color:white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 20px rgba(91,138,111,.5); cursor:pointer; border:none; transition:all .2s; z-index:80; }
  .fab:hover { background:var(--primary-dark); transform:scale(1.08); }
  .pet-card { background: white; border-radius: 20px; border: 1.5px solid var(--border); overflow: hidden; cursor: pointer; transition: all .25s; box-shadow: 0 2px 12px rgba(45,36,24,.06); }
  .pet-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(45,36,24,.12); border-color: var(--primary); }
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; position:relative; }
  .cal-day.today { background:var(--primary); color:white; }
  .cal-day.has-event::after { content:''; position:absolute; bottom:4px; width:5px; height:5px; border-radius:50%; background:var(--accent); }
  .cal-day:hover:not(.today) { background:var(--surface2); }
  .cal-day.other-month { color:var(--text3); opacity:.5; }
  .tip { font-size:12px; color:var(--text3); margin-top:4px; }
  .spinner { width:40px; height:40px; border:4px solid var(--border); border-top-color:var(--primary); border-radius:50%; animation: spin 0.8s linear infinite; }
  .error-box { padding:12px 16px; border-radius:10px; background:#fee2e2; color:#dc2626; font-size:14px; font-weight:600; margin-bottom:16px; }
`;

// ============================================================
// ICONS
// ============================================================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    paw: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6.5 8C5.12 8 4 9.12 4 10.5S5.12 13 6.5 13 9 11.88 9 10.5 7.88 8 6.5 8zm11 0C16.12 8 15 9.12 15 10.5S16.12 13 17.5 13 20 11.88 20 10.5 18.88 8 17.5 8zm-5.5 4c-3.87 0-7 3.13-7 7 0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2 0-3.87-3.13-7-7-7z"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
  };
  return icons[name] || null;
};

// ============================================================
// COMPONENTS
// ============================================================
const Modal = ({ title, onClose, children }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{title}</h2>
        <button className="btn-ghost" onClick={onClose} style={{ padding: "6px", borderRadius: "50%" }}><Icon name="close" size={20} /></button>
      </div>
      <div style={{ padding: "20px 24px 24px" }}>{children}</div>
    </div>
  </div>
);

const Spinner = ({ text = "Cargando..." }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", gap: 16 }}>
    <div className="spinner" />
    <p style={{ color: "var(--text3)", fontWeight: 600 }}>{text}</p>
  </div>
);

const Avatar = ({ pet, size = 64 }) => {
  const species = SPECIES_DATA[pet.species];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary-light), var(--surface2))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.45, flexShrink: 0, border: "2.5px solid var(--border)", overflow: "hidden" }}>
      {pet.photo_url ? <img src={pet.photo_url} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>{species?.icon || "🐾"}</span>}
    </div>
  );
};

// ============================================================
// AUTH SCREEN
// ============================================================
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Por favor completa todos los campos."); return; }
    setLoading(true);
    try {
      if (mode === "register") {
        if (!form.name) { setError("Ingresa tu nombre."); setLoading(false); return; }
        if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); setLoading(false); return; }
        if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); setLoading(false); return; }

        const { data, error: signUpError } = await supabase.auth.signUp({ email: form.email, password: form.password });
        if (signUpError) throw signUpError;

        // Crear perfil en tabla users
        const { error: profileError } = await supabase.from("users").insert({ id: data.user.id, name: form.name, email: form.email });
        if (profileError) throw profileError;

        onLogin({ ...data.user, name: form.name });
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password });
        if (signInError) throw signInError;

        // Obtener perfil
        const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single();
        onLogin({ ...data.user, name: profile?.name || data.user.email });
      }
    } catch (err) {
      const msgs = {
        "Invalid login credentials": "Email o contraseña incorrectos.",
        "User already registered": "Este email ya está registrado.",
        "Password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres.",
        "Unable to validate email address: invalid format": "El formato del email no es válido.",
      };
      setError(msgs[err.message] || err.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
      <style>{styles}</style>
      <div className="anim-fadeup" style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 36, boxShadow: "0 8px 24px rgba(91,138,111,.4)" }}>🐾</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700 }}>PetCare</h1>
          <p style={{ color: "var(--text3)", fontSize: 15, marginTop: 6 }}>Tu compañero de salud animal</p>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[["login", "Ingresar"], ["register", "Registrarse"]].map(([key, label]) => (
              <button key={key} onClick={() => { setMode(key); setError(""); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", fontFamily: "var(--font)", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .2s", background: mode === key ? "white" : "transparent", color: mode === key ? "var(--primary)" : "var(--text3)", boxShadow: mode === key ? "0 2px 8px rgba(0,0,0,.08)" : "none" }}>{label}</button>
            ))}
          </div>
          {mode === "register" && (
            <div className="form-group"><label>Nombre</label><input placeholder="Tu nombre completo" value={form.name} onChange={e => f("name")(e.target.value)} /></div>
          )}
          <div className="form-group"><label>Email</label><input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => f("email")(e.target.value)} /></div>
          <div className="form-group"><label>Contraseña</label><input type="password" placeholder="••••••••" value={form.password} onChange={e => f("password")(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
          {mode === "register" && (
            <div className="form-group"><label>Confirmar Contraseña</label><input type="password" placeholder="••••••••" value={form.confirm} onChange={e => f("confirm")(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></div>
          )}
          {error && <div className="error-box">{error}</div>}
          <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Crear Cuenta"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HOME SCREEN
// ============================================================
const HomeScreen = ({ user, pets, loading, onSelectPet, onAddPet }) => {
  const now = new Date();
  const allAlerts = [];

  pets.forEach(pet => {
    const sp = SPECIES_DATA[pet.species];
    if (!sp) return;
    const ageMonths = pet.birth_date ? Math.floor((now - new Date(pet.birth_date)) / (1000 * 60 * 60 * 24 * 30)) : 0;
    sp.vaccines.forEach(vac => {
      if (ageMonths < vac.ageMonths) return;
      const applied = (pet.vaccinations || []).filter(v => v.vaccine_name === vac.name);
      if (applied.length === 0) {
        allAlerts.push({ pet, text: `${pet.name} necesita: ${vac.name}`, type: "danger", days: -1 });
      } else {
        const last = applied.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        const nextDate = addMonths(last.date, vac.intervalMonths);
        const d = daysUntil(nextDate);
        if (d <= 30) allAlerts.push({ pet, text: `${pet.name}: ${vac.name}`, type: d < 0 ? "danger" : d <= 7 ? "warning" : "info", days: d, date: nextDate });
      }
    });
  });

  const greeting = () => {
    const h = now.getHours();
    if (h < 12) return "¡Buenos días";
    if (h < 18) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  return (
    <div>
      <div className="page-header" style={{ background: "linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 600 }}>{greeting()}, {user.name?.split(" ")[0]}! 👋</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "white", fontWeight: 700, marginTop: 2 }}>PetCare</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {allAlerts.length > 0 && (
              <div style={{ position: "relative" }}>
                <div style={{ color: "rgba(255,255,255,.85)" }}><Icon name="bell" size={24} /></div>
                <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white" }}>{allAlerts.length}</div>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[{ label: "Mascotas", value: pets.length, icon: "🐾" }, { label: "Alertas", value: allAlerts.filter(a => a.type === "danger").length, icon: "🔴" }, { label: "Próx. 30d", value: allAlerts.filter(a => a.type !== "danger" && a.days >= 0).length, icon: "📅" }].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-content">
        {allAlerts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title">⚠️ Alertas Activas</h2>
            {allAlerts.slice(0, 4).map((a, i) => (
              <div key={i} className="alert-item anim-fadeup" style={{ borderLeftColor: a.type === "danger" ? "var(--danger)" : a.type === "warning" ? "var(--warning)" : "var(--primary)", animationDelay: `${i * 0.05}s`, cursor: "pointer" }} onClick={() => onSelectPet(a.pet)}>
                <Avatar pet={a.pet} size={40} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{a.text}</p>
                  <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{a.days < 0 ? "⏰ Pendiente / Vencida" : `📅 En ${a.days} días — ${formatDate(a.date)}`}</p>
                </div>
                <span className="badge" style={{ background: a.type === "danger" ? "#fee2e2" : a.type === "warning" ? "#fef3c7" : "#dcfce7", color: a.type === "danger" ? "#dc2626" : a.type === "warning" ? "#b45309" : "#16a34a", whiteSpace: "nowrap" }}>
                  {a.days < 0 ? "Vencida" : `${a.days}d`}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Mis Mascotas</h2>
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={onAddPet}><Icon name="plus" size={16} /> Añadir</button>
        </div>

        {loading ? <Spinner text="Cargando mascotas..." /> : pets.length === 0 ? (
          <div className="empty-state card anim-scale">
            <div className="empty-icon">🐾</div>
            <div className="empty-title">Aún no hay mascotas</div>
            <div className="empty-sub">Agrega tu primera mascota para comenzar a llevar su historial</div>
            <button className="btn-primary" onClick={onAddPet}><Icon name="plus" size={18} /> Agregar Mascota</button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pets.map((pet, i) => {
              const petAlerts = allAlerts.filter(a => a.pet.id === pet.id).length;
              const sp = SPECIES_DATA[pet.species];
              return (
                <div key={pet.id} className="pet-card anim-fadeup" style={{ animationDelay: `${i * 0.07}s` }} onClick={() => onSelectPet(pet)}>
                  <div style={{ padding: 20, display: "flex", gap: 16, alignItems: "center" }}>
                    <Avatar pet={pet} size={72} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                        <h3 style={{ fontSize: 20, fontWeight: 800 }}>{pet.name}</h3>
                        {petAlerts > 0 && <span className="badge badge-red">🔔 {petAlerts}</span>}
                      </div>
                      <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 2 }}>{sp?.icon} {sp?.label} {pet.breed ? `• ${pet.breed}` : ""}</p>
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {pet.birth_date && <span className="tag">🎂 {calcAge(pet.birth_date)}</span>}
                        {pet.weight && <span className="tag">⚖️ {pet.weight}kg</span>}
                        {pet.sex && <span className="tag">{pet.sex === "macho" ? "♂" : "♀"} {pet.sex}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// PET FORM
// ============================================================
const PetForm = ({ pet, userId, onSave, onClose }) => {
  const isEdit = !!pet;
  const [form, setForm] = useState(pet || { name: "", species: "perro", breed: "", birth_date: "", sex: "", weight: "", health_status: "bueno", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const sp = SPECIES_DATA[form.species];

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Ingresa el nombre de tu mascota"); return; }
    setLoading(true);
    setError("");
    try {
      if (isEdit) {
        const { error: err } = await supabase.from("pets").update({ name: form.name, species: form.species, breed: form.breed, birth_date: form.birth_date || null, sex: form.sex, weight: form.weight ? parseFloat(form.weight) : null, health_status: form.health_status, notes: form.notes }).eq("id", pet.id);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from("pets").insert({ user_id: userId, name: form.name, species: form.species, breed: form.breed, birth_date: form.birth_date || null, sex: form.sex, weight: form.weight ? parseFloat(form.weight) : null, health_status: form.health_status, notes: form.notes });
        if (err) throw err;
      }
      onSave();
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <Modal title={isEdit ? "✏️ Editar Mascota" : "🐾 Nueva Mascota"} onClose={onClose}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--surface2)", border: "3px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>
          {sp?.icon || "🐾"}
        </div>
      </div>
      <div className="form-group"><label>Nombre *</label><input placeholder="Ej: Luna, Max, Coco..." value={form.name} onChange={e => f("name")(e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group">
          <label>Especie *</label>
          <select value={form.species} onChange={e => { f("species")(e.target.value); f("breed")(""); }}>
            {Object.entries(SPECIES_DATA).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label>Raza</label>
          <select value={form.breed} onChange={e => f("breed")(e.target.value)}>
            <option value="">Sin especificar</option>
            {sp?.breeds.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha de Nacimiento</label>
          <input type="date" value={form.birth_date || ""} onChange={e => f("birth_date")(e.target.value)} max={new Date().toISOString().split("T")[0]} />
          {form.birth_date && <p className="tip">Edad: {calcAge(form.birth_date)}</p>}
        </div>
        <div className="form-group">
          <label>Sexo</label>
          <select value={form.sex} onChange={e => f("sex")(e.target.value)}>
            <option value="">No especificado</option>
            <option value="macho">♂ Macho</option>
            <option value="hembra">♀ Hembra</option>
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>Peso (kg)</label><input type="number" step="0.1" min="0" placeholder="Ej: 5.2" value={form.weight || ""} onChange={e => f("weight")(e.target.value)} /></div>
        <div className="form-group">
          <label>Estado de salud</label>
          <select value={form.health_status} onChange={e => f("health_status")(e.target.value)}>
            <option value="excelente">✅ Excelente</option>
            <option value="bueno">🟢 Bueno</option>
            <option value="regular">🟡 Regular</option>
            <option value="malo">🔴 Malo</option>
          </select>
        </div>
      </div>
      <div className="form-group"><label>Observaciones</label><textarea rows={3} placeholder="Notas adicionales..." value={form.notes || ""} onChange={e => f("notes")(e.target.value)} style={{ resize: "vertical" }} /></div>
      {error && <div className="error-box">{error}</div>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave} disabled={loading}><Icon name="check" size={18} /> {loading ? "Guardando..." : isEdit ? "Guardar" : "Agregar"}</button>
      </div>
    </Modal>
  );
};

// ============================================================
// VACCINE FORM
// ============================================================
const VaccineForm = ({ pet, onSave, onClose }) => {
  const sp = SPECIES_DATA[pet.species];
  const [form, setForm] = useState({ vaccine_name: "", date: new Date().toISOString().split("T")[0], vet: "", next_date: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async () => {
    const name = form.vaccine_name === "__other__" ? form.customName : form.vaccine_name;
    if (!name) { setError("Ingresa el nombre de la vacuna"); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.from("vaccinations").insert({ pet_id: pet.id, vaccine_name: name, date: form.date, next_date: form.next_date || null, vet: form.vet, notes: form.notes });
      if (err) throw err;
      onSave();
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <Modal title="💉 Registrar Vacuna" onClose={onClose}>
      <div className="form-group">
        <label>Vacuna *</label>
        <select value={form.vaccine_name} onChange={e => {
          const vac = sp?.vaccines.find(v => v.name === e.target.value);
          if (vac) { const next = addMonths(form.date, vac.intervalMonths); setForm(p => ({ ...p, vaccine_name: e.target.value, next_date: next.toISOString().split("T")[0] })); }
          else f("vaccine_name")(e.target.value);
        }}>
          <option value="">Seleccionar...</option>
          {sp?.vaccines.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
          <option value="__other__">Otra vacuna...</option>
        </select>
        {form.vaccine_name === "__other__" && <input placeholder="Nombre de la vacuna" value={form.customName || ""} onChange={e => f("customName")(e.target.value)} style={{ marginTop: 8 }} />}
      </div>
      <div className="form-row">
        <div className="form-group"><label>Fecha aplicación *</label><input type="date" value={form.date} onChange={e => f("date")(e.target.value)} /></div>
        <div className="form-group"><label>Próxima dosis</label><input type="date" value={form.next_date} onChange={e => f("next_date")(e.target.value)} /></div>
      </div>
      <div className="form-group"><label>Veterinaria / Clínica</label><input placeholder="Nombre de la clínica" value={form.vet} onChange={e => f("vet")(e.target.value)} /></div>
      <div className="form-group"><label>Notas</label><textarea rows={2} placeholder="Observaciones..." value={form.notes} onChange={e => f("notes")(e.target.value)} /></div>
      {error && <div className="error-box">{error}</div>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave} disabled={loading}><Icon name="check" size={18} /> {loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </Modal>
  );
};

// ============================================================
// HISTORY FORM
// ============================================================
const HistoryForm = ({ pet, onSave, onClose }) => {
  const [form, setForm] = useState({ title: "", type: "control", date: new Date().toISOString().split("T")[0], vet: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const TYPES = [{ value: "vacuna", label: "💉 Vacuna" }, { value: "enfermedad", label: "🤒 Enfermedad" }, { value: "procedimiento", label: "🔬 Procedimiento" }, { value: "control", label: "🩺 Control" }, { value: "desparasitacion", label: "🪱 Desparasitación" }, { value: "observacion", label: "📝 Observación" }];

  const handleSave = async () => {
    if (!form.title.trim()) { setError("Ingresa un título"); return; }
    setLoading(true);
    try {
      const { error: err } = await supabase.from("medical_history").insert({ pet_id: pet.id, title: form.title, type: form.type, date: form.date, vet: form.vet, description: form.description });
      if (err) throw err;
      onSave();
    } catch (err) { setError(err.message); }
    setLoading(false);
  };

  return (
    <Modal title="📋 Agregar al Historial" onClose={onClose}>
      <div className="form-group">
        <label>Tipo de evento</label>
        <div className="chip-group">{TYPES.map(t => <span key={t.value} className={`chip ${form.type === t.value ? "active" : ""}`} onClick={() => f("type")(t.value)}>{t.label}</span>)}</div>
      </div>
      <div className="form-group"><label>Título *</label><input placeholder="Ej: Control anual, Gastroenteritis..." value={form.title} onChange={e => f("title")(e.target.value)} /></div>
      <div className="form-row">
        <div className="form-group"><label>Fecha</label><input type="date" value={form.date} onChange={e => f("date")(e.target.value)} /></div>
        <div className="form-group"><label>Veterinaria</label><input placeholder="Clínica..." value={form.vet} onChange={e => f("vet")(e.target.value)} /></div>
      </div>
      <div className="form-group"><label>Descripción</label><textarea rows={3} placeholder="Detalles del evento..." value={form.description} onChange={e => f("description")(e.target.value)} /></div>
      {error && <div className="error-box">{error}</div>}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave} disabled={loading}><Icon name="check" size={18} /> {loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </Modal>
  );
};

// ============================================================
// PET DETAIL
// ============================================================
const PetDetail = ({ petId, userId, onBack, onRefreshPets }) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("info");
  const [showEdit, setShowEdit] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const loadPet = useCallback(async () => {
    setLoading(true);
    const { data: petData } = await supabase.from("pets").select("*").eq("id", petId).single();
    const { data: vaccines } = await supabase.from("vaccinations").select("*").eq("pet_id", petId).order("date", { ascending: false });
    const { data: history } = await supabase.from("medical_history").select("*").eq("pet_id", petId).order("date", { ascending: false });
    setPet({ ...petData, vaccinations: vaccines || [], medicalHistory: history || [] });
    setLoading(false);
  }, [petId]);

  useEffect(() => { loadPet(); }, [loadPet]);

  const handleDelete = async () => {
    await supabase.from("pets").delete().eq("id", petId);
    onRefreshPets();
    onBack();
  };

  const deleteVaccine = async (id) => {
    await supabase.from("vaccinations").delete().eq("id", id);
    loadPet();
  };

  const deleteHistory = async (id) => {
    await supabase.from("medical_history").delete().eq("id", id);
    loadPet();
  };

  if (loading) return <div style={{ paddingTop: 40 }}><Spinner text="Cargando mascota..." /></div>;
  if (!pet) return null;

  const sp = SPECIES_DATA[pet.species];
  const breedInfo = sp?.breeds.find(b => b.name === pet.breed);
  const now = new Date();
  const ageMonths = pet.birth_date ? Math.floor((now - new Date(pet.birth_date)) / (1000 * 60 * 60 * 24 * 30)) : 0;
  const healthIcons = { excelente: "✅", bueno: "🟢", regular: "🟡", malo: "🔴" };
  const TABS = [{ id: "info", label: "Info" }, { id: "vaccines", label: "Vacunas" }, { id: "history", label: "Historial" }];

  return (
    <div>
      <div style={{ background: "linear-gradient(160deg, var(--primary-dark), var(--primary) 60%, var(--surface2) 100%)", padding: "24px 20px 0" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", marginBottom: 20 }}>
          <Icon name="back" size={20} color="white" />
        </button>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24 }}>
          <Avatar pet={pet} size={90} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "white", fontWeight: 700 }}>{pet.name}</h1>
              <span style={{ fontSize: 22 }}>{healthIcons[pet.health_status] || "🟢"}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 14, marginTop: 4 }}>{sp?.icon} {sp?.label} {pet.breed ? `• ${pet.breed}` : ""}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {pet.birth_date && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>🎂 {calcAge(pet.birth_date)}</span>}
              {pet.weight && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>⚖️ {pet.weight}kg</span>}
              {pet.sex && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{pet.sex === "macho" ? "♂" : "♀"} {pet.sex}</span>}
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <Icon name="edit" size={18} color="white" />
          </button>
        </div>
        <div style={{ display: "flex", background: "rgba(0,0,0,.15)", borderRadius: "16px 16px 0 0", padding: "4px 4px 0" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, padding: "10px 8px", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontWeight: 700, fontSize: 13, borderRadius: "12px 12px 0 0", transition: "all .2s", background: tab === t.id ? "white" : "transparent", color: tab === t.id ? "var(--primary)" : "rgba(255,255,255,.75)" }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content">
        {/* INFO TAB */}
        {tab === "info" && (
          <div className="anim-fadeup">
            {breedInfo && (
              <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>🧬 Información de Raza</h3>
                <div className="grid-2">
                  {[["📏 Tamaño", breedInfo.size], ["⏳ Esperanza de vida", breedInfo.lifespan], ["⚡ Actividad", breedInfo.activity], ["💭 Carácter", breedInfo.character]].map(([label, value]) => (
                    <div key={label} style={{ background: "var(--surface2)", borderRadius: 12, padding: 12 }}>
                      <p style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{value}</p>
                    </div>
                  ))}
                </div>
                {breedInfo.specialCare && <div style={{ marginTop: 12, padding: 12, background: "#e8f3ed", borderRadius: 12, borderLeft: "4px solid var(--primary)" }}><p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}>🌿 CUIDADOS ESPECIALES</p><p style={{ fontSize: 14, color: "var(--text2)" }}>{breedInfo.specialCare}</p></div>}
                {breedInfo.commonDiseases?.length > 0 && <div style={{ marginTop: 10, padding: 12, background: "#fdf0e8", borderRadius: 12, borderLeft: "4px solid var(--accent)" }}><p style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", marginBottom: 6 }}>⚠️ ENFERMEDADES COMUNES</p><div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{breedInfo.commonDiseases.map(d => <span key={d} className="tag" style={{ fontSize: 12 }}>{d}</span>)}</div></div>}
              </div>
            )}
            {pet.notes && (
              <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 10 }}>📝 Observaciones</h3>
                <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{pet.notes}</p>
              </div>
            )}
            <div className="card" style={{ padding: 20, border: "1.5px solid #fecaca" }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--danger)", marginBottom: 12 }}>⚠️ Zona de peligro</h3>
              <button className="btn-danger" style={{ width: "100%" }} onClick={() => setConfirmDelete(true)}><Icon name="trash" size={16} /> Eliminar Mascota</button>
            </div>
          </div>
        )}

        {/* VACCINES TAB */}
        {tab === "vaccines" && (
          <div className="anim-fadeup">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Vacunas</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddVaccine(true)}><Icon name="plus" size={16} /> Registrar</button>
            </div>
            {(sp?.vaccines || []).map(vac => {
              const applied = (pet.vaccinations || []).filter(v => v.vaccine_name === vac.name).sort((a, b) => new Date(b.date) - new Date(a.date));
              const hasAny = applied.length > 0;
              const nextDate = hasAny ? addMonths(applied[0].date, vac.intervalMonths) : null;
              const days = nextDate ? daysUntil(nextDate) : null;
              const color = !hasAny ? "#ef4444" : days < 0 ? "#ef4444" : days <= 30 ? "#f59e0b" : "#22c55e";
              return (
                <div key={vac.name} className="vaccine-row">
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: hasAny ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{hasAny ? "💉" : "⏳"}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{vac.name}</p>
                      {vac.type === "obligatoria" ? <span className="badge badge-red" style={{ fontSize: 10 }}>Obligatoria</span> : <span className="badge badge-blue" style={{ fontSize: 10 }}>Opcional</span>}
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{vac.description}</p>
                    {hasAny && <p style={{ fontSize: 12, fontWeight: 600, color, marginTop: 3 }}>Última: {formatDate(applied[0].date)} • Próx: {formatDate(nextDate)} {days >= 0 ? `(${days}d)` : "(vencida)"}</p>}
                    {!hasAny && <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", marginTop: 3 }}>⚠️ No registrada</p>}
                  </div>
                </div>
              );
            })}
            {(pet.vaccinations || []).length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>📝 Vacunas Aplicadas</p>
                {pet.vaccinations.map(v => (
                  <div key={v.id} className="vaccine-row" style={{ alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💉</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{v.vaccine_name}</p>
                      <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>📅 {formatDate(v.date)}</p>
                      {v.vet && <p style={{ fontSize: 12, color: "var(--text3)" }}>🏥 {v.vet}</p>}
                      {v.next_date && <p style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>📌 Próxima: {formatDate(v.next_date)}</p>}
                    </div>
                    <button onClick={() => deleteVaccine(v.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 6 }}><Icon name="trash" size={16} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* HISTORY TAB */}
        {tab === "history" && (
          <div className="anim-fadeup">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Historial Médico</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddHistory(true)}><Icon name="plus" size={16} /> Agregar</button>
            </div>
            {(pet.medicalHistory || []).length === 0 ? (
              <div className="empty-state card"><div className="empty-icon">📋</div><div className="empty-title">Sin historial</div><div className="empty-sub">Agrega eventos médicos, enfermedades y procedimientos</div><button className="btn-primary" onClick={() => setShowAddHistory(true)}><Icon name="plus" size={16} /> Agregar Evento</button></div>
            ) : (
              <div>
                {pet.medicalHistory.map((h, i) => {
                  const typeColors = { vacuna: "#22c55e", enfermedad: "#ef4444", procedimiento: "#8b5cf6", control: "#3b82f6", observacion: "#f59e0b", desparasitacion: "#06b6d4" };
                  const typeIcons = { vacuna: "💉", enfermedad: "🤒", procedimiento: "🔬", control: "🩺", observacion: "📝", desparasitacion: "🪱" };
                  const color = typeColors[h.type] || "#9e8c7a";
                  return (
                    <div key={h.id} className="timeline-item">
                      <div className="timeline-dot" style={{ background: `${color}20`, border: `2px solid ${color}` }}><span style={{ fontSize: 16 }}>{typeIcons[h.type] || "📝"}</span></div>
                      <div style={{ flex: 1, background: "white", borderRadius: 14, padding: 14, border: "1.5px solid var(--border)", marginBottom: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: 15 }}>{h.title}</p>
                            <p style={{ fontSize: 12, color, fontWeight: 600, marginTop: 2, textTransform: "capitalize" }}>{h.type}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{formatDate(h.date)}</span>
                            <button onClick={() => deleteHistory(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 2 }}><Icon name="trash" size={14} /></button>
                          </div>
                        </div>
                        {h.description && <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 8, lineHeight: 1.6 }}>{h.description}</p>}
                        {h.vet && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>🏥 {h.vet}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {showEdit && <PetForm pet={pet} userId={userId} onSave={() => { loadPet(); onRefreshPets(); setShowEdit(false); }} onClose={() => setShowEdit(false)} />}
      {showAddVaccine && <VaccineForm pet={pet} onSave={() => { loadPet(); setShowAddVaccine(false); }} onClose={() => setShowAddVaccine(false)} />}
      {showAddHistory && <HistoryForm pet={pet} onSave={() => { loadPet(); setShowAddHistory(false); }} onClose={() => setShowAddHistory(false)} />}
      {confirmDelete && (
        <Modal title="⚠️ Confirmar eliminación" onClose={() => setConfirmDelete(false)}>
          <p style={{ color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>¿Eliminar a <b>{pet.name}</b>? Esta acción no se puede deshacer.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>Cancelar</button>
            <button className="btn-danger" onClick={handleDelete}>Sí, eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// CALENDAR SCREEN
// ============================================================
const CalendarScreen = ({ pets }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);
  const allEvents = [];
  pets.forEach(pet => {
    const sp = SPECIES_DATA[pet.species];
    if (!sp) return;

    // Vacunas programadas (próximas dosis)
    sp.vaccines.forEach(vac => {
      const applied = (pet.vaccinations || []).filter(v => v.vaccine_name === vac.name).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (applied.length > 0) {
        const nextDate = addMonths(applied[0].date, vac.intervalMonths);
        allEvents.push({ pet, date: nextDate, label: `${pet.name}: ${vac.name}`, icon: "💉", type: "vaccine" });
      }
    });

    // Vacunas aplicadas (fecha real)
    (pet.vaccinations || []).forEach(v => {
      allEvents.push({ pet, date: new Date(v.date), label: `${pet.name}: ${v.vaccine_name}`, icon: "💉", type: "vaccine" });
    });

    // Historial médico (controles, enfermedades, procedimientos, etc.)
    (pet.medical_history || []).forEach(h => {
      const typeIcons = { vacuna: "💉", enfermedad: "🤒", procedimiento: "🔬", control: "🩺", observacion: "📝", desparasitacion: "🪱" };
      allEvents.push({
        pet,
        date: new Date(h.date),
        label: `${pet.name}: ${h.title}`,
        icon: typeIcons[h.type] || "📝",
        type: h.type,
        detail: h.description,
        vet: h.vet,
      });
    });
  });
  const year = currentDate.getFullYear(), month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const eventDays = {};
  allEvents.forEach(ev => { const d = new Date(ev.date); if (d.getFullYear() === year && d.getMonth() === month) { const k = d.getDate(); if (!eventDays[k]) eventDays[k] = []; eventDays[k].push(ev); } });
  const upcoming = allEvents.filter(e => daysUntil(e.date) >= 0 && daysUntil(e.date) <= 60).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="page-header"><h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>📅 Calendario</h1></div>
      <div className="page-content">
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button className="btn-ghost" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
            <h2 style={{ fontWeight: 800, fontSize: 18, textTransform: "capitalize" }}>{currentDate.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}</h2>
            <button className="btn-ghost" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
          </div>
          <div className="cal-grid" style={{ marginBottom: 8 }}>
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--text3)", padding: "4px 0" }}>{d}</div>)}
          </div>
          <div className="cal-grid">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="cal-day other-month" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              return <div key={day} className={`cal-day${isToday ? " today" : ""}${eventDays[day] ? " has-event" : ""}`} style={{ background: selectedDay === day && !isToday ? "var(--primary-light)" : undefined, fontWeight: (isToday || selectedDay === day) ? 800 : 600 }} onClick={() => setSelectedDay(selectedDay === day ? null : day)}>{day}</div>;
            })}
          </div>
          {selectedDay && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface2)", borderRadius: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>📅 {selectedDay} de {currentDate.toLocaleDateString("es-CL", { month: "long" })}</p>
              {(eventDays[selectedDay] || []).length === 0 
                ? <p style={{ fontSize: 13, color: "var(--text3)" }}>Sin eventos este día</p> 
                : (eventDays[selectedDay] || []).map((ev, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
                      {ev.icon || "📅"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 700 }}>{ev.label}</p>
                      {ev.vet && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>🏥 {ev.vet}</p>}
                      {ev.detail && <p style={{ fontSize: 12, color: "var(--text2)", marginTop: 2, lineHeight: 1.5 }}>{ev.detail}</p>}
                      <p style={{ fontSize: 11, color: "var(--primary)", fontWeight: 600, marginTop: 3, textTransform: "capitalize" }}>{ev.type}</p>
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
        <h2 className="section-title">⏰ Próximos 60 días</h2>
        {upcoming.length === 0 ? <div className="empty-state card"><div className="empty-icon">🎉</div><div className="empty-title">¡Todo al día!</div><div className="empty-sub">No hay eventos pendientes en los próximos 60 días</div></div>
          : upcoming.map((ev, i) => { const d = daysUntil(ev.date); return <div key={i} className="alert-item" style={{ borderLeftColor: getUrgencyColor(d) }}><Avatar pet={ev.pet} size={40} /><div style={{ flex: 1 }}><p style={{ fontWeight: 700, fontSize: 14 }}>{ev.label}</p><p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>📅 {formatDate(ev.date)}</p></div><span className="badge" style={{ background: `${getUrgencyColor(d)}20`, color: getUrgencyColor(d), fontWeight: 800 }}>{d === 0 ? "Hoy" : `${d}d`}</span></div>; })}
      </div>
    </div>
  );
};

// ============================================================
// PROFILE SCREEN
// ============================================================
const ProfileScreen = ({ user, onLogout }) => {
  const [stats, setStats] = useState({ pets: 0, vaccines: 0, history: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const { data: pets } = await supabase.from("pets").select("id").eq("user_id", user.id);
      if (pets?.length > 0) {
        const petIds = pets.map(p => p.id);
        const { data: vaccines } = await supabase.from("vaccinations").select("id").in("pet_id", petIds);
        const { data: history } = await supabase.from("medical_history").select("id").in("pet_id", petIds);
        setStats({ pets: pets.length, vaccines: vaccines?.length || 0, history: history?.length || 0 });
      }
    };
    loadStats();
  }, [user.id]);

  return (
    <div>
      <div className="page-header"><h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>👤 Mi Perfil</h1></div>
      <div className="page-content">
        <div className="card" style={{ padding: 24, marginBottom: 16, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32, color: "white", fontWeight: 800 }}>
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{user.name}</h2>
          <p style={{ color: "var(--text3)", fontSize: 14, marginTop: 4 }}>{user.email}</p>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>📊 Mis estadísticas</h3>
          <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
            {[["🐾", stats.pets, "Mascotas"], ["💉", stats.vaccines, "Vacunas"], ["📋", stats.history, "Historial"]].map(([icon, val, label]) => (
              <div key={label} style={{ background: "var(--surface2)", borderRadius: 14, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>{icon}</div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{val}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>☁️ Datos en la nube</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: "#e8f3ed", borderRadius: 12 }}>
            <span style={{ fontSize: 28 }}>✅</span>
            <div>
              <p style={{ fontWeight: 700, fontSize: 14, color: "var(--primary-dark)" }}>Conectado a Supabase</p>
              <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>Tus datos están guardados de forma segura en la nube</p>
            </div>
          </div>
        </div>

        <button className="btn-danger" style={{ width: "100%", padding: "14px 0" }} onClick={onLogout}>
          <Icon name="logout" size={18} /> Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [tab, setTab] = useState("home");
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [showAddPet, setShowAddPet] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Auth listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) loadUserProfile(session.user);
      else setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) loadUserProfile(session.user);
      else { setUser(null); setPets([]); setAuthLoading(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (authUser) => {
    const { data: profile } = await supabase.from("users").select("*").eq("id", authUser.id).single();
    setUser({ ...authUser, name: profile?.name || authUser.email });
    setAuthLoading(false);
  };

  const loadPets = useCallback(async (userId) => {
    if (!userId) return;
    setLoadingPets(true);
    const { data } = await supabase.from("pets").select("*, vaccinations(*), medical_history(*)").eq("user_id", userId).order("created_at", { ascending: true });
    setPets(data || []);
    setLoadingPets(false);
  }, []);

  useEffect(() => { if (user?.id) loadPets(user.id); }, [user, loadPets]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null); setPets([]); setSelectedPetId(null); setTab("home");
  };

  if (authLoading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <style>{styles}</style>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🐾</div>
        <div className="spinner" style={{ margin: "0 auto" }} />
        <p style={{ color: "var(--text3)", fontWeight: 600, marginTop: 16 }}>Iniciando PetCare...</p>
      </div>
    </div>
  );

  if (!user) return (
    <>
      <style>{styles}</style>
      <AuthScreen onLogin={(u) => setUser(u)} />
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrap">
        {selectedPetId ? (
          <div className="anim-fadein">
            <PetDetail petId={selectedPetId} userId={user.id} onBack={() => { setSelectedPetId(null); loadPets(user.id); }} onRefreshPets={() =>loadPets(user.id)}  />
          </div>
        ) : (
          <div className="anim-fadein">
            {tab === "home" && <HomeScreen user={user} pets={pets} loading={loadingPets} onSelectPet={(p) => setSelectedPetId(p.id)} onAddPet={() => setShowAddPet(true)} />}
            {tab === "calendar" && <CalendarScreen pets={pets} />}
            {tab === "profile" && <ProfileScreen user={user} onLogout={handleLogout} />}
          </div>
        )}

        {!selectedPetId && (
          <nav className="bottom-nav">
            {[{ id: "home", label: "Inicio", icon: "home" }, { id: "calendar", label: "Calendario", icon: "calendar" }, { id: "profile", label: "Perfil", icon: "user" }].map(n => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <Icon name={n.icon} size={22} />{n.label}
              </button>
            ))}
          </nav>
        )}

        {tab === "home" && !selectedPetId && (
          <button className="fab" onClick={() => setShowAddPet(true)}>
            <Icon name="plus" size={28} color="white" />
          </button>
        )}

        {showAddPet && (
          <PetForm userId={user.id} onSave={() => { loadPets(user.id); setShowAddPet(false); }} onClose={() => { loadPets(user.id); setShowAddPet(false); }} />
        )}
      </div>
    </>
  );
}
