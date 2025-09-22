/**
 * Structure de l'API /api/artisans pour l'application d'artisanat français
 * 
 * Cette structure API RESTful gère toutes les opérations CRUD sur les artisans,
 * leur profil, leurs produits et leurs paramètres. Elle suit les conventions
 * Next.js 14 App Router avec des route handlers TypeScript.
 */

// ====================================================================
// FICHIER: src/app/api/artisans/route.ts
// DESCRIPTION: Point d'entrée principal pour les opérations sur les artisans
// BUT: Gestion CRUD globale des artisans (liste, création)
// RELATION: Interface principale avec la base de données Prisma
// CONTRIBUTION: Permet au frontend et au CMS d'accéder aux données artisans
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ArtisanSchema } from '@/types/artisan'
import { z } from 'zod'

// GET /api/artisans - Récupérer la liste des artisans avec filtres
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const region = searchParams.get('region')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {
      isActive: true, // Seuls les artisans actifs sont visibles publiquement
    }

    // Filtrage par catégorie
    if (category) {
      where.categories = {
        some: { slug: category }
      }
    }

    // Filtrage par région
    if (region) {
      where.region = region
    }

    // Recherche textuelle
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { specialties: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Artisans mis en avant
    if (featured === 'true') {
      where.isFeatured = true
    }

    const artisans = await prisma.artisan.findMany({
      where,
      include: {
        categories: true,
        products: {
          where: { isActive: true },
          take: 3, // Aperçu de 3 produits par artisan
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { products: { where: { isActive: true } } }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit,
      skip: offset
    })

    const total = await prisma.artisan.count({ where })

    return NextResponse.json({
      artisans,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des artisans:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des artisans' },
      { status: 500 }
    )
  }
}

// POST /api/artisans - Créer un nouvel artisan (admin uniquement)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { error: 'Accès non autorisé' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = ArtisanSchema.parse(body)

    // Générer un slug unique
    const baseSlug = validatedData.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    let slug = baseSlug
    let counter = 1
    while (await prisma.artisan.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const artisan = await prisma.artisan.create({
      data: {
        ...validatedData,
        slug,
        categories: {
          connect: validatedData.categoryIds?.map(id => ({ id })) || []
        }
      },
      include: {
        categories: true,
        products: true
      }
    })

    return NextResponse.json(artisan, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de l\'artisan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de l\'artisan' },
      { status: 500 }
    )
  }
}
