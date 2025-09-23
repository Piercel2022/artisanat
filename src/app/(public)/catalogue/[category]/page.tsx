/**
 * FICHIER: src/app/(public)/catalogue/[category]/page.tsx
 * 
 * DESCRIPTION: Page dynamique pour afficher les produits d'une catégorie spécifique
 * Utilise les dynamic routes de Next.js pour capturer le slug de catégorie
 * 
 * RÔLE: 
 * - Affichage filtré des produits par catégorie
 * - Navigation entre catégories avec breadcrumbs
 * - SEO optimisé pour chaque catégorie
 * 
 * RELATIONS AVEC L'APPLICATION:
 * - Route dynamique paramétrée par [category] slug
 * - Consomme l'API /api/products?category=slug
 * - Génère des métadonnées dynamiques pour le SEO
 * - Hérite des composants partagés du catalogue principal
 * - Se connecte aux pages produits via /produit/[slug]
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { ArrowLeft, Filter, Grid, List, MapPin, Star, ChevronRight } from 'lucide-react';

// Types
interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  images: string[];
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
  description: string;
  image: string;
  productCount: number;
  subcategories?: Category[];
}

interface PageProps {
  params: {
    category: string;
  };
  searchParams: {
    sort?: string;
    min_price?: string;
    max_price?: string;
    region?: string;
  };
}

// Simulation des données catégories
const mockCategories: Record<string, Category> = {
  'ceramique': {
    id: '1',
    name: 'Céramique',
    slug: 'ceramique',
    description: 'Découvrez l\'art ancestral de la céramique française, des faïences de Moustiers aux grès du Berry.',
    image: '/images/categories/ceramique.jpg',
    productCount: 45,
    subcategories: [
      { id: '1a', name: 'Vaisselle', slug: 'vaisselle', description: '', image: '', productCount: 18 },
      { id: '1b', name: 'Vases', slug: 'vases', description: '', image: '', productCount: 15 },
      { id: '1c', name: 'Carrelage', slug: 'carrelage', description: '', image: '', productCount: 12 },
    ]
  },
  'textile': {
    id: '2',
    name: 'Textile',
    slug: 'textile',
    description: 'Explorez les traditions textiles françaises, de la soie lyonnaise aux toiles de Jouy.',
    image: '/images/categories/textile.jpg',
    productCount: 32,
  },
  'bijoux': {
    id: '3',
    name: 'Bijoux',
    slug: 'bijoux',
    description: 'Bijoux artisanaux créés par des maîtres joailliers et créateurs français.',
    image: '/images/categories/bijoux.jpg',
    productCount: 67,
  },
};

// Simulation des produits par catégorie
const mockProductsByCategory: Record<string, Product[]> = {
  'ceramique': [
    {
      id: '1',
      slug: 'vase-ceramique-provence',
      name: 'Vase en Céramique de Provence',
      description: 'Vase artisanal en céramique, fabriqué selon les traditions provençales avec des motifs floraux peints à la main.',
      price: 89.00,
      images: ['/images/products/vase-ceramique-1.jpg'],
      artisan: { id: '1', name: 'Marie Dubois', city: 'Aubagne', region: 'Provence-Alpes-Côte d\'Azur' },
      rating: 4.8,
      reviewCount: 24,
      inStock: true,
    },
    {
      id: '2',
      slug: 'service-assiettes-faience',
      name: 'Service d\'Assiettes en Faïence',
      description: 'Service de 6 assiettes en faïence de Moustiers, décorées selon les techniques traditionnelles.',
      price: 245.00,
      images: ['/images/products/assiettes-faience-1.jpg'],
      artisan: { id: '2', name: 'Pierre Martin', city: 'Moustiers-Sainte-Marie', region: 'Provence-Alpes-Côte d\'Azur' },
      rating: 4.9,
      reviewCount: 18,
      inStock: true,
    },
  ]
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = mockCategories[params.category];
  
  if (!category) {
    return {
      title: 'Catégorie non trouvée',
    };
  }

  return {
    title: `${category.name} - Artisanat Français`,
    description: category.description,
    keywords: `${category.name.toLowerCase()}, artisanat français, fait main, ${category.name.toLowerCase()} artisanal`,
    openGraph: {
      title: `${category.name} Artisanal - Artisanat Français`,
      description: category.description,
      type: 'website',
      images: [
        {
          url: category.image,
          width: 1200,
          height: 630,
          alt: `Catégorie ${category.name}`,
        },
      ],
    },
  };
}

function CategoryHeader({ category }: { category: Category }) {
  return (
    <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="hover:underline">
                Accueil
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li>
              <Link href="/catalogue" className="hover:underline">
                Catalogue
              </Link>
            </li>
            <ChevronRight className="h-4 w-4" />
            <li className="font-semibold">{category.name}</li>
          </ol>
        </nav>
        
        <div className="flex items-center gap-4 mb-4">
          <Link 
            href="/catalogue"
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au catalogue
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        <p className="text-xl text-indigo-100 max-w-2xl mb-6">
          {category.description}
        </p>
        
        <div className="flex items-center gap-6 text-sm">
          <span className="bg-white/20 px-3 py-1 rounded-full">
            {category.productCount} produits
          </span>
          <span>Créations artisanales françaises</span>
        </div>
      </div>
    </div>
  );
}

function SubcategoryFilter({ subcategories }: { subcategories?: Category[] }) {
  if (!subcategories || subcategories.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="font-semibold text-gray-900 mb-4">Sous-catégories</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            href={`/catalogue/${subcategory.slug}`}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium">{subcategory.name}</span>
            <span className="text-sm text-gray-500">({subcategory.productCount})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

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
        
        <div className="text-xs text-gray-500 mt-1">
          par {product.artisan.name}
        </div>
      </div>
    </Link>
  );
}

function FilterBar({ category }: { category: Category }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Trier par</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="rating">Mieux notés</option>
            <option value="newest">Plus récents</option>
          </select>
          
          <select className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Toutes les régions</option>
            <option value="provence">Provence-Alpes-Côte d'Azur</option>
            <option value="bretagne">Bretagne</option>
            <option value="alsace">Alsace</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {category.productCount} produits
          </span>
          <div className="flex border border-gray-300 rounded-md ml-4">
            <button className="p-2 bg-indigo-50 text-indigo-600 rounded-l-md">
              <Grid className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded-r-md">
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params, searchParams }: PageProps) {
  const category = mockCategories[params.category];
  
  if (!category) {
    notFound();
  }
  
  const products = mockProductsByCategory[params.category] || [];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <CategoryHeader category={category} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SubcategoryFilter subcategories={category.subcategories} />
        
        <FilterBar category={category} />
        
        <Suspense fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Aucun produit dans cette catégorie
                </h3>
                <p className="text-gray-600 mb-4">
                  Cette catégorie sera bientôt enrichie avec de nouveaux produits artisanaux.
                </p>
                <Link 
                  href="/catalogue"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Voir tous les produits
                </Link>
              </div>
            </div>
          )}
        </Suspense>
        
        {/* Pagination si nécessaire */}
        {products.length > 12 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                Précédent
              </button>
              <button className="px-3 py-2 bg-indigo-600 text-white rounded">
                1
              </button>
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900">
                2
              </button>
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-3 py-2 text-gray-700 hover:text-gray-900">
                10
              </button>
              <button className="px-3 py-2 text-gray-500 hover:text-gray-700">
                Suivant
              </button>
            </nav>
          </div>
        )}

        {/* Section informative sur la catégorie */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              À propos de nos {category.name.toLowerCase()}s artisanaux
            </h2>
            
            <div className="prose prose-lg text-gray-600">
              <p>
                {category.name === 'Céramique' && 
                  "La céramique française puise ses racines dans des traditions millénaires. De la faïence de Moustiers aux grès du Berry, en passant par les émaux de Limoges, chaque région a développé ses propres techniques et styles distinctifs. Nos artisans perpétuent ces savoir-faire ancestraux tout en y apportant leur touche personnelle."
                }
                {category.name === 'Textile' && 
                  "L'art textile français rayonne depuis des siècles à travers le monde. De la soie lyonnaise aux dentelles de Calais, en passant par les toiles de Jouy, nos créateurs textiles allient tradition et innovation pour créer des pièces uniques et intemporelles."
                }
                {category.name === 'Bijoux' && 
                  "La joaillerie française est reconnue mondialement pour son excellence et sa créativité. Nos artisans bijoutiers, héritiers de traditions séculaires, créent des pièces uniques alliant techniques ancestrales et designs contemporains."
                }
              </p>
              
              <p className="mt-4">
                Chaque produit de cette catégorie est soigneusement sélectionné pour sa qualité exceptionnelle 
                et le savoir-faire qu'il représente. En choisissant nos créations artisanales, vous soutenez 
                directement les artisans français et contribuez à la préservation de ces métiers d'art.
              </p>
            </div>
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Qualité Premium</h3>
                <p className="text-sm text-gray-600">
                  Chaque produit est rigoureusement sélectionné pour sa qualité exceptionnelle
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Made in France</h3>
                <p className="text-sm text-gray-600">
                  100% français, créé par des artisans passionnés dans leurs ateliers
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Savoir-faire Unique</h3>
                <p className="text-sm text-gray-600">
                  Des techniques traditionnelles transmises de génération en génération
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Catégories suggérées */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Découvrez aussi nos autres créations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(mockCategories)
              .filter(cat => cat.slug !== category.slug)
              .map((suggestedCategory) => (
                <Link
                  key={suggestedCategory.id}
                  href={`/catalogue/${suggestedCategory.slug}`}
                  className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                >
                  <div className="aspect-video relative">
                    <Image
                      src={suggestedCategory.image || '/images/placeholder-category.jpg'}
                      alt={suggestedCategory.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="text-xl font-bold mb-1">{suggestedCategory.name}</h3>
                      <p className="text-sm opacity-90">
                        {suggestedCategory.productCount} produits
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {suggestedCategory.description}
                    </p>
                    <div className="mt-3 flex items-center text-indigo-600 text-sm font-semibold">
                      Découvrir
                      <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}