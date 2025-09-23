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

/**export interface ProductImage {
  id: string
  url: string
  altText: string
  ordre: number
  estPrincipale: boolean
}
**/

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

/**
 * Schémas Zod pour la validation des données produits
 */

import { z } from 'zod'

// Schéma pour l'image du produit
export const ProductImageSchema = z.object({
  url: z.string().url('URL de l\'image invalide'),
  alt: z.string().optional(),
  order: z.number().int().min(0).optional(),
})

// Schéma de base pour un produit
export const ProductBaseSchema = z.object({
  title: z.string().min(1, 'Le titre est requis').max(200, 'Le titre est trop long'),
  description: z.string().min(10, 'La description doit faire au moins 10 caractères'),
  shortDescription: z.string().max(300, 'La description courte est trop longue').optional(),
  price: z.number().positive('Le prix doit être positif'),
  originalPrice: z.number().positive().optional(),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
  sku: z.string().optional(),
  weight: z.number().positive().optional(),
  dimensions: z.object({
    length: z.number().positive().optional(),
    width: z.number().positive().optional(),
    height: z.number().positive().optional(),
  }).optional(),
  materials: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  featured: z.boolean().default(false),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  artisanId: z.string().min(1, 'L\'artisan est requis'),
  categoryId: z.string().min(1, 'La catégorie est requise'),
  images: z.array(ProductImageSchema).optional(),
})

// Schéma pour la création d'un produit
export const ProductCreateSchema = ProductBaseSchema.extend({
  images: z.array(ProductImageSchema).min(1, 'Au moins une image est requise'),
})

// Schéma pour la mise à jour d'un produit
export const ProductUpdateSchema = ProductBaseSchema.partial().extend({
  id: z.string().min(1, 'L\'ID du produit est requis'),
})

// Schéma pour les filtres de recherche
export const ProductFilterSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(50).default(12),
  category: z.string().optional(),
  artisanId: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  sortBy: z.enum([
    'createdAt',
    'updatedAt',
    'title',
    'price',
    'stock',
    'featured'
  ]).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Types TypeScript dérivés des schémas
export type ProductImage = z.infer<typeof ProductImageSchema>
export type ProductBase = z.infer<typeof ProductBaseSchema>
export type ProductCreate = z.infer<typeof ProductCreateSchema>
export type ProductUpdate = z.infer<typeof ProductUpdateSchema>
export type ProductFilter = z.infer<typeof ProductFilterSchema>

// Type pour le produit complet avec relations
export type ProductWithRelations = ProductBase & {
  id: string
  slug: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  artisan: {
    id: string
    name: string
    slug: string
    city: string
    department: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  images: ProductImage[]
  _count: {
    reviews: number
    favorites: number
  }
}

// Type pour la réponse API des produits
export type ProductsApiResponse = {
  success: boolean
  data: ProductWithRelations[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  filters: ProductFilter
  error?: string
  details?: any
}

// Type pour la réponse API d'un seul produit
export type ProductApiResponse = {
  success: boolean
  data?: ProductWithRelations
  error?: string
  message?: string
  details?: any
}
export type ProductStatus = 'brouillon' | 'actif' | 'inactif' | 'rupture' | 'archive'