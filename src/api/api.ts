/**
 * Mock inbox API.
 *
 * Simulates a remote service in-process: every call resolves after a random
 * delay and a fixed percentage of calls reject with a NetworkError. Server-side
 * state (read flags, archived / trashed ids) is kept in module memory so that
 * refetching a page after an action returns consistent data. Nothing here
 * persists across app restarts; that is intentional.
 *
 * You should not need to modify this file. If you believe you do, say why in
 * MOBILE_NOTES.md.
 */
import type { Email, InboxPage } from '../types/email';
import { generateEmail, idsForPage, TOTAL_PAGES } from './data';

// ---------------------------------------------------------------------------
// Tunables (read-only for the exercise; kept visible so reviewers can adjust)
// ---------------------------------------------------------------------------

export const API_CONFIG = {
  fetchLatencyMs: { min: 400, max: 900 },
  actionLatencyMs: { min: 300, max: 600 },
  fetchFailureRate: 0.1,
  actionFailureRate: 0.2,
} as const;

export class NetworkError extends Error {
  constructor(message = 'Network error') {
    super(message);
    this.name = 'NetworkError';
  }
}

// ---------------------------------------------------------------------------
// Internal "server" state
// ---------------------------------------------------------------------------

const readOverrides = new Map<number, boolean>();
const removed = new Set<number>(); // archived or trashed

function delay(min: number, max: number): Promise<void> {
  const ms = min + Math.random() * (max - min);
  return new Promise(resolve => setTimeout(resolve, ms));
}

function maybeFail(rate: number): void {
  if (Math.random() < rate) {
    throw new NetworkError();
  }
}

function withServerState(email: Email): Email {
  const override = readOverrides.get(email.id);
  return override === undefined ? email : { ...email, isRead: override };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch one page of the inbox, newest first. Pages are 1-based.
 * Messages that have been archived or trashed are omitted, so a page may
 * contain fewer than PAGE_SIZE items.
 */
export async function fetchInbox(page: number): Promise<InboxPage> {
  await delay(API_CONFIG.fetchLatencyMs.min, API_CONFIG.fetchLatencyMs.max);
  maybeFail(API_CONFIG.fetchFailureRate);

  const items = idsForPage(page)
    .filter(id => !removed.has(id))
    .map(id => withServerState(generateEmail(id)));

  return {
    items,
    nextPage: page < TOTAL_PAGES ? page + 1 : null,
  };
}

/** Fetch a single message by id. Rejects if it has been archived or trashed. */
export async function fetchEmail(id: number): Promise<Email> {
  await delay(API_CONFIG.actionLatencyMs.min, API_CONFIG.actionLatencyMs.max);
  maybeFail(API_CONFIG.fetchFailureRate);
  if (removed.has(id)) {
    throw new Error(`Email ${id} no longer exists`);
  }
  return withServerState(generateEmail(id));
}

export async function archive(id: number): Promise<void> {
  await delay(API_CONFIG.actionLatencyMs.min, API_CONFIG.actionLatencyMs.max);
  maybeFail(API_CONFIG.actionFailureRate);
  removed.add(id);
}

export async function trash(id: number): Promise<void> {
  await delay(API_CONFIG.actionLatencyMs.min, API_CONFIG.actionLatencyMs.max);
  maybeFail(API_CONFIG.actionFailureRate);
  removed.add(id);
}

export async function setRead(id: number, isRead: boolean): Promise<void> {
  await delay(API_CONFIG.actionLatencyMs.min, API_CONFIG.actionLatencyMs.max);
  maybeFail(API_CONFIG.actionFailureRate);
  readOverrides.set(id, isRead);
}

/**
 * Restore a previously archived / trashed message. Only needed if you attempt
 * the optional Undo stretch goal.
 */
export async function restore(id: number): Promise<void> {
  await delay(API_CONFIG.actionLatencyMs.min, API_CONFIG.actionLatencyMs.max);
  maybeFail(API_CONFIG.actionFailureRate);
  removed.delete(id);
}

/** Test helper: wipe server-side state. Not for use in app code. */
export function __resetServerState(): void {
  readOverrides.clear();
  removed.clear();
}
