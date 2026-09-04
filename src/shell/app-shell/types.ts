export interface KAppBrand {
  name: string;
  subtitle?: string;
  logoUrl?: string;
  logoAlt?: string;
}

export interface KAppNavigationItem {
  id: string;
  label: string;
  hint?: string;
  icon?: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  children?: KAppNavigationItem[];
}

export interface KAppUser {
  name: string;
  avatarUrl?: string;
  initials?: string;
}
