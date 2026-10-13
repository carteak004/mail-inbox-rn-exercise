/**
 * Sanity checks for the mock API. These must keep passing; feel free to add
 * your own tests alongside them.
 */
import { generateEmail, idsForPage, PAGE_SIZE, TOTAL_EMAILS, TOTAL_PAGES } from '../src/api/data';
import { archive, fetchInbox, setRead, __resetServerState, API_CONFIG } from '../src/api/api';

beforeEach(() => __resetServerState());

test('data is deterministic', () => {
  expect(generateEmail(42)).toEqual(generateEmail(42));
  expect(generateEmail(1).id).toBe(1);
  expect(() => generateEmail(0)).toThrow(RangeError);
  expect(() => generateEmail(TOTAL_EMAILS + 1)).toThrow(RangeError);
});

test('timestamps decrease as id increases', () => {
  const a = new Date(generateEmail(1).receivedAt).getTime();
  const b = new Date(generateEmail(500).receivedAt).getTime();
  expect(a).toBeGreaterThan(b);
});

test('pages cover the whole inbox exactly once', () => {
  expect(idsForPage(1)).toHaveLength(PAGE_SIZE);
  expect(idsForPage(1)[0]).toBe(1);
  expect(idsForPage(TOTAL_PAGES).at(-1)).toBe(TOTAL_EMAILS);
  expect(idsForPage(TOTAL_PAGES + 1)).toHaveLength(0);
});

async function untilOk<T>(fn: () => Promise<T>): Promise<T> {
  for (let i = 0; i < 20; i++) {
    try {
      return await fn();
    } catch {
      /* retry on simulated network error */
    }
  }
  throw new Error('mock API kept failing');
}

test('server state is reflected on refetch', async () => {
  const first = await untilOk(() => fetchInbox(1));
  expect(first.nextPage).toBe(2);
  const target = first.items[0];

  await untilOk(() => setRead(target.id, !target.isRead));
  await untilOk(() => archive(first.items[1].id));

  const again = await untilOk(() => fetchInbox(1));
  expect(again.items.find(e => e.id === target.id)?.isRead).toBe(!target.isRead);
  expect(again.items.find(e => e.id === first.items[1].id)).toBeUndefined();
  expect(again.items).toHaveLength(PAGE_SIZE - 1);
}, 30_000);

test('failure rates are the documented values', () => {
  expect(API_CONFIG.fetchFailureRate).toBe(0.1);
  expect(API_CONFIG.actionFailureRate).toBe(0.2);
});
