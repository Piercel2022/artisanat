// ====================================================================
// FICHIER: src/app/api/artisans/search/route.ts
// DESCRIPTION: Moteur de recherche avancé pour les artisans
// BUT: Recherche textuelle, géographique et par critères multiples
// RELATION: Utilise les données artisans avec indexation full-text
// CONTRIBUTION: Interface de recherche performante pour l'expérience utilisateur
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Types pour améliorer la sécurité des types
interface PriceRange {
  lte?: number;
  gte?: number;
}

interface ArtisanWithRelations {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  specialties: string | null;
  avgRating: number;
  reviewCount: number;
  averagePrice: number | null;
  priceRange: string | null;
  isActive: boolean;
  isAvailable: boolean;
  isCertified: boolean;
  isPremium: boolean;
  responseTime: number | null;
  completionRate: number | null;
  category: {
    name: string;
    slug: string;
  } | null;
  address: {
    street: string | null;
    city: string | null;
    postalCode: string | null;
    department: string | null;
    region: string | null;
    latitude: number | null;
    longitude: number | null;
  } | null;
  images: Array<{
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
  _count: {
    reviews: number;
    orders: number;
  };
}

const SearchSchema = z.object({
  q: z.string().min(1).max(100),
  category: z.string().optional(),
  region: z.string().optional(),
  department: z.string().optional(),
  city: z.string().optional(),
  radius: z.number().min(1).max(200).optional(), // Rayon de recherche en km
  lat: z.number().optional(),
  lng: z.number().optional(),
  minRating: z.number().min(1).max(5).optional(),
  priceRange: z.enum(['low', 'medium', 'high']).optional(),
  available: z.boolean().optional(), // Disponible pour commande
  certified: z.boolean().optional(), // Certifié qualité
  limit: z.number().min(1).max(50).default(20),
  offset: z.number().min(0).default(0)
})

// Fonction utilitaire pour calculer la distance (formule Haversine)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// GET /api/artisans/search - Recherche avancée d'artisans
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const params: Record<string, any> = Object.fromEntries(searchParams.entries())

    // Conversion des paramètres numériques et booléens avec validation
    if (params.radius) params.radius = parseFloat(params.radius)
    if (params.lat) params.lat = parseFloat(params.lat)
    if (params.lng) params.lng = parseFloat(params.lng)
    if (params.minRating) params.minRating = parseInt(params.minRating, 10)
    if (params.limit) params.limit = parseInt(params.limit, 10)
    if (params.offset) params.offset = parseInt(params.offset, 10)
    if (params.available) params.available = params.available === 'true'
    if (params.certified) params.certified = params.certified === 'true'

    const validatedParams = SearchSchema.parse(params)

    // Construction de la requête WHERE avec types appropriés
    const where: any = {
      isActive: true,
      // Recherche textuelle full-text
      OR: [
        { name: { contains: validatedParams.q, mode: 'insensitive' } },
        { description: { contains: validatedParams.q, mode: 'insensitive' } },
        { specialties: { contains: validatedParams.q, mode: 'insensitive' } },
        { keywords: { contains: validatedParams.q, mode: 'insensitive' } },
        { 
          category: {
            name: { contains: validatedParams.q, mode: 'insensitive' }
          }
        }
      ]
    }

    // Filtres par catégorie
    if (validatedParams.category) {
      where.category = {
        slug: validatedParams.category
      }
    }

    // Filtres géographiques
    if (validatedParams.region) {
      where.address = {
        ...where.address,
        region: { contains: validatedParams.region, mode: 'insensitive' }
      }
    }

    if (validatedParams.department) {
      where.address = {
        ...where.address,
        department: { contains: validatedParams.department, mode: 'insensitive' }
      }
    }

    if (validatedParams.city) {
      where.address = {
        ...where.address,
        city: { contains: validatedParams.city, mode: 'insensitive' }
      }
    }

    // Filtre par note minimale
    if (validatedParams.minRating) {
      where.avgRating = { gte: validatedParams.minRating }
    }

    // Filtre par gamme de prix avec typage correct
    if (validatedParams.priceRange) {
      const priceRanges: Record<string, PriceRange> = {
        low: { lte: 50 },
        medium: { gte: 51, lte: 150 },
        high: { gte: 151 }
      }
      where.averagePrice = priceRanges[validatedParams.priceRange]
    }

    // Filtre par disponibilité
    if (validatedParams.available !== undefined) {
      where.isAvailable = validatedParams.available
    }

    // Filtre par certification
    if (validatedParams.certified !== undefined) {
      where.isCertified = validatedParams.certified
    }

