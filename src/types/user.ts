/**
 * Fichier: src/types/user.ts
 * Description: Types et interfaces pour les utilisateurs et l'authentification
 * But: Gérer les différents types d'utilisateurs et leurs permissions
 * Rôle: Types fondamentaux pour l'authentification, autorisation et gestion des comptes
 * Relation: Utilisé dans l'auth, les sessions, l'admin et tous les composants utilisateur
 */

export interface User {
  id: string
  email: string
  nom?: string
  prenom?: string
  username?: string
  avatar?: string
  telephone?: string
  
  // Informations personnelles
  dateNaissance?: Date
  genre?: 'homme' | 'femme' | 'non_specifie'
  
  // Adresse par défaut
  adresseDefaut?: Adresse
  adressesLivraison: AdresseLivraison[]
  
  // Statut compte
  estActif: boolean
  estVerifie: boolean
  emailVerifie: boolean
  telephoneVerifie: boolean
  
  // Rôles et permissions
  role: UserRole
  permissions: Permission[]
  
  // Préférences
  preferences: UserPreferences
  
  // Dates
  dateCreation: Date
  dateMiseAJour: Date
  derniereConnexion?: Date
  
  // Relations commerce
  commandes?: Order[]
  wishlist?: WishlistItem[]
  avis?: Review[]
  
  // Si l'utilisateur est aussi artisan
  artisanProfile?: Artisan
}

export interface AdresseLivraison {
  id: string
  nom: string // "Maison", "Bureau", etc.
  destinataire: string
  rue: string
  ville: string
  codePostal: string
  region: string
  pays: string
  telephone?: string
  instructions?: string
  estDefaut: boolean
}

export interface UserPreferences {
  langue: 'fr' | 'en' | 'es'
  devise: 'EUR' | 'USD'
  newsletter: boolean
  notificationsEmail: boolean
  notificationsPush: boolean
  notificationsSMS: boolean
  themeInterface?: 'clair' | 'sombre' | 'auto'
  categoriesFavorites: string[]
  regionsInterets: string[]
}

// Types pour les rôles et permissions
export type UserRole = 'client' | 'artisan' | 'moderateur' | 'admin' | 'super_admin'

export interface Permission {
  id: string
  nom: string
  description: string
  ressource: string // 'products', 'artisans', 'users', etc.
  actions: PermissionAction[]
}

export type PermissionAction = 'read' | 'create' | 'update' | 'delete' | 'publish' | 'moderate'

// Types pour l'authentification
export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  nom?: string
  prenom?: string
  accepteConditions: boolean
  accepteNewsletter?: boolean
}

export interface ResetPasswordData {
  token: string
  password: string
  confirmPassword: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
  confirmNewPassword: string
}

// Types pour les sessions
export interface UserSession {
  user: User
  token: string
  refreshToken: string
  expiresAt: Date
  createdAt: Date
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// Types pour les profils utilisateur
export interface UpdateProfileInput {
  nom?: string
  prenom?: string
  username?: string
  telephone?: string
  dateNaissance?: Date
  genre?: 'homme' | 'femme' | 'non_specifie'
  avatar?: string
}

export interface UpdatePreferencesInput {
  langue?: 'fr' | 'en' | 'es'
  devise?: 'EUR' | 'USD'
  newsletter?: boolean
  notificationsEmail?: boolean
  notificationsPush?: boolean
  notificationsSMS?: boolean
  themeInterface?: 'clair' | 'sombre' | 'auto'
  categoriesFavorites?: string[]
  regionsInterets?: string[]
}

// Types pour l'administration des utilisateurs
export interface UserFilters {
  role?: UserRole
  estActif?: boolean
  estVerifie?: boolean
  region?: string
  dateInscription?: {
    debut: Date
    fin: Date
  }
}

export interface UserSearchParams {
  query?: string
  filters?: UserFilters
  sortBy?: 'nom' | 'email' | 'dateCreation' | 'derniereConnexion'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

// Types pour les statistiques utilisateur
export interface UserStats {
  totalCommandes: number
  montantTotal: number
  commandeMoyenne: number
  derniereCommande?: Date
  totalAvis: number
  moyenneAvis: number
  produitsWishlist: number
}

export type UserStatus = 'actif' | 'inactif' | 'suspendu' | 'banni' | 'en_attente_verification'