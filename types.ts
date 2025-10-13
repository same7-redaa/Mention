export interface NavLink {
  href: string;
  label: string;
}

export interface Service {
  icon: string;
  title: string;
  description: string;
  items: string[];
}

export interface PortfolioItem {
  id: number;
  imageUrl: string;
  title: string;
  category: string;
  type: 'image' | 'video';
  videoUrl?: string;
}

export interface Client {
  id: number;
  logoUrl: string;
  name: string;
}

export interface Value {
    icon: string;
    text: string;
}