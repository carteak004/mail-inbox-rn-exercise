/**
 * Shape of a single inbox message. Do not change this type; the mock API
 * depends on it and the reviewers will test against it.
 */
export type Email = {
  /** 1..TOTAL_EMAILS. id 1 is the newest message. */
  id: number;
  /** Display name of the sender, e.g. "Maya Thompson". */
  sender: string;
  senderEmail: string;
  /** 3–12 words, single line. */
  subject: string;
  /** 1–3 sentences; shown on the inbox row, clipped to 2 lines. */
  preview: string;
  /** 3–6 paragraphs separated by "\n\n"; shown on the message screen. */
  body: string;
  /** ISO 8601 timestamp. Strictly decreasing as id increases. */
  receivedAt: string;
  isRead: boolean;
  hasAttachment: boolean;
};

export type InboxPage = {
  items: Email[];
  /** Next page number to request, or null when the inbox is exhausted. */
  nextPage: number | null;
};
