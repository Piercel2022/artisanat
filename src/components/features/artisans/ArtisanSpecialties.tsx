/**
 * ArtisanSpecialties.tsx
 * 
 * Description: Composant présentant les spécialités, techniques et savoir-faire de l'artisan
 * Affiche les domaines d'expertise, techniques maîtrisées et matériaux utilisés
 * 
 * Rôle:
 * - Détailler les compétences techniques de l'artisan
 * - Présenter les différentes spécialités et services
 * - Informer sur les techniques et matériaux utilisés
 * - Aide au choix pour les clients potentiels
 * 
 * Relations avec l'application:
 * - Section informative du profil artisan
 * - Lié au système de catégorisation des produits
 * - Influence les résultats de recherche et filtres
 * - Connecté aux données de spécialisation via API
 */
import { Palette, Settings, Star, Clock, Package, Award, MapPin, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface Technique {
  name: string
  description: string
  level: 'débutant' | 'intermédiaire' | 'expert' | 'maître'
  yearsOfPractice: number
}

interface Material {
  name: string
  description: string
  origin?: string
  usage: string[]
}

interface Service {
  id: string
  name: string
  description: string
  estimatedTime: string
  priceRange?: {
    min: number
    max: number
  }
  isCustomizable: boolean
  availability: 'disponible' | 'sur_commande' | 'indisponible'
}

interface ArtisanSpecialtiesProps {
  artisan: {
    name: string
    mainSpecialty: string
    specialties: string[]
    techniques: Technique[]
    materials: Material[]
    services: Service[]
    workshopCapacity?: number
    customWorkAccepted: boolean
    deliveryTime: {
      standard: string
      express?: string
      custom: string
    }
  }
}

export default function ArtisanSpecialties({ artisan }: ArtisanSpecialtiesProps) {
  const getLevelColor = (level: Technique['level']) => {
    switch (level) {
      case 'maître':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'expert':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'intermédiaire':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getLevelStars = (level: Technique['level']) => {
    const levels = { 'débutant': 1, 'intermédiaire': 2, 'expert': 3, 'maître': 4 }
    return levels[level] || 1
  }

  const getAvailabilityColor = (availability: Service['availability']) => {
    switch (availability) {
      case 'disponible':
        return 'bg-green-100 text-green-800'
      case 'sur_commande':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityIcon = (availability: Service['availability']) => {
    switch (availability) {
      case 'disponible':
        return <CheckCircle className="w-4 h-4" />
      case 'sur_commande':
        return <AlertCircle className="w-4 h-4" />
      default:
        return <XCircle className="w-4 h-4" />
    }
  }

  const getAvailabilityText = (availability: Service['availability']) => {
    switch (availability) {
      case 'disponible':
        return 'Disponible'
      case 'sur_commande':
        return 'Sur commande'
      default:
        return 'Indisponible'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* En-tête avec spécialité principale */}
      <div className="text-center border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Spécialités de {artisan.name}
        </h1>
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full">
          <Award className="w-5 h-5" />
          <span className="font-semibold">{artisan.mainSpecialty}</span>
        </div>
      </div>

      {/* Informations générales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h3 className="font-semibold text-gray-800">Capacité d'atelier</h3>
          <p className="text-gray-600">
            {artisan.workshopCapacity ? `${artisan.workshopCapacity} pièces/mois` : 'Non spécifiée'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Settings className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h3 className="font-semibold text-gray-800">Travail sur mesure</h3>
          <p className="text-gray-600">
            {artisan.customWorkAccepted ? 'Accepté' : 'Non disponible'}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <Clock className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <h3 className="font-semibold text-gray-800">Délai standard</h3>
          <p className="text-gray-600">{artisan.deliveryTime.standard}</p>
        </div>
      </div>

      {/* Spécialités */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Palette className="w-6 h-6 text-blue-600" />
          Domaines d'expertise
        </h2>
        <div className="flex flex-wrap gap-2">
          {artisan.specialties.map((specialty, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
            >
              {specialty}
            </span>
          ))}
        </div>
      </section>

      {/* Techniques maîtrisées */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Settings className="w-6 h-6 text-green-600" />
          Techniques maîtrisées
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artisan.techniques.map((technique, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{technique.name}</h3>
                <div className="flex items-center gap-1">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < getLevelStars(technique.level)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-3">{technique.description}</p>
              <div className="flex justify-between items-center">
                <span className={`px-2 py-1 rounded text-xs font-medium border ${getLevelColor(technique.level)}`}>
                  {technique.level}
                </span>
                <span className="text-xs text-gray-500">
                  {technique.yearsOfPractice} ans de pratique
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Matériaux utilisés */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Package className="w-6 h-6 text-purple-600" />
          Matériaux et ressources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artisan.materials.map((material, index) => (
            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800">{material.name}</h3>
                {material.origin && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>{material.origin}</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm mb-3">{material.description}</p>
              <div>
                <h4 className="font-medium text-gray-700 mb-1 text-sm">Utilisations :</h4>
                <div className="flex flex-wrap gap-1">
                  {material.usage.map((use, useIndex) => (
                    <span
                      key={useIndex}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services proposés */}
      <section>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-yellow-600" />
          Services proposés
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artisan.services.map((service) => (
            <div key={service.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{service.name}</h3>
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getAvailabilityColor(service.availability)}`}>
                  {getAvailabilityIcon(service.availability)}
                  <span>{getAvailabilityText(service.availability)}</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{service.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Durée estimée : {service.estimatedTime}</span>
                </div>
                
                {service.priceRange && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">€</span>
                    <span className="text-gray-600">
                      {service.priceRange.min}€ - {service.priceRange.max}€
                    </span>
                  </div>
                )}
                
                {service.isCustomizable && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Personnalisable</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Délais de livraison */}
      <section className="bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Délais de livraison
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">Standard</h3>
            <p className="text-blue-600 font-medium">{artisan.deliveryTime.standard}</p>
          </div>
          {artisan.deliveryTime.express && (
            <div className="text-center">
              <h3 className="font-semibold text-gray-800">Express</h3>
              <p className="text-orange-600 font-medium">{artisan.deliveryTime.express}</p>
            </div>
          )}
          <div className="text-center">
            <h3 className="font-semibold text-gray-800">Sur mesure</h3>
            <p className="text-purple-600 font-medium">{artisan.deliveryTime.custom}</p>
          </div>
        </div>
      </section>
    </div>
  )
}