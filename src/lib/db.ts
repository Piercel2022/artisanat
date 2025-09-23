/**
 * Route Handler Principal des Produits - VERSION CORRIGÉE
 * Description: Gestionnaire principal des routes API pour les opérations CRUD sur les produits
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { ProductCreateSchema, ProductFilterSchema } from '@/types/product'
import { ZodError } from 'zod'

// GET /api/products - Récupération des produits avec filtres et pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Validation des paramètres de requête
    const filterParams = ProductFilterSchema.parse({
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '12'),
      category: searchParams.get('category') || undefined,
      artisanId: searchParams.get('artisanId') || undefined,
      search: searchParams.get('search') || undefined,
      minPrice: searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined,
      inStock: searchParams.get('inStock') === 'true' ? true : undefined,
      featured: searchParams.get('featured') === 'true' ? true : undefined,
      status: searchParams.get('status') as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' || undefined,
      sortBy: searchParams.get('sortBy') as any || 'createdAt',
      sortOrder: searchParams.get('sortOrder') as 'asc' | 'desc' || 'desc'
    })

    // Construction de la requête Prisma
    const where: any = {}
    
    if (filterParams.category) {
      where.categoryId = filterParams.category
    }
    
    if (filterParams.artisanId) {
      where.artisanId = filterParams.artisanId
    }
    
    if (filterParams.search) {
      where.OR = [
        { title: { contains: filterParams.search, mode: 'insensitive' } },
        { description: { contains: filterParams.search, mode: 'insensitive' } },
        { artisan: { name: { contains: filterParams.search, mode: 'insensitive' } } }
      ]
    }
    
    if (filterParams.minPrice || filterParams.maxPrice) {
      where.price = {}
      if (filterParams.minPrice) where.price.gte = filterParams.minPrice
      if (filterParams.maxPrice) where.price.lte = filterParams.maxPrice
    }
    
    if (filterParams.inStock) {
      where.stock = { gt: 0 }
    }
    
    if (filterParams.featured !== undefined) {
      where.featured = filterParams.featured
    }

    if (filterParams.status) {
      where.status = filterParams.status
    }

    // Calcul pagination
    const skip = (filterParams.page - 1) * filterParams.limit
    
    // Exécution des requêtes en parallèle
    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: filterParams.limit,
        orderBy: {
          [filterParams.sortBy]: filterParams.sortOrder
        },
        include: {
          artisan: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              department: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: { order: 'asc' },
            take: 5
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        }
      }),
      prisma.product.count({ where })
    ])

    // Calcul des métadonnées de pagination
    const totalPages = Math.ceil(totalCount / filterParams.limit)
    const hasNextPage = filterParams.page < totalPages
    const hasPrevPage = filterParams.page > 1

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page: filterParams.page,
        limit: filterParams.limit,
        total: totalCount,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      filters: filterParams
    })

  } catch (error) {
    console.error('Erreur GET /api/products:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Paramètres de requête invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

// POST /api/products - Création d'un nouveau produit (Admin seulement)
export async function POST(request: NextRequest) {
  try {
    // Vérification de l'authentification admin
    const session = await getServerSession(authOptions)
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Validation des données
    const validatedData = ProductCreateSchema.parse(body)

    // Vérification de l'existence de l'artisan et de la catégorie
    const [artisan, category] = await Promise.all([
      prisma.artisan.findUnique({
        where: { id: validatedData.artisanId }
      }),
      prisma.category.findUnique({
        where: { id: validatedData.categoryId }
      })
    ])

    if (!artisan) {
      return NextResponse.json(
        { success: false, error: 'Artisan non trouvé' },
        { status: 404 }
      )
    }

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Catégorie non trouvée' },
        { status: 404 }
      )
    }

    // Génération du slug unique
    const baseSlug = validatedData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    let slug = baseSlug
    let counter = 1
    
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Création du produit avec transaction
    const product = await prisma.$transaction(async (tx: { product: { create: (arg0: { data: any; include: { artisan: { select: { id: boolean; name: boolean; slug: boolean; city: boolean; department: boolean } }; category: { select: { id: boolean; name: boolean; slug: boolean } }; images: { orderBy: { order: string } }; _count: { select: { reviews: boolean; favorites: boolean } } } }) => any }; productImage: { createMany: (arg0: { data: any }) => any } }) => {
      // Création du produit
      const newProduct = await tx.product.create({
        data: {
          ...validatedData,
          slug,
          createdBy: session.user.id,
          tags: validatedData.tags || [],
          materials: validatedData.materials || []
        },
        include: {
          artisan: {
            select: {
              id: true,
              name: true,
              slug: true,
              city: true,
              department: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          images: {
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              reviews: true,
              favorites: true
            }
          }
        }
      })

      // Création des images si présentes
      if (validatedData.images && validatedData.images.length > 0) {
        await tx.productImage.createMany({
          data: validatedData.images.map((image: { url: any; alt: any; order: any }, index: any) => ({
            productId: newProduct.id,
            url: image.url,
            alt: image.alt || newProduct.title,
            order: image.order ?? index
          }))
        })
      }

      return newProduct
    })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Produit créé avec succès'
    }, { status: 201 })

  } catch (error) {
    console.error('Erreur POST /api/products:', error)
    
    if (error instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
