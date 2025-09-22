// ====================================================================
// FICHIER: src/app/api/artisans/[id]/contact/route.ts
// DESCRIPTION: Gestion des messages de contact vers un artisan
// BUT: Permettre aux visiteurs de contacter directement un artisan
// RELATION: Relie les visiteurs aux artisans via un système de messagerie
// CONTRIBUTION: Facilite la communication et les demandes de devis
// ====================================================================

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { ContactMessageSchema } from '@/types/contact'
import { z } from 'zod'
import { rateLimit } from '@/lib/rate-limit'

interface RouteParams {
  params: { id: string }
}

// POST /api/artisans/[id]/contact - Envoyer un message à un artisan
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Limitation du taux de requêtes pour éviter le spam
    const clientIP = request.ip || 'anonymous'
    const isAllowed = await rateLimit({
      identifier: clientIP,
      limit: 5, // 5 messages par heure
      duration: 3600 // 1 heure
    })

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Trop de messages envoyés. Veuillez patienter.' },
        { status: 429 }
      )
    }

    // Vérifier que l'artisan existe et accepte les messages
    const artisan = await prisma.artisan.findUnique({
      where: { id: params.id }
    })

    if (!artisan) {
      return NextResponse.json(
        { error: 'Artisan introuvable' },
        { status: 404 }
      )
    }

    if (!artisan.acceptMessages) {
      return NextResponse.json(
        { error: 'Cet artisan n\'accepte pas les messages' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = ContactMessageSchema.parse(body)

    // Enregistrer le message en base
    const message = await prisma.contactMessage.create({
      data: {
        ...validatedData,
        artisanId: params.id,
        ipAddress: clientIP
      }
    })

    // Envoyer un email à l'artisan
    if (artisan.email && artisan.emailNotifications) {
      await sendEmail({
        to: artisan.email,
        subject: `Nouveau message de ${validatedData.name}`,
        template: 'artisan-contact',
        data: {
          artisanName: artisan.name,
          senderName: validatedData.name,
          senderEmail: validatedData.email,
          senderPhone: validatedData.phone,
          message: validatedData.message,
          subject: validatedData.subject
        }
      })
    }

    // Envoyer un email de confirmation à l'expéditeur
    await sendEmail({
      to: validatedData.email,
      subject: `Votre message à ${artisan.name} a bien été envoyé`,
      template: 'contact-confirmation',
      data: {
        senderName: validatedData.name,
        artisanName: artisan.name,
        message: validatedData.message
      }
    })

    return NextResponse.json({
      message: 'Votre message a été envoyé avec succès',
      id: message.id
    }, { status: 201 })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur lors de l\'envoi du message:', error)
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'envoi du message' },
      { status: 500 }
    )
  }
}
