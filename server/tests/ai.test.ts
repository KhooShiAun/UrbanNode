import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { classifyReport } from '../utils/ai.ts';
import { calculateDeadline } from '../utils/deadline.ts';

describe('AI Helper - classifyReport', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test-api-key' };
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('should return uncategorised if GEMINI_API_KEY is not defined', async () => {
    delete process.env.GEMINI_API_KEY;
    const severity = await classifyReport('Shattered glass on floor');
    expect(severity).toBe('uncategorised');
  });

  it('should successfully return parsed category for low severity', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  severity: 'low',
                  reasoning: 'Minor paint wear on the park bench.',
                }),
              },
            ],
          },
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const severity = await classifyReport('Paint peeling on bench');
    expect(severity).toBe('low');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should successfully return parsed category for routine severity', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  severity: 'routine',
                  reasoning: 'Trash overflow is a regular scheduled hygiene issue.',
                }),
              },
            ],
          },
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const severity = await classifyReport('Trash is overflowing');
    expect(severity).toBe('routine');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should successfully return parsed category for urgent severity', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [
              {
                text: JSON.stringify({
                  severity: 'urgent',
                  reasoning: 'Shattered glass poses immediate risk of injury.',
                }),
              },
            ],
          },
        },
      ],
    };

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const severity = await classifyReport('Broken window with glass everywhere');
    expect(severity).toBe('urgent');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('should fallback to uncategorised on API connection error', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'));

    const severity = await classifyReport('Overflowing bin');
    expect(severity).toBe('uncategorised');
  });

  it('should fallback to uncategorised if response is not ok', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const severity = await classifyReport('Pothole on Main St');
    expect(severity).toBe('uncategorised');
  });
});

describe('AI Helper - calculateDeadline', () => {
  const baseDate = new Date('2026-07-01T12:00:00Z');

  it('calculates low severity deadline (+7 days)', () => {
    const deadline = calculateDeadline('low', baseDate);
    expect(deadline?.toISOString()).toBe('2026-07-08T12:00:00.000Z');
  });

  it('calculates routine severity deadline (+3 days)', () => {
    const deadline = calculateDeadline('routine', baseDate);
    expect(deadline?.toISOString()).toBe('2026-07-04T12:00:00.000Z');
  });

  it('calculates urgent severity deadline (+24 hours)', () => {
    const deadline = calculateDeadline('urgent', baseDate);
    expect(deadline?.toISOString()).toBe('2026-07-02T12:00:00.000Z');
  });

  it('returns null deadline for uncategorised', () => {
    const deadline = calculateDeadline('uncategorised', baseDate);
    expect(deadline).toBeNull();
  });
});
