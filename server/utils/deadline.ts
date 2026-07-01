import type { Severity } from './ai.ts';

/**
 * Calculates a possible SLA deadline based on the report severity.
 * - urgent: 24 hours (1 day)
 * - routine: 3 days
 * - low: 7 days
 * - uncategorised: null (requires manual admin review)
 *
 * @param severity The classified severity.
 * @param fromDate The starting time (defaults to now).
 */
export function calculateDeadline(severity: Severity, fromDate: Date = new Date()): Date | null {
  const deadline = new Date(fromDate);
  switch (severity) {
    case 'urgent':
      deadline.setHours(deadline.getHours() + 24);
      return deadline;
    case 'routine':
      deadline.setDate(deadline.getDate() + 3);
      return deadline;
    case 'low':
      deadline.setDate(deadline.getDate() + 7);
      return deadline;
    case 'uncategorised':
    default:
      return null;
  }
}
