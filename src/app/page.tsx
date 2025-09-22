// ===================================================================================================
// FICHIER: src/app/(public)/page.tsx
// DESCRIPTION: Page d'accueil principale de l'application Artisanat Français
// BUT: Présenter la plateforme, mettre en avant les artisans et produits phares
// RÔLE: Landing page qui encourage la découverte et l'engagement des utilisateurs
// ===================================================================================================
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Star,
  ArrowRight,
  Users,
  Package,
  Award,
  MapPin,
  Heart,
  Sparkles,
  ChevronRight,
  Clock,
  Shield,
  Truck
} from 'lucide-react';
import { Container } from '@/components/layout';

// Types pour les données statiques (en attendant l'API)
interface FeaturedArtisan {
  id: string;
  name: string;
  specialty: string;
  location: string;
  image: string;
  rating: number;
  description: string;
}

interface FeaturedProduct {
  id: string;
  title: string;
  artisan: string;
  price: number;
  image: string;
  category: string;
  isNew?: boolean;
}

interface CategoryHighlight {
  name: string;
  count: number;
  image: string;
  href: string;
}

export default function HomePage() {
  // Données statiques temporaires
  const featuredArtisans: FeaturedArtisan[] = [
    {
      id: '1',
      name: 'Marie Dubois',
      specialty: 'Céramiste',
      location: 'Provence-Alpes-Côte d\'Azur',
      image: '/images/artisans/marie-dubois.jpg',
      rating: 4.8,
      description: 'Créatrice de pièces uniques en céramique, inspirées par la tradition provençale.'
    },
    {
      id: '2',
      name: 'Jean-Pierre Martin',
      specialty: 'Ébéniste',
      location: 'Nouvelle-Aquitaine',
      image: '/images/artisans/jean-pierre-martin.jpg',
      rating: 4.9,
      description: 'Maître artisan spécialisé dans la restauration et création de meubles d\'époque.'
    },
    {
      id: '3',
      name: 'Sophie Laurent',
      specialty: 'Maroquinière',
      location: 'Île-de-France',
      image: '/images/artisans/sophie-laurent.jpg',
      rating: 4.7,
      description: 'Artisane du cuir créant des pièces sur-mesure alliant tradition et modernité.'
    }
  ];

  const featuredProducts: FeaturedProduct[] = [
    {
      id: '1',
      title: 'Vase artisanal en grès',
      artisan: 'Marie Dubois',
      price: 85,
      image: '/images/products/vase-gres.jpg',
      category: 'Céramique',
      isNew: true
    },
    {
      id: '2',
      title: 'Table basse en chêne massif',
      artisan: 'Jean-Pierre Martin',
      price: 450,
      image: '/images/products/table-chene.jpg',
      category: 'Mobilier'
    },
    {
      id: '3',
      title: 'Sac à main cuir vintage',
      artisan: 'Sophie Laurent',
      price: 160,
      image: '/images/products/sac-cuir.jpg',
      category: 'Maroquinerie',
      isNew: true
    },
    {
      id: '4',
      title: 'Carafe en verre soufflé',
      artisan: 'Atelier Cristal',
      price: 95,
      image: '/images/products/carafe-verre.jpg',
      category: 'Verrerie'
    }
  ];

  const categories: CategoryHighlight[] = [
    {
      name: 'Céramique & Poterie',
      count: 45,
      image: '/images/categories/ceramique.jpg',
      href: '/catalogue/ceramique'
    },
    {
      name: 'Mobilier & Décoration',
      count: 32,
      image: '/images/categories/mobilier.jpg',
      href: '/catalogue/mobilier'
    },
    {
      name: 'Maroquinerie',
      count: 28,
      image: '/images/categories/maroquinerie.jpg',
      href: '/catalogue/maroquinerie'
    },
    {
      name: 'Bijoux & Accessoires',
      count: 56,
      image: '/images/categories/bijoux.jpg',
      href: '/catalogue/bijoux'
    }
  ];

  const stats = [
    { icon: Users, label: 'Artisans partenaires', value: '150+' },
    { icon: Package, label: 'Produits uniques', value: '1,200+' },
    { icon: Award, label: 'Années d\'expérience', value: '25+' },
    { icon: MapPin, label: 'Régions françaises', value: '13' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Centré */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/patterns/artisan-pattern.png')] opacity-5"></div>
        <Container className="relative">
          <div className="py-20 lg:py-28">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="text-center lg:text-left">
                  <div className="flex justify-center lg:justify-start mb-6">
                    <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Nouveau : Découvrez nos artisans d'exception
                    </div>
                  </div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                    L'excellence de
                    <span className="block text-blue-600">l'artisanat français</span>
                  </h1>
                  <p className="text-base text-gray-600 mb-4 max-w-sm mx-auto lg:mx-auto">
  Découvrez des créations uniques réalisées par des artisans passionnés.
  Du savoir-faire traditionnel aux techniques innovantes, explorez l'art français authentique.
</p>
<div className="flex flex-col sm:flex-row gap-2 justify-center mx-auto w-1/4">
  <Link
    href="/catalogue"
    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
  >
    Découvrir le catalogue
    <ArrowRight className="w-4 h-4 ml-1" />
  </Link>
  <Link
    href="/artisans"
    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm text-gray-700 font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-colors"
  >
    Rencontrer les artisans
  </Link>
</div>
                </div>
                <div className="relative flex justify-center">
                  <div className="relative w-full max-w-lg h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src="/images/hero/artisan-workshop.jpg"
                      alt="Atelier d'artisan français"
                      fill
                      className="object-cover"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                  {/* Floating cards */}
                  <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="text-sm font-semibold">4.9/5</span>
                    </div>
                    <p className="text-xs text-gray-600">+2,500 avis clients</p>
                  </div>
                  <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg p-4 hidden md:block">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-5 h-5 text-red-500" />
                      <span className="text-sm font-semibold">Made in France</span>
                    </div>
                    <p className="text-xs text-gray-600">100% artisanal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats Section - Centré */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                        <Icon className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                    <div className="text-gray-600">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Categories - Centré avec largeur max */}
      <section className="py-16 bg-gray-50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explorez nos catégories
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Des créations authentiques dans chaque domaine d'expertise artisanale
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={category.href}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="aspect-w-4 aspect-h-3 relative">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-lg font-semibold mb-1">{category.name}</h3>
                    <p className="text-sm opacity-90">{category.count} créations</p>
                    <div className="flex items-center mt-2 text-sm">
                      <span>Découvrir</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Featured Products - Centré avec grille responsive optimisée */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Créations du moment
              </h2>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                Découvrez les dernières œuvres de nos artisans talentueux
              </p>
              <Link
                href="/catalogue"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
              >
                Voir tout le catalogue
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
            
            {/* Grille responsive centrée */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mx-auto">
              {featuredProducts.map((product, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.isNew && (
                      <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Nouveau
                      </div>
                    )}
                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-50">
                      <Heart className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="p-5">
                    <div className="text-sm text-blue-600 font-medium mb-2">
                      {product.category}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Par {product.artisan}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        {product.price}€
                      </span>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                        Voir détails
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
        </Container>
      </section>

      {/* Featured Artisans - Centré */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nos artisans d'exception
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Rencontrez les maîtres artisans qui perpétuent les traditions françaises avec passion et expertise
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {featuredArtisans.map((artisan, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="aspect-w-4 aspect-h-3 relative">
                    <Image
                      src={artisan.image}
                      alt={artisan.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{artisan.name}</h3>
                        <p className="text-blue-600 font-medium">{artisan.specialty}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{artisan.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-500 text-sm mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      {artisan.location}
                    </div>
                    <p className="text-gray-600 mb-6">{artisan.description}</p>
                    <Link
                      href={`/artisans/${artisan.id}`}
                      className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700"
                    >
                      Découvrir son profil
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Us - Centré */}
      <section className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir Artisanat Français ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une plateforme de confiance qui valorise l'excellence et l'authenticité
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                    <Shield className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Qualité garantie</h3>
                <p className="text-gray-600">
                  Chaque artisan est soigneusement sélectionné pour son savoir-faire et la qualité de ses créations.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full">
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Création sur-mesure</h3>
                <p className="text-gray-600">
                  Possibilité de commander des pièces personnalisées selon vos goûts et besoins spécifiques.
                </p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full">
                    <Truck className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Livraison sécurisée</h3>
                <p className="text-gray-600">
                  Emballage soigné et livraison assurée pour que vos créations arrivent en parfait état.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter CTA - Centré avec largeur optimisée */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
  <Container>
    <div className="w-1/4 mx-auto text-center text-white">
      <h2 className="text-lg md:text-xl font-bold mb-3">
        Restez informé
      </h2>
      <p className="text-sm opacity-90 mb-4">
        Découvrez en avant-première les œuvres de nos artisans
      </p>
      <div className="space-y-2">
        <input
          type="email"
          placeholder="Votre adresse email"
          className="w-full px-3 py-2 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white text-xs"
        />
        <button className="w-full px-4 py-2 bg-white text-blue-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          S'inscrire
        </button>
      </div>
      <p className="text-xs opacity-75 mt-3">
        Pas de spam, juste de belles découvertes
      </p>
    </div>
    </Container>
  </section>

    </div>
  );
}