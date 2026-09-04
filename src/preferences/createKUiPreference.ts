import type {
  KUiPreferenceController,
  KUiPreferenceOptions,
  KUiPreferenceRecord,
  KUiPreferenceValue,
} from './types';

const clone = <T extends KUiPreferenceValue>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export function createKUiPreference<T extends KUiPreferenceValue>(
  options: KUiPreferenceOptions<T>,
): KUiPreferenceController<T> {
  if (!options.scope.trim()) throw new Error('UI preference scope must not be empty.');
  if (!Number.isInteger(options.version) || options.version < 1) throw new Error('UI preference version must be a positive integer.');

  const delay = Math.max(0, options.debounceMs ?? 400);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let pending: T | undefined;
  let saveQueue: Promise<void> = Promise.resolve();

  const reportError = (error: unknown) => {
    options.onError?.(error);
    return error;
  };

  const normalize = (value: unknown): T => options.normalize
    ? options.normalize(value, clone(options.defaultValue))
    : clone(value as T);

  const load = async (): Promise<T> => {
    const record = await options.adapter.load(options.scope);
    if (!record) return clone(options.defaultValue);
    if (record.version === options.version) return normalize(record.value);
    if (options.migrate) return options.migrate(record.value, record.version, clone(options.defaultValue));
    return clone(options.defaultValue);
  };

  const flush = async (): Promise<void> => {
    if (timer) clearTimeout(timer);
    timer = null;
    if (pending === undefined) {
      await saveQueue;
      return;
    }
    const value = pending;
    pending = undefined;
    const record: KUiPreferenceRecord<T> = { version: options.version, value: clone(value) };
    saveQueue = saveQueue.catch(() => undefined).then(() => options.adapter.save(options.scope, record));
    try {
      await saveQueue;
    } catch (error) {
      throw reportError(error);
    }
  };

  const scheduleSave = (value: T): void => {
    pending = clone(value);
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { void flush().catch(() => undefined); }, delay);
  };

  const reset = async (): Promise<T> => {
    if (timer) clearTimeout(timer);
    timer = null;
    pending = undefined;
    await saveQueue.catch(() => undefined);
    if (options.adapter.remove) await options.adapter.remove(options.scope);
    return clone(options.defaultValue);
  };

  const dispose = (): void => {
    if (timer) clearTimeout(timer);
    timer = null;
    pending = undefined;
  };

  return { load, scheduleSave, flush, reset, dispose };
}