    // Requête principale avec relations
    const artisans = await prisma.artisan.findMany({
      where,
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        },
        address: {
          select: {
            street: true,
            city: true,
            postalCode: true,
            department: true,
            region: true,
            latitude: true,
            longitude: true
          }
        },
        images: {
          select: {
            url: true,
            alt: true,
            isPrimary: true
          },
          take: 3
        },
        _count: {
          select: {
            reviews: true,
            orders: true
          }
        }
      },
      orderBy: [
        { isPremium: 'desc' }, // Artisans premium en premier
        { avgRating: 'desc' },
        { reviewCount: 'desc' },
        { createdAt: 'desc' }
      ],
      take: validatedParams.limit,
      skip: validatedParams.offset
    }) as ArtisanWithRelations[]

    // Filtrage par rayon géographique si coordonnées fournies
    let filteredArtisans = artisans
    if (validatedParams.lat && validatedParams.lng && validatedParams.radius) {
      filteredArtisans = artisans.filter((artisan) => {
        if (!artisan.address?.latitude || !artisan.address?.longitude) {
          return false
        }
        
        const distance = calculateDistance(
          validatedParams.lat!,
          validatedParams.lng!,
          artisan.address.latitude,
          artisan.address.longitude
        )
        
        return distance <= validatedParams.radius!
      })
    }

    // Calcul du nombre total pour la pagination
    const totalCount = await prisma.artisan.count({ where })

    // Format des résultats avec typage approprié
    const results = filteredArtisans.map((artisan) => ({
      id: artisan.id,
      name: artisan.name,
      slug: artisan.slug,
      description: artisan.description,
      specialties: artisan.specialties,
      category: artisan.category,
      address: artisan.address ? {
        city: artisan.address.city,
        department: artisan.address.department,
        region: artisan.address.region,
        postalCode: artisan.address.postalCode
      } : null,
      coordinates: artisan.address && artisan.address.latitude && artisan.address.longitude ? {
        lat: artisan.address.latitude,
        lng: artisan.address.longitude
      } : null,
      rating: {
        average: artisan.avgRating,
        count: artisan._count.reviews
      },
      pricing: {
        average: artisan.averagePrice,
        range: artisan.priceRange,
        currency: 'EUR'
      },
      status: {
        isActive: artisan.isActive,
        isAvailable: artisan.isAvailable,
        isCertified: artisan.isCertified,
        isPremium: artisan.isPremium
      },
      images: artisan.images.map(img => ({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary
      })),
      stats: {
        totalOrders: artisan._count.orders,
        totalReviews: artisan._count.reviews,
        responseTime: artisan.responseTime,
        completionRate: artisan.completionRate
      },
      // Distance calculée si coordonnées fournies
      ...(validatedParams.lat && 
          validatedParams.lng && 
          artisan.address?.latitude && 
          artisan.address?.longitude && {
        distance: calculateDistance(
          validatedParams.lat,
          validatedParams.lng,
          artisan.address.latitude,
          artisan.address.longitude
        )
      })
    }))

    // Suggestions de recherche si peu de résultats
    const suggestions: Array<{
      type: string;
      text: string;
      value: string;
      count: number;
    }> = []
    
    if (results.length < 3) {
      // Recherche de catégories similaires
      const similarCategories = await prisma.category.findMany({
        where: {
          name: { contains: validatedParams.q, mode: 'insensitive' }
        },
        select: {
          name: true,
          slug: true,
          _count: {
            select: { artisans: true }
          }
        },
        take: 5
      })

      suggestions.push(
        ...similarCategories.map((cat: { name: any; slug: any; _count: { artisans: any; }; }) => ({
          type: 'category',
          text: cat.name,
          value: cat.slug,
          count: cat._count.artisans
        }))
      )
    }

    // Métadonnées de recherche
    const searchMeta = {
      query: validatedParams.q,
      filters: {
        category: validatedParams.category,
        location: {
          region: validatedParams.region,
          department: validatedParams.department,
          city: validatedParams.city,
          radius: validatedParams.radius
        },
        rating: validatedParams.minRating,
        priceRange: validatedParams.priceRange,
        availability: validatedParams.available,
        certified: validatedParams.certified
      },
      pagination: {
        limit: validatedParams.limit,
        offset: validatedParams.offset,
        total: totalCount,
        hasMore: validatedParams.offset + validatedParams.limit < totalCount
      },
      resultsCount: results.length,
      searchTime: Date.now() // Temps de traitement (à implémenter)
    }

    return NextResponse.json({
      success: true,
      data: results,
      meta: searchMeta,
      suggestions
    })

  } 
  catch (error: unknown) {
  console.error('Erreur lors de la recherche d\'artisans:', error)

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Paramètres de recherche invalides',
        details: error.issues // Use 'issues' instead of 'errors'
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Erreur interne du serveur lors de la recherche'
    },
    { status: 500 }
  )
 }
}

