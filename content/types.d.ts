export type PageType = 'home' | 'hub' | 'service' | 'industry' | 'location' | 'case-study' | 'resource' | 'about' | 'action' | 'utility';
export interface Section { heading: string; paragraphs?: string[]; items?: string[]; }
export interface Page {
  slug: string; type: PageType; status: 'construction' | 'published';
  title: string; description: string; h1: string; label: string;
  approval: { facts: boolean; content: boolean; evidence: string[] };
  content: Section[]; relationships: string[]; plannedSections: string[];
  publishedAt?: string; updatedAt?: string; summary?: string; icon?: string;
  navOrder?: number; city?: string; author?: string; sources?: string[];
  caseStudy?: { facilityType: string; industry: string; region: string; services: string[]; challenge: string; objectives: string[]; approach: string[]; considerations: string[]; results: string[]; whyItWorked: string; category: string; clientId?: string; disclosureApproved: boolean };
}
export interface Customer {
  id: string; name: string; industry: string; logo: string | null;
  relationshipStatus: string; relationshipLabel: string;
  displayApproved: boolean; nameApproved: boolean; approvalEvidence: string | null;
  caseStudySlug?: string;
}
