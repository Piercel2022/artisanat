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
  params: Promise<{ id: string }>
}

// ====================================================================
// GET /api/artisans/[id] - Récupérer un artisan par son ID
// ====================================================================
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const artisan = await prisma.artisan.findUnique({
      where: { id },
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
            customer: { select: { name: true, avatar: true } }
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
      return NextResponse.json({ error: 'Artisan introuvable' }, { status: 404 })
    }

    const session = await auth()
    if (session?.user?.role !== "ADMIN" && !artisan.isActive) {
      return NextResponse.json({ error: 'Artisan introuvable' }, { status: 404 })
    }

    return NextResponse.json(artisan)
  } catch (error) {
    console.error("Erreur lors de la récupération de l'artisan:", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération de l'artisan" },
      { status: 500 }
    )
  }
}

// ====================================================================
// PUT /api/artisans/[id] - Mettre à jour un artisan
// ====================================================================
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = ArtisanSchema.partial().parse(body)

    const existingArtisan = await prisma.artisan.findUnique({ where: { id } })
    if (!existingArtisan) {
      return NextResponse.json({ error: 'Artisan introuvable' }, { status: 404 })
    }

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
        where: { slug, NOT: { id } }
      })) {
        slug = `${baseSlug}-${counter}`
        counter++
      }
      updateData.slug = slug
    }

    if (validatedData.categoryIds) {
      updateData.categories = {
        set: validatedData.categoryIds.map((id: any) => ({ id }))
      }
      delete updateData.categoryIds
    }

    const artisan = await prisma.artisan.update({
      where: { id },
      data: updateData,
      include: { categories: true, products: true }
    })

    return NextResponse.json(artisan)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.issues },
        { status: 400 }
      )
    }

    console.error("Erreur lors de la mise à jour de l'artisan:", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la mise à jour de l'artisan" },
      { status: 500 }
    )
  }
}

// ====================================================================
// DELETE /api/artisans/[id] - Supprimer un artisan
// ====================================================================
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const { id } = await params
  try {
    const session = await auth()
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 401 })
    }

    const existingArtisan = await prisma.artisan.findUnique({
      where: { id },
      include: { _count: { select: { products: true, reviews: true } } }
    })

    if (!existingArtisan) {
      return NextResponse.json({ error: 'Artisan introuvable' }, { status: 404 })
    }

    await prisma.$transaction(async (tx: { review: { deleteMany: (arg0: { where: { artisanId: string } }) => any }; product: { deleteMany: (arg0: { where: { artisanId: string } }) => any }; artisan: { delete: (arg0: { where: { id: string } }) => any } }) => {
      await tx.review.deleteMany({ where: { artisanId: id } })
      await tx.product.deleteMany({ where: { artisanId: id } })
      await tx.artisan.delete({ where: { id } })
    })

    return NextResponse.json({ message: 'Artisan supprimé avec succès' })
  } catch (error) {
    console.error("Erreur lors de la suppression de l'artisan:", error)
    return NextResponse.json(
      { error: "Erreur serveur lors de la suppression de l'artisan" },
      { status: 500 }
    )
  }
}
