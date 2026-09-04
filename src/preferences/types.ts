export type KUiPreferencePrimitive = string | number | boolean | null;

export type KUiPreferenceValue =
  | KUiPreferencePrimitive
  | KUiPreferenceValue[]
  | { [key: string]: KUiPreferenceValue };

export interface KUiPreferenceRecord<T extends KUiPreferenceValue = KUiPreferenceValue> {
  version: number;
  value: T;
  updatedAt?: string;
}

export interface KUiPreferencesAdapter {
  load(scope: string): Promise<KUiPreferenceRecord | null>;
  save(scope: string, record: KUiPreferenceRecord): Promise<void>;
  remove?(scope: string): Promise<void>;
}

export interface KUiPreferenceOptions<T extends KUiPreferenceValue> {
  adapter: KUiPreferencesAdapter;
  scope: string;
  version: number;
  defaultValue: T;
  debounceMs?: number;
  normalize?: (value: unknown, fallback: T) => T;
  migrate?: (value: unknown, fromVersion: number, fallback: T) => T;
  onError?: (error: unknown) => void;
}

export interface KUiPreferenceController<T extends KUiPreferenceValue> {
  load(): Promise<T>;
  scheduleSave(value: T): void;
  flush(): Promise<void>;
  reset(): Promise<T>;
  dispose(): void;
}
