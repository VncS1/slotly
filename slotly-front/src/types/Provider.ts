export interface ProviderCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProviderSummary {
  id: number;
  name: string;
  business_slug: string;
  avatar_url: string | null;
  bio: string | null;
  category?: ProviderCategory | null;
}
