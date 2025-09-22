/**
 * Fichier: src/types/order.ts
 * Description: Types et interfaces pour la gestion des commandes
 * But: Structurer le processus de commande, paiement et livraison
 * Rôle: Types essentiels pour le système e-commerce et suivi des transactions
 * Relation: Connecte les utilisateurs, produits, artisans et systèmes de paiement
 */

import { Artisan } from "./artisan"
import { CartItem, Product, ProductVariant } from "./product"
import { AdresseLivraison, User } from "./user"

export interface Order {
  id: string
  numeroCommande: string
  
  // Relations
  userId: string
  user: User
  
  // Statut et état
  statut: OrderStatus
  statutPaiement: PaymentStatus
  statutLivraison: ShippingStatus
  
  // Articles commandés
  items: OrderItem[]
  
  // Montants
  sousTotal: number
  fraisLivraison: number
  taxes: number
  remise: number
  montantTotal: number
  
  // Adresses
  adresseLivraison: AdresseLivraison
  adresseFacturation: AdresseLivraison
  
  // Livraison
  methodeLivraison: ShippingMethod
  transporteur?: string
  numeroSuivi?: string
  dateExpedition?: Date
  dateLivraisonEstimee?: Date
  dateLivraison?: Date
  
  // Paiement
  methodePaiement: PaymentMethod
  transactionId?: string
  
  // Communication
  notes?: string
  notesInternes?: string
  historique: OrderHistory[]
  
  // Dates
  dateCreation: Date
  dateMiseAJour: Date
  dateConfirmation?: Date
  dateAnnulation?: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  product: Product
  artisanId: string
  artisan: Artisan
  
  // Détails produit au moment de la commande
  nomProduit: string
  skuProduit: string
  variante?: ProductVariant
  
  // Quantité et prix
  quantite: number
  prixUnitaire: number
  prixTotal: number
  
  // Personnalisations
  personnalisations?: Record<string, string>
  
  // Statut spécifique à l'item
  statut: OrderItemStatus
  tempsFabricationEstime: number
  dateDebutFabrication?: Date
  dateFinFabrication?: Date
  
  // Notes
  notesClient?: string
  notesArtisan?: string
}

export interface OrderHistory {
  id: string
  orderId: string
  action: OrderAction
  description: string
  ancienStatut?: OrderStatus
  nouveauStatut?: OrderStatus
  userId?: string
  username?: string
  dateAction: Date
  metadonnees?: Record<string, any>
}

// Types d'énumérations pour les statuts
export type OrderStatus = 
  | 'brouillon'
  | 'en_attente_paiement'
  | 'payee'
  | 'confirmee'
  | 'en_preparation'
  | 'en_cours_fabrication'
  | 'prete_expedition'
  | 'expediee'
  | 'livree'
  | 'annulee'
  | 'remboursee'
  | 'litige'

export type PaymentStatus = 
  | 'en_attente'
  | 'en_cours'
  | 'payee'
  | 'echouee'
  | 'annulee'
  | 'remboursee'
  | 'remboursement_partiel'

export type ShippingStatus = 
  | 'non_expediee'
  | 'en_preparation'
  | 'expediee'
  | 'en_transit'
  | 'livree'
  | 'echec_livraison'
  | 'retournee'

export type OrderItemStatus = 
  | 'en_attente'
  | 'confirmee'
  | 'en_fabrication'
  | 'terminee'
  | 'expediee'
  | 'livree'
  | 'annulee'

export type OrderAction = 
  | 'creation'
  | 'paiement'
  | 'confirmation'
  | 'preparation'
  | 'fabrication_debut'
  | 'fabrication_fin'
  | 'expedition'
  | 'livraison'
  | 'annulation'
  | 'remboursement'
  | 'modification'

// Types pour les méthodes de paiement et livraison
export interface PaymentMethod {
  id: string
  type: 'carte' | 'paypal' | 'virement' | 'cheque' | 'especes'
  nom: string
  description?: string
  estActif: boolean
  frais?: number
  delaiTraitement?: number
}

export interface ShippingMethod {
  id: string
  nom: string
  description: string
  type: 'standard' | 'express' | 'retrait' | 'livraison_main'
  prix: number
  delaiMin: number // jours
  delaiMax: number // jours
  transporteur?: string
  estActif: boolean
  zones: string[] // codes postaux ou régions
}

// Types pour les formulaires de commande
export interface CreateOrderInput {
  userId: string
  items: {
    productId: string
    quantite: number
    variante?: string
    personnalisations?: Record<string, string>
  }[]
  adresseLivraison: Omit<AdresseLivraison, 'id'>
  adresseFacturation?: Omit<AdresseLivraison, 'id'>
  methodeLivraison: string
  methodePaiement: string
  codePromo?: string
  notes?: string
}

export interface UpdateOrderStatusInput {
  orderId: string
  nouveauStatut: OrderStatus
  notes?: string
  notifierClient?: boolean
}

// Types pour les recherches et filtres
export interface OrderFilters {
  statut?: OrderStatus[]
  statutPaiement?: PaymentStatus[]
  statutLivraison?: ShippingStatus[]
  userId?: string
  artisanId?: string
  dateCommande?: {
    debut: Date
    fin: Date
  }
  montant?: {
    min: number
    max: number
  }
  methodePaiement?: string
  methodeLivraison?: string
}

export interface OrderSearchParams {
  query?: string // numéro commande, nom client
  filters?: OrderFilters
  sortBy?: 'dateCreation' | 'montantTotal' | 'statut' | 'numeroCommande'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Types pour le panier avant commande
export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  sousTotal: number
  fraisLivraison?: number
  taxes?: number
  remise?: number
  montantTotal: number
  codePromo?: string
  dateCreation: Date
  dateMiseAJour: Date
  dateExpiration: Date
}

// Types pour les statistiques de commandes
export interface OrderStats {
  totalCommandes: number
  chiffreAffaires: number
  commandeMoyenne: number
  commandesParStatut: Record<OrderStatus, number>
  evolutionMensuelle: {
    mois: string
    commandes: number
    chiffreAffaires: number
  }[]
  topProduits: {
    productId: string
    nomProduit: string
    quantiteVendue: number
    chiffreAffaires: number
  }[]
}