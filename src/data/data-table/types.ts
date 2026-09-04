export type KDataTableKey = string | number;
export type KDataTableRow = object;
export type KDataTableMode = 'table' | 'cards';
export type KDataTableSortDirection = 'asc' | 'desc';
export type KDataTableAlign = 'start' | 'center' | 'end';
import type { KTableFilterDefinition } from '../table-filters/types';

export interface KDataTableColumn<TRow extends KDataTableRow = KDataTableRow> {
  key: string;
  label: string;
  value?: (row: TRow) => unknown;
  sortable?: boolean;
  align?: KDataTableAlign;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  headerClass?: string;
  cellClass?: string;
  filter?: KTableFilterDefinition;
}

export interface KColumnPickerOption {
  value: string;
  label: string;
  locked?: boolean;
}
