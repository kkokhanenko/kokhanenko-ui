export type KSelectValue = string | number;

export interface KSelectOption {
  value: KSelectValue;
  label: string;
  hint?: string;
  disabled?: boolean;
}
