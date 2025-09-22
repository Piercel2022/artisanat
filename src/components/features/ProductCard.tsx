// src/components/features/ProductCard.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Heart, Eye, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useWishlist } from '@/hooks/useWishlist'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
  priority?: boolean
  className?: string
}

export function ProductCard({ product, priority = false, className }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <motion.div
      className={`group relative bg-white rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/catalogue/produit/${product.slug}`}>
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
          <Image
            src={product.images[0]?.url || '/placeholder-product.jpg'}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={priority}
            sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
          
          {/* Overlay actions */}
          <motion.div
            className="absolute inset-0 bg-black/20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
          >
            <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
              <ShoppingBag className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Wishlist button */}
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleWishlistClick}
          >
            <Heart 
              className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
            />
          </Button>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.isNew && (
              <Badge variant="secondary" className="bg-green-500 text-white">
                Nouveau
              </Badge>
            )}
            {product.isHandmade && (
              <Badge variant="outline" className="bg-white/90">
                Fait main
              </Badge>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          {/* Artisan */}
          <p className="text-sm text-gray-600">
            Par <span className="font-medium text-primary">{product.artisan.name}</span>
          </p>

          {/* Product name */}
          <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Category & Region */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{product.category.name}</span>
            <span>•</span>
            <span>{product.artisan.region}</span>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Rating */}
            {product.averageRating && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-600">
                  ⭐ {product.averageRating.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-2 pt-1">
            <div 
              className={`w-2 h-2 rounded-full ${
                product.inStock ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className={`text-xs ${
              product.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {product.inStock ? 'Disponible' : 'Sur commande'}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}