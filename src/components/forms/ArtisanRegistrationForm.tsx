// =============================================================================
// FICHIER: src/components/forms/ArtisanRegistrationForm.tsx
// DESCRIPTION: Formulaire d'inscription pour les nouveaux artisans
// BUT: Permettre aux artisans de créer leur compte et profil professionnel
// RÔLE: Point d'entrée principal pour l'onboarding des artisans sur la plateforme
// =============================================================================

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { User, Mail, Phone, MapPin, Briefcase, FileText, Camera } from 'lucide-react'

interface ArtisanFormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    postalCode: string
    region: string
  }
  professionalInfo: {
    businessName: string
    specialty: string
    experience: number
    description: string
    website?: string
    socialMedia?: {
      facebook?: string
      instagram?: string
      linkedin?: string
    }
  }
  documents: {
    profilePhoto?: File
    portfolioImages?: File[]
    certificates?: File[]
    businessRegistration?: File
  }
  agreements: {
    terms: boolean
    privacy: boolean
    communications: boolean
  }
}

const SPECIALTIES = [
  'Ébénisterie',
  'Poterie et Céramique',
  'Maroquinerie',
  'Bijouterie',
  'Textile et Broderie',
  'Menuiserie',
  'Ferronnerie',
  'Verrerie',
  'Sculpture',
  'Gravure',
  'Autre'
]

const REGIONS = [
  'Auvergne-Rhône-Alpes',
  'Bourgogne-Franche-Comté',
  'Bretagne',
  'Centre-Val de Loire',
  'Corse',
  'Grand Est',
  'Hauts-de-France',
  'Île-de-France',
  'Normandie',
  'Nouvelle-Aquitaine',
  'Occitanie',
  'Pays de la Loire',
  'Provence-Alpes-Côte d\'Azur',
  'Outre-mer'
]

interface ArtisanRegistrationFormProps {
  onSubmit?: (data: ArtisanFormData) => void
}

