// ====================================================================
// FICHIER: src/app/api/artisans/[id]/route.ts
// DESCRIPTION: Gestion d'un artisan spécifique par ID
// BUT: CRUD pour un artisan individuel (lecture, mise à jour, suppression)
// RELATION: Utilise l'ID artisan pour les opérations unitaires
// CONTRIBUTION: Interface détaillée pour l'édition et la consultation
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { ArtisanSchema } from '@/types/artisan'
import { z } from 'zod'

interface RouteParams {
  params: { id: string }
}

// GET /api/artisans/[id] - Récupérer un artisan par son ID
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const artisan = await prisma.artisan.findUnique({
      where: { id: params.id },
      include: {
        categories: true,
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        },
        reviews: {
          where: { isPublished: true },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            customer: {
              select: { name: true, avatar: true }
            }
          }
        },
        _count: {
          select: {
            products: { where: { isActive: true } },
            reviews: { where: { isPublished: true } }
          }
        }
      }
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    // Masquer certaines informations sensibles pour les utilisateurs non-admin
    const session = await auth()
    if (!session?.user?.isAdmin && !artisan.isActive) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json(artisan)

  } catch (error) {
    console.error('Erreur lors de la récupération de l\'artisan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'artisan' },
      { status: 500 }
    )
  }
}

// PUT /api/artisans/[id] - Mettre à jour un artisan
export async function PUT(
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

    const body = await request.json()
    const validatedData = ArtisanSchema.partial().parse(body)

    // Vérifier l'existence de l'artisan
    const existingArtisan = await prisma.artisan.findUnique({
      where: { id: params.id }
    })

    if (!existingArtisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    // Mettre à jour le slug si le nom change
    let updateData: any = { ...validatedData }
    if (validatedData.name && validatedData.name !== existingArtisan.name) {
      const baseSlug = validatedData.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      let slug = baseSlug
      let counter = 1
      while (await prisma.artisan.findFirst({
        where: { slug, NOT: { id: params.id } }
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = slug
    }

    // Gestion des catégories
    if (validatedData.categoryIds) {
      updateData.categories = {
        set: validatedData.categoryIds.map(id => ({ id }))
      }
      delete updateData.categoryIds
    }

    const artisan = await prisma.artisan.update({
      where: { id: params.id },
      data: updateData,
      include: {
        categories: true,
        products: true
      }
    })

    return NextResponse.json(artisan)

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de la mise à jour de l\'artisan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'artisan' },
      { status: 500 }
    )
  }
}

// DELETE /api/artisans/[id] - Supprimer un artisan
export async function DELETE(
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

    // Vérifier l'existence de l'artisan
    const existingArtisan = await prisma.artisan.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: { products: true, reviews: true }
        }
      }
    })

    if (!existingArtisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    // Suppression en cascade des données liées
    await prisma.$transaction(async (tx) => {
      // Supprimer les avis
      await tx.review.deleteMany({
        where: { artisanId: params.id }
      })

      // Supprimer les produits
      await tx.product.deleteMany({
        where: { artisanId: params.id }
      })

      // Supprimer l'artisan
      await tx.artisan.delete({
        where: { id: params.id }
      })
    })

    return NextResponse.json({ message: 'Artisan supprimé avec succès' })

  } catch (error) {
    console.error('Erreur lors de la suppression de l\'artisan:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'artisan' },
      { status: 500 }
    )
  }
}
