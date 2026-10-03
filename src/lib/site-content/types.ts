export type StatusBarUpdate = {
  id: string;
  text: string;
  href: string;
};

export type SiteNewsItem = {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  body: string[];
  image: string;
  featured: boolean;
};

export type SiteEvent = {
  id: string;
  title: string;
  date: string;
  location: string;
  mode: string;
  image: string;
  description: string;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  featured?: boolean;
};

export type SpotlightArticle = {
  id: string;
  category: string;
  title: string;
  image: string;
  href: string;
};

export type SiteContent = {
  statusBarUpdates: StatusBarUpdate[];
  newsItems: SiteNewsItem[];
  events: SiteEvent[];
  galleryItems: GalleryItem[];
  spotlightArticles: SpotlightArticle[];
  updatedAt: string;
};

export type SiteContentSection = keyof Omit<SiteContent, "updatedAt">;
