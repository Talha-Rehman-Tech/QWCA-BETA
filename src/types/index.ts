export interface ServiceItem {
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  icon?: string;
  benefits: string[];
  deliverables: string[];
  regulatoryBodies?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  designation: string;
  qualification: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  featured?: boolean;
}

export interface PublicationItem {
  id: string;
  title: string;
  category: 'Taxation' | 'Corporate Law' | 'Auditing' | 'Economic Advisory';
  publishDate: string;
  summary: string;
  pdfUrl?: string;
  readTime: string;
}

export interface CostCalculatorOption {
  id: string;
  label: string;
  category: 'SECP Registration' | 'Taxation & FBR' | 'Intellectual Property' | 'Licenses & Compliance';
  estimatedCostPKR: number;
  description: string;
  required?: boolean;
}

