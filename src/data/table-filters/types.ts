import type { KSelectOption, KSelectValue } from '../../controls/select';

export interface KTableDateRangeValue {
  from: string;
  to: string;
}

export interface KTableNumberRangeValue {
  from: number | null;
  to: number | null;
}

export type KTableFilterValue = KSelectValue[] | KTableDateRangeValue | KTableNumberRangeValue | null;
export type KTableFilterValues = Record<string, KTableFilterValue>;

interface KTableFilterBase {
  label?: string;
  placeholder?: string;
}

export interface KTableMultiSelectFilter extends KTableFilterBase {
  type: 'multi-select';
  options: KSelectOption[];
  searchable?: boolean | 'auto';
  showSelectAll?: boolean;
  selectAllLabel?: string;
  allSelectionMode?: 'explicit' | 'implicit-empty';
}

export interface KTableDateRangeFilter extends KTableFilterBase {
  type: 'date-range';
  min?: string;
  max?: string;
}

export interface KTableNumberRangeFilter extends KTableFilterBase {
  type: 'number-range';
  min?: number;
  max?: number;
  step?: number;
}

export type KTableFilterDefinition = KTableMultiSelectFilter | KTableDateRangeFilter | KTableNumberRangeFilter;

export const isKTableFilterActive = (value: KTableFilterValue | undefined): boolean => {
  if (Array.isArray(value)) return value.length > 0;
  if (!value) return false;
  return value.from !== '' && value.from !== null || value.to !== '' && value.to !== null;
};
