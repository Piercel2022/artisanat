/**
 * ArtisanGallery.tsx
 * 
 * Description: Composant de galerie photo pour présenter les créations et l'atelier de l'artisan
 * Affichage en grille responsive avec lightbox pour voir les images en grand
 * 
 * Rôle:
 * - Showcase visuel des réalisations de l'artisan
 * - Présentation de l'atelier et du processus de création
 * - Expérience utilisateur immersive avec visionneuse d'images
 * 
 * Relations avec l'application:
 * - Intégré dans la page profil artisan
 * - Utilise les données média depuis l'API
 * - Composant UI réutilisable pour d'autres galleries
 * - Optimisation des images avec Next.js Image
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface GalleryImage {
  id: string
  src: string
  alt: string
  title?: string
  category: 'creation' | 'atelier' | 'process' | 'other'
}

interface ArtisanGalleryProps {
  images: GalleryImage[]
  artisanName: string
}

export default function ArtisanGallery({ images, artisanName }: ArtisanGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filtrage des images par catégorie
  const filteredImages = selectedCategory === 'all' 
    ? images 
    : images.filter(img => img.category === selectedCategory)

  // Catégories disponibles
  const categories = [
    { key: 'all', label: 'Toutes' },
    { key: 'creation', label: 'Créations' },
    { key: 'atelier', label: 'Atelier' },
    { key: 'process', label: 'Processus' }
  ]

  const openLightbox = (index: number) => {
    setSelectedImage(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1)
    }
  }

  const goToNext = () => {
    if (selectedImage !== null && selectedImage < filteredImages.length - 1) {
      setSelectedImage(selectedImage + 1)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox()
    if (e.key === 'ArrowLeft') goToPrevious()
    if (e.key === 'ArrowRight') goToNext()
  }

  if (images.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600">Aucune image disponible pour le moment.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête et filtres */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          Galerie de {artisanName}
        </h2>
        
        {/* Filtres par catégorie */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.key
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grille d'images */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredImages.map((image, index) => (
          <div
            key={image.id}
            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-200"
            onClick={() => openLightbox(index)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Overlay au survol */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Titre de l'image */}
            {image.title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-sm font-medium">{image.title}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Image principale */}
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filteredImages[selectedImage].src}
              alt={filteredImages[selectedImage].alt}
              width={800}
              height={600}
              className="max-w-full max-h-[80vh] object-contain"
              priority
            />
            
            {/* Informations de l'image */}
            {filteredImages[selectedImage].title && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-white text-lg font-medium">
                  {filteredImages[selectedImage].title}
                </p>
              </div>
            )}
          </div>

          {/* Bouton fermer */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation précédent/suivant */}
          {selectedImage > 0 && (
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {selectedImage < filteredImages.length - 1 && (
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Compteur d'images */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white text-sm">
            {selectedImage + 1} / {filteredImages.length}
          </div>
        </div>
      )}

      {/* Message si aucune image après filtrage */}
      {filteredImages.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-600">
            Aucune image trouvée dans cette catégorie.
          </p>
        </div>
      )}
    </div>
  )
}