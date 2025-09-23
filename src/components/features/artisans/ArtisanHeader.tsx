/**
 * ArtisanHeader.tsx
 * 
 * Description: Composant d'en-tête pour le profil d'un artisan
 * Affiche les informations principales : nom, photo, localisation, note, etc.
 * 
 * Rôle: 
 * - Présentation visuelle principale de l'artisan
 * - Hero section du profil artisan
 * - Informations de contact essentielles
 * 
 * Relations avec l'application:
 * - Utilisé dans la page profil artisan ([slug]/page.tsx)
 * - Consomme les types Artisan depuis /types
 * - Intègre les composants UI de base
 * - Connecté aux données via l'API /api/artisans
 */

import Image from 'next/image'
import { MapPin, Star, Phone, Mail, Globe, Clock } from 'lucide-react'

interface ArtisanHeaderProps {
  artisan: {
    id: string
    name: string
    slug: string
    specialty: string
    avatar?: string
    coverImage?: string
    location: {
      city: string
      region: string
      department: string
    }
    contact: {
      phone?: string
      email?: string
      website?: string
    }
    rating: number
    reviewsCount: number
    yearsOfExperience: number
    isVerified: boolean
    openingHours?: {
      [key: string]: string
    }
  }
}

export default function ArtisanHeader({ artisan }: ArtisanHeaderProps) {
  return (
    <div className="relative">
      {/* Image de couverture */}
      <div className="h-64 md:h-80 relative overflow-hidden">
        {artisan.coverImage ? (
          <Image
            src={artisan.coverImage}
            alt={`Atelier de ${artisan.name}`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-amber-100 to-orange-200" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  {artisan.avatar ? (
                    <Image
                      src={artisan.avatar}
                      alt={artisan.name}
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">
                        {artisan.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                {artisan.isVerified && (
                  <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-2">
                    <Star className="w-4 h-4 text-white fill-current" />
                  </div>
                )}
              </div>
            </div>

            {/* Informations principales */}
            <div className="flex-grow">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    {artisan.name}
                  </h1>
                  <p className="text-lg text-amber-600 font-medium mb-3">
                    {artisan.specialty}
                  </p>
                  
                  {/* Localisation */}
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {artisan.location.city}, {artisan.location.region} ({artisan.location.department})
                    </span>
                  </div>

                  {/* Note et avis */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{artisan.rating.toFixed(1)}</span>
                      <span className="text-gray-600 ml-1">
                        ({artisan.reviewsCount} avis)
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {artisan.yearsOfExperience} ans d'expérience
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-fit">
                  {artisan.contact.phone && (
                    <a
                      href={`tel:${artisan.contact.phone}`}
                      className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span>Appeler</span>
                    </a>
                  )}
                  {artisan.contact.email && (
                    <a
                      href={`mailto:${artisan.contact.email}`}
                      className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Informations complémentaires */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-6">
              {artisan.contact.website && (
                <a
                  href={artisan.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <Globe className="w-4 h-4" />
                  <span>Site web</span>
                </a>
              )}
              
              {artisan.openingHours && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Horaires disponibles</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}