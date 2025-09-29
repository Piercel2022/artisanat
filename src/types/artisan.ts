/**
 * FICHIER: src/types/artisan.ts
 * 
 * NOM: Types TypeScript pour Artisans
 * 
 * DESCRIPTION:
 * Définitions des types TypeScript pour les artisans, leurs données
 * et les structures associées (témoignages, créations, etc.)
 */
import { z } from "zod"

// Type principal pour un artisan
export interface Artisan {
  rating: number;
  phone: string;
  email: string;
  id: string;
  slug: string;
  name: string;
  firstName?: string;
  lastName?: string;
  craft: string;
  city: string;
  region: string;
  shortDescription: string;
  longDescription?: string;
  yearsExperience: number;
  profileImage?: string;
  coverImage?: string;
  specialties?: string[];
  certifications?: string[];
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  socialLinks?: string[];
  gallery?: string[];
  testimonials?: Testimonial[];
  creations?: Creation[];
  createdAt: Date;
  updatedAt: Date;
}

// Type pour les témoignages clients
export interface Testimonial {
  id: string;
  artisanSlug: string;
  clientName: string;
  clientInitials?: string;
  rating: number; // 1-5 étoiles
  content: string;
  projectType?: string;
  createdAt: Date;
  isVerified?: boolean;
}

// Type pour les créations/œuvres d'un artisan
export interface Creation {
  id: string;
  artisanSlug: string;
  title: string;
  description?: string;
  images: string[];
  category?: string;
  materials?: string[];
  dimensions?: {
    width?: number;
    height?: number;
    depth?: number;
    unit: 'cm' | 'mm' | 'm';
  };
  price?: number;
  isForSale?: boolean;
  createdAt: Date;
  completedAt?: Date;
}

// Type pour les filtres de recherche d'artisans
export interface ArtisanFilters {
  craft?: string;
  region?: string;
  city?: string;
  specialties?: string[];
  yearsExperienceMin?: number;
  yearsExperienceMax?: number;
  hasCertifications?: boolean;
  search?: string;
}

// Type pour les résultats paginés d'artisans
export interface PaginatedArtisans {
  artisans: Artisan[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  filters: ArtisanFilters;
}

// Type pour les statistiques d'un artisan
export interface ArtisanStats {
  totalViews: number;
  totalContacts: number;
  averageRating: number;
  totalTestimonials: number;
  totalCreations: number;
  profileCompleteness: number; // Pourcentage de complétude du profil
}

// Type pour les données de contact
export interface ContactRequest {
  artisanSlug: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  projectType?: string;
  message: string;
  budget?: string;
  timeline?: string;
  createdAt: Date;
}

// Type pour les métiers d'artisanat disponibles
export interface CraftCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  parentCategory?: string;
  subcategories?: CraftCategory[];
  artisanCount?: number;
}

// Type pour les régions avec comptage d'artisans
export interface Region {
  id: string;
  name: string;
  slug: string;
  code: string; // Code région INSEE
  cities: City[];
  artisanCount: number;
}

// Type pour les villes
export interface City {
  id: string;
  name: string;
  slug: string;
  region: string;
  postalCode?: string;
  artisanCount: number;
}

// Type pour les données d'authentification artisan
export interface ArtisanAuth {
  id: string;
  email: string;
  role: 'artisan' | 'admin';
  artisanProfile?: Artisan;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

// Type pour les paramètres de recherche avancée
export interface SearchParams {
  query?: string;
  craft?: string;
  region?: string;
  city?: string;
  sortBy?: 'relevance' | 'name' | 'experience' | 'rating' | 'recent';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Type pour les résultats de recherche
export interface SearchResults {
  artisans: Artisan[];
  total: number;
  facets: {
    crafts: { name: string; count: number }[];
    regions: { name: string; count: number }[];
    cities: { name: string; count: number }[];
  };
  suggestions?: string[];
  searchTime: number; // en millisecondes
}

// Types pour les formulaires
export interface ArtisanFormData {
  name: string;
  firstName?: string;
  lastName?: string;
  craft: string;
  city: string;
  region: string;
  shortDescription: string;
  longDescription?: string;
  yearsExperience: number;
  specialties: string[];
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  socialLinks: string[];
}

// Type pour les erreurs API
export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

// Type pour les réponses API standardisées
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: ApiError;
  timestamp: Date;
}

// Schéma Zod pour un artisan
export const ArtisanSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional(),
  image: z.string().url().optional(),
  slug: z.string().optional(),
  isActive: z.boolean().default(true),
  categoryIds: z.array(z.string().uuid()).optional()
})

