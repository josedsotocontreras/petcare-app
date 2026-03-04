import { useState, useEffect, useCallback } from "react";

// ============================================================
// DATA LAYER - Species, Breeds, Vaccine Schedules
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
      { name: "Coronavirus", type: "opcional", ageMonths: 2, intervalMonths: 12, description: "Coronavirus canino" },
    ],
    dewormingIntervalMonths: 3,
  },
  gato: {
    label: "Gato", icon: "🐈",
    breeds: [
      { name: "Persa", size: "Mediano", lifespan: "12-17 años", activity: "Bajo", character: "Tranquilo, afectuoso, reservado", specialCare: "Cepillado diario, limpieza ocular", commonDiseases: ["Problemas renales", "Problemas respiratorios"] },
      { name: "Siamés", size: "Mediano", lifespan: "15-20 años", activity: "Alto", character: "Vocal, social, curioso", specialCare: "Estimulación mental, compañía", commonDiseases: ["Amiloidosis hepática", "Problemas respiratorios"] },
      { name: "Maine Coon", size: "Grande", lifespan: "12-15 años", activity: "Moderado", character: "Gentil, juguetón, sociable", specialCare: "Cepillado semanal, control cardíaco", commonDiseases: ["Cardiomiopatía hipertrófica", "Displasia de cadera"] },
      { name: "British Shorthair", size: "Grande", lifespan: "15-20 años", activity: "Bajo", character: "Tranquilo, leal, independiente", specialCare: "Control de peso", commonDiseases: ["Cardiomiopatía", "Diabetes"] },
      { name: "Ragdoll", size: "Grande", lifespan: "12-17 años", activity: "Bajo", character: "Dócil, afectuoso, tranquilo", specialCare: "No dejar salir solo, cepillado", commonDiseases: ["Cardiomiopatía hipertrófica", "Enfermedad renal"] },
      { name: "Doméstico / Sin raza", size: "Mediano", lifespan: "13-17 años", activity: "Moderado", character: "Variable", specialCare: "Cuidados generales", commonDiseases: ["Enfermedad renal", "Hipertiroidismo"] },
    ],
    vaccines: [
      { name: "Triple Felina (FVRCP)", type: "obligatoria", ageMonths: 2, intervalMonths: 12, description: "Rinotraqueítis, Calicivirus, Panleucopenia" },
      { name: "Rabia", type: "obligatoria", ageMonths: 3, intervalMonths: 12, description: "Vacuna antirrábica" },
      { name: "FeLV (Leucemia Felina)", type: "opcional", ageMonths: 2, intervalMonths: 12, description: "Leucemia viral felina" },
      { name: "FIV (Inmunodeficiencia)", type: "opcional", ageMonths: 3, intervalMonths: 12, description: "Inmunodeficiencia viral felina" },
    ],
    dewormingIntervalMonths: 3,
  },
  ave: {
    label: "Ave", icon: "🐦",
    breeds: [
      { name: "Periquito", size: "Pequeño", lifespan: "7-10 años", activity: "Alto", character: "Social, juguetón, ruidoso", specialCare: "Compañía, jaula amplia", commonDiseases: ["Psitacosis", "Aspergilosis"] },
      { name: "Loro", size: "Mediano-Grande", lifespan: "20-50 años", activity: "Alto", character: "Inteligente, social, vocal", specialCare: "Estimulación mental, socialización", commonDiseases: ["Psitacosis", "Proventricular"] },
      { name: "Canario", size: "Pequeño", lifespan: "10-15 años", activity: "Moderado", character: "Tranquilo, independiente", specialCare: "Canto, luz natural", commonDiseases: ["Ácaros", "Respiratorias"] },
      { name: "Cacatúa", size: "Mediano", lifespan: "20-40 años", activity: "Alto", character: "Cariñoso, juguetón", specialCare: "Atención constante, interacción", commonDiseases: ["PBFD", "Aspergilosis"] },
      { name: "Otra especie", size: "Variable", lifespan: "Variable", activity: "Variable", character: "Variable", specialCare: "Consultar veterinario aviar", commonDiseases: ["Consultar especialista"] },
    ],
    vaccines: [
      { name: "Newcastle", type: "opcional", ageMonths: 1, intervalMonths: 12, description: "Enfermedad de Newcastle en aves" },
    ],
    dewormingIntervalMonths: 6,
  },
  reptil: {
    label: "Reptil", icon: "🦎",
    breeds: [
      { name: "Iguana Verde", size: "Grande", lifespan: "10-15 años", activity: "Bajo", character: "Independiente, territorial", specialCare: "UVB, temperatura adecuada, dieta vegetal", commonDiseases: ["MBD", "Parásitos internos"] },
      { name: "Leopard Gecko", size: "Pequeño", lifespan: "10-20 años", activity: "Moderado", character: "Dócil, nocturno", specialCare: "Temperatura, suplementos de calcio", commonDiseases: ["Cryptosporidium", "Estomatitis"] },
      { name: "Tortuga de tierra", size: "Mediano", lifespan: "50-100 años", activity: "Bajo", character: "Tranquilo, solitario", specialCare: "Hibernación, dieta variada, UVB", commonDiseases: ["Neumonía", "Parásitos"] },
      { name: "Serpiente Ball Python", size: "Mediano", lifespan: "20-30 años", activity: "Bajo", character: "Dócil, nocturno", specialCare: "Humedad, temperatura, terrario seguro", commonDiseases: ["Mites", "Infecciones respiratorias"] },
      { name: "Otro reptil", size: "Variable", lifespan: "Variable", activity: "Variable", character: "Variable", specialCare: "Consultar veterinario exótico", commonDiseases: ["Consultar especialista"] },
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
      { name: "Rata doméstica", size: "Pequeño", lifespan: "2-3 años", activity: "Alto", character: "Inteligente, social, juguetón", specialCare: "Compañía, estimulación", commonDiseases: ["Tumores mamarios", "Micoplasma"] },
      { name: "Chinchilla", size: "Pequeño", lifespan: "10-15 años", activity: "Alto", character: "Activo, curioso", specialCare: "Baños de arena, temperatura fresca", commonDiseases: ["Maloclusión dental", "GI estasis"] },
    ],
    vaccines: [
      { name: "Mixomatosis (Conejo)", type: "obligatoria", ageMonths: 2, intervalMonths: 12, description: "Solo para conejos" },
      { name: "VHD (Conejo)", type: "obligatoria", ageMonths: 3, intervalMonths: 12, description: "Enfermedad hemorrágica viral del conejo" },
    ],
    dewormingIntervalMonths: 6,
  },
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================
const generateId = () => Math.random().toString(36).substr(2, 9);

const calcAge = (birthDate) => {
  if (!birthDate) return null;
  const now = new Date();
  const birth = new Date(birthDate);
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  let totalMonths = years * 12 + months;
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

const daysUntil = (date) => {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.ceil((d - now) / (1000 * 60 * 60 * 24));
  return diff;
};

const getUrgencyColor = (days) => {
  if (days < 0) return "#ef4444";
  if (days <= 7) return "#f97316";
  if (days <= 30) return "#eab308";
  return "#22c55e";
};

// ============================================================
// STORAGE
// ============================================================
const STORAGE_KEY = "petcare_data_v2";

const loadData = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { users: [], currentUser: null };
};

const saveData = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
};

