/**
 * Fichier: src/types/product.ts
 * Description: Types et interfaces pour les produits artisanaux
 * But: Définir la structure des produits, leurs variantes et caractéristiques
 * Rôle: Types essentiels pour le catalogue produits et la gestion e-commerce
 * Relation: Utilisé dans le catalogue, panier, commandes, et interface admin
 */

import { Artisan } from "./artisan"
import { OrderItem } from "./order"
import { Review } from "./review"

export interface Product {
  id: string
  slug: string
  nom: string
  description: string
  descriptionCourte?: string
  
  // Pricing et stock
  prix: number
  prixPromo?: number
  enStock: boolean
  quantiteStock?: number
  
  // Catégorisation
  categorie: Category
  sousCategorie?: SubCategory
  tags: string[]
  
  // Médias
  images: ProductImage[]
  videosDemo?: string[]
  
  // Caractéristiques produit
  dimensions?: Dimensions
  poids?: number // en grammes
  materiaux: string[]
  couleurs: string[]
  
  // Fabrication
  tempsFabrication: number // en jours
  estPersonnalisable: boolean
  optionsPersonnalisation?: PersonalizationOption[]
  
  // Relations
  artisanId: string
  artisan?: Artisan
  
  // Métadonnées SEO
  metaTitle?: string
  metaDescription?: string
  
  // Statut
  estActif: boolean
  estEnVedette: boolean
  estNouveaute: boolean
  
  // Dates
  dateCreation: Date
  dateMiseAJour: Date
  datePublication?: Date
  
  // Relations commerce
  variantes?: ProductVariant[]
  avis?: Review[]
  commandes?: OrderItem[]
}

export interface ProductImage {
  id: string
  url: string
  altText: string
  ordre: number
  estPrincipale: boolean
}

export interface Dimensions {
  longueur: number // en cm
  largeur: number // en cm
  hauteur: number // en cm
  unite: 'cm' | 'mm' | 'm'
}

export interface PersonalizationOption {
  id: string
  nom: string
  type: 'text' | 'select' | 'color' | 'number'
  obligatoire: boolean
  options?: string[] // Pour type 'select'
  prixSupplement?: number
  description?: string
}

export interface ProductVariant {
  id: string
  nom: string
  sku: string
  prix: number
  prixPromo?: number
  quantiteStock: number
  attributs: VariantAttribute[]
  images?: string[]
}

export interface VariantAttribute {
  nom: string // ex: "Couleur", "Taille"
  valeur: string // ex: "Rouge", "L"
}

// Types pour les catégories
export interface Category {
  id: string
  nom: string
  slug: string
  description?: string
  image?: string
  ordre: number
  sousCategories?: SubCategory[]
  estActive: boolean
}

export interface SubCategory {
  id: string
  nom: string
  slug: string
  description?: string
  categorieParentId: string
  ordre: number
  estActive: boolean
}

// Types pour les formulaires
export interface CreateProductInput {
  nom: string
  description: string
  descriptionCourte?: string
  prix: number
  categorieId: string
  sousCategorieId?: string
  tags: string[]
  materiaux: string[]
  couleurs: string[]
  tempsFabrication: number
  estPersonnalisable: boolean
  dimensions?: Omit<Dimensions, 'unite'>
  poids?: number
  artisanId: string
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string
}

// Types pour la recherche et filtres
export interface ProductFilters {
  categorie?: string
  sousCategorie?: string
  artisan?: string
  region?: string
  prix?: {
    min?: number
    max?: number
  }
  materiaux?: string[]
  couleurs?: string[]
  tags?: string[]
  enStock?: boolean
  estPersonnalisable?: boolean
  estNouveaute?: boolean
  estEnVedette?: boolean
}

export interface ProductSearchParams {
  query?: string
  filters?: ProductFilters
  sortBy?: 'nom' | 'prix' | 'dateCreation' | 'popularite'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Types pour le panier et wishlist
export interface CartItem {
  productId: string
  product: Product
  quantite: number
  variante?: ProductVariant
  personnalisations?: Record<string, string>
  prixUnitaire: number
  prixTotal: number
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product: Product
  dateAjout: Date
}

export type ProductStatus = 'brouillon' | 'actif' | 'inactif' | 'rupture' | 'archive'