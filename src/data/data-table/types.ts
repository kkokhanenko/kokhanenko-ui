export type KDataTableKey = string | number;
export type KDataTableRow = object;
export type KDataTableMode = 'table' | 'cards';
export type KDataTableSortDirection = 'asc' | 'desc';
export type KDataTableAlign = 'start' | 'center' | 'end';
import type { KTableFilterDefinition } from '../table-filters/types';
import type { KActionMenuItem } from '../../overlays/action-menu/types';

export type KDataTableColumnKind = 'text' | 'actions';

export type KDataTableAction = KActionMenuItem;

export interface KDataTableColumn<TRow extends KDataTableRow = KDataTableRow> {
  key: string;
  label: string;
  kind?: KDataTableColumnKind;
  value?: (row: TRow) => unknown;
  actions?: (row: TRow) => KDataTableAction[];
  sortable?: boolean;
  align?: KDataTableAlign;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  headerClass?: string;
  cellClass?: string;
  filter?: KTableFilterDefinition;
}

export interface KDataTableActionEvent<TRow extends KDataTableRow = KDataTableRow> {
  row: TRow;
  action: KDataTableAction;
  column: KDataTableColumn<TRow>;
}

export interface KColumnPickerOption {
  value: string;
  label: string;
  locked?: boolean;
}
