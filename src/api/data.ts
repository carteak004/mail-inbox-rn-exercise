/**
 * Deterministic inbox data. Every field is derived from the email id with a
 * seeded PRNG, so the same id always produces the same message across runs,
 * reloads and machines. No network access, no randomness at module load.
 *
 * You should not need to modify this file.
 */
import type { Email } from '../types/email';

export const TOTAL_EMAILS = 10_000;
export const PAGE_SIZE = 25;

/** Fixed "now" so relative timestamps are stable while you develop. */
export const INBOX_NOW = new Date('2026-10-05T09:41:00.000Z');

// ---------------------------------------------------------------------------
// Seeded PRNG (mulberry32)
// ---------------------------------------------------------------------------

/* eslint-disable no-bitwise */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* eslint-enable no-bitwise */
function pick<T>(rand: () => number, list: readonly T[]): T {
  return list[Math.floor(rand() * list.length)];
}

function range(rand: () => number, min: number, max: number): number {
  return min + Math.floor(rand() * (max - min + 1));
}

// ---------------------------------------------------------------------------
// Vocabulary
// ---------------------------------------------------------------------------

const FIRST_NAMES = [
  'Maya', 'Liam', 'Sofia', 'Noah', 'Amara', 'Ethan', 'Priya', 'Lucas', 'Zoe',
  'Mateo', 'Hana', 'Oliver', 'Leila', 'Kai', 'Elena', 'Jonas', 'Aisha', 'Theo',
  'Nora', 'Diego', 'Ingrid', 'Rafael', 'Chloe', 'Omar', 'Yuki', 'Daniel',
  'Fatima', 'Henrik', 'Camila', 'Arjun',
];

const LAST_NAMES = [
  'Thompson', 'Garcia', 'Nakamura', 'Okafor', 'Petrov', 'Silva', 'Haddad',
  'Lindqvist', 'Moreau', 'Khan', 'Rossi', 'Fischer', 'Mendes', 'Novak',
  'Adeyemi', 'Costa', 'Brennan', 'Sato', 'Varga', 'Delgado', 'Osei',
  'Berg', 'Ramos', 'Ivanova', 'Dubois', 'Ferreira', 'Yilmaz', 'Park',
];

const DOMAINS = [
  'example.com', 'northwind.dev', 'acme.co', 'contoso.io', 'globex.net',
  'initech.app', 'umbrella.org', 'hooli.xyz',
];

const SUBJECT_OPENERS = [
  'Re:', 'Fwd:', 'Quick question about', 'Update on', 'Follow-up:', 'Reminder:',
  'Notes from', 'Action required:', 'Draft for review:', 'FYI:', '', '', '',
];

const SUBJECT_TOPICS = [
  'the Q4 roadmap', 'tomorrow\'s standup', 'invoice #48213', 'the design review',
  'onboarding docs', 'release 2.7 timeline', 'the vendor contract', 'offsite logistics',
  'API rate limits', 'the hiring plan', 'budget reallocation', 'customer feedback summary',
  'the incident postmortem', 'parking validation', 'your expense report',
  'the analytics dashboard', 'the mobile beta', 'lunch on Thursday',
  'the accessibility audit', 'the new brand guidelines', 'test flakiness',
  'the migration runbook', 'the board deck', 'your PTO request',
];

const SENTENCES = [
  'Hope you had a good weekend.',
  'Following up on the thread from last week.',
  'I took a first pass at this and attached my notes.',
  'Could you take a look before end of day?',
  'No rush on this, whenever you get a chance.',
  'The numbers came in a bit lower than we expected.',
  'Let me know if Thursday afternoon works for a quick call.',
  'I think we are mostly aligned but wanted to confirm a few details.',
  'The team flagged two open questions that need a decision.',
  'Sharing the latest version with the changes we discussed.',
  'This should unblock the rollout once it is approved.',
  'Happy to walk through it live if that is easier.',
  'I pushed the fix this morning and the tests are green.',
  'Reminder that the deadline for feedback is Friday.',
  'We may need to pull in finance on this one.',
  'Thanks again for turning this around so quickly.',
  'See the summary below and the full report attached.',
  'The client asked whether we could move the date up a week.',
  'I have a couple of concerns about the current approach.',
  'Everything else looks good from my side.',
];

const SIGNOFFS = ['Thanks,', 'Best,', 'Cheers,', 'Regards,', 'Talk soon,'];

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------

function sentences(rand: () => number, count: number): string {
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    out.push(pick(rand, SENTENCES));
  }
  return out.join(' ');
}

/** Build the email with the given id. Pure and deterministic. */
export function generateEmail(id: number): Email {
  if (!Number.isInteger(id) || id < 1 || id > TOTAL_EMAILS) {
    throw new RangeError(`Email id out of range: ${id}`);
  }

  const rand = mulberry32(id * 7919);

  const first = pick(rand, FIRST_NAMES);
  const last = pick(rand, LAST_NAMES);
  const sender = `${first} ${last}`;
  const senderEmail = `${first}.${last}@${pick(rand, DOMAINS)}`.toLowerCase();

  const opener = pick(rand, SUBJECT_OPENERS);
  const topic = pick(rand, SUBJECT_TOPICS);
  const subject = (opener ? `${opener} ${topic}` : topic.charAt(0).toUpperCase() + topic.slice(1)).trim();

  const preview = sentences(rand, range(rand, 1, 3));

  const paragraphCount = range(rand, 3, 6);
  const paragraphs: string[] = [`Hi,`];
  for (let i = 0; i < paragraphCount; i++) {
    paragraphs.push(sentences(rand, range(rand, 2, 4)));
  }
  paragraphs.push(`${pick(rand, SIGNOFFS)}\n${first}`);
  const body = paragraphs.join('\n\n');

  // Timestamps: id 1 is newest. Spread 10,000 messages over ~120 days with
  // jittered gaps so grouping by day is realistic.
  const avgGapMs = (120 * 24 * 60 * 60 * 1000) / TOTAL_EMAILS;
  const jitter = 0.5 + rand(); // 0.5x..1.5x
  const offsetMs = Math.floor((id - 1) * avgGapMs * jitter);
  const receivedAt = new Date(INBOX_NOW.getTime() - offsetMs).toISOString();

  const isRead = rand() > 0.4; // ~40% unread
  const hasAttachment = rand() < 0.2;

  return {
    id,
    sender,
    senderEmail,
    subject,
    preview,
    body,
    receivedAt,
    isRead,
    hasAttachment,
  };
}

/** Ids for a 1-based page number, newest first. Empty when out of range. */
export function idsForPage(page: number): number[] {
  if (!Number.isInteger(page) || page < 1) {
    return [];
  }
  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(start + PAGE_SIZE - 1, TOTAL_EMAILS);
  if (start > TOTAL_EMAILS) {
    return [];
  }
  const ids: number[] = [];
  for (let id = start; id <= end; id++) {
    ids.push(id);
  }
  return ids;
}

export const TOTAL_PAGES = Math.ceil(TOTAL_EMAILS / PAGE_SIZE);
