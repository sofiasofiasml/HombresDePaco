import { useState, useEffect, useRef } from 'react';
import type {
  TabId,
  Suspect,
  Evidence,
  Accusation,
} from './types';
import {
  CASE_METADATA,
  SUSPECTS,
  EVIDENCES,
  TIMELINE_SLOTS,
  TIMELINE_OPTIONS,
  ACCUSATION_OPTIONS,
  CORRECT_ACCUSATION,
  RESOLUTION_DIALOGUE,
} from './caseData';
import { soundEngine } from './soundEngine';

const NOTES_STORAGE_KEY = 'expediente_404_sa_notes_v2';
const MIN_EVIDENCES_TO_ACCUSE = 3;

const PHOTO_MAP: Record<string, string> = {
  paco: `${import.meta.env.BASE_URL}personajes/paco.jpg`,
  mariano: `${import.meta.env.BASE_URL}personajes/mariano.jpg`,
  lucas: `${import.meta.env.BASE_URL}personajes/lucas.jpg`,
  curtis: `${import.meta.env.BASE_URL}personajes/quique.jpg`,
};

const GROUP_PHOTO = `${import.meta.env.BASE_URL}equipo-paco.jpg`;

function SuspectPortraitSvg({ avatar, name }: { avatar: string; name?: string }) {
  const photoUrl = PHOTO_MAP[avatar];
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name || avatar}
        className="polaroid-img"
      />
    );
  }
  if (avatar === 'paco') {
    return (
      <svg viewBox="0 0 160 160" className="polaroid-svg" aria-hidden="true">
        <defs>
          <radialGradient id="bgPaco" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#d9ccb4" />
            <stop offset="100%" stopColor="#8a7961" />
          </radialGradient>
        </defs>
        <rect width="160" height="160" fill="url(#bgPaco)" />
        {/* Height chart lines in background */}
        <line x1="15" y1="25" x2="145" y2="25" stroke="#6b5d4b" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="15" y1="50" x2="145" y2="50" stroke="#6b5d4b" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="15" y1="75" x2="145" y2="75" stroke="#6b5d4b" strokeWidth="1" strokeDasharray="3,3" />
        {/* Suit & wrinkled white shirt */}
        <path d="M22 160 L36 112 L124 112 L138 160 Z" fill="#2e2a27" />
        <path d="M58 112 L80 148 L102 112 Z" fill="#ece3d0" />
        {/* Tie with coffee stain */}
        <path d="M75 118 L85 118 L88 158 L72 158 Z" fill="#7a231d" />
        <circle cx="82" cy="138" r="6" fill="#4a2c11" opacity="0.75" />
        <circle cx="77" cy="144" r="3.5" fill="#4a2c11" opacity="0.65" />
        {/* Head & ears */}
        <ellipse cx="48" cy="70" rx="6" ry="10" fill="#cbb08f" />
        <ellipse cx="112" cy="70" rx="6" ry="10" fill="#cbb08f" />
        <rect x="68" y="96" width="24" height="20" fill="#cbb08f" />
        <ellipse cx="80" cy="68" rx="32" ry="38" fill="#d8be9c" />
        {/* Dark messy hair with receding temples */}
        <path d="M48 60 C46 32, 68 24, 82 26 C98 24, 114 34, 112 60 C108 44, 96 38, 80 40 C64 38, 52 45, 48 60 Z" fill="#2b241f" />
        {/* Worried eyebrows */}
        <path d="M58 54 L73 59" stroke="#2b241f" strokeWidth="3.2" strokeLinecap="round" />
        <path d="M102 54 L87 59" stroke="#2b241f" strokeWidth="3.2" strokeLinecap="round" />
        {/* Wide panicked eyes */}
        <ellipse cx="66" cy="66" rx="6" ry="4.5" fill="#faf6ee" />
        <ellipse cx="94" cy="66" rx="6" ry="4.5" fill="#faf6ee" />
        <circle cx="67" cy="66" r="2.5" fill="#231f1c" />
        <circle cx="93" cy="66" r="2.5" fill="#231f1c" />
        {/* Sweat drops */}
        <path d="M104 46 C104 46, 108 53, 105 56 C102 56, 102 51, 104 46 Z" fill="#7ab8d6" />
        <path d="M55 48 C55 48, 58 54, 55 56 C52 56, 53 51, 55 48 Z" fill="#7ab8d6" />
        {/* Nose & nervous grimace */}
        <path d="M80 64 L77 80 L84 81" fill="none" stroke="#8c6f52" strokeWidth="2.2" />
        <path d="M67 92 Q80 87 93 92" fill="none" stroke="#4a3525" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (avatar === 'mariano') {
    return (
      <svg viewBox="0 0 160 160" className="polaroid-svg" aria-hidden="true">
        <rect width="160" height="160" fill="#c7b89e" />
        <line x1="15" y1="30" x2="145" y2="30" stroke="#7a6a53" strokeWidth="1" strokeDasharray="3,3" />
        <line x1="15" y1="60" x2="145" y2="60" stroke="#7a6a53" strokeWidth="1" strokeDasharray="3,3" />
        {/* Police bomber jacket / open collar */}
        <path d="M16 160 L30 110 L130 110 L144 160 Z" fill="#283542" />
        <path d="M56 110 L80 144 L104 110 Z" fill="#dfd5c3" />
        {/* Rounder head & cheeks */}
        <rect x="64" y="96" width="32" height="20" fill="#d4b491" />
        <ellipse cx="80" cy="70" rx="36" ry="36" fill="#dfc19f" />
        {/* Curly/wavy side hair */}
        <path d="M44 66 C42 40, 56 30, 80 30 C104 30, 118 40, 116 66 C112 46, 98 38, 80 38 C62 38, 48 46, 44 66 Z" fill="#3a2e25" />
        {/* Singed/charred eyebrows with soot marks */}
        <path d="M55 54 Q65 49 74 55" fill="none" stroke="#181512" strokeWidth="4.5" strokeDasharray="3,1.5" />
        <path d="M86 55 Q95 49 105 54" fill="none" stroke="#181512" strokeWidth="4.5" strokeDasharray="3,1.5" />
        <circle cx="62" cy="50" r="6" fill="#222" opacity="0.22" />
        <circle cx="98" cy="50" r="7" fill="#222" opacity="0.22" />
        {/* Indignant eyes */}
        <circle cx="66" cy="65" r="3" fill="#231f1c" />
        <circle cx="94" cy="65" r="3" fill="#231f1c" />
        {/* Nose & mustache/stubble */}
        <ellipse cx="80" cy="75" rx="6" ry="4.5" fill="#c7a27c" />
        <path d="M65 89 Q80 84 95 89" fill="none" stroke="#3a2e25" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }

  if (avatar === 'lucas') {
    return (
      <svg viewBox="0 0 160 160" className="polaroid-svg" aria-hidden="true">
        <rect width="160" height="160" fill="#b8aa93" />
        {/* Black leather jacket with popped collar */}
        <path d="M18 160 L32 104 L52 96 L80 125 L108 96 L128 104 L142 160 Z" fill="#1c1b1a" />
        <path d="M62 114 L80 155 L98 114 Z" fill="#3d3a36" />
        {/* Neck & angular jaw */}
        <rect x="67" y="94" width="26" height="22" fill="#cfa982" />
        <path d="M50 56 C50 32, 110 32, 110 56 L106 86 C104 98, 90 104, 80 104 C70 104, 56 98, 54 86 Z" fill="#d9b48f" />
        {/* Messy cool hair */}
        <path d="M48 58 C46 30, 64 22, 84 24 C104 22, 115 34, 112 58 C106 42, 92 35, 78 37 C64 36, 54 44, 48 58 Z" fill="#2a211b" />
        {/* Aviator Sunglasses indoors */}
        <rect x="54" y="56" width="22" height="15" rx="4" fill="#141414" stroke="#8c7853" strokeWidth="1.8" />
        <rect x="84" y="56" width="22" height="15" rx="4" fill="#141414" stroke="#8c7853" strokeWidth="1.8" />
        <line x1="76" y1="60" x2="84" y2="60" stroke="#8c7853" strokeWidth="2" />
        <line x1="58" y1="59" x2="66" y2="68" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
        <line x1="88" y1="59" x2="96" y2="68" stroke="#ffffff" strokeWidth="1.2" opacity="0.45" />
        {/* Stubble & toothpick */}
        <path d="M68 88 L92 87" stroke="#4a3728" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="88" y1="88" x2="105" y2="94" stroke="#f0e4c8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  // Curtis
  return (
    <svg viewBox="0 0 160 160" className="polaroid-svg" aria-hidden="true">
      <rect width="160" height="160" fill="#c9bca6" />
      {/* Police tactical polo */}
      <path d="M20 160 L34 110 L126 110 L140 160 Z" fill="#1f2d3d" />
      <rect x="96" y="124" width="18" height="7" rx="1" fill="#d4af37" />
      {/* Head */}
      <rect x="66" y="95" width="28" height="20" fill="#7a5037" />
      <ellipse cx="80" cy="68" rx="31" ry="35" fill="#8a5c40" />
      {/* Close-cropped hair */}
      <path d="M50 56 C50 32, 110 32, 110 56 C105 42, 94 37, 80 37 C66 37, 55 42, 50 56 Z" fill="#1c1613" />
      {/* Calm eyebrows & eyes */}
      <line x1="58" y1="56" x2="72" y2="56" stroke="#1c1613" strokeWidth="3" strokeLinecap="round" />
      <line x1="88" y1="56" x2="102" y2="56" stroke="#1c1613" strokeWidth="3" strokeLinecap="round" />
      <circle cx="66" cy="64" r="2.8" fill="#1a1512" />
      <circle cx="94" cy="64" r="2.8" fill="#1a1512" />
      <path d="M68 87 Q80 91 90 87" fill="none" stroke="#2b1d14" strokeWidth="2.5" strokeLinecap="round" />
      {/* Vanilla milkshake cup & straw */}
      <rect x="108" y="114" width="26" height="36" rx="3" fill="#f7f1e1" stroke="#5c4b3b" strokeWidth="1.5" />
      <path d="M106 114 L136 114" stroke="#a82020" strokeWidth="3" />
      <polyline points="121,114 117,96 100,90" fill="none" stroke="#a82020" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('resumen');
  const [inspectedEvidences, setInspectedEvidences] = useState<Set<string>>(() => new Set());
  const [flaggedEvidences, setFlaggedEvidences] = useState<Set<string>>(() => new Set());
  const [detectedContradictions, setDetectedContradictions] = useState<Set<string>>(() => new Set());
  const [userNotes, setUserNotes] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(NOTES_STORAGE_KEY);
      return (
        saved ??
        '=== BLOC DEL INSPECTOR (CASO #404-SA) ===\n• 09:00h: Don Lorenzo abre la caja fuerte y halla media tortilla, el trofeo de petanca y una foto del Fary.\n'
      );
    } catch {
      return '=== BLOC DEL INSPECTOR (CASO #404-SA) ===\n';
    }
  });

  // Modal state for inspecting an evidence item in full detail
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  // Cassette player state (Evidence #02)
  const [isPlayingTape, setIsPlayingTape] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);
  const tapeTimeoutRef = useRef<number | null>(null);

  // Timeline reconstruction state (Tab 04)
  const [timelineAssignments, setTimelineAssignments] = useState<Record<string, string>>({});
  const [timelineFeedback, setTimelineFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [timelineVerified, setTimelineVerified] = useState(false);

  // Accusation state (Tab 05)
  const [accusation, setAccusation] = useState<Accusation>({
    suspectId: '',
    weaponOrTool: '',
    motive: '',
  });
  const [accusationError, setAccusationError] = useState<string | null>(null);
  const [caseSolved, setCaseSolved] = useState(false);

  // Mobile/floating notepad toggle
  const [notepadOpen, setNotepadOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_STORAGE_KEY, userNotes);
    } catch {
      // ignore storage quota errors
    }
  }, [userNotes]);

  useEffect(() => {
    return () => {
      if (tapeTimeoutRef.current) window.clearTimeout(tapeTimeoutRef.current);
      soundEngine.stopAll();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const appendNote = (snippet: string, label: string) => {
    setUserNotes((prev) => {
      if (prev.includes(snippet)) {
        showToast(`Ya consta en tu libreta: ${label}`);
        return prev;
      }
      showToast(`Añadido al bloc de notas: ${label}`);
      return `${prev.trimEnd()}\n${snippet}\n`;
    });
  };

  const handleTabChange = (tab: TabId) => {
    soundEngine.playPaperFlip();
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInspectEvidence = (ev: Evidence) => {
    soundEngine.playPaperFlip();
    setInspectedEvidences((prev) => {
      const next = new Set(prev);
      next.add(ev.id);
      return next;
    });
    setSelectedEvidence(ev);
  };

  const toggleFlagEvidence = (id: string) => {
    soundEngine.playStampSound();
    setFlaggedEvidences((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleDetectContradiction = (suspect: Suspect) => {
    soundEngine.playStampSound();
    setDetectedContradictions((prev) => {
      const next = new Set(prev);
      next.add(suspect.id);
      return next;
    });
    appendNote(suspect.noteSnippet, `Contradicción de ${suspect.name}`);
  };

  // Cassette tape playback controls
  const stopTapePlayback = () => {
    if (tapeTimeoutRef.current) {
      window.clearTimeout(tapeTimeoutRef.current);
      tapeTimeoutRef.current = null;
    }
    soundEngine.stopAll();
    soundEngine.playCassetteClick();
    setIsPlayingTape(false);
    setActiveSegmentIndex(null);
  };

  const playTapeFromSegment = (startIndex = 0) => {
    const audioEvidence = EVIDENCES.find((e) => e.id === 'ev-02');
    const segments = audioEvidence?.audioSegments;
    if (!segments || startIndex >= segments.length) {
      stopTapePlayback();
      return;
    }

    // Mark EV-02 as inspected automatically when listening to the tape
    setInspectedEvidences((prev) => {
      const next = new Set(prev);
      next.add('ev-02');
      return next;
    });

    if (tapeTimeoutRef.current) {
      window.clearTimeout(tapeTimeoutRef.current);
    }

    if (startIndex === 0 && !isPlayingTape) {
      soundEngine.playCassetteClick();
    }

    setIsPlayingTape(true);
    setActiveSegmentIndex(startIndex);
    const seg = segments[startIndex];
    soundEngine.playSegmentSfx(seg.sfxType, seg.durationMs, seg.text, () => {
      if (startIndex + 1 < segments.length) {
        playTapeFromSegment(startIndex + 1);
      } else {
        setIsPlayingTape(false);
        setActiveSegmentIndex(null);
        soundEngine.playCassetteClick();
      }
    });
  };

  // Timeline verification logic
  const handleVerifyTimeline = () => {
    const allFilled = TIMELINE_SLOTS.every((slot) => timelineAssignments[slot.id]);
    if (!allFilled) {
      setTimelineFeedback({
        ok: false,
        message: 'Faltan franjas horarias por asignar en el tablón cronológico.',
      });
      return;
    }

    const allCorrect = TIMELINE_SLOTS.every(
      (slot) => timelineAssignments[slot.id] === slot.correctEventId
    );

    if (allCorrect) {
      soundEngine.playStampSound();
      setTimelineVerified(true);
      setTimelineFeedback({
        ok: true,
        message:
          '¡CRONOLOGÍA VERIFICADA! La secuencia encaja al segundo: Paco entró a las 23:10h con los dedos pringados de croqueta, trituró el dossier sin gafas a las 23:14h y aprovechó el apagón del microondas de Mariano (23:15h) para que Povedilla escondiera las tiras en el calabozo.',
      });
      appendNote(
        '• [CRONOLOGÍA VERIFICADA] 22:30 Croquetas -> 23:10 Paco abre despacho -> 23:14 Paco tritura informe sin gafas -> 23:15 Mariano explota microondas -> 23:16 Povedilla esconde las tiras.',
        'Cronología Oficial'
      );
    } else {
      soundEngine.playPaperFlip();
      setTimelineFeedback({
        ok: false,
        message: `Llevas ${
          TIMELINE_SLOTS.filter((slot) => timelineAssignments[slot.id] === slot.correctEventId).length
        } de ${TIMELINE_SLOTS.length} franjas bien. Revisa el Registro de Accesos (Prueba #03) y la Caja Negra (Prueba #02).`,
      });
    }
  };

  // Accusation submission logic
  const enoughEvidence = inspectedEvidences.size >= MIN_EVIDENCES_TO_ACCUSE;
  const canSubmitAccusation = enoughEvidence && timelineVerified;

  const handleAccusationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitAccusation) return;

    if (!accusation.suspectId || !accusation.weaponOrTool || !accusation.motive) {
      setAccusationError('Por los clavos de Cristo, rellena los tres apartados del pliego de cargos antes de firmar.');
      return;
    }

    const isSuspectRight = accusation.suspectId === CORRECT_ACCUSATION.suspectId;
    const isToolRight = accusation.weaponOrTool === CORRECT_ACCUSATION.weaponOrTool;
    const isMotiveRight = accusation.motive === CORRECT_ACCUSATION.motive;

    if (isSuspectRight && isToolRight && isMotiveRight) {
      soundEngine.playStampSound();
      setAccusationError(null);
      setCaseSolved(true);
    } else {
      soundEngine.playPaperFlip();
      if (!isSuspectRight) {
        if (accusation.suspectId === 'mariano') {
          setAccusationError(
            'Don Lorenzo ruge: «¡Mariano es tonto del culo por meter papel albal en el microondas, sí, pero a las 23:15 estaba en la cocina! ¿Quién abrió mi caja fuerte llamándome "suegro" detrás de la foto del Fary y dejó grasa de croqueta en la ruleta?»'
          );
        } else if (accusation.suspectId === 'lucas') {
          setAccusationError(
            'Don Lorenzo frunce el ceño: «¿Lucas? Lucas estaba en el parking con el soplete y solo subió cuando saltaron los plomos. Lee otra vez el informe forense de Silvia y escucha la cinta de las 23:14h.»'
          );
        } else {
          setAccusationError(
            'Don Lorenzo golpea la mesa: «¿Curtis? ¡Pero si Curtis estaba tomándose un batido y solo te ha dado el chivatazo de la foto del Fary! Mira quién entró a las 23:10h con su tarjeta.»'
          );
        }
      } else if (!isToolRight) {
        setAccusationError(
          'Don Lorenzo resopla: «Has acertado que fue Paco, pero no destruyó el informe del Ministro con ese aparato. ¡Escucha la grabación de la Caja Negra a las 23:14:50h! ¿Qué máquina confundió por no llevar las gafas de cerca?»'
        );
      } else {
        setAccusationError(
          'Don Lorenzo te mira fijo: «Sabes que fue Paco con la destructora de papel, pero ¿qué provocó exactamente la explosión y el apagón a las 23:15h en la sala de descansos? Revisa la declaración de Mariano.»'
        );
      }
    }
  };

  return (
    <div className="desk-environment">
      {/* Ambient coffee ring and desk accessories */}
      <div className="coffee-stain coffee-stain-top" aria-hidden="true" />
      <div className="coffee-stain coffee-stain-bottom" aria-hidden="true" />

      {/* Top Classification Banner */}
      <header className="top-bar">
        <div className="top-bar-left">
          <span className="cnp-badge">CNP · SAN ANTONIO</span>
          <div>
            <h1 className="case-main-title">
              {CASE_METADATA.caseCode} — {CASE_METADATA.operationName}
            </h1>
            <p className="case-subtitle">{CASE_METADATA.precinct}</p>
          </div>
        </div>

        <div className="top-bar-right">
          <div className="progress-pill" title="Evidencias abiertas en el laboratorio">
            <span>🔎 Pruebas examinadas:</span>
            <strong>
              {inspectedEvidences.size} / {EVIDENCES.length}
            </strong>
          </div>
          <div className="progress-pill" title="Contradicciones anotadas de los sospechosos">
            <span>📌 Contradicciones:</span>
            <strong>
              {detectedContradictions.size} / {SUSPECTS.length}
            </strong>
          </div>
          <button
            type="button"
            className="notepad-toggle-btn"
            onClick={() => setNotepadOpen((v) => !v)}
          >
            📝 Bloc del Inspector
          </button>
        </div>
      </header>

      {toastMessage && (
        <div className="toast-banner" role="status">
          📌 {toastMessage}
        </div>
      )}

      {/* Main Workspace: Manila Folder + Side Inspector Notepad */}
      <div className="workspace-grid">
        <main className="manila-folder-wrapper">
          {/* Die-cut Folder Tabs (Pestañas troqueladas superiores) */}
          <nav className="folder-tabs" aria-label="Pestañas del sumario policial">
            <button
              type="button"
              className={`folder-tab ${activeTab === 'resumen' ? 'active' : ''}`}
              onClick={() => handleTabChange('resumen')}
            >
              <span className="tab-num">01</span>
              <span className="tab-label">Informe del Suceso</span>
              <span className="tab-label-short">Suceso</span>
            </button>
            <button
              type="button"
              className={`folder-tab ${activeTab === 'sospechosos' ? 'active' : ''}`}
              onClick={() => handleTabChange('sospechosos')}
            >
              <span className="tab-num">02</span>
              <span className="tab-label">Sospechosos ({SUSPECTS.length})</span>
              <span className="tab-label-short">Fichas</span>
            </button>
            <button
              type="button"
              className={`folder-tab ${activeTab === 'pruebas' ? 'active' : ''}`}
              onClick={() => handleTabChange('pruebas')}
            >
              <span className="tab-num">03</span>
              <span className="tab-label">
                Pruebas Forenses ({inspectedEvidences.size}/{EVIDENCES.length})
              </span>
              <span className="tab-label-short">
                Pruebas {inspectedEvidences.size}/{EVIDENCES.length}
              </span>
            </button>
            <button
              type="button"
              className={`folder-tab ${activeTab === 'interrogatorio' ? 'active' : ''}`}
              onClick={() => handleTabChange('interrogatorio')}
            >
              <span className="tab-num">04</span>
              <span className="tab-label">Tablón Cronológico</span>
              <span className="tab-label-short">{timelineVerified ? '✓ ' : ''}Tablón</span>
            </button>
            <button
              type="button"
              className={`folder-tab tab-accuse ${activeTab === 'resolucion' ? 'active' : ''}`}
              onClick={() => handleTabChange('resolucion')}
            >
              <span className="tab-num">05</span>
              <span className="tab-label">
                {caseSolved ? '✓ Caso Cerrado' : canSubmitAccusation ? 'Resolver Caso' : '🔒 Resolver Caso'}
              </span>
              <span className="tab-label-short">
                {caseSolved ? '✓ Cerrado' : canSubmitAccusation ? 'Acusar' : '🔒 Acusar'}
              </span>
            </button>
          </nav>

          {/* Manila Folder Body */}
          <div className="manila-folder-sheet">
            {/* Decorative metallic clip & rubber stamp */}
            <div className="paperclip-top" aria-hidden="true" />
            <div className="stamp-secret" aria-hidden="true">
              SECRETO DE SUMARIO
              <span>COMISARÍA SAN ANTONIO</span>
            </div>

            {/* =========================================================
                TAB 01: INFORME DEL SUCESO (RESUMEN)
               ========================================================= */}
            {activeTab === 'resumen' && (
              <section className="tab-sheet" aria-labelledby="heading-resumen">
                <div className="document-header">
                  <div>
                    <p className="doc-kicker">MINISTERIO DEL INTERIOR · DIRECCIÓN GENERAL DE LA POLICÍA</p>
                    <h2 id="heading-resumen" className="doc-title">
                      ATESTADO DE URGENCIA — {CASE_METADATA.caseCode}
                    </h2>
                  </div>
                  <div className="doc-meta-box">
                    <div>
                      <strong>FECHA:</strong> Miércoles, 09:00 AM
                    </div>
                    <div>
                      <strong>LUGAR:</strong> Planta Baja y Despacho Oficial
                    </div>
                    <div>
                      <strong>INSTRUCTORA:</strong> Inspectora Irina
                    </div>
                  </div>
                </div>

                <div className="summary-layout">
                  <div className="typewriter-paper">
                    <div className="group-photo-polaroid">
                      <div className="metallic-clip" aria-hidden="true" />
                      <img
                        src={GROUP_PHOTO}
                        alt="Brigada de Paco Miranda en la Comisaría de San Antonio"
                        className="group-photo-img"
                      />
                      <p className="group-photo-caption">
                        ANEXO FOTOGRÁFICO #00 — Brigada del Inspector Jefe Miranda (Comisaría de San Antonio)
                      </p>
                    </div>

                    <h3 className="section-heading">1. HECHOS DENUNCIADOS (EL INCIDENTE DE LAS 09:00 AM)</h3>
                    <p className="typewriter-paragraph">{CASE_METADATA.incidentSummary}</p>

                    <h3 className="section-heading">2. INVENTARIO DE OBJETOS HALLADOS EN LA CAJA FUERTE</h3>
                    <div className="safe-items-grid">
                      {CASE_METADATA.safeContents.map((sc) => (
                        <div key={sc.item} className="safe-item-card">
                          <span className="safe-item-icon" aria-hidden="true">
                            {sc.icon}
                          </span>
                          <div>
                            <strong>{sc.item}</strong>
                            <p>{sc.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <h3 className="section-heading">3. DIRECTRICES DE LA INVESTIGACIÓN</h3>
                    <ul className="directive-list">
                      <li>
                        Interroga y revisa las declaraciones juradas de los <strong>4 sospechosos</strong> del turno de noche (Paco, Mariano, Lucas y Curtis).
                      </li>
                      <li>
                        Abre y examina al menos <strong>{MIN_EVIDENCES_TO_ACCUSE} de las 4 pruebas forenses</strong> del laboratorio de Silvia Castro para desbloquear el pliego de imputación formal.
                      </li>
                      <li>
                        Reconstruye la secuencia de los hechos entre las <strong>22:30h y las 23:16h</strong> en el Tablón Cronológico. Sin cronología verificada, Don Lorenzo no firma nada.
                      </li>
                      <li>
                        Formula la acusación triple: <strong>quién</strong>, <strong>con qué aparato</strong> y <strong>por qué se fue la luz</strong>. Ojo: aquí nadie confiesa, hay que cruzar placas, horas y voces.
                      </li>
                    </ul>

                    <div className="quick-actions-row">
                      <button
                        type="button"
                        className="btn-police"
                        onClick={() => handleTabChange('sospechosos')}
                      >
                        Examinar Fichas de Sospechosos →
                      </button>
                      <button
                        type="button"
                        className="btn-police secondary"
                        onClick={() => handleTabChange('pruebas')}
                      >
                        Abrir Bolsas de Evidencia Forense →
                      </button>
                    </div>
                  </div>

                  {/* Furious Yellow Post-it from Don Lorenzo */}
                  <aside className="postit-column">
                    <div className="yellow-postit">
                      <div className="postit-pin" aria-hidden="true" />
                      <span className="postit-tag">NOTA ADHERIDA A LA CAJA FUERTE (PRUEBA #04)</span>
                      <p className="postit-handwriting">{CASE_METADATA.lorenzoPostIt.text}</p>
                      <p className="postit-signature">{CASE_METADATA.lorenzoPostIt.signature}</p>
                    </div>

                    <div className="investigation-status-card">
                      <h4>ESTADO DEL SUMARIO</h4>
                      <div className="status-row">
                        <span>Pruebas inspeccionadas:</span>
                        <strong>
                          {inspectedEvidences.size} / {EVIDENCES.length}
                        </strong>
                      </div>
                      <div className="status-row">
                        <span>Contradicciones cazadas:</span>
                        <strong>
                          {detectedContradictions.size} / {SUSPECTS.length}
                        </strong>
                      </div>
                      <div className="status-row">
                        <span>Pliego de Acusación:</span>
                        <strong className={canSubmitAccusation ? 'status-unlocked' : 'status-locked'}>
                          {canSubmitAccusation
                            ? 'DESBLOQUEADO'
                            : !enoughEvidence
                              ? `BLOQUEADO (Faltan ${MIN_EVIDENCES_TO_ACCUSE - inspectedEvidences.size} pruebas)`
                              : 'BLOQUEADO (Falta la cronología)'}
                        </strong>
                      </div>
                    </div>
                  </aside>
                </div>
              </section>
            )}

            {/* =========================================================
                TAB 02: SOSPECHOSOS (POLAROIDS + DECLARACIONES)
               ========================================================= */}
            {activeTab === 'sospechosos' && (
              <section className="tab-sheet" aria-labelledby="heading-sospechosos">
                <div className="document-header">
                  <div>
                    <p className="doc-kicker">BRIGADA DE POLICÍA JUDICIAL · TURNO DE NOCHE</p>
                    <h2 id="heading-sospechosos" className="doc-title">
                      PERFILES DE SOSPECHOSOS Y DECLARACIONES EN ACTA
                    </h2>
                  </div>
                  <p className="doc-helper">
                    Compara las coartadas horarias con las pruebas físicas y pulsa{' '}
                    <strong>«Señalar Contradicción / Pista»</strong> para registrarla en el expediente.
                  </p>
                </div>

                <div className="suspects-grid">
                  {SUSPECTS.map((suspect) => {
                    const isDetected = detectedContradictions.has(suspect.id);
                    return (
                      <article key={suspect.id} className="suspect-dossier-card">
                        {/* Metallic paperclip on each Polaroid */}
                        <div className="polaroid-wrapper">
                          <div className="metallic-clip" aria-hidden="true" />
                          <div className="polaroid-frame">
                            <div className="polaroid-photo-box">
                              <SuspectPortraitSvg avatar={suspect.avatar} name={suspect.name} />
                              <div className="polaroid-grain" aria-hidden="true" />
                              <span className="stamp-interrogated">INTERROGADO</span>
                            </div>
                            <p className="polaroid-caption">{suspect.polaroidCaption}</p>
                          </div>
                        </div>

                        <div className="suspect-info">
                          <div className="suspect-title-row">
                            <div>
                              <h3 className="suspect-name">{suspect.name}</h3>
                              <span className="suspect-rank">
                                {suspect.rank} · Placa {suspect.badgeNumber}
                              </span>
                            </div>
                            {isDetected && (
                              <span className="contradiction-badge">✓ ANALIZADO</span>
                            )}
                          </div>

                          <div className="suspect-meta-strip">
                            <div>
                              <strong>Estado físico:</strong> {suspect.statusDescription}
                            </div>
                            <div>
                              <strong>Coartada declarada:</strong> {suspect.alibiTime} — {suspect.alibiLocation}
                            </div>
                          </div>

                          <blockquote className="suspect-statement">
                            {suspect.statement}
                          </blockquote>

                          <div className="suspect-actions">
                            <button
                              type="button"
                              className={`btn-contradiction ${isDetected ? 'detected' : ''}`}
                              onClick={() => handleDetectContradiction(suspect)}
                            >
                              {isDetected
                                ? '📌 Contradicción / Pista Registrada (Añadir a notas)'
                                : '🔍 Señalar Contradicción / Pista en el Expediente'}
                            </button>
                          </div>

                          {isDetected && (
                            <div className="contradiction-reveal">
                              <strong>NOTA DEL INSTRUCTOR:</strong> {suspect.contradictions}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =========================================================
                TAB 03: PRUEBAS FORENSES (LABORATORIO DE SILVIA CASTRO)
               ========================================================= */}
            {activeTab === 'pruebas' && (
              <section className="tab-sheet" aria-labelledby="heading-pruebas">
                <div className="document-header">
                  <div>
                    <p className="doc-kicker">LABORATORIO FORENSE · DRA. SILVIA CASTRO</p>
                    <h2 id="heading-pruebas" className="doc-title">
                      PRUEBAS MATERIALES Y DOCUMENTOS DEL EXPEDIENTE
                    </h2>
                  </div>
                  <p className="doc-helper">
                    Haz clic en cada bolsa de evidencia para examinarla a fondo ({inspectedEvidences.size} de{' '}
                    {EVIDENCES.length} revisadas; mínimo {MIN_EVIDENCES_TO_ACCUSE} para acusar).
                  </p>
                </div>

                <div className="evidence-grid">
                  {EVIDENCES.map((ev) => {
                    const isInspected = inspectedEvidences.has(ev.id);
                    const isFlagged = flaggedEvidences.has(ev.id);

                    return (
                      <article
                        key={ev.id}
                        className={`evidence-card ${isInspected ? 'inspected' : ''} ${
                          isFlagged ? 'flagged-key' : ''
                        }`}
                      >
                        <div className="evidence-bag-header">
                          <span className="evidence-code-badge">{ev.code}</span>
                          <span className="evidence-lab-tag">{ev.labTag}</span>
                          {isInspected ? (
                            <span className="ev-status-pill inspected">✓ EXAMINADA</span>
                          ) : (
                            <span className="ev-status-pill pending">PENDIENTE DE ABRIR</span>
                          )}
                        </div>

                        <h3 className="evidence-title">{ev.title}</h3>
                        <p className="evidence-subtitle">{ev.subtitle}</p>
                        <p className="evidence-author">Perito responsable: {ev.author}</p>

                        <div className="evidence-preview-box">
                          <p>{ev.content}</p>
                        </div>

                        {/* Special inline preview for Evidence #02: Police Cassette Player */}
                        {ev.id === 'ev-02' && ev.audioSegments && (
                          <div className="cassette-player-box">
                            <div className="cassette-header">
                              <span className="cassette-model">
                                📼 REPRODUCTOR POLICIAL SONY-SA · CINTA #B-23 (23:14h)
                              </span>
                              <span className={`cassette-led ${isPlayingTape ? 'on' : ''}`}>
                                {isPlayingTape ? '● REPRODUCIENDO AUDIO SINTETIZADO' : '○ EN ESPERA'}
                              </span>
                            </div>

                            <div className="cassette-window">
                              <div className={`tape-reel ${isPlayingTape ? 'spinning' : ''}`}>
                                <div className="reel-spokes" />
                              </div>
                              <div className="tape-middle-label">
                                <span>CAJA NEGRA DESPACHO</span>
                                <small>23:14:50 — 23:15:12</small>
                              </div>
                              <div className={`tape-reel ${isPlayingTape ? 'spinning' : ''}`}>
                                <div className="reel-spokes" />
                              </div>
                            </div>

                            <div className="cassette-controls">
                              {!isPlayingTape ? (
                                <button
                                  type="button"
                                  className="cassette-btn play"
                                  onClick={() => playTapeFromSegment(0)}
                                >
                                  ▶ Reproducir Cinta Completa (Con Sonido)
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="cassette-btn stop"
                                  onClick={stopTapePlayback}
                                >
                                  ⏹ Detener Cinta
                                </button>
                              )}
                            </div>

                            <div className="tape-transcript-list">
                              {ev.audioSegments.map((seg, idx) => (
                                <button
                                  key={seg.timestamp}
                                  type="button"
                                  className={`tape-line ${activeSegmentIndex === idx ? 'active-line' : ''}`}
                                  onClick={() => playTapeFromSegment(idx)}
                                  title="Haz clic para escuchar este corte de la cinta"
                                >
                                  <span className="tape-time">[{seg.timestamp}]</span>
                                  <strong className="tape-speaker">{seg.speaker}:</strong>
                                  <span className="tape-text">{seg.text}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="evidence-card-footer">
                          <button
                            type="button"
                            className="btn-police"
                            onClick={() => handleInspectEvidence(ev)}
                          >
                            🔬 Inspeccionar Prueba en Detalle
                          </button>
                          <button
                            type="button"
                            className={`btn-flag ${isFlagged ? 'active' : ''}`}
                            onClick={() => toggleFlagEvidence(ev.id)}
                          >
                            {isFlagged ? '★ Marcada como Clave' : '☆ Marcar Clave'}
                          </button>
                          <button
                            type="button"
                            className="btn-note-small"
                            onClick={() => appendNote(ev.noteSnippet, ev.code)}
                          >
                            + Anotar
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>
            )}

            {/* =========================================================
                TAB 04: TABLÓN CRONOLÓGICO (RECONSTRUCTOR MINUTO A MINUTO)
               ========================================================= */}
            {activeTab === 'interrogatorio' && (
              <section className="tab-sheet" aria-labelledby="heading-cronologia">
                <div className="document-header">
                  <div>
                    <p className="doc-kicker">DEDUCCIÓN OPERATIVA · RECONSTRUCCIÓN DE LA NOCHE</p>
                    <h2 id="heading-cronologia" className="doc-title">
                      TABLÓN CRONOLÓGICO DE LOS HECHOS (22:30H — 23:16H)
                    </h2>
                  </div>
                  <p className="doc-helper">
                    Asigna qué ocurrió exactamente en cada franja horaria según las tarjetas de acceso, el informe forense y la grabación de la caja negra.
                  </p>
                </div>

                <div className="timeline-board">
                  <h3 className="section-heading">SUCESOS HALLADOS EN EL SUMARIO (DESORDENADOS)</h3>
                  <ol className="timeline-bank">
                    {TIMELINE_OPTIONS.map((opt, i) => {
                      const used = Object.values(timelineAssignments).includes(opt.id);
                      return (
                        <li key={opt.id} className={used ? 'used' : ''}>
                          <span className="bank-letter">{String.fromCharCode(65 + i)}</span>
                          <span>{opt.text}</span>
                        </li>
                      );
                    })}
                  </ol>
                  <h3 className="section-heading">ASIGNA UNA LETRA A CADA HORA</h3>
                  {TIMELINE_SLOTS.map((slot) => {
                    const selectedVal = timelineAssignments[slot.id] || '';
                    return (
                      <div key={slot.id} className="timeline-row">
                        <div className="timeline-time-badge">
                          <span className="clock-time">{slot.time}</span>
                          <span className="clock-label">{slot.label}</span>
                        </div>
                        <div className="timeline-selector-cell">
                          <select
                            aria-label={`Suceso a las ${slot.time}`}
                            className="timeline-select"
                            value={selectedVal}
                            onChange={(e) => {
                              setTimelineFeedback(null);
                              setTimelineAssignments((prev) => ({
                                ...prev,
                                [slot.id]: e.target.value,
                              }));
                            }}
                          >
                            <option value="">— Elige suceso —</option>
                            {TIMELINE_OPTIONS.map((opt, i) => (
                              <option key={opt.id} value={opt.id}>
                                Suceso {String.fromCharCode(65 + i)}
                              </option>
                            ))}
                          </select>
                          {selectedVal && (
                            <p className="timeline-chosen">
                              {TIMELINE_OPTIONS.find((o) => o.id === selectedVal)?.text}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <div className="timeline-actions">
                    <button
                      type="button"
                      className="btn-police"
                      onClick={handleVerifyTimeline}
                    >
                      ✓ Verificar Secuencia Temporal
                    </button>
                  </div>

                  {timelineFeedback && (
                    <div
                      className={`timeline-feedback-box ${
                        timelineFeedback.ok ? 'feedback-ok' : 'feedback-err'
                      }`}
                      role="alert"
                    >
                      {timelineFeedback.message}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* =========================================================
                TAB 05: RESOLVER CASO (FORMULARIO DE IMPUTACIÓN + VEREDICTO)
               ========================================================= */}
            {activeTab === 'resolucion' && (
              <section className="tab-sheet" aria-labelledby="heading-resolucion">
                <div className="document-header">
                  <div>
                    <p className="doc-kicker">DESPACHO DEL COMISARIO DON LORENZO CASTRO</p>
                    <h2 id="heading-resolucion" className="doc-title">
                      PLIEGO OFICIAL DE IMPUTACIÓN Y RESOLUCIÓN DEL CASO
                    </h2>
                  </div>
                </div>

                {!canSubmitAccusation ? (
                  <div className="locked-accusation-panel">
                    <div className="lock-icon" aria-hidden="true">
                      🔒
                    </div>
                    <h3>PLIEGO DE IMPUTACIÓN BLOQUEADO POR PROTOCOLO FORENSE</h3>
                    <p>
                      Don Lorenzo no piensa escuchar acusaciones sin fundamento. Antes de acusar necesitas:
                    </p>
                    <p className="lock-progress">
                      {enoughEvidence ? '✓' : '✗'} Pruebas examinadas: <strong>{inspectedEvidences.size}</strong> de{' '}
                      <strong>{MIN_EVIDENCES_TO_ACCUSE}</strong> requeridas.
                      <br />
                      {timelineVerified ? '✓' : '✗'} Tablón cronológico verificado.
                    </p>
                    <button
                      type="button"
                      className="btn-police"
                      onClick={() => handleTabChange(enoughEvidence ? 'interrogatorio' : 'pruebas')}
                    >
                      {enoughEvidence ? 'Ir al Tablón Cronológico →' : 'Ir al Laboratorio Forense a Examinar Pruebas →'}
                    </button>
                  </div>
                ) : (
                  <form className="accusation-form" onSubmit={handleAccusationSubmit}>
                    <div className="form-intro-banner">
                      <strong>INSTRUCCIÓN DE DON LORENZO:</strong> «Quiero nombres, quiero saber con qué cacharro me han hecho confeti el dossier del Ministro y quiero saber por qué demonios saltaron los plomos a las 23:15h. ¡Y como se equivoque, lo mando a patrullar en triciclo!»
                    </div>

                    <div className="accusation-field-group">
                      <label htmlFor="select-suspect" className="accusation-label">
                        1. ¿QUIÉN FUE EL AUTOR PRINCIPAL que abrió la caja fuerte con la foto del Fary y destruyó el dossier?
                      </label>
                      <select
                        id="select-suspect"
                        className="accusation-select"
                        value={accusation.suspectId}
                        onChange={(e) => {
                          setAccusationError(null);
                          setAccusation((prev) => ({ ...prev, suspectId: e.target.value }));
                        }}
                      >
                        <option value="">— Seleccionar sospechoso principal —</option>
                        {ACCUSATION_OPTIONS.suspects.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="accusation-field-group">
                      <label htmlFor="select-weapon" className="accusation-label">
                        2. ¿QUÉ APARATO CONFUNDIÓ a las 23:14h provocando la destrucción del informe del Ministro?
                      </label>
                      <select
                        id="select-weapon"
                        className="accusation-select"
                        value={accusation.weaponOrTool}
                        onChange={(e) => {
                          setAccusationError(null);
                          setAccusation((prev) => ({ ...prev, weaponOrTool: e.target.value }));
                        }}
                      >
                        <option value="">— Seleccionar aparato / instrumento del desastre —</option>
                        {ACCUSATION_OPTIONS.weaponsOrTools.map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="accusation-field-group">
                      <label htmlFor="select-motive" className="accusation-label">
                        3. ¿POR QUÉ SE QUEDÓ A OSCURAS LA COMISARÍA a las 23:15h facilitando el cambiazo en la caja fuerte?
                      </label>
                      <select
                        id="select-motive"
                        className="accusation-select"
                        value={accusation.motive}
                        onChange={(e) => {
                          setAccusationError(null);
                          setAccusation((prev) => ({ ...prev, motive: e.target.value }));
                        }}
                      >
                        <option value="">— Seleccionar causa del apagón general —</option>
                        {ACCUSATION_OPTIONS.motivesOrBlackout.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {accusationError && (
                      <div className="lorenzo-rebuke-box" role="alert">
                        <strong>🤬 BRONCA DE DON LORENZO:</strong>
                        <p>{accusationError}</p>
                      </div>
                    )}

                    <div className="accusation-submit-row">
                      <button type="submit" className="btn-stamp-submit">
                        🔏 FIRMAR Y SELLAR IMPUTACIÓN OFICIAL
                      </button>
                    </div>
                  </form>
                )}

                {/* Epic Final Resolution Verdict & Dialogue */}
                {caseSolved && (
                  <div className="verdict-container">
                    <div className="confetti" aria-hidden="true">
                      {Array.from({ length: 40 }, (_, i) => (
                        <span
                          key={i}
                          style={{
                            left: `${(i * 37) % 100}%`,
                            animationDelay: `${(i % 10) * 0.3}s`,
                            background: ['#a82020', '#f9e87c', '#1e6b38', '#2c3e50', '#d4af37'][i % 5],
                          }}
                        />
                      ))}
                    </div>
                    <div className="birthday-badge-row">
                      <svg viewBox="0 0 200 240" className="inspector-badge" role="img" aria-label="Placa de Inspectora Irina">
                        <path d="M100 8 L122 40 L160 30 L156 70 L190 92 L160 116 L174 152 L136 156 L124 194 L100 176 L76 194 L64 156 L26 152 L40 116 L10 92 L44 70 L40 30 L78 40 Z" fill="#d4af37" stroke="#8a6d1c" strokeWidth="4" />
                        <circle cx="100" cy="104" r="46" fill="#1f2d3d" stroke="#f3dd8a" strokeWidth="4" />
                        <text x="100" y="90" textAnchor="middle" fill="#f3dd8a" fontSize="13" fontFamily="Special Elite, monospace">CNP</text>
                        <text x="100" y="112" textAnchor="middle" fill="#fff" fontSize="18" fontFamily="Special Elite, monospace">IRINA</text>
                        <text x="100" y="128" textAnchor="middle" fill="#f3dd8a" fontSize="9" fontFamily="Special Elite, monospace">INSPECTORA</text>
                        <rect x="36" y="206" width="128" height="26" rx="4" fill="#1f2d3d" />
                        <text x="100" y="224" textAnchor="middle" fill="#f3dd8a" fontSize="12" fontFamily="Special Elite, monospace">PLACA CNP-0007-SA</text>
                      </svg>
                      <div className="birthday-card">
                        <p className="birthday-kicker">DÍA 7 · ASCENSO POR MÉRITOS</p>
                        <h3>¡Enhorabuena, Inspectora Irina!</h3>
                        <p>
                          Caso resuelto sin despeinarse. Don Lorenzo le concede la placa CNP-0007-SA y la Comisaría de San Antonio al completo le desea un
                          <strong> ¡FELIZ CUMPLEAÑOS!</strong> 🎂
                        </p>
                      </div>
                    </div>
                    <div className="verdict-stamp-banner">
                      <div className="big-red-stamp">
                        CASO #404-SA RESUELTO
                        <span>CULPABLE: INSPECTOR JEFE PACO MIRANDA</span>
                      </div>
                    </div>

                    <h3 className="verdict-heading">
                      CONCLUSIÓN FORENSE: «OPERACIÓN TORTILLA QUEMADA»
                    </h3>
                    <p className="verdict-summary-text">
                      <strong>Paco Miranda</strong> entró al despacho de Don Lorenzo a las <strong>23:10h</strong> con su tarjeta de acceso y los dedos manchados de grasa de las croquetas de Lola. Abrió la caja fuerte mirando la combinación de su suegro (<code>14-02-98</code>) apuntada con su bolígrafo mordido detrás de la foto firmada del Fary, con la intención de fotocopiar el dossier del Ministro y meter dentro el tupper de tortilla de Mariano para gastarle una broma. A las <strong>23:14:58h</strong>, como no llevaba puestas las gafas de cerca, confundió la destructora de papel con el escáner y trituró el informe original. Tres segundos después (<strong>23:15:05h</strong>), <strong>Mariano</strong> hizo explotar el microondas de la cocina al calentar un bocadillo de panceta envuelto en papel albal, dejando la comisaría a oscuras. Aprovechando el apagón, Paco ordenó a <strong>Povedilla</strong> esconder las tiras de papel en el calabozo 2 y traerle «lo primero que pillara» para hacer bulto: el tupper de Mariano y, a ciegas, el trofeo de petanca de encima del microondas (de ahí el hollín y el olor a panceta). Con las prisas, Paco se dejó dentro la foto del Fary con la chuleta. A las 23:45h volvió con su tarjeta al calabozo 2 a comprobar que las tiras seguían escondidas.
                    </p>

                    <div className="epic-dialogue-box">
                      <h4>🎙️ TRANSCRIPCIÓN DEL CAREO FINAL EN EL DESPACHO DE DON LORENZO</h4>
                      <div className="dialogue-list">
                        {RESOLUTION_DIALOGUE.map((line, i) => (
                          <div key={i} className={`dialogue-item mood-${line.mood}`}>
                            <div className="dialogue-speaker-row">
                              <strong>{line.speaker}</strong>
                              <span>({line.role})</span>
                            </div>
                            <p className="dialogue-text">{line.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        </main>

        {/* Side / Floating Inspector's Notepad (Persisted in localStorage) */}
        <aside className={`inspector-notepad ${notepadOpen ? 'mobile-open' : ''}`}>
          <div className="notepad-spiral" aria-hidden="true" />
          <div className="notepad-header">
            <h3>📝 LIBRETA DEL INSPECTOR</h3>
            <span className="notepad-saved-tag">Guardado automático</span>
          </div>
          <p className="notepad-instructions">
            Apunta coartadas, horas clave y contradicciones. Puedes pulsar <em>«+ Anotar»</em> en cualquier prueba o sospechoso.
          </p>
          <textarea
            className="notepad-textarea"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            aria-label="Notas del inspector sobre el Caso 404-SA"
            rows={14}
          />
          <div className="notepad-footer">
            <button
              type="button"
              className="btn-note-clear"
              onClick={() =>
                setUserNotes(
                  '=== BLOC DEL INSPECTOR (CASO #404-SA) ===\n• 09:00h: Don Lorenzo abre la caja fuerte y halla media tortilla, el trofeo de petanca y una foto del Fary.\n'
                )
              }
            >
              Reiniciar Libreta
            </button>
          </div>
        </aside>
      </div>

      {/* =========================================================
          INTERACTIVE EVIDENCE MODAL (EvidenceModal)
         ========================================================= */}
      {selectedEvidence && (
        <div
          className="evidence-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-ev-title"
          onClick={() => setSelectedEvidence(null)}
        >
          <div className="evidence-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-top-bar">
              <div>
                <span className="evidence-code-badge">{selectedEvidence.code}</span>
                <span className="evidence-lab-tag">{selectedEvidence.labTag}</span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedEvidence(null)}
              >
                ✕ Cerrar Visor
              </button>
            </div>

            <h3 id="modal-ev-title" className="modal-title">
              {selectedEvidence.title}
            </h3>
            <p className="modal-subtitle">
              {selectedEvidence.subtitle} — <strong>{selectedEvidence.author}</strong>
            </p>

            {/* Visual Forensic Exhibit inside Modal */}
            <div className="modal-exhibit-showcase">
              {selectedEvidence.id === 'ev-01' && (
                <div className="fary-back-note">
                  <div className="fary-note-label">
                    REVERSO DE LA FOTOGRAFÍA DE «EL FARY» (Tinta de bolígrafo BIC mordido):
                  </div>
                  <p className="fary-handwriting">
                    "Combinación suegro: 14-02-98. No olvidar sacar el dossier para fotocopiarlo y meter el tupper de Mariano para gastarle una broma"
                  </p>
                  <div className="forensic-sub-grid">
                    <div className="forensic-chip">
                      <strong>RUEDA CAJA FUERTE:</strong> Grasa de croqueta casera + ceniza de puro.
                    </div>
                    <div className="forensic-chip">
                      <strong>TAPA DEL TUPPER:</strong> Huellas de Mariano (exterior) y <u>Paco Miranda (interior)</u>.
                    </div>
                  </div>
                </div>
              )}

              {selectedEvidence.id === 'ev-02' && (
                <div className="modal-audio-notice">
                  <p>
                    <strong>CINTA MAGNETOFÓNICA #B-23:</strong> Grabación directa del micrófono ambiental del despacho de Don Lorenzo entre las <code>23:14:50</code> y las <code>23:15:12</code>.
                  </p>
                  <button
                    type="button"
                    className="cassette-btn play"
                    onClick={() => playTapeFromSegment(0)}
                  >
                    ▶ Escuchar Grabación de la Caja Negra
                  </button>
                </div>
              )}

              {selectedEvidence.id === 'ev-03' && selectedEvidence.logEntries && (
                <div className="access-log-table-wrap">
                  <table className="access-log-table">
                    <thead>
                      <tr>
                        <th>HORA</th>
                        <th>TITULAR TARJETA</th>
                        <th>PLACA</th>
                        <th>ZONA</th>
                        <th>ESTADO</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedEvidence.logEntries.map((row) => (
                        <tr key={row.time} className={row.suspicious ? 'suspicious-row' : ''}>
                          <td>{row.time}</td>
                          <td>{row.cardHolder}</td>
                          <td>{row.badge}</td>
                          <td>{row.zone}</td>
                          <td>{row.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {selectedEvidence.id === 'ev-04' && (
                <div className="yellow-postit modal-postit">
                  <p className="postit-handwriting">{CASE_METADATA.lorenzoPostIt.text}</p>
                  <p className="postit-signature">{CASE_METADATA.lorenzoPostIt.signature}</p>
                </div>
              )}
            </div>

            <div className="modal-body-text">
              <h4>TRANSCRIPCIÓN ÍNTEGRA DE LA PRUEBA:</h4>
              <p className="pre-line-text">{selectedEvidence.content}</p>

              <h4>CONCLUSIONES CLAVE PARA EL TABLÓN DE DEDUCCIÓN:</h4>
              <ul className="modal-highlights-list">
                {selectedEvidence.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>

            <div className="modal-footer-actions">
              <button
                type="button"
                className={`btn-flag ${flaggedEvidences.has(selectedEvidence.id) ? 'active' : ''}`}
                onClick={() => toggleFlagEvidence(selectedEvidence.id)}
              >
                {flaggedEvidences.has(selectedEvidence.id)
                  ? '★ Marcada como Prueba Clave'
                  : '☆ Marcar como Prueba Clave'}
              </button>
              <button
                type="button"
                className="btn-police"
                onClick={() => {
                  appendNote(selectedEvidence.noteSnippet, selectedEvidence.code);
                  setSelectedEvidence(null);
                }}
              >
                📌 Enviar Hallazgo al Bloc y Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
