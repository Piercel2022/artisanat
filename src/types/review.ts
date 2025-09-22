/**
 * Fichier: src/types/review.ts
 * Description: Types et interfaces pour le système d'avis et évaluations
 * But: Gérer les avis clients sur les produits et artisans
 * Rôle: Types pour la modération, affichage et calcul des notes moyennes
 * Relation: Lie les utilisateurs aux produits et artisans pour le feedback
 */

import { User } from "next-auth"
import { Artisan } from "./artisan"
import { Order } from "./order"
import { Product } from "./product"

export interface Review {
  id: string
  
  // Relations
  userId: string
  user: User
  productId?: string
  product?: Product
  artisanId?: string
  artisan?: Artisan
  orderId: string
  order: Order
  
  // Contenu de l'avis
  titre: string
  commentaire: string
  note: number // 1 à 5 étoiles
  
  // Évaluations détaillées
  notes: ReviewRating[]
  
  // Médias
  photos: ReviewPhoto[]
  
  // Modération
  statut: ReviewStatus
  estVerifie: boolean
  estRecommande: boolean
  
  // Interaction
  nbUtile: number
  nbPasUtile: number
  signalements: ReviewReport[]
  
  // Réponse de l'artisan
  reponseArtisan?: ArtisanResponse
  
  // Métadonnées
  dateCreation: Date
  dateMiseAJour: Date
  datePublication?: Date
  dateMasquage?: Date
  
  // Données de commande au moment de l'avis
  achatVerifie: boolean
  dateAchat: Date
}

export interface ReviewRating {
  id: string
  critere: string // "Qualité", "Communication", "Délai", "Emballage"
  note: number // 1 à 5
  poids?: number // Pour le calcul de la moyenne pondérée
}

export interface ReviewPhoto {
  id: string
  reviewId: string
  url: string
  altText: string
  ordre: number
  estApprouvee: boolean
}

export interface ReviewReport {
  id: string
  reviewId: string
  userId: string
  user: User
  motif: ReportReason
  description?: string
  dateSignalement: Date
  statut: ReportStatus
  moderateurId?: string
  dateTraitement?: Date
  actionPrise?: string
}

export interface ArtisanResponse {
  id: string
  reviewId: string
  artisanId: string
  artisan: Artisan
  contenu: string
  dateReponse: Date
  dateMiseAJour?: Date
  estPublique: boolean
}

// Types d'énumérations
export type ReviewStatus = 
  | 'en_attente'
  | 'approuve'
  | 'rejete'
  | 'masque'
  | 'signale'
  | 'supprime'

export type ReportReason = 
  | 'contenu_inapproprie'
  | 'langage_offensant'
  | 'faux_avis'
  | 'spam'
  | 'hors_sujet'
  | 'conflit_interet'
  | 'autre'

export type ReportStatus = 
  | 'en_attente'
  | 'en_cours'
  | 'traite'
  | 'rejete'
  | 'resolu'

// Types pour les formulaires
export interface CreateReviewInput {
  userId: string
  productId?: string
  artisanId?: string
  orderId: string
  titre: string
  commentaire: string
  note: number
  notes?: {
    critere: string
    note: number
  }[]
  photos?: File[]
}

export interface UpdateReviewInput {
  id: string
  titre?: string
  commentaire?: string
  note?: number
  notes?: {
    critere: string
    note: number
  }[]
}

export interface CreateArtisanResponseInput {
  reviewId: string
  artisanId: string
  contenu: string
  estPublique: boolean
}

// Types pour les filtres et recherche
export interface ReviewFilters {
  note?: number[]
  statut?: ReviewStatus[]
  achatVerifie?: boolean
  avecPhotos?: boolean
  avecReponse?: boolean
  dateCreation?: {
    debut: Date
    fin: Date
  }
  userId?: string
  productId?: string
  artisanId?: string
}

export interface ReviewSearchParams {
  query?: string
  filters?: ReviewFilters
  sortBy?: 'dateCreation' | 'note' | 'utile' | 'dateAchat'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Types pour les statistiques d'avis
export interface ReviewStats {
  totalAvis: number
  noteMoyenne: number
  repartitionNotes: {
    note: number
    nombre: number
    pourcentage: number
  }[]
  notesDetaillees?: {
    critere: string
    moyenne: number
    nombre: number
  }[]
  evolutionMensuelle: {
    mois: string
    nombre: number
    moyenne: number
  }[]
  tauxReponse?: number // Pour les artisans
}

// Types pour l'affichage des avis
export interface ReviewSummary {
  totalAvis: number
  noteMoyenne: number
  repartitionNotes: Record<number, number>
  tauxRecommandation: number
  dernierAvis?: Date
  criteresNotes?: Record<string, number>
}

// Types pour les actions utilisateur
export interface ReviewVote {
  id: string
  reviewId: string
  userId: string
  type: 'utile' | 'pas_utile'
  dateVote: Date
}

// Types pour la modération
export interface ReviewModerationAction {
  id: string
  reviewId: string
  moderateurId: string
  action: 'approuver' | 'rejeter' | 'masquer' | 'supprimer'
  motif?: string
  commentaireInterne?: string
  dateAction: Date
}

export interface ReviewModerationQueue {
  reviews: Review[]
  total: number
  enAttente: number
  traites: number
  signales: number
}