export const USER = { firstName: 'Maya' };

export const MODELS = ['Wide AI 1.0', 'Wide AI 0.9'];

export const NAV = [
  { label: 'Chat', href: '#chat' },
  { label: 'History', href: '#history' },
  { label: 'Models', href: '#models' },
  { label: 'Pricing', href: '#pricing' },
];

/** The app each attachment came from; the composer draws its logo. */
export type Source = 'youtube' | 'telegram' | 'firefox';

/** Files attached to the next message. */
export const ATTACHMENTS: { id: string; name: string; source: Source }[] = [
  { id: 'file-1', name: 'video.mp4', source: 'youtube' },
  { id: 'file-2', name: 'video.mp4', source: 'telegram' },
  { id: 'file-3', name: 'video.mp4', source: 'firefox' },
];