export default function ArtisanRegistrationForm({ onSubmit }: ArtisanRegistrationFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<ArtisanFormData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      region: ''
    },
    professionalInfo: {
      businessName: '',
      specialty: '',
      experience: 0,
      description: '',
      website: '',
      socialMedia: {
        facebook: '',
        instagram: '',
        linkedin: ''
      }
    },
    documents: {},
    agreements: {
      terms: false,
      privacy: false,
      communications: false
    }
  })

  const [errors, setErrors] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateStep = (step: number): boolean => {
    const newErrors: any = {}

    switch (step) {
      case 1: // Informations personnelles
        const { personalInfo } = formData
        if (!personalInfo.firstName.trim()) newErrors.firstName = 'Prénom requis'
        if (!personalInfo.lastName.trim()) newErrors.lastName = 'Nom requis'
        if (!personalInfo.email.trim()) newErrors.email = 'Email requis'
        if (personalInfo.email && !/\S+@\S+\.\S+/.test(personalInfo.email)) {
          newErrors.email = 'Format d\'email invalide'
        }
        if (!personalInfo.phone.trim()) newErrors.phone = 'Téléphone requis'
        if (!personalInfo.address.trim()) newErrors.address = 'Adresse requise'
        if (!personalInfo.city.trim()) newErrors.city = 'Ville requise'
        if (!personalInfo.postalCode.trim()) newErrors.postalCode = 'Code postal requis'
        if (!personalInfo.region) newErrors.region = 'Région requise'
        break

      case 2: // Informations professionnelles
        const { professionalInfo } = formData
        if (!professionalInfo.businessName.trim()) newErrors.businessName = 'Nom de l\'entreprise requis'
        if (!professionalInfo.specialty) newErrors.specialty = 'Spécialité requise'
        if (professionalInfo.experience < 0) newErrors.experience = 'Expérience invalide'
        if (!professionalInfo.description.trim()) newErrors.description = 'Description requise'
        break

      case 4: // Accords
        const { agreements } = formData
        if (!agreements.terms) newErrors.terms = 'Vous devez accepter les conditions'
        if (!agreements.privacy) newErrors.privacy = 'Vous devez accepter la politique de confidentialité'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep(4)) return
    
    setIsSubmitting(true)
    
    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Logique par défaut de soumission
        const response = await fetch('/api/artisans/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        })
        
        if (!response.ok) throw new Error('Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const updatePersonalInfo = (field: keyof ArtisanFormData['personalInfo'], value: string) => {
    setFormData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }))
  }

  const updateProfessionalInfo = (field: keyof ArtisanFormData['professionalInfo'], value: any) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, [field]: value }
    }))
  }

  const updateSocialMedia = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      professionalInfo: {
        ...prev.professionalInfo,
        socialMedia: {
          ...prev.professionalInfo.socialMedia,
          [platform]: value
        }
      }
    }))
  }

  const updateAgreements = (field: keyof ArtisanFormData['agreements'], value: boolean) => {
    setFormData(prev => ({
      ...prev,
      agreements: { ...prev.agreements, [field]: value }
    }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations personnelles</h2>
              <p className="text-gray-600">Commençons par vos informations de base</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Prénom *
                </Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('firstName', e.target.value)}
                  className={errors.firstName ? 'border-red-500' : ''}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
              </div>

              <div>
                <Label htmlFor="lastName">Nom *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('lastName', e.target.value)}
                  className={errors.lastName ? 'border-red-500' : ''}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.personalInfo.email}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Téléphone *
                </Label>
                <Input
                  id="phone"
                  value={formData.personalInfo.phone}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Adresse *
              </Label>
              <Input
                id="address"
                value={formData.personalInfo.address}
                onChange={(e: { target: { value: string } }) => updatePersonalInfo('address', e.target.value)}
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  value={formData.personalInfo.city}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="postalCode">Code postal *</Label>
                <Input
                  id="postalCode"
                  value={formData.personalInfo.postalCode}
                  onChange={(e: { target: { value: string } }) => updatePersonalInfo('postalCode', e.target.value)}
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
              </div>

              <div>
                <Label htmlFor="region">Région *</Label>
                <Select value={formData.personalInfo.region} onValueChange={(value: string) => updatePersonalInfo('region', value)}>
                  <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-red-500 text-sm mt-1">{errors.region}</p>}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Informations professionnelles</h2>
              <p className="text-gray-600">Parlez-nous de votre activité artisanale</p>
            </div>

            <div>
              <Label htmlFor="businessName" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Nom de l'entreprise/atelier *
              </Label>
              <Input
                id="businessName"
                value={formData.professionalInfo.businessName}
                onChange={(e: { target: { value: any } }) => updateProfessionalInfo('businessName', e.target.value)}
                className={errors.businessName ? 'border-red-500' : ''}
              />
              {errors.businessName && <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="specialty">Spécialité *</Label>
                <Select value={formData.professionalInfo.specialty} onValueChange={(value: any) => updateProfessionalInfo('specialty', value)}>
                  <SelectTrigger className={errors.specialty ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Choisir une spécialité" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIALTIES.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>{specialty}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.specialty && <p className="text-red-500 text-sm mt-1">{errors.specialty}</p>}
              </div>

              <div>
                <Label htmlFor="experience">Années d'expérience</Label>
                <Input
                  id="experience"
                  type="number"
                  min="0"
                  value={formData.professionalInfo.experience}
                  onChange={(e: { target: { value: string } }) => updateProfessionalInfo('experience', parseInt(e.target.value) || 0)}
                  className={errors.experience ? 'border-red-500' : ''}
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description de votre activité *
              </Label>
              <Textarea
                id="description"
                rows={5}
                value={formData.professionalInfo.description}
                onChange={(e: { target: { value: any } }) => updateProfessionalInfo('description', e.target.value)}
                placeholder="Décrivez votre savoir-faire, vos techniques, votre approche..."
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <Label htmlFor="website">Site web (optionnel)</Label>
              <Input
                id="website"
                type="url"
                value={formData.professionalInfo.website}
                onChange={(e: { target: { value: any } }) => updateProfessionalInfo('website', e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div>
              <Label className="text-base font-semibold">Réseaux sociaux (optionnel)</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div>
                  <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                  <Input
                    id="facebook"
                    value={formData.professionalInfo.socialMedia?.facebook || ''}
                    onChange={(e: { target: { value: string } }) => updateSocialMedia('facebook', e.target.value)}
                    placeholder="Profil Facebook"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                  <Input
                    id="instagram"
                    value={formData.professionalInfo.socialMedia?.instagram || ''}
                    onChange={(e: { target: { value: string } }) => updateSocialMedia('instagram', e.target.value)}
                    placeholder="@instagram"
                  />
                </div>
                <div>
                  <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    value={formData.professionalInfo.socialMedia?.linkedin || ''}
                    onChange={(e: { target: { value: string } }) => updateSocialMedia('linkedin', e.target.value)}
                    placeholder="Profil LinkedIn"
                  />
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Documents et portfolio</h2>
              <p className="text-gray-600">Ajoutez vos photos et documents professionnels</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="profilePhoto" className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    Photo de profil
                  </Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    onChange={(e: { target: { files: any[] } }) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, profilePhoto: file }
                        }))
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500">Format recommandé: carré, 400x400px minimum</p>
                </div>

                <div>
                  <Label htmlFor="portfolioImages">Portfolio (max 10 images)</Label>
                  
                  <p className="text-sm text-gray-500">Montrez vos plus belles réalisations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="certificates">Certificats/Diplômes</Label>
                  <Input id="certificates" type="file" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={(e: { target: { files: any } }) => {
    const files = Array.from(e.target.files || []) as File[] // Ajout du cast explicite
    if (files.length > 0) {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, certificates: files }
      }))
    }
  }}
