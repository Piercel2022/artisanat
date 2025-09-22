// ====================================================================
// FICHIER: src/app/api/artisans/[id]/reviews/route.ts
// DESCRIPTION: Gestion des avis clients pour un artisan
// BUT: CRUD des avis et évaluations d'un artisan
// RELATION: Sous-ressource de l'artisan, interface avec la table reviews
// CONTRIBUTION: Système de notation et commentaires pour la réputation
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ReviewSchema } from '@/types/review'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

// GET /api/artisans/[id]/reviews - Récupérer les avis d'un artisan
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')
    const rating = searchParams.get('rating')

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
      isPublished: true
    }

    if (rating) {
      where.rating = parseInt(rating)
    }

    const reviews = await prisma.review.findMany({
      where,
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    })

    const total = await prisma.review.count({ where })

    // Calculer les statistiques des avis
    const stats = await prisma.review.groupBy({
      by: ['rating'],
      where: { artisanId: params.id, isPublished: true },
      _count: { rating: true }
    })

    const reviewStats = {
      total,
      average: 0,
      distribution: [0, 0, 0, 0, 0] // Index 0 = 1 étoile, Index 4 = 5 étoiles
    }

    let totalRating = 0
    stats.forEach(stat => {
      reviewStats.distribution[stat.rating - 1] = stat._count.rating
      totalRating += stat.rating * stat._count.rating
    })

    if (total > 0) {
      reviewStats.average = Math.round((totalRating / total) * 10) / 10
    }

    return NextResponse.json({
      reviews,
      stats: reviewStats,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total
      }
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des avis:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des avis' },
      { status: 500 }
    )
  }
}

// POST /api/artisans/[id]/reviews - Créer un avis pour un artisan
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
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

    // Vérifier que l'utilisateur n'a pas déjà laissé un avis
    const existingReview = await prisma.review.findFirst({
      where: {
        artisanId: params.id,
        customerId: session.user.id
      }
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'Vous avez déjà laissé un avis pour cet artisan' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = ReviewSchema.parse(body)

    const review = await prisma.review.create({
      data: {
        ...validatedData,
        artisanId: params.id,
        customerId: session.user.id,
        isPublished: false // Les avis doivent être modérés
      },
      include: {
        customer: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json(review, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la création de l\'avis:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de l\'avis' },
      { status: 500 }
    )
  }
}