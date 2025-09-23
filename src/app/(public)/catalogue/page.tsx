/**
 * FICHIER: src/app/(public)/catalogue/page.tsx
 * 
 * DESCRIPTION: Page principale du catalogue des produits artisanaux français
 * Cette page affiche la liste complète des produits avec filtres et recherche
 * 
 * RÔLE: 
 * - Point d'entrée du catalogue produits pour les visiteurs
 * - Interface de navigation et filtrage des produits
 * - Présentation en grille des produits disponibles
 * 
 * RELATIONS AVEC L'APPLICATION:
 * - Consomme l'API /api/products pour récupérer les données
 * - Utilise les composants UI partagés (components/ui)
 * - Se connecte aux pages produit individuelles via [slug]
 * - Hérite du layout public (app/(public)/layout.tsx)
 * - Intègre les filtres par catégorie vers /catalogue/[category]
 */

import { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, Grid, List, MapPin, Star } from 'lucide-react';

// Types
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
    slug: string;
  };
  artisan: {
    id: string;
    name: string;
    city: string;
    region: string;
  };
  rating: number;
  reviewCount: number;
  inStock: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export const metadata: Metadata = {
  title: 'Catalogue des Produits Artisanaux Français',
  description: 'Découvrez notre sélection de produits artisanaux français authentiques, créés par des artisans passionnés dans toutes les régions de France.',
  keywords: 'artisanat français, produits artisanaux, fait main, France, terroir',
  openGraph: {
    title: 'Catalogue - Artisanat Français',
    description: 'Découvrez des produits artisanaux authentiques créés par des artisans français passionnés.',
    type: 'website',
  },
};

// Simulation des données (à remplacer par un appel API)
const mockProducts: Product[] = [
  {
    id: '1',
    slug: 'vase-ceramique-provence',
    name: 'Vase en Céramique de Provence',
    description: 'Vase artisanal en céramique, fabriqué selon les traditions provençales',
    price: 89.00,
    images: ['/images/products/vase-ceramique-1.jpg'],
    category: { id: '1', name: 'Céramique', slug: 'ceramique' },
    artisan: { id: '1', name: 'Marie Dubois', city: 'Aubagne', region: 'Provence-Alpes-Côte d\'Azur' },
    rating: 4.8,
    reviewCount: 24,
    inStock: true,
  },
  // Autres produits...
];

const mockCategories: Category[] = [
  { id: '1', name: 'Céramique', slug: 'ceramique', productCount: 45 },
  { id: '2', name: 'Textile', slug: 'textile', productCount: 32 },
  { id: '3', name: 'Bijoux', slug: 'bijoux', productCount: 67 },
  { id: '4', name: 'Maroquinerie', slug: 'maroquinerie', productCount: 28 },
  { id: '5', name: 'Bois', slug: 'bois', productCount: 19 },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <Link 
      href={`/catalogue/produit/${product.slug}`}
      className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
    >
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={product.images[0] || '/images/placeholder-product.jpg'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Rupture de stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <Link 
            href={`/catalogue/${product.category.slug}`}
            className="text-xs text-blue-600 hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {product.category.name}
          </Link>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-gray-600 ml-1">
              {product.rating} ({product.reviewCount} avis)
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {product.price.toFixed(2)} €
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-3 w-3 mr-1" />
            {product.artisan.city}
          </div>
        </div>
        
        <Link 
          href={`/artisans/${product.artisan.id}`}
          className="text-xs text-gray-500 hover:text-blue-600 mt-1 inline-block"
          onClick={(e) => e.stopPropagation()}
        >
          par {product.artisan.name}
        </Link>
      </div>
    </Link>
  );
}

function CategoryFilter({ categories }: { categories: Category[] }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="font-semibold text-gray-900 mb-4">Catégories</h3>
      <div className="space-y-2">
        <Link 
          href="/catalogue"
          className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
        >
          <span>Tous les produits</span>
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/catalogue/${category.slug}`}
            className="flex items-center justify-between py-2 px-3 rounded hover:bg-gray-50"
          >
            <span>{category.name}</span>
            <span className="text-sm text-gray-500">({category.productCount})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function CatalogueHeader() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-4">
          Catalogue des Produits Artisanaux
        </h1>
        <p className="text-xl text-blue-100 max-w-2xl">
          Découvrez des créations authentiques réalisées par des artisans passionnés 
          dans toute la France. Chaque produit raconte une histoire et perpétue un savoir-faire traditionnel.
        </p>
      </div>
    </div>
  );
}

export default function CataloguePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CatalogueHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                <Filter className="h-4 w-4" />
                Filtres
              </button>
              
              <div className="flex border border-gray-300 rounded-lg">
                <button className="p-2 bg-blue-50 text-blue-600 rounded-l-lg">
                  <Grid className="h-4 w-4" />
                </button>
                <button className="p-2 hover:bg-gray-50 rounded-r-lg">
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar avec filtres */}
          <aside className="lg:w-64 flex-shrink-0">
            <CategoryFilter categories={mockCategories} />
          </aside>
          
          {/* Contenu principal */}
          <main className="flex-1">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Tous les produits
              </h2>
              <p className="text-gray-600">
                {mockProducts.length} produits trouvés
              </p>
            </div>
            
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                    <div className="aspect-square bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <ProductGrid products={mockProducts} />
            </Suspense>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  Précédent
                </button>
                <button className="px-3 py-2 bg-blue-600 text-white rounded">
                  1
                </button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  2
                </button>
                <button className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded">
                  3
                </button>
                <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                  Suivant
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}