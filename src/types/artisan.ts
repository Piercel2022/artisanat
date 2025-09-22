/**
 * Fichier: src/types/artisan.ts
 * Description: Types et interfaces pour les artisans
 * But: Définir la structure des données des artisans et leurs informations
 * Rôle: Types centraux pour la gestion des profils d'artisans dans l'application
 * Relation: Utilisé dans les pages artisans, l'admin, les API et les composants de profil
 */

import { Order } from "./order"
import { Product } from "./product"
import { Review } from "./review"

export interface Artisan {
  id: string
  slug: string
  nom: string
  prenom: string
  nomAtelier: string
  email: string
  telephone?: string
  bio: string
  
  // Adresse et localisation
  adresse: Adresse
  
  // Métier et spécialités
  metier: string
  specialites: string[]
  
  // Médias
  avatar?: string
  photosAtelier: string[]
  
  // Réseaux sociaux
  reseauxSociaux: ReseauxSociaux
  
  // Informations professionnelles
  experience: number // années d'expérience
  formations: Formation[]
  certifications: Certification[]
  
  // Statut et visibilité
  estActif: boolean
  estVerifie: boolean
  estPremium: boolean
  
  // Métadonnées
  dateCreation: Date
  dateMiseAJour: Date
  
  // Relations
  produits?: Product[]
  commandes?: Order[]
  avis?: Review[]
}

export interface Adresse {
  rue: string
  ville: string
  codePostal: string
  region: string
  pays: string
  coordonnees?: {
    latitude: number
    longitude: number
  }
}

export interface ReseauxSociaux {
  instagram?: string
  facebook?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  website?: string
}

export interface Formation {
  id: string
  nom: string
  etablissement: string
  anneeObtention: number
  description?: string
}

export interface Certification {
  id: string
  nom: string
  organisme: string
  dateObtention: Date
  dateExpiration?: Date
  numeroReference?: string
}

// Types pour les formulaires et l'administration
export interface CreateArtisanInput {
  nom: string
  prenom: string
  nomAtelier: string
  email: string
  telephone?: string
  bio: string
  adresse: Omit<Adresse, 'coordonnees'>
  metier: string
  specialites: string[]
  experience: number
  reseauxSociaux?: Partial<ReseauxSociaux>
}

export interface UpdateArtisanInput extends Partial<CreateArtisanInput> {
  id: string
}

// Types pour les filtres et recherches
export interface ArtisanFilters {
  metier?: string
  region?: string
  ville?: string
  specialites?: string[]
  experience?: {
    min?: number
    max?: number
  }
  estVerifie?: boolean
  estPremium?: boolean
}

export interface ArtisanSearchParams {
  query?: string
  filters?: ArtisanFilters
  sortBy?: 'nom' | 'experience' | 'dateCreation' | 'ville'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Type pour les statistiques d'artisan
export interface ArtisanStats {
  totalProduits: number
  totalCommandes: number
  moyenneAvis: number
  totalAvis: number
  chiffreAffaires?: number
}

export type ArtisanStatus = 'actif' | 'inactif' | 'suspendu' | 'en_attente'