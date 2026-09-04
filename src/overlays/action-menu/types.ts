export interface KActionMenuItem {
  id: string;
  label: string;
  disabled?: boolean;
  hidden?: boolean;
  tone?: 'default' | 'danger';
  icon?: string;
}
