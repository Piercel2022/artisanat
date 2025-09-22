// ====================================================================
// FICHIER: src/app/api/artisans/[id]/products/route.ts
// DESCRIPTION: Gestion des produits d'un artisan spécifique
// BUT: CRUD des produits liés à un artisan donné
// RELATION: Sous-ressource de l'artisan, interface avec la table products
// CONTRIBUTION: Permet la gestion des catalogues produits par artisan
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ProductSchema } from '@/types/product'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

// GET /api/artisans/[id]/products - Récupérer les produits d'un artisan
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Vérifier que l'artisan existe
    const artisan = await prisma.artisan.findUnique({
      where: { id: params.id }
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    const where: any = {
      artisanId: params.id,
      isActive: true
    }

    if (category) {
      where.categoryId = category
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
        images: true,
        artisan: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des produits' },
      { status: 500 }
    )
  }
}

// POST /api/artisans/[id]/products - Créer un produit pour un artisan
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    // Vérifier que l'artisan existe
    const artisan = await prisma.artisan.findUnique({
      where: { id: params.id }
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const validatedData = ProductSchema.parse(body)

    // Générer un slug unique
    const baseSlug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const product = await prisma.product.create({
      data: {
        ...validatedData,
        slug,
        artisanId: params.id
      },
      include: {
        category: true,
        images: true,
        artisan: {
          select: {
            id: true,
            name: true,
            slug: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(product, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création du produit:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du produit' },
      { status: 500 }
    )
  }
}