/**
 * FICHIER: src/lib/api/artisans.ts
 * 
 * NOM: API Functions pour Artisans
 * 
 * DESCRIPTION:
 * Fonctions d'API pour récupérer les données des artisans depuis la base de données
 * ou les services externes. Gère la mise en cache, les erreurs et la transformation des données.
 */

import { Artisan } from '@/types/artisan';

// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Récupère un artisan par son slug
 */
export async function getArtisanBySlug(slug: string): Promise<Artisan | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/artisans/${slug}`, {
      next: { 
        revalidate: 3600 // Cache pendant 1 heure
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.artisan;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artisan:', error);
    
    // Fallback: retourner des données de démonstration en cas d'erreur
    if (process.env.NODE_ENV === 'development') {
      return getMockArtisan(slug);
    }
    
    throw error;
  }
}

/**
 * Récupère les artisans similaires basés sur le métier et la région
 */
export async function getRelatedArtisans(
  currentSlug: string, 
  craft: string, 
  region: string, 
  limit: number = 3
): Promise<Artisan[]> {
  try {
    const params = new URLSearchParams({
      craft,
      region,
      exclude: currentSlug,
      limit: limit.toString()
    });

    const response = await fetch(`${API_BASE_URL}/artisans/related?${params}`, {
      next: { 
        revalidate: 1800 // Cache pendant 30 minutes
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.artisans || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des artisans similaires:', error);
    
    // Fallback: retourner des données de démonstration
    if (process.env.NODE_ENV === 'development') {
      return getMockRelatedArtisans(craft, limit);
    }
    
    return [];
  }
}

/**
 * Récupère tous les artisans avec filtres optionnels
 */
export async function getArtisans(filters?: {
  craft?: string;
  region?: string;
  city?: string;
  page?: number;
  limit?: number;
}): Promise<{ artisans: Artisan[]; total: number; hasMore: boolean }> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.craft) params.append('craft', filters.craft);
    if (filters?.region) params.append('region', filters.region);
    if (filters?.city) params.append('city', filters.city);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const response = await fetch(`${API_BASE_URL}/artisans?${params}`, {
      next: { 
        revalidate: 1800 // Cache pendant 30 minutes
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return {
      artisans: data.artisans || [],
      total: data.total || 0,
      hasMore: data.hasMore || false
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des artisans:', error);
    throw error;
  }
}

/**
 * Récupère les slugs de tous les artisans (pour generateStaticParams)
 */
export async function getAllArtisanSlugs(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/artisans/slugs`, {
      next: { 
        revalidate: 3600 // Cache pendant 1 heure
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur API: ${response.status}`);
    }

    const data = await response.json();
    return data.slugs || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des slugs:', error);
    
    // Fallback: retourner quelques slugs de démonstration
    return [
      'marie-dubois-ceramiste',
      'pierre-martin-ebeniste',
      'sophie-lambert-maroquiniere',
      'jean-durand-verrier',
      'claire-bernard-bijoutiere'
    ];
  }
}

// --- DONNÉES DE DÉMONSTRATION POUR LE DÉVELOPPEMENT ---

function getMockArtisan(slug: string): Artisan {
  const mockArtisans: Record<string, Artisan> = {
    'marie-dubois-ceramiste': {
      id: '1',
      slug: 'marie-dubois-ceramiste',
      name: 'Marie Dubois',
      firstName: 'Marie',
      lastName: 'Dubois',
      craft: 'Céramiste',
      city: 'Lyon',
      region: 'Auvergne-Rhône-Alpes',
      shortDescription: 'Artisan céramiste passionnée, créatrice de pièces uniques alliant tradition et modernité.',
      longDescription: 'Depuis plus de 15 ans, Marie Dubois façonne l\'argile avec passion et expertise. Formée aux Beaux-Arts de Lyon, elle a développé un style unique qui mêle techniques ancestrales et créativité contemporaine. Son atelier, situé au cœur du Vieux Lyon, est un lieu de création où naissent des pièces d\'exception.',
      yearsExperience: 15,
      profileImage: '/images/artisans/marie-dubois-profile.jpg',
      coverImage: '/images/artisans/marie-dubois-cover.jpg',
      specialties: ['Grès émaillé', 'Raku', 'Porcelaine', 'Sculptures'],
      certifications: ['Maître Artisan', 'EPV - Entreprise du Patrimoine Vivant'],
      contactEmail: 'marie@dubois-ceramique.fr',
      contactPhone: '+33 4 78 12 34 56',
      website: 'https://dubois-ceramique.fr',
      socialLinks: ['https://instagram.com/marie.dubois.ceramique'],
      gallery: [
        '/images/gallery/marie-1.jpg',
        '/images/gallery/marie-2.jpg',
        '/images/gallery/marie-3.jpg'
      ],
      testimonials: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    'pierre-martin-ebeniste': {
      id: '2',
      slug: 'pierre-martin-ebeniste',
      name: 'Pierre Martin',
      firstName: 'Pierre',
      lastName: 'Martin',
      craft: 'Ébéniste',
      city: 'Toulouse',
      region: 'Occitanie',
      shortDescription: 'Maître ébéniste spécialisé dans la restauration de meubles anciens et la création sur mesure.',
      longDescription: 'Pierre Martin perpétue un savoir-faire familial transmis de génération en génération. Son atelier toulousain résonne des gestes ancestraux de l\'ébénisterie. Spécialiste de la restauration de mobilier d\'époque, il crée également des pièces contemporaines sur mesure.',
      yearsExperience: 22,
      profileImage: '/images/artisans/pierre-martin-profile.jpg',
      coverImage: '/images/artisans/pierre-martin-cover.jpg',
      specialties: ['Restauration Louis XV', 'Mobilier contemporain', 'Marqueterie', 'Dorure sur bois'],
      certifications: ['Compagnon du Devoir', 'Meilleur Ouvrier de France'],
      contactEmail: 'pierre@martin-ebeniste.fr',
      contactPhone: '+33 5 61 23 45 67',
      website: 'https://martin-ebeniste.fr',
      socialLinks: [],
      gallery: [],
      testimonials: [],
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }
  };

  return mockArtisans[slug] || mockArtisans['marie-dubois-ceramiste'];
}

function getMockRelatedArtisans(craft: string, limit: number): Artisan[] {
  const mockArtisans: Artisan[] = [
    {
      id: '3',
      slug: 'sophie-lambert-maroquiniere',
      name: 'Sophie Lambert',
      firstName: 'Sophie',
      lastName: 'Lambert',
      craft: 'Maroquinière',
      city: 'Paris',
      region: 'Île-de-France',
      shortDescription: 'Créatrice de maroquinerie de luxe, alliant savoir-faire traditionnel et design moderne.',
      longDescription: '',
      yearsExperience: 12,
      profileImage: '/images/artisans/sophie-lambert-profile.jpg',
      specialties: ['Sacs à main', 'Ceintures', 'Petite maroquinerie'],
      contactEmail: 'sophie@lambert-maroquinerie.fr',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      slug: 'jean-durand-verrier',
      name: 'Jean Durand',
      firstName: 'Jean',
      lastName: 'Durand',
      craft: 'Verrier',
      city: 'Nancy',
      region: 'Grand Est',
      shortDescription: 'Maître verrier spécialisé dans l\'art du vitrail et la création de pièces décoratives.',
      longDescription: '',
      yearsExperience: 18,
      profileImage: '/images/artisans/jean-durand-profile.jpg',
      specialties: ['Vitraux', 'Fusing', 'Soufflage de verre'],
      contactEmail: 'jean@durand-verrerie.fr',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-15')
    }
  ];

  return mockArtisans.slice(0, limit);
}