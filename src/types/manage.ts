export interface Click {
  country: string;
  city: string;
  os: string;
  device: string;
  createdAt: string;
}

export interface UrlSummary {
  id: number;
  destination: string;
  customCode: string;
  createdAt: string;
}

export interface UrlData extends UrlSummary {
  clicks: Click[];
}

export interface StoredProfile {
  email: string;
  name: string;
}