// POST /api/artisans/search - Recherche avancée avec body complexe
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Schema pour les recherches POST plus complexes
    const AdvancedSearchSchema = z.object({
      query: z.string().min(1).max(100),
      filters: z.object({
        categories: z.array(z.string()).optional(),
        location: z.object({
          coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
            radius: z.number().min(1).max(200)
          }).optional(),
          regions: z.array(z.string()).optional(),
          departments: z.array(z.string()).optional(),
          cities: z.array(z.string()).optional()
        }).optional(),
        rating: z.object({
          min: z.number().min(1).max(5).optional(),
          reviewsCount: z.number().min(0).optional()
        }).optional(),
        pricing: z.object({
          range: z.array(z.enum(['low', 'medium', 'high'])).optional(),
          maxPrice: z.number().positive().optional(),
          minPrice: z.number().positive().optional()
        }).optional(),
        availability: z.object({
          available: z.boolean().optional(),
          responseTime: z.number().positive().optional() // en heures
        }).optional(),
        certification: z.object({
          certified: z.boolean().optional(),
          premium: z.boolean().optional()
        }).optional()
      }).optional(),
      sorting: z.object({
        field: z.enum(['relevance', 'rating', 'price', 'distance', 'reviews', 'recent']).default('relevance'),
        order: z.enum(['asc', 'desc']).default('desc')
      }).optional(),
      pagination: z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(50).default(20)
      }).optional()
    })

    const validatedBody = AdvancedSearchSchema.parse(body)
    
    // Construction de la requête WHERE complexe
    const where: any = {
      isActive: true,
      OR: [
        { name: { contains: validatedBody.query, mode: 'insensitive' } },
        { description: { contains: validatedBody.query, mode: 'insensitive' } },
        { specialties: { contains: validatedBody.query, mode: 'insensitive' } },
        { keywords: { contains: validatedBody.query, mode: 'insensitive' } }
      ]
    }

    // Application des filtres avancés
    if (validatedBody.filters?.categories?.length) {
      where.category = {
        slug: { in: validatedBody.filters.categories }
      }
    }

    if (validatedBody.filters?.rating?.min) {
      where.avgRating = { gte: validatedBody.filters.rating.min }
    }

    if (validatedBody.filters?.rating?.reviewsCount) {
      where.reviewCount = { gte: validatedBody.filters.rating.reviewsCount }
    }

    // Construction du tri
    const orderBy: any[] = []
    if (validatedBody.sorting?.field === 'rating') {
      orderBy.push({ avgRating: validatedBody.sorting.order })
    } else if (validatedBody.sorting?.field === 'price') {
      orderBy.push({ averagePrice: validatedBody.sorting.order })
    } else if (validatedBody.sorting?.field === 'reviews') {
      orderBy.push({ reviewCount: validatedBody.sorting.order })
    } else if (validatedBody.sorting?.field === 'recent') {
      orderBy.push({ createdAt: validatedBody.sorting.order })
    }
    
    // Tri par défaut
    orderBy.push(
      { isPremium: 'desc' },
      { avgRating: 'desc' },
      { reviewCount: 'desc' }
    )

    // Pagination
    const page = validatedBody.pagination?.page || 1
    const limit = validatedBody.pagination?.limit || 20
    const skip = (page - 1) * limit

    // Exécution de la requête
    const [artisans, totalCount] = await Promise.all([
      prisma.artisan.findMany({
        where,
        include: {
          category: true,
          address: true,
          images: { take: 3 },
          _count: {
            select: {
              reviews: true,
              orders: true
            }
          }
        },
        orderBy,
        take: limit,
        skip
      }) as Promise<ArtisanWithRelations[]>,
      prisma.artisan.count({ where })
    ])

    // Filtrage géographique post-requête si nécessaire
    let filteredResults = artisans
    if (validatedBody.filters?.location?.coordinates) {
      const { lat, lng, radius } = validatedBody.filters.location.coordinates
      filteredResults = artisans.filter((artisan) => {
        if (!artisan.address?.latitude || !artisan.address?.longitude) {
          return false
        }
        
        const distance = calculateDistance(lat, lng, artisan.address.latitude, artisan.address.longitude)
        return distance <= radius
      })
    }

    return NextResponse.json({
      success: true,
      data: filteredResults,
      meta: {
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount,
          hasPrev: page > 1
        },
        filters: validatedBody.filters,
        sorting: validatedBody.sorting,
        resultsCount: filteredResults.length
      }
    })

  } 
  catch (error: unknown) {
  console.error('Erreur lors de la recherche d\'artisans:', error)

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Paramètres de recherche invalides',
        details: error.issues // Use 'issues' instead of 'errors'
      },
      { status: 400 }
    )
  }

  return NextResponse.json(
    {
      success: false,
      error: 'Erreur interne du serveur lors de la recherche'
    },
    { status: 500 }
  )
 }
}