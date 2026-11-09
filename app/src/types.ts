export type TabId = 'resumen' | 'sospechosos' | 'pruebas' | 'interrogatorio' | 'resolucion';

export type EvidenceType = 'forensic' | 'audio' | 'log' | 'photo';

export interface Suspect {
  id: string;
  name: string;
  rank: string;
  badgeNumber: string;
  avatar: string;
  statusDescription: string;
  statement: string;
  alibiTime: string;
  alibiLocation: string;
  contradictions: string;
  noteSnippet: string;
  polaroidCaption: string;
  accentColor: string;
}

export interface AudioSegment {
  timestamp: string;
  speaker: string;
  text: string;
  sfxType: 'voice_paco' | 'shredder' | 'explosion' | 'voice_whisper';
  durationMs: number;
}

export interface AccessLogEntry {
  time: string;
  cardHolder: string;
  badge: string;
  zone: string;
  status: string;
  suspicious?: boolean;
}

export interface Evidence {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  type: EvidenceType;
  labTag: string;
  author: string;
  content: string;
  unlockedByDefault: boolean;
  clueKey: string;
  noteSnippet: string;
  highlights: string[];
  audioSegments?: AudioSegment[];
  logEntries?: AccessLogEntry[];
}

export interface TimelineSlot {
  id: string;
  time: string;
  label: string;
  correctEventId: string;
}

export interface TimelineEventOption {
  id: string;
  text: string;
  actor: string;
}

export interface Accusation {
  suspectId: string;
  weaponOrTool: string;
  motive: string;
}

export interface InvestigationState {
  activeTab: TabId;
  inspectedEvidences: Set<string>;
  flaggedEvidences: Set<string>;
  detectedContradictions: Set<string>;
  userNotes: string;
  accusation: Accusation;
  timelineVerified: boolean;
  caseSolved: boolean;
}

export interface DialogueLine {
  speaker: string;
  role: string;
  text: string;
  mood: 'furious' | 'sweating' | 'indignant' | 'terrified' | 'cool';
}