// ============================================================
// ICONS SVG
// ============================================================
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    paw: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C10.34 2 9 3.34 9 5s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM6.5 8C5.12 8 4 9.12 4 10.5S5.12 13 6.5 13 9 11.88 9 10.5 7.88 8 6.5 8zm11 0C16.12 8 15 9.12 15 10.5S16.12 13 17.5 13 20 11.88 20 10.5 18.88 8 17.5 8zm-5.5 4c-3.87 0-7 3.13-7 7 0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2 0-3.87-3.13-7-7-7z"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>,
    vaccine: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6.6 10.8l1.4-1.4L9.4 10.8l1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4L8 6.6 6.6 5.2 5.2 6.6l1.4 1.4L5.2 9.4l1.4 1.4zM17 5.4L14.6 3 3 14.6 5.4 17 17 5.4zm-2.6 9.6L13 13.6l-1.4 1.4 2.4 2.4-1.4 1.4L11.2 17l-1.4 1.4 2.4 2.4-1.4 1.4L8.4 19.8l1.4 1.4L11.2 20l1.4-1.4L11.2 17l1.4-1.4 1.4 1.4 1.4-1.4-1.4-1.4 1.4-1.4-1.4-1.4z"/></svg>,
    history: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>,
    close: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>,
    bell: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>,
    info: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>,
    weight: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 3c-1.2 5.4-5 6.9-5 11a5 5 0 0010 0c0-4.1-3.8-5.6-5-11zm0 15.5c-1.38 0-2.5-1.12-2.5-2.5 0-1.05.68-2.17 1.5-2.8v1.3c0 .55.45 1 1 1s1-.45 1-1v-1.3c.82.63 1.5 1.75 1.5 2.8 0 1.38-1.12 2.5-2.5 2.5z"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/></svg>,
    back: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2"/></svg>,
    dna: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M17.16 3H16v1h1V3zm-8 18H8v1h1.16L9 21zm-1-18H7v1h1.16L8 3zm8 18H15v1h1v-1zM5 7.5C5 11 7.69 14 11 14.93V17c0 1.1.9 2 2 2s2-.9 2-2v-2.07C18.31 14 21 11 21 7.5S18.31 1 15 1c-1.44 0-2.76.49-3.82 1.28C10.13 1.49 8.72 1 7 1 3.69 1 1 4 1 7.5S3.69 14 7 14.93V17c0 1.1.9 2 2 2s2-.9 2-2v-2.07C13.31 14 11 11 11 7.5S13.69 1 17 1"/></svg>,
    syringe: <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M18.5 2.5L16 5 19 8l2.5-2.5L18.5 2.5zM13 7L5 15l2 2-1 1 1 1 1-1 2 2 8-8L13 7zm-6.5 10L5 18.5 5.5 19 7 17.5 6.5 17z"/></svg>,
  };
  return icons[name] || null;
};

// ============================================================
// STYLES
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Fraunces:ital,wght@0,400;0,700;1,400&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #faf7f2;
    --surface: #ffffff;
    --surface2: #f5f0e8;
    --border: #e8e0d0;
    --text: #2d2418;
    --text2: #6b5d4f;
    --text3: #9e8c7a;
    --primary: #5b8a6f;
    --primary-light: #e8f3ed;
    --primary-dark: #3d6b52;
    --accent: #d4845a;
    --accent-light: #fdf0e8;
    --danger: #ef4444;
    --warning: #f59e0b;
    --success: #22c55e;
    --purple: #8b5cf6;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 2px 16px rgba(45,36,24,0.08);
    --shadow-lg: 0 8px 32px rgba(45,36,24,0.12);
    --font: 'Nunito', sans-serif;
    --font-display: 'Fraunces', serif;
    --nav-h: 72px;
  }
  
  body { font-family: var(--font); background: var(--bg); color: var(--text); overflow-x: hidden; }
  
  input, select, textarea {
    font-family: var(--font);
    background: var(--surface2);
    border: 1.5px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 14px;
    font-size: 15px;
    color: var(--text);
    width: 100%;
    outline: none;
    transition: border-color .2s;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--primary); background: var(--surface); }
  
  button { font-family: var(--font); cursor: pointer; border: none; }
  
  .btn-primary {
    background: var(--primary);
    color: white;
    padding: 12px 24px;
    border-radius: 50px;
    font-size: 15px;
    font-weight: 700;
    transition: all .2s;
    display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-primary:hover { background: var(--primary-dark); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91,138,111,.35); }
  .btn-primary:active { transform: translateY(0); }
  
  .btn-secondary {
    background: var(--surface2);
    color: var(--text2);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid var(--border);
    transition: all .2s;
  }
  .btn-secondary:hover { background: var(--border); }
  
  .btn-ghost {
    background: transparent;
    color: var(--text2);
    padding: 8px 16px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    transition: all .2s;
  }
  .btn-ghost:hover { background: var(--surface2); }
  
  .btn-danger {
    background: #fef2f2;
    color: var(--danger);
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 14px;
    font-weight: 600;
    border: 1.5px solid #fecaca;
    transition: all .2s;
  }
  .btn-danger:hover { background: #fee2e2; }
  
  .card {
    background: var(--surface);
    border-radius: var(--radius);
    border: 1.5px solid var(--border);
    box-shadow: var(--shadow);
  }
  
  .section-title {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 16px;
  }
  
  .badge {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .5px;
  }
  .badge-green { background: #dcfce7; color: #16a34a; }
  .badge-orange { background: #ffedd5; color: #c2410c; }
  .badge-red { background: #fee2e2; color: #dc2626; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }
  .badge-purple { background: #ede9fe; color: #7c3aed; }
  
  .divider { height: 1.5px; background: var(--border); margin: 16px 0; }
  
  /* ANIMATIONS */
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes slideIn { from { transform:translateX(100%); } to { transform:translateX(0); } }
  @keyframes scaleIn { from { opacity:0; transform:scale(.92); } to { opacity:1; transform:scale(1); } }
  @keyframes shimmer { 0%{background-position:-200px 0} 100%{background-position:calc(200px + 100%) 0} }
  
  .anim-fadeup { animation: fadeUp .4s ease both; }
  .anim-fadein { animation: fadeIn .3s ease both; }
  .anim-scale { animation: scaleIn .3s ease both; }
  
  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; z-index: 200;
    background: rgba(45,36,24,.45);
    backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center;
    padding: 16px;
    animation: fadeIn .2s ease;
  }
  .modal {
    background: var(--surface);
    border-radius: 24px;
    width: 100%; max-width: 540px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: scaleIn .25s ease;
  }
  
  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 13px; font-weight: 700; color: var(--text2); margin-bottom: 6px; text-transform: uppercase; letter-spacing: .5px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  @media (max-width: 480px) { .form-row { grid-template-columns: 1fr; } }
  
  /* NAV */
  .bottom-nav {
    position: fixed; bottom: 0; left: 0; right: 0;
    height: var(--nav-h);
    background: var(--surface);
    border-top: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: space-around;
    z-index: 100;
    padding-bottom: env(safe-area-inset-bottom);
  }
  .nav-item {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    padding: 8px 16px;
    border-radius: 14px;
    cursor: pointer;
    transition: all .2s;
    color: var(--text3);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .3px;
    min-width: 60px;
    background: transparent;
    border: none;
  }
  .nav-item.active { color: var(--primary); background: var(--primary-light); }
  .nav-item:hover:not(.active) { background: var(--surface2); }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
  
  /* TAG */
  .tag { display:inline-flex; align-items:center; background:var(--surface2); border:1px solid var(--border); border-radius:50px; padding:3px 10px; font-size:12px; font-weight:600; color:var(--text2); gap:4px; }
  
  /* EMPTY STATE */
  .empty-state { display:flex; flex-direction:column; align-items:center; justify-content:center; padding:60px 20px; text-align:center; gap:16px; }
  .empty-icon { font-size:64px; opacity:.5; }
  .empty-title { font-size:20px; font-weight:800; color:var(--text2); }
  .empty-sub { font-size:14px; color:var(--text3); max-width:260px; line-height:1.6; }
  
  /* ALERT ITEM */
  .alert-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 14px 16px;
    border-radius: var(--radius-sm);
    border-left: 4px solid;
    background: white;
    margin-bottom: 10px;
    animation: fadeUp .3s ease;
  }
  
  /* TIMELINE */
  .timeline-item { display:flex; gap:16px; padding:12px 0; position:relative; }
  .timeline-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:2px; }
  .timeline-line { position:absolute; left:17px; top:50px; bottom:-10px; width:2px; background:var(--border); }
  
  /* PROGRESS */
  .progress-bar { height:8px; background:var(--border); border-radius:50px; overflow:hidden; }
  .progress-fill { height:100%; border-radius:50px; transition:width .5s ease; }
  
  /* SCROLL AREA */
  .scroll-x { overflow-x:auto; scrollbar-width:none; -ms-overflow-style:none; }
  .scroll-x::-webkit-scrollbar { display:none; }
  
  /* PET CARD */
  .pet-card {
    background: white;
    border-radius: 20px;
    border: 1.5px solid var(--border);
    overflow: hidden;
    cursor: pointer;
    transition: all .25s;
    box-shadow: 0 2px 12px rgba(45,36,24,.06);
  }
  .pet-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(45,36,24,.12); border-color: var(--primary); }
  
  /* VACCINE ROW */
  .vaccine-row {
    display:flex; align-items:center; gap:12px;
    padding:12px 16px;
    border-radius:12px;
    border:1.5px solid var(--border);
    margin-bottom:10px;
    background:white;
    transition:all .2s;
  }
  .vaccine-row:hover { border-color:var(--primary); }
  
  /* HEADER */
  .page-header {
    background: var(--surface);
    border-bottom: 1.5px solid var(--border);
    padding: 20px 20px 16px;
    position: sticky;
    top: 0;
    z-index: 50;
  }
  
  .app-wrap {
    max-width: 600px;
    margin: 0 auto;
    min-height: 100vh;
    position: relative;
    background: var(--bg);
  }
  
  .page-content {
    padding: 20px;
    padding-bottom: calc(var(--nav-h) + 24px);
  }
  
  /* TOOLTIP */
  .tip { font-size:12px; color:var(--text3); margin-top:4px; }
  
  /* CHIP */
  .chip-group { display:flex; flex-wrap:wrap; gap:8px; }
  .chip {
    padding:6px 14px; border-radius:50px; font-size:13px; font-weight:600;
    border: 1.5px solid var(--border); background:var(--surface2);
    cursor:pointer; transition:all .15s; color:var(--text2);
  }
  .chip.active { background:var(--primary); border-color:var(--primary); color:white; }
  
  /* FLOATING ACTION */
  .fab {
    position:fixed; bottom:calc(var(--nav-h) + 20px); right:20px;
    width:56px; height:56px; border-radius:50%;
    background:var(--primary); color:white;
    display:flex; align-items:center; justify-content:center;
    box-shadow:0 4px 20px rgba(91,138,111,.5);
    cursor:pointer; border:none;
    transition:all .2s;
    z-index:80;
  }
  .fab:hover { background:var(--primary-dark); transform:scale(1.08); }
  .fab:active { transform:scale(.95); }
  
  /* GRID CARDS */
  .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  @media(max-width:360px) { .grid-2 { grid-template-columns:1fr; } }
  
  .stat-card {
    background:white; border-radius:16px; padding:16px;
    border:1.5px solid var(--border);
    display:flex; flex-direction:column; gap:4px;
  }
  .stat-card .value { font-size:24px; font-weight:800; color:var(--text); }
  .stat-card .label { font-size:12px; font-weight:600; color:var(--text3); text-transform:uppercase; letter-spacing:.5px; }
  
  /* SCROLLABLE CALENDAR */
  .cal-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:4px; }
  .cal-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; position:relative; }
  .cal-day.today { background:var(--primary); color:white; }
  .cal-day.has-event::after { content:''; position:absolute; bottom:4px; width:5px; height:5px; border-radius:50%; background:var(--accent); }
  .cal-day:hover:not(.today) { background:var(--surface2); }
  .cal-day.other-month { color:var(--text3); opacity:.5; }
