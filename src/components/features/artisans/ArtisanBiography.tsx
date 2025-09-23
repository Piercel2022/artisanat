/**
 * ArtisanBiography.tsx
 * 
 * Description: Composant présentant l'histoire, la formation et la philosophie de l'artisan
 * Affiche une biographie complète avec timeline des événements importants
 * 
 * Rôle:
 * - Raconter l'histoire personnelle et professionnelle de l'artisan
 * - Créer un lien émotionnel avec les visiteurs
 * - Présenter les valeurs et la philosophie de l'artisan
 * - Timeline des étapes importantes de sa carrière
 * 
 * Relations avec l'application:
 * - Section clé du profil artisan pour l'authenticité
 * - Connecté aux données biographiques via API
 * - Améliore le SEO avec contenu riche et unique
 * - Influence les décisions d'achat par la confiance
 */

import { Calendar, Award, Heart, Users } from 'lucide-react'

interface TimelineEvent {
  year: string
  title: string
  description: string
  type: 'formation' | 'career' | 'achievement' | 'recognition'
}

interface ArtisanBiographyProps {
  artisan: {
    name: string
    biography: string
    philosophy?: string
    yearsOfExperience: number
    startedYear: number
    formation?: string
    achievements?: string[]
    timeline?: TimelineEvent[]
    personalStory?: string
    inspiration?: string
  }
}

export default function ArtisanBiography({ artisan }: ArtisanBiographyProps) {
  const getTimelineIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'formation':
        return <Calendar className="w-4 h-4" />
      case 'achievement':
        return <Award className="w-4 h-4" />
      case 'recognition':
        return <Users className="w-4 h-4" />
      default:
        return <Heart className="w-4 h-4" />
    }
  }

  const getTimelineColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'formation':
        return 'bg-blue-500'
      case 'achievement':
        return 'bg-yellow-500'
      case 'recognition':
        return 'bg-green-500'
      default:
        return 'bg-amber-500'
    }
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          L'histoire de {artisan.name}
        </h2>
        <div className="flex items-center justify-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <span>Depuis {artisan.startedYear}</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            <span>{artisan.yearsOfExperience} ans d'expérience</span>
          </div>
        </div>
      </div>

      {/* Biographie principale */}
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Son parcours
        </h3>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artisan.biography}
          </p>
        </div>
      </div>

      {/* Histoire personnelle */}
      {artisan.personalStory && (
        <div className="bg-amber-50 rounded-xl p-8 border-l-4 border-amber-400">
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-amber-600" />
            L'histoire personnelle
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artisan.personalStory}
          </p>
        </div>
      )}

      {/* Formation */}
      {artisan.formation && (
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Formation et apprentissage
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artisan.formation}
          </p>
        </div>
      )}

      {/* Philosophie */}
      {artisan.philosophy && (
        <div className="bg-gray-50 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Sa philosophie
          </h3>
          <blockquote className="text-gray-700 leading-relaxed italic text-lg border-l-4 border-amber-400 pl-6">
            {artisan.philosophy}
          </blockquote>
        </div>
      )}

      {/* Source d'inspiration */}
      {artisan.inspiration && (
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Sources d'inspiration
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {artisan.inspiration}
          </p>
        </div>
      )}

      {/* Timeline */}
      {artisan.timeline && artisan.timeline.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Parcours professionnel
          </h3>
          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {artisan.timeline.map((event, index) => (
                <div key={index} className="relative flex items-start gap-6">
                  {/* Point sur la timeline */}
                  <div className={`relative z-10 w-12 h-12 rounded-full ${getTimelineColor(event.type)} flex items-center justify-center text-white shadow-lg`}>
                    {getTimelineIcon(event.type)}
                  </div>
                  
                  {/* Contenu */}
                  <div className="flex-1 bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                        {event.year}
                      </span>
                      <h4 className="font-semibold text-gray-900">
                        {event.title}
                      </h4>
                    </div>
                    <p className="text-gray-700">
                      {event.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Réalisations */}
      {artisan.achievements && artisan.achievements.length > 0 && (
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" />
            Réalisations marquantes
          </h3>
          <div className="grid gap-4">
            {artisan.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-gray-700">{achievement}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Citation ou devise */}
      <div className="text-center py-8">
        <div className="max-w-2xl mx-auto">
          <blockquote className="text-xl font-medium text-gray-900 italic">
            "L'artisanat, c'est transformer la matière avec passion pour créer des pièces uniques qui racontent une histoire."
          </blockquote>
          <p className="mt-4 text-gray-600">— {artisan.name}</p>
        </div>
      </div>
    </div>
  )
}