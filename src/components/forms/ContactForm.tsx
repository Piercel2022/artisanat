// =============================================================================
// FICHIER: src/components/forms/ContactForm.tsx
// DESCRIPTION: Formulaire de contact principal pour les visiteurs
// BUT: Permettre aux visiteurs de contacter les artisans ou l'équipe du site
// RÔLE: Interface de communication entre les visiteurs et les artisans/administrateurs
// =============================================================================

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Mail, Phone, User } from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  artisanId?: string
}

interface ContactFormProps {
  artisanId?: string
  artisanName?: string
  onSubmit?: (data: ContactFormData) => void
}

export default function ContactForm({ artisanId, artisanName, onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: artisanName ? `Contact concernant ${artisanName}` : '',
    message: '',
    artisanId
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Partial<ContactFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<ContactFormData> = {}
    
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis'
    if (!formData.email.trim()) newErrors.email = 'L\'email est requis'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Le sujet est requis'
    if (!formData.message.trim()) newErrors.message = 'Le message est requis'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Logique par défaut d'envoi
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Erreur lors de l\'envoi')
      }
      
      // Reset form on success
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: artisanName ? `Contact concernant ${artisanName}` : '',
        message: '',
        artisanId
      })
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {artisanName ? `Contacter ${artisanName}` : 'Nous contacter'}
        </h2>
        <p className="text-gray-600">
          Envoyez-nous un message, nous vous répondrons rapidement
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Nom complet *
          </Label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            placeholder="Votre nom"
            className={errors.name ? 'border-red-500' : ''}
            required
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="votre@email.fr"
            className={errors.email ? 'border-red-500' : ''}
            required
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="phone" className="flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Téléphone (optionnel)
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          placeholder="01 23 45 67 89"
        />
      </div>

      <div>
        <Label htmlFor="subject">Sujet *</Label>
        <Input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Objet de votre message"
          className={errors.subject ? 'border-red-500' : ''}
          required
        />
        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
      </div>

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          placeholder="Votre message..."
          rows={5}
          className={errors.message ? 'border-red-500' : ''}
          required
        />
        {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
      </Button>

      <p className="text-sm text-gray-500 text-center">
        * Champs obligatoires
      </p>
    </form>
  )
}