`;

// ============================================================
// COMPONENTS
// ============================================================

const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
    <div className="modal" style={{ maxWidth: wide ? 620 : 540 }}>
      <div style={{ padding: "24px 24px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700 }}>{title}</h2>
        <button className="btn-ghost" onClick={onClose} style={{ padding: "6px", borderRadius: "50%" }}><Icon name="close" size={20} /></button>
      </div>
      <div style={{ padding: "20px 24px 24px" }}>{children}</div>
    </div>
  </div>
);

const Avatar = ({ pet, size = 64 }) => {
  const species = SPECIES_DATA[pet.species];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `linear-gradient(135deg, var(--primary-light), var(--surface2))`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.45, flexShrink: 0,
      border: "2.5px solid var(--border)",
      overflow: "hidden",
    }}>
      {pet.photo ? (
        <img src={pet.photo} alt={pet.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <span>{species?.icon || "🐾"}</span>
      )}
    </div>
  );
};

// ============================================================
// AUTH SCREENS
// ============================================================
const AuthScreen = ({ onLogin }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const appData = loadData();

  const handleSubmit = () => {
    setError("");
    if (!form.email || !form.password) { setError("Por favor completa todos los campos."); return; }
    if (mode === "register") {
      if (!form.name) { setError("Ingresa tu nombre."); return; }
      if (form.password !== form.confirm) { setError("Las contraseñas no coinciden."); return; }
      if (form.password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres."); return; }
      if (appData.users.find(u => u.email === form.email)) { setError("Este email ya está registrado."); return; }
      const user = { id: generateId(), name: form.name, email: form.email, password: form.password, pets: [], createdAt: new Date().toISOString() };
      appData.users.push(user);
      appData.currentUser = user.id;
      saveData(appData);
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(user); }, 600);
    } else {
      const user = appData.users.find(u => u.email === form.email && u.password === form.password);
      if (!user) { setError("Email o contraseña incorrectos."); return; }
      appData.currentUser = user.id;
      saveData(appData);
      setLoading(true);
      setTimeout(() => { setLoading(false); onLogin(user); }, 500);
    }
  };

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--bg)" }}>
      <style>{styles}</style>
      <div className="anim-fadeup" style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "linear-gradient(135deg, var(--primary), var(--primary-dark))",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px", fontSize: 36,
            boxShadow: "0 8px 24px rgba(91,138,111,.4)"
          }}>🐾</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 700, color: "var(--text)" }}>PetCare</h1>
          <p style={{ color: "var(--text3)", fontSize: 15, marginTop: 6 }}>Tu compañero de salud animal</p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {/* Tabs */}
          <div style={{ display: "flex", background: "var(--surface2)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[["login", "Ingresar"], ["register", "Registrarse"]].map(([key, label]) => (
              <button key={key} onClick={() => { setMode(key); setError(""); }}
                style={{ flex: 1, padding: "9px 0", borderRadius: 10, border: "none", fontFamily: "var(--font)", fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all .2s",
                  background: mode === key ? "white" : "transparent",
                  color: mode === key ? "var(--primary)" : "var(--text3)",
                  boxShadow: mode === key ? "0 2px 8px rgba(0,0,0,.08)" : "none"
                }}>{label}</button>
            ))}
          </div>

          {mode === "register" && (
            <div className="form-group">
              <label>Nombre</label>
              <input placeholder="Tu nombre" value={form.name} onChange={e => f("name")(e.target.value)} />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="correo@ejemplo.com" value={form.email} onChange={e => f("email")(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => f("password")(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
          </div>
          {mode === "register" && (
            <div className="form-group">
              <label>Confirmar Contraseña</label>
              <input type="password" placeholder="••••••••" value={form.confirm} onChange={e => f("confirm")(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSubmit()} />
            </div>
          )}

          {error && (
            <div style={{ padding: "10px 14px", borderRadius: 10, background: "#fee2e2", color: "#dc2626", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <button className="btn-primary" style={{ width: "100%" }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Cargando..." : mode === "login" ? "Ingresar" : "Crear Cuenta"}
          </button>

          {mode === "login" && (
            <p style={{ textAlign: "center", fontSize: 13, color: "var(--text3)", marginTop: 16 }}>
              ¿Demo? Email: <b>demo@pet.com</b> Pass: <b>123456</b>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// HOME SCREEN
// ============================================================
const HomeScreen = ({ user, pets, onSelectPet, onAddPet }) => {
  const now = new Date();
  const allAlerts = [];
  pets.forEach(pet => {
    const sp = SPECIES_DATA[pet.species];
    if (!sp) return;
    const birthMs = new Date(pet.birthDate).getTime();
    const ageMonths = Math.floor((now - birthMs) / (1000 * 60 * 60 * 24 * 30));
    sp.vaccines.forEach(vac => {
      if (ageMonths < vac.ageMonths) return;
      const applied = (pet.vaccinations || []).filter(v => v.vaccineName === vac.name);
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
            <p style={{ color: "rgba(255,255,255,.75)", fontSize: 14, fontWeight: 600 }}>{greeting()}, {user.name.split(" ")[0]}! 👋</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "white", fontWeight: 700, marginTop: 2 }}>PetCare</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {allAlerts.length > 0 && (
              <div style={{ position: "relative" }}>
                <div style={{ color: "rgba(255,255,255,.85)" }}><Icon name="bell" size={24} /></div>
                <div style={{ position: "absolute", top: -4, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, color: "white" }}>{allAlerts.length}</div>
              </div>
            )}
            <div style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <Icon name="user" size={20} />
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {[
            { label: "Mascotas", value: pets.length, icon: "🐾" },
            { label: "Alertas", value: allAlerts.filter(a => a.type === "danger").length, icon: "🔴" },
            { label: "Próx. 30d", value: allAlerts.filter(a => a.type !== "danger" && a.days >= 0).length, icon: "📅" },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: "rgba(255,255,255,.15)", backdropFilter: "blur(8px)", borderRadius: 14, padding: "10px 14px", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "white" }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,.7)", fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="page-content">
        {/* Alerts */}
        {allAlerts.length > 0 && (
          <div style={{ marginBottom: 24 }}>
            <h2 className="section-title">⚠️ Alertas Activas</h2>
            {allAlerts.slice(0, 4).map((a, i) => (
              <div key={i} className="alert-item anim-fadeup" style={{ borderLeftColor: a.type === "danger" ? "var(--danger)" : a.type === "warning" ? "var(--warning)" : "var(--primary)", animationDelay: `${i * 0.05}s` }}
                onClick={() => onSelectPet(a.pet)}>
                <Avatar pet={a.pet} size={40} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 14 }}>{a.text}</p>
                  <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>
                    {a.days < 0 ? "⏰ Pendiente / Vencida" : `📅 En ${a.days} días — ${formatDate(a.date)}`}
                  </p>
                </div>
                <span className="badge" style={{ background: a.type === "danger" ? "#fee2e2" : a.type === "warning" ? "#fef3c7" : "#dcfce7", color: a.type === "danger" ? "#dc2626" : a.type === "warning" ? "#b45309" : "#16a34a", whiteSpace: "nowrap" }}>
                  {a.days < 0 ? "Vencida" : `${a.days}d`}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* My Pets */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <h2 className="section-title" style={{ margin: 0 }}>Mis Mascotas</h2>
          <button className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }} onClick={onAddPet}>
            <Icon name="plus" size={16} /> Añadir
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="empty-state card anim-scale">
            <div className="empty-icon">🐾</div>
            <div className="empty-title">Aún no hay mascotas</div>
            <div className="empty-sub">Agrega tu primera mascota para comenzar a llevar su historial de salud</div>
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
                        <h3 style={{ fontSize: 20, fontWeight: 800, color: "var(--text)" }}>{pet.name}</h3>
                        {petAlerts > 0 && <span className="badge badge-red">🔔 {petAlerts}</span>}
                      </div>
                      <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 2 }}>
                        {sp?.icon} {sp?.label} {pet.breed ? `• ${pet.breed}` : ""}
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                        {pet.birthDate && <span className="tag">🎂 {calcAge(pet.birthDate)}</span>}
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
const PetForm = ({ pet, onSave, onClose }) => {
  const isEdit = !!pet;
  const [form, setForm] = useState(pet || {
    id: generateId(), name: "", species: "perro", breed: "", birthDate: "", sex: "", weight: "", photo: "", healthStatus: "bueno", notes: "",
  });
  const [photoPreview, setPhotoPreview] = useState(pet?.photo || "");

  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const sp = SPECIES_DATA[form.species];

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPhotoPreview(ev.target.result); setForm(p => ({ ...p, photo: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.name.trim()) { alert("Por favor ingresa el nombre de tu mascota"); return; }
    onSave(form);
  };

  return (
    <Modal title={isEdit ? "✏️ Editar Mascota" : "🐾 Nueva Mascota"} onClose={onClose}>
      {/* Photo */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <label style={{ cursor: "pointer", textAlign: "center" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--surface2)", border: "3px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", transition: "all .2s" }}>
            {photoPreview ? <img src={photoPreview} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 36 }}>{sp?.icon || "🐾"}</span>}
          </div>
          <p style={{ fontSize: 12, color: "var(--primary)", fontWeight: 700, marginTop: 8 }}>📷 Subir foto</p>
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        </label>
      </div>

      <div className="form-group">
        <label>Nombre *</label>
        <input placeholder="Ej: Luna, Max, Coco..." value={form.name} onChange={e => f("name")(e.target.value)} />
      </div>

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
          <input type="date" value={form.birthDate} onChange={e => f("birthDate")(e.target.value)} max={new Date().toISOString().split("T")[0]} />
          {form.birthDate && <p className="tip">Edad: {calcAge(form.birthDate)}</p>}
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
        <div className="form-group">
          <label>Peso (kg)</label>
          <input type="number" step="0.1" min="0" placeholder="Ej: 5.2" value={form.weight} onChange={e => f("weight")(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Estado de salud</label>
          <select value={form.healthStatus} onChange={e => f("healthStatus")(e.target.value)}>
            <option value="excelente">✅ Excelente</option>
            <option value="bueno">🟢 Bueno</option>
            <option value="regular">🟡 Regular</option>
            <option value="malo">🔴 Malo</option>
            <option value="critico">🆘 Crítico</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label>Observaciones</label>
        <textarea rows={3} placeholder="Notas adicionales, condiciones especiales..." value={form.notes} onChange={e => f("notes")(e.target.value)} style={{ resize: "vertical" }} />
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={handleSave}><Icon name="check" size={18} /> {isEdit ? "Guardar Cambios" : "Agregar Mascota"}</button>
      </div>
    </Modal>
  );
};

// ============================================================
// PET DETAIL
// ============================================================
const PetDetail = ({ pet, onUpdate, onDelete, onBack }) => {
  const [tab, setTab] = useState("info");
  const [showEdit, setShowEdit] = useState(false);
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [showAddHistory, setShowAddHistory] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const sp = SPECIES_DATA[pet.species];
  const breedInfo = sp?.breeds.find(b => b.name === pet.breed);
  const now = new Date();
  const birthMs = new Date(pet.birthDate).getTime();
  const ageMonths = pet.birthDate ? Math.floor((now - birthMs) / (1000 * 60 * 60 * 24 * 30)) : 0;

  const TABS = [
    { id: "info", label: "Info", icon: "info" },
    { id: "vaccines", label: "Vacunas", icon: "syringe" },
    { id: "history", label: "Historial", icon: "history" },
  ];

  const handleSaveEdit = (updated) => { onUpdate(updated); setShowEdit(false); };
  const handleSaveVaccine = (v) => {
    const updated = { ...pet, vaccinations: [...(pet.vaccinations || []), { ...v, id: generateId(), date: v.date || new Date().toISOString().split("T")[0] }] };
    onUpdate(updated);
    setShowAddVaccine(false);
  };
  const handleSaveHistory = (h) => {
    const updated = { ...pet, medicalHistory: [...(pet.medicalHistory || []), { ...h, id: generateId(), date: h.date || new Date().toISOString().split("T")[0] }] };
    onUpdate(updated);
    setShowAddHistory(false);
  };
  const deleteVaccine = (id) => onUpdate({ ...pet, vaccinations: (pet.vaccinations || []).filter(v => v.id !== id) });
  const deleteHistory = (id) => onUpdate({ ...pet, medicalHistory: (pet.medicalHistory || []).filter(h => h.id !== id) });

  const healthColors = { excelente: "#22c55e", bueno: "#22c55e", regular: "#f59e0b", malo: "#ef4444", critico: "#9b1c1c" };
  const healthIcons = { excelente: "✅", bueno: "🟢", regular: "🟡", malo: "🔴", critico: "🆘" };

  return (
    <div>
      <style>{styles}</style>
      {/* Header */}
      <div style={{ background: "linear-gradient(160deg, var(--primary-dark), var(--primary) 60%, var(--surface2) 100%)", padding: "24px 20px 0" }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 38, height: 38, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white", marginBottom: 20 }}>
          <Icon name="back" size={20} color="white" />
        </button>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", paddingBottom: 24 }}>
          <Avatar pet={pet} size={90} />
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <h1 style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "white", fontWeight: 700 }}>{pet.name}</h1>
              <span style={{ fontSize: 22 }}>{healthIcons[pet.healthStatus] || "🟢"}</span>
            </div>
            <p style={{ color: "rgba(255,255,255,.85)", fontSize: 14, marginTop: 4 }}>
              {sp?.icon} {sp?.label} {pet.breed ? `• ${pet.breed}` : ""}
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {pet.birthDate && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>🎂 {calcAge(pet.birthDate)}</span>}
              {pet.weight && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>⚖️ {pet.weight}kg</span>}
              {pet.sex && <span style={{ background: "rgba(255,255,255,.2)", color: "white", padding: "4px 10px", borderRadius: 50, fontSize: 12, fontWeight: 700 }}>{pet.sex === "macho" ? "♂" : "♀"} {pet.sex}</span>}
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} style={{ background: "rgba(255,255,255,.2)", border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "white" }}>
            <Icon name="edit" size={18} color="white" />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", background: "rgba(0,0,0,.15)", borderRadius: "16px 16px 0 0", padding: "4px 4px 0" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: "10px 8px", border: "none", cursor: "pointer", fontFamily: "var(--font)", fontWeight: 700, fontSize: 13, borderRadius: "12px 12px 0 0", transition: "all .2s",
              background: tab === t.id ? "white" : "transparent",
              color: tab === t.id ? "var(--primary)" : "rgba(255,255,255,.75)"
            }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="page-content">
        {/* INFO TAB */}
        {tab === "info" && (
          <div className="anim-fadeup">
            {/* Breed Info */}
            {breedInfo && (
              <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}><span>🧬</span> Información de Raza</h3>
                <div className="grid-2">
                  {[
                    ["📏 Tamaño", breedInfo.size],
                    ["⏳ Esperanza de vida", breedInfo.lifespan],
                    ["⚡ Actividad", breedInfo.activity],
                    ["💭 Carácter", breedInfo.character],
                  ].map(([label, value]) => (
                    <div key={label} style={{ background: "var(--surface2)", borderRadius: 12, padding: 12 }}>
                      <p style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text)", marginTop: 2 }}>{value}</p>
                    </div>
                  ))}
                </div>
                {breedInfo.specialCare && (
                  <div style={{ marginTop: 12, padding: 12, background: "#e8f3ed", borderRadius: 12, borderLeft: "4px solid var(--primary)" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "var(--primary-dark)", marginBottom: 4 }}>🌿 CUIDADOS ESPECIALES</p>
                    <p style={{ fontSize: 14, color: "var(--text2)" }}>{breedInfo.specialCare}</p>
                  </div>
                )}
                {breedInfo.commonDiseases?.length > 0 && (
                  <div style={{ marginTop: 10, padding: 12, background: "#fdf0e8", borderRadius: 12, borderLeft: "4px solid var(--accent)" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#c2410c", marginBottom: 6 }}>⚠️ ENFERMEDADES COMUNES</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {breedInfo.commonDiseases.map(d => <span key={d} className="tag" style={{ fontSize: 12 }}>{d}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Health Status */}
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>💊 Estado de Salud</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", background: "var(--surface2)", borderRadius: 12 }}>
                <span style={{ fontSize: 32 }}>{healthIcons[pet.healthStatus] || "🟢"}</span>
                <div>
                  <p style={{ fontSize: 18, fontWeight: 800, color: healthColors[pet.healthStatus] || "var(--success)", textTransform: "capitalize" }}>{pet.healthStatus || "Bueno"}</p>
                  <p style={{ fontSize: 13, color: "var(--text3)" }}>Estado general actual</p>
                </div>
              </div>
              {pet.notes && (
                <div style={{ marginTop: 12, padding: 12, background: "var(--surface2)", borderRadius: 12 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", marginBottom: 4 }}>📝 OBSERVACIONES</p>
                  <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.6 }}>{pet.notes}</p>
                </div>
              )}
            </div>

            {/* Vaccine Summary */}
            <div className="card" style={{ padding: 20, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>💉 Resumen Vacunas</h3>
              {(sp?.vaccines || []).map(vac => {
                if (ageMonths < vac.ageMonths && !pet.vaccinations?.find(v => v.vaccineName === vac.name)) return null;
                const applied = (pet.vaccinations || []).filter(v => v.vaccineName === vac.name).sort((a, b) => new Date(b.date) - new Date(a.date));
                const hasAny = applied.length > 0;
                const nextDate = hasAny ? addMonths(applied[0].date, vac.intervalMonths) : null;
                const days = nextDate ? daysUntil(nextDate) : null;
                return (
                  <div key={vac.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: hasAny ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span>{hasAny ? "✅" : "❌"}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 14 }}>{vac.name}</p>
                      <p style={{ fontSize: 12, color: "var(--text3)" }}>
                        {hasAny ? `Última: ${formatDate(applied[0].date)} • Próx: ${formatDate(nextDate)}` : "Pendiente"}
                      </p>
                    </div>
                    <span className="badge" style={{ fontSize: 11 }}>
                      {vac.type === "obligatoria" ? <span className="badge badge-red">Obligatoria</span> : <span className="badge badge-blue">Opcional</span>}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Danger zone */}
            <div className="card" style={{ padding: 20, border: "1.5px solid #fecaca" }}>
              <h3 style={{ fontWeight: 800, fontSize: 15, color: "var(--danger)", marginBottom: 12 }}>⚠️ Zona de peligro</h3>
              <button className="btn-danger" style={{ width: "100%" }} onClick={() => setConfirmDelete(true)}>
                <Icon name="trash" size={16} /> Eliminar Mascota
              </button>
            </div>
          </div>
        )}

        {/* VACCINES TAB */}
        {tab === "vaccines" && (
          <div className="anim-fadeup">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 className="section-title" style={{ margin: 0 }}>Vacunas y Procedimientos</h2>
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddVaccine(true)}>
                <Icon name="plus" size={16} /> Registrar
              </button>
            </div>

            {/* Scheduled */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>📋 Calendario según especie</p>
              {(sp?.vaccines || []).map(vac => {
                const applied = (pet.vaccinations || []).filter(v => v.vaccineName === vac.name).sort((a, b) => new Date(b.date) - new Date(a.date));
                const hasAny = applied.length > 0;
                const nextDate = hasAny ? addMonths(applied[0].date, vac.intervalMonths) : null;
                const days = nextDate ? daysUntil(nextDate) : null;
                const color = !hasAny ? "#ef4444" : days < 0 ? "#ef4444" : days <= 30 ? "#f59e0b" : "#22c55e";
                return (
                  <div key={vac.name} className="vaccine-row">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: hasAny ? "#dcfce7" : "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                      {hasAny ? "💉" : "⏳"}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <p style={{ fontWeight: 700, fontSize: 15 }}>{vac.name}</p>
                        {vac.type === "obligatoria" ? <span className="badge badge-red" style={{ fontSize: 10 }}>Obligatoria</span> : <span className="badge badge-blue" style={{ fontSize: 10 }}>Opcional</span>}
                      </div>
                      <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>{vac.description}</p>
                      {hasAny && <p style={{ fontSize: 12, fontWeight: 600, color, marginTop: 3 }}>
                        Última: {formatDate(applied[0].date)} • Próx: {formatDate(nextDate)} {days >= 0 ? `(${days}d)` : "(vencida)"}
                      </p>}
                      {!hasAny && <p style={{ fontSize: 12, fontWeight: 600, color: "#ef4444", marginTop: 3 }}>⚠️ No registrada</p>}
                    </div>
                  </div>
                );
              })}
              {(!sp?.vaccines || sp.vaccines.length === 0) && <p style={{ color: "var(--text3)", fontSize: 14, textAlign: "center", padding: 20 }}>No hay vacunas definidas para esta especie</p>}
            </div>

            {/* Applied */}
            {(pet.vaccinations || []).length > 0 && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: ".5px" }}>📝 Vacunas Aplicadas</p>
                {[...(pet.vaccinations || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).map(v => (
                  <div key={v.id} className="vaccine-row" style={{ alignItems: "flex-start" }}>
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: "#dcfce7", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>💉</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 700, fontSize: 15 }}>{v.vaccineName}</p>
                      <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>📅 {formatDate(v.date)}</p>
                      {v.vet && <p style={{ fontSize: 12, color: "var(--text3)" }}>🏥 {v.vet}</p>}
                      {v.nextDate && <p style={{ fontSize: 12, color: "var(--primary)", fontWeight: 600 }}>📌 Próxima: {formatDate(v.nextDate)}</p>}
                      {v.notes && <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2, fontStyle: "italic" }}>{v.notes}</p>}
                    </div>
                    <button onClick={() => deleteVaccine(v.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 6 }}>
                      <Icon name="trash" size={16} />
                    </button>
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
              <button className="btn-primary" style={{ padding: "8px 14px", fontSize: 13 }} onClick={() => setShowAddHistory(true)}>
                <Icon name="plus" size={16} /> Agregar
              </button>
            </div>

            {(pet.medicalHistory || []).length === 0 ? (
              <div className="empty-state card">
                <div className="empty-icon">📋</div>
                <div className="empty-title">Sin historial</div>
                <div className="empty-sub">Agrega eventos médicos, enfermedades, procedimientos y observaciones</div>
                <button className="btn-primary" onClick={() => setShowAddHistory(true)}><Icon name="plus" size={16} /> Agregar Evento</button>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                {[...(pet.medicalHistory || [])].sort((a, b) => new Date(b.date) - new Date(a.date)).map((h, i, arr) => {
                  const typeColors = { vacuna: "#22c55e", enfermedad: "#ef4444", procedimiento: "#8b5cf6", control: "#3b82f6", observacion: "#f59e0b", desparasitacion: "#06b6d4" };
                  const typeIcons = { vacuna: "💉", enfermedad: "🤒", procedimiento: "🔬", control: "🩺", observacion: "📝", desparasitacion: "🪱" };
                  const color = typeColors[h.type] || "#9e8c7a";
                  return (
                    <div key={h.id} className="timeline-item">
                      {i < arr.length - 1 && <div className="timeline-line" />}
                      <div className="timeline-dot" style={{ background: `${color}20`, border: `2px solid ${color}` }}>
                        <span style={{ fontSize: 16 }}>{typeIcons[h.type] || "📝"}</span>
                      </div>
                      <div style={{ flex: 1, background: "white", borderRadius: 14, padding: 14, border: "1.5px solid var(--border)", marginBottom: 4 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <p style={{ fontWeight: 800, fontSize: 15, color: "var(--text)" }}>{h.title}</p>
                            <p style={{ fontSize: 12, color, fontWeight: 600, marginTop: 2, textTransform: "capitalize" }}>{h.type}</p>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 600 }}>{formatDate(h.date)}</span>
                            <button onClick={() => deleteHistory(h.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text3)", padding: 2 }}>
                              <Icon name="trash" size={14} />
                            </button>
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

      {/* Modals */}
      {showEdit && <PetForm pet={pet} onSave={handleSaveEdit} onClose={() => setShowEdit(false)} />}
      {showAddVaccine && <VaccineForm pet={pet} onSave={handleSaveVaccine} onClose={() => setShowAddVaccine(false)} />}
      {showAddHistory && <HistoryForm onSave={handleSaveHistory} onClose={() => setShowAddHistory(false)} />}
      {confirmDelete && (
        <Modal title="⚠️ Confirmar eliminación" onClose={() => setConfirmDelete(false)}>
          <p style={{ color: "var(--text2)", marginBottom: 20, lineHeight: 1.6 }}>¿Estás seguro que deseas eliminar a <b>{pet.name}</b>? Esta acción no se puede deshacer y se eliminará todo su historial médico.</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>Cancelar</button>
            <button className="btn-danger" onClick={() => { onDelete(pet.id); setConfirmDelete(false); }}>Sí, eliminar</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ============================================================
// VACCINE FORM
// ============================================================
const VaccineForm = ({ pet, onSave, onClose }) => {
  const sp = SPECIES_DATA[pet.species];
  const [form, setForm] = useState({ vaccineName: "", date: new Date().toISOString().split("T")[0], vet: "", nextDate: "", notes: "", type: "obligatoria" });
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  return (
    <Modal title="💉 Registrar Vacuna" onClose={onClose}>
      <div className="form-group">
        <label>Vacuna *</label>
        <select value={form.vaccineName} onChange={e => {
          const vac = sp?.vaccines.find(v => v.name === e.target.value);
          if (vac) {
            const next = addMonths(form.date, vac.intervalMonths);
            setForm(p => ({ ...p, vaccineName: e.target.value, type: vac.type, nextDate: next.toISOString().split("T")[0] }));
          } else f("vaccineName")(e.target.value);
        }}>
          <option value="">Seleccionar o escribir...</option>
          {sp?.vaccines.map(v => <option key={v.name} value={v.name}>{v.name}</option>)}
          <option value="__other__">Otra vacuna...</option>
        </select>
        {form.vaccineName === "__other__" && (
          <input placeholder="Nombre de la vacuna" value={form.customName || ""} onChange={e => f("customName")(e.target.value)} style={{ marginTop: 8 }} />
        )}
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha de aplicación *</label>
          <input type="date" value={form.date} onChange={e => f("date")(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Próxima dosis</label>
          <input type="date" value={form.nextDate} onChange={e => f("nextDate")(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Veterinaria / Clínica</label>
        <input placeholder="Nombre de la clínica o veterinario" value={form.vet} onChange={e => f("vet")(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Notas</label>
        <textarea rows={2} placeholder="Observaciones adicionales..." value={form.notes} onChange={e => f("notes")(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={() => {
          const name = form.vaccineName === "__other__" ? form.customName : form.vaccineName;
          if (!name) { alert("Ingresa el nombre de la vacuna"); return; }
          onSave({ ...form, vaccineName: name });
        }}><Icon name="check" size={18} /> Guardar</button>
      </div>
    </Modal>
  );
};

// ============================================================
// HISTORY FORM
// ============================================================
const HistoryForm = ({ onSave, onClose, event }) => {
  const [form, setForm] = useState(event || { title: "", type: "control", date: new Date().toISOString().split("T")[0], vet: "", description: "" });
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));
  const TYPES = [
    { value: "vacuna", label: "💉 Vacuna" }, { value: "enfermedad", label: "🤒 Enfermedad" },
    { value: "procedimiento", label: "🔬 Procedimiento" }, { value: "control", label: "🩺 Control médico" },
    { value: "desparasitacion", label: "🪱 Desparasitación" }, { value: "observacion", label: "📝 Observación" },
  ];
  return (
    <Modal title="📋 Agregar al Historial" onClose={onClose}>
      <div className="form-group">
        <label>Tipo de evento</label>
        <div className="chip-group">
          {TYPES.map(t => <span key={t.value} className={`chip ${form.type === t.value ? "active" : ""}`} onClick={() => f("type")(t.value)}>{t.label}</span>)}
        </div>
      </div>
      <div className="form-group">
        <label>Título *</label>
        <input placeholder="Ej: Cirugía de cadera, Gastroenteritis..." value={form.title} onChange={e => f("title")(e.target.value)} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Fecha</label>
          <input type="date" value={form.date} onChange={e => f("date")(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Veterinaria</label>
          <input placeholder="Clínica..." value={form.vet} onChange={e => f("vet")(e.target.value)} />
        </div>
      </div>
      <div className="form-group">
        <label>Descripción</label>
        <textarea rows={3} placeholder="Detalles del evento..." value={form.description} onChange={e => f("description")(e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
        <button className="btn-secondary" onClick={onClose}>Cancelar</button>
        <button className="btn-primary" onClick={() => { if (!form.title.trim()) { alert("Ingresa un título"); return; } onSave(form); }}><Icon name="check" size={18} /> Guardar</button>
      </div>
    </Modal>
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
    sp.vaccines.forEach(vac => {
      const applied = (pet.vaccinations || []).filter(v => v.vaccineName === vac.name).sort((a, b) => new Date(b.date) - new Date(a.date));
      if (applied.length > 0) {
        const nextDate = addMonths(applied[0].date, vac.intervalMonths);
        allEvents.push({ pet, date: nextDate, label: `${pet.name}: ${vac.name}`, type: "vaccine" });
      }
    });
    (pet.vaccinations || []).forEach(v => {
      if (v.nextDate) allEvents.push({ pet, date: new Date(v.nextDate), label: `${pet.name}: ${v.vaccineName}`, type: "vaccine" });
    });
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const eventDays = {};
  allEvents.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      const key = d.getDate();
      if (!eventDays[key]) eventDays[key] = [];
      eventDays[key].push(ev);
    }
  });

  const selectedEvents = selectedDay ? (eventDays[selectedDay] || []) : [];

  const upcoming = allEvents.filter(e => daysUntil(e.date) >= 0 && daysUntil(e.date) <= 60).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>📅 Calendario</h1>
        <p style={{ color: "var(--text3)", fontSize: 13, marginTop: 2 }}>{pets.length} mascota{pets.length !== 1 ? "s" : ""} registrada{pets.length !== 1 ? "s" : ""}</p>
      </div>
      <div className="page-content">
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button className="btn-ghost" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>‹</button>
            <h2 style={{ fontWeight: 800, fontSize: 18, textTransform: "capitalize" }}>
              {currentDate.toLocaleDateString("es-CL", { month: "long", year: "numeric" })}
            </h2>
            <button className="btn-ghost" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>›</button>
          </div>

          {/* Day names */}
          <div className="cal-grid" style={{ marginBottom: 8 }}>
            {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 700, color: "var(--text3)", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Days */}
          <div className="cal-grid">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} className="cal-day other-month" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
              const hasEv = !!eventDays[day];
              const isSelected = selectedDay === day;
              return (
                <div key={day} className={`cal-day${isToday ? " today" : ""}${hasEv ? " has-event" : ""}`}
                  style={{ background: isSelected && !isToday ? "var(--primary-light)" : undefined, color: isSelected && !isToday ? "var(--primary)" : undefined, fontWeight: (isToday || isSelected) ? 800 : 600 }}
                  onClick={() => setSelectedDay(isSelected ? null : day)}>
                  {day}
                </div>
              );
            })}
          </div>

          {/* Selected events */}
          {selectedDay && (
            <div style={{ marginTop: 16, padding: "12px 14px", background: "var(--surface2)", borderRadius: 12 }}>
              <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>📅 {selectedDay} de {currentDate.toLocaleDateString("es-CL", { month: "long" })}</p>
              {selectedEvents.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--text3)" }}>Sin eventos este día</p>
              ) : selectedEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}>
                  <Avatar pet={ev.pet} size={28} />
                  <p style={{ fontSize: 13, fontWeight: 600 }}>{ev.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        <h2 className="section-title">⏰ Próximos 60 días</h2>
        {upcoming.length === 0 ? (
          <div className="empty-state card"><div className="empty-icon">🎉</div><div className="empty-title">¡Todo al día!</div><div className="empty-sub">No hay eventos pendientes en los próximos 60 días</div></div>
        ) : upcoming.map((ev, i) => {
          const d = daysUntil(ev.date);
          return (
            <div key={i} className="alert-item anim-fadeup" style={{ borderLeftColor: getUrgencyColor(d), animationDelay: `${i * .05}s` }}>
              <Avatar pet={ev.pet} size={40} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 14 }}>{ev.label}</p>
                <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 2 }}>📅 {formatDate(ev.date)}</p>
              </div>
              <span className="badge" style={{ background: `${getUrgencyColor(d)}20`, color: getUrgencyColor(d), fontWeight: 800, fontSize: 12 }}>
                {d === 0 ? "Hoy" : `${d}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================
// PROFILE SCREEN
// ============================================================
const ProfileScreen = ({ user, onUpdate, onLogout }) => {
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ name: user.name, email: user.email });
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    onUpdate({ ...user, ...form });
    setEdit(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 700 }}>👤 Mi Perfil</h1>
      </div>
      <div className="page-content">
        <div className="card" style={{ padding: 24, marginBottom: 16, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--primary), var(--primary-dark))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: 32, color: "white", fontWeight: 800 }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700 }}>{user.name}</h2>
          <p style={{ color: "var(--text3)", fontSize: 14, marginTop: 4 }}>{user.email}</p>
          <p style={{ fontSize: 12, color: "var(--text3)", marginTop: 6 }}>Miembro desde {formatDate(user.createdAt)}</p>
        </div>

        {!edit ? (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontWeight: 800, fontSize: 16 }}>Información Personal</h3>
              <button className="btn-ghost" onClick={() => setEdit(true)} style={{ padding: "6px 12px" }}><Icon name="edit" size={16} /> Editar</button>
            </div>
            {[["Nombre", user.name], ["Email", user.email]].map(([label, value]) => (
              <div key={label} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)" }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: ".5px" }}>{label}</p>
                <p style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>{value}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 16 }}>Editar Perfil</h3>
            <div className="form-group"><label>Nombre</label><input value={form.name} onChange={e => f("name")(e.target.value)} /></div>
            <div className="form-group"><label>Email</label><input value={form.email} onChange={e => f("email")(e.target.value)} /></div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setEdit(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleSave}><Icon name="check" size={16} /> Guardar</button>
            </div>
          </div>
        )}

        {/* App info */}
        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontWeight: 800, fontSize: 16, marginBottom: 14 }}>Acerca de PetCare</h3>
          {[["Versión", "1.0.0 MVP"], ["Plataforma", "PWA / Web"], ["Datos", "Almacenamiento local seguro"]].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 14, color: "var(--text2)", fontWeight: 600 }}>{k}</span>
              <span style={{ fontSize: 14, color: "var(--text3)" }}>{v}</span>
            </div>
          ))}
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
  const [appData, setAppData] = useState(loadData);
  const [currentUser, setCurrentUser] = useState(null);
  const [tab, setTab] = useState("home");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showAddPet, setShowAddPet] = useState(false);

  // Init demo user
  useEffect(() => {
    const data = loadData();
    if (data.users.length === 0) {
      const demo = {
        id: "demo", name: "Usuario Demo", email: "demo@pet.com", password: "123456",
        pets: [
          {
            id: "pet1", name: "Luna", species: "perro", breed: "Labrador Retriever",
            birthDate: "2021-03-15", sex: "hembra", weight: "22", healthStatus: "excelente",
            notes: "Le encantan los paseos al parque", photo: "",
            vaccinations: [
              { id: "v1", vaccineName: "Polivalente (DA2PP)", date: "2024-03-15", vet: "Clínica VetSalud", nextDate: "2025-03-15", notes: "" },
              { id: "v2", vaccineName: "Rabia", date: "2024-04-01", vet: "Clínica VetSalud", nextDate: "2025-04-01", notes: "" },
            ],
            medicalHistory: [
              { id: "h1", title: "Control anual", type: "control", date: "2024-03-15", vet: "Dr. Rodríguez", description: "Examen físico completo, todo en orden. Peso estable." },
              { id: "h2", title: "Gastroenteritis leve", type: "enfermedad", date: "2023-09-10", vet: "Clínica VetSalud", description: "Tratamiento con metronidazol 3 días. Recuperación completa." },
            ]
          },
          {
            id: "pet2", name: "Mishi", species: "gato", breed: "Doméstico / Sin raza",
            birthDate: "2020-07-20", sex: "macho", weight: "4.5", healthStatus: "bueno",
            notes: "Gato indoor, muy tranquilo", photo: "",
            vaccinations: [],
            medicalHistory: [
              { id: "h3", title: "Esterilización", type: "procedimiento", date: "2020-12-10", vet: "Clínica Gatitos", description: "Castración sin complicaciones." },
            ]
          }
        ],
        createdAt: new Date().toISOString()
      };
      data.users.push(demo);
      saveData(data);
    }
    if (data.currentUser) {
      const u = data.users.find(x => x.id === data.currentUser);
      if (u) setCurrentUser(u);
    }
    setAppData(data);
  }, []);

  const saveUser = useCallback((updatedUser) => {
    const data = loadData();
    const idx = data.users.findIndex(u => u.id === updatedUser.id);
    if (idx >= 0) data.users[idx] = updatedUser;
    saveData(data);
    setCurrentUser(updatedUser);
    setAppData(data);
  }, []);

  const handleLogin = (user) => { setCurrentUser(user); };
  const handleLogout = () => {
    const data = loadData();
    data.currentUser = null;
    saveData(data);
    setCurrentUser(null);
    setSelectedPet(null);
    setTab("home");
  };

  const handleAddPet = (petData) => {
    const updated = { ...currentUser, pets: [...(currentUser.pets || []), petData] };
    saveUser(updated);
    setShowAddPet(false);
  };

  const handleUpdatePet = (petData) => {
    const updated = { ...currentUser, pets: currentUser.pets.map(p => p.id === petData.id ? petData : p) };
    saveUser(updated);
    if (selectedPet?.id === petData.id) setSelectedPet(petData);
  };

  const handleDeletePet = (petId) => {
    const updated = { ...currentUser, pets: currentUser.pets.filter(p => p.id !== petId) };
    saveUser(updated);
    setSelectedPet(null);
  };

  const handleUpdateUser = (u) => saveUser(u);

  const pets = currentUser?.pets || [];

  if (!currentUser) return (
    <>
      <style>{styles}</style>
      <AuthScreen onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app-wrap">
        {selectedPet ? (
          <div className="anim-fadein" style={{ paddingBottom: 0 }}>
            <PetDetail
              pet={pets.find(p => p.id === selectedPet.id) || selectedPet}
              onUpdate={handleUpdatePet}
              onDelete={handleDeletePet}
              onBack={() => setSelectedPet(null)}
            />
          </div>
        ) : (
          <div className="anim-fadein">
            {tab === "home" && <HomeScreen user={currentUser} pets={pets} onSelectPet={setSelectedPet} onAddPet={() => setShowAddPet(true)} />}
            {tab === "calendar" && <CalendarScreen pets={pets} />}
            {tab === "profile" && <ProfileScreen user={currentUser} onUpdate={handleUpdateUser} onLogout={handleLogout} />}
          </div>
        )}

        {!selectedPet && (
          <nav className="bottom-nav">
            {[
              { id: "home", label: "Inicio", icon: "home" },
              { id: "calendar", label: "Calendario", icon: "calendar" },
              { id: "profile", label: "Perfil", icon: "user" },
            ].map(n => (
              <button key={n.id} className={`nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <Icon name={n.icon} size={22} />
                {n.label}
              </button>
            ))}
          </nav>
        )}

        {tab === "home" && !selectedPet && (
          <button className="fab" onClick={() => setShowAddPet(true)}>
            <Icon name="plus" size={28} color="white" />
          </button>
        )}

        {showAddPet && <PetForm onSave={handleAddPet} onClose={() => setShowAddPet(false)} />}
      </div>
    </>
  );
}