/>
                  <p className="text-sm text-gray-500">CAP, BMA, certifications professionnelles...</p>
                </div>

                <div>
                  <Label htmlFor="businessRegistration">Justificatif d'entreprise</Label>
                  <Input
                    id="businessRegistration"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e: { target: { files: any[] } }) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setFormData(prev => ({
                          ...prev,
                          documents: { ...prev.documents, businessRegistration: file }
                        }))
                      }
                    }}
                  />
                  <p className="text-sm text-gray-500">Kbis, déclaration auto-entrepreneur...</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Conseils pour vos photos :</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Utilisez un bon éclairage naturel</li>
                <li>• Montrez différentes étapes de votre travail</li>
                <li>• Incluez des vues d'ensemble et des détails</li>
                <li>• Mettez en avant la qualité de votre finition</li>
              </ul>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Conditions et finalisation</h2>
              <p className="text-gray-600">Dernière étape avant de rejoindre notre communauté</p>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="terms"
                  checked={formData.agreements.terms}
                  onCheckedChange={(checked: boolean) => updateAgreements('terms', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="terms" className="text-sm font-medium">
                    J'accepte les conditions générales d'utilisation *
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="/terms" target="_blank" className="text-blue-600 hover:underline">
                      Lire les conditions générales
                    </a>
                  </p>
                </div>
              </div>
              {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="privacy"
                  checked={formData.agreements.privacy}
                  onCheckedChange={(checked: boolean) => updateAgreements('privacy', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="privacy" className="text-sm font-medium">
                    J'accepte la politique de confidentialité *
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    <a href="/privacy" target="_blank" className="text-blue-600 hover:underline">
                      Lire la politique de confidentialité
                    </a>
                  </p>
                </div>
              </div>
              {errors.privacy && <p className="text-red-500 text-sm">{errors.privacy}</p>}

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="communications"
                  checked={formData.agreements.communications}
                  onCheckedChange={(checked: boolean) => updateAgreements('communications', checked as boolean)}
                />
                <div className="flex-1">
                  <Label htmlFor="communications" className="text-sm font-medium">
                    J'accepte de recevoir des communications marketing (optionnel)
                  </Label>
                  <p className="text-xs text-gray-500 mt-1">
                    Newsletters, promotions et actualités de la plateforme
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">🎉 Félicitations !</h4>
              <p className="text-sm text-green-800 mb-3">
                Vous êtes sur le point de rejoindre notre communauté d'artisans. 
                Votre profil sera examiné par notre équipe dans les 24-48h.
              </p>
              <div className="text-xs text-green-700">
                <p><strong>Prochaines étapes :</strong></p>
                <ul className="mt-1 space-y-1">
                  <li>• Validation de votre profil par notre équipe</li>
                  <li>• Réception d'un email de confirmation</li>
                  <li>• Accès à votre tableau de bord artisan</li>
                  <li>• Publication de vos premières créations</li>
                </ul>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Informations personnelles'
      case 2: return 'Informations professionnelles'
      case 3: return 'Documents et portfolio'
      case 4: return 'Conditions et finalisation'
      default: return ''
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                ${currentStep >= step 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step}
              </div>
              {step < 4 && (
                <div className={`
                  w-full h-1 mx-4
                  ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Étape {currentStep} sur 4: {getStepTitle(currentStep)}
          </h3>
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
        {renderStep()}

        {/* Navigation buttons */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-6"
          >
            Précédent
          </Button>

          <div className="text-sm text-gray-500">
            {currentStep} / 4
          </div>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="px-6"
            >
              Suivant
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="px-8 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Inscription en cours...
                </>
              ) : (
                'Finaliser l\'inscription'
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Help section */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Besoin d'aide ? Contactez-nous à{' '}
          <a href="mailto:support@artisan-marketplace.fr" className="text-blue-600 hover:underline">
            support@artisan-marketplace.fr
          </a>
        </p>
      </div>
    </div>
  )
}