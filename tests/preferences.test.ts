import { describe, expect, it, vi } from 'vitest';
import { createKUiPreference } from '../src/preferences';
import type { KUiPreferenceRecord, KUiPreferencesAdapter } from '../src/preferences';

type State = { columns: string[]; compact: boolean };

const defaults: State = { columns: ['date', 'amount'], compact: false };

describe('UI preferences', () => {
  it('loads, normalizes and isolates stored values', async () => {
    const stored: KUiPreferenceRecord<State> = { version: 1, value: { columns: ['amount'], compact: true } };
    const adapter: KUiPreferencesAdapter = {
      load: vi.fn(async () => stored),
      save: vi.fn(async () => undefined),
    };
    const preference = createKUiPreference<State>({
      adapter,
      scope: 'reports.main',
      version: 1,
      defaultValue: defaults,
      normalize: (value, fallback) => {
        const source = value as Partial<State>;
        return {
          columns: Array.isArray(source.columns) ? source.columns.map(String) : fallback.columns,
          compact: typeof source.compact === 'boolean' ? source.compact : fallback.compact,
        };
      },
    });

    const loaded = await preference.load();
    expect(loaded).toEqual(stored.value);
    loaded.columns.push('status');
    expect(stored.value.columns).toEqual(['amount']);
  });

  it('debounces changes and saves only the latest serializable state', async () => {
    vi.useFakeTimers();
    const save = vi.fn(async () => undefined);
    const adapter: KUiPreferencesAdapter = { load: vi.fn(async () => null), save };
    const preference = createKUiPreference<State>({ adapter, scope: 'reports.main', version: 2, defaultValue: defaults, debounceMs: 50 });

    preference.scheduleSave({ columns: ['date'], compact: false });
    preference.scheduleSave({ columns: ['amount'], compact: true });
    await vi.advanceTimersByTimeAsync(50);

    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('reports.main', { version: 2, value: { columns: ['amount'], compact: true } });
    vi.useRealTimers();
  });

  it('uses defaults for an unsupported version and can remove a preference', async () => {
    const remove = vi.fn(async () => undefined);
    const adapter: KUiPreferencesAdapter = {
      load: vi.fn(async () => ({ version: 1, value: { columns: ['legacy'], compact: true } })),
      save: vi.fn(async () => undefined),
      remove,
    };
    const preference = createKUiPreference<State>({ adapter, scope: 'reports.main', version: 2, defaultValue: defaults });

    expect(await preference.load()).toEqual(defaults);
    expect(await preference.reset()).toEqual(defaults);
    expect(remove).toHaveBeenCalledWith('reports.main');
  });
});
