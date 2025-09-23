// ====================================================================
// FICHIER: src/app/api/artisans/[id]/contact/route.ts
// DESCRIPTION: Gestion des messages de contact vers un artisan
// BUT: Permettre aux visiteurs de contacter directement un artisan
// RELATION: Relie les visiteurs aux artisans via un système de messagerie
// CONTRIBUTION: Facilite la communication et les demandes de devis
// ====================================================================
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Types pour le contexte de route Next.js
interface RouteContext<T> {
  params: Promise<{ id: string }>
}

// Schema de validation pour les messages de contact
const ContactMessageSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères")
})

// Fonction de limitation de taux simplifié (en mémoire)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

async function rateLimit(options: {
  identifier: string
  limit: number
  duration: number
}): Promise<boolean> {
  const now = Date.now()
  const key = options.identifier
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    // Créer ou réinitialiser l'enregistrement
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + (options.duration * 1000)
    })
    return true
  }

  if (record.count >= options.limit) {
    return false
  }

  record.count++
  return true
}

// Fonction d'envoi d'email simplifié
async function sendEmail(options: {
  to: string
  subject: string
  template: string
  data: Record<string, any>
}): Promise<void> {
  // Implémentation basique - remplacez par votre service d'email
  console.log(`Envoi d'email à ${options.to}:`, {
    subject: options.subject,
    template: options.template,
    data: options.data
  })
  
  // Exemple avec un service d'email comme Resend, SendGrid, etc.
  // await emailService.send(options)
}

// POST /api/artisans/[id]/contact - Envoyer un message à un artisan
export async function POST(
  request: NextRequest,
  context: RouteContext<'/api/[id]/contact'>
) {
  try {
    // Récupération de l'ID depuis les paramètres
    const { id } = await context.params

    // Récupération de l'IP depuis les headers
    const headersList = headers()
    const forwardedFor = (await headersList).get('x-forwarded-for')
    const realIP = (await headersList).get('x-real-ip')
    const clientIP = forwardedFor?.split(',')[0] || realIP || 'anonymous'

    // Limitation du taux de requêtes pour éviter le spam
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
      where: { id }
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
        artisanId: id,
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
        { error: 'Données invalides', details: error.issues },
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