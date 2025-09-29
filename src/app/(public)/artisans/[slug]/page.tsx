/**
 * FICHIER: src/app/(public)/artisans/[slug]/page.tsx
 * 
 * NOM: Page Profil Artisan Individuel
 * 
 * DESCRIPTION:
 * Page de profil détaillée d'un artisan spécifique, accessible via son slug unique.
 * Présente la biographie, les photos, les spécialités, les créations, les témoignages
 * et les informations de contact. Interface immersive avec galerie photos, 
 * storytelling et incitation à la prise de contact.
 * 
 * RÔLE DANS L'APPLICATION:
 * - Vitrine individuelle complète de chaque artisan
 * - Page de conversion pour générer des contacts/commandes
 * - Contenu riche pour le SEO et le partage social
 * - Point de contact entre visiteurs et artisans
 * 
 * RELATIONS AVEC L'ENSEMBLE:
 * - Route dynamique générée à partir des slugs artisans
 * - Consomme l'API /api/artisans/[slug] pour les données
 * - Intègre les composants de galerie, témoignages, contact
 * - Connectée aux pages catalogue via les créations présentées
 * - Génère automatiquement les métadonnées SEO personnalisées
 * - Inclut les structured data pour le référencement local
 */

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import ArtisanHeader from '@/components/features/artisans/ArtisanHeader';
import ArtisanBiography from '@/components/features/artisans/ArtisanBiography';
import ArtisanGallery from '@/components/features/artisans/ArtisanGallery';
import ArtisanSpecialties from '@/components/features/artisans/ArtisanSpecialties';
import ArtisanTestimonials from '@/components/features/artisans/ArtisanTestimonials';
import ContactArtisanForm from '@/components/features/artisans/ContactArtisanForm';
import RelatedArtisans from '@/components/features/artisans/RelatedArtisans';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { getArtisanBySlug, getRelatedArtisans } from '@/lib/api/artisans';
import { Artisan } from '@/types/artisan';

// Add this to the top of your page.tsx file, after the imports

// Type adapter function
function adaptArtisanForHeader(apiArtisan: Artisan) {
  return {
    ...apiArtisan,
    specialty: apiArtisan.craft,
    avatar: apiArtisan.profileImage,
    location: {
      city: apiArtisan.city,
      region: apiArtisan.region,
      department: apiArtisan.region, // Adjust based on your data
    },
    contact: {
      email: apiArtisan.email || '',
      phone: apiArtisan.phone || '',
      website: apiArtisan.website || '',
    },
    rating: apiArtisan.rating || 0,
    // Add any other missing properties with appropriate mappings
  };
}

// Then update your return statement in the component:
return (
  <div className="min-h-screen bg-stone-50">
    {/* Use adapted artisan for ArtisanHeader */}
    <ArtisanHeader artisan={adaptArtisanForHeader(artisan)} />

    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Use original artisan for other components that expect the API format */}
      <ArtisanBiography artisan={artisan} />
      <ArtisanSpecialties artisan={artisan} />
      <ArtisanGallery artisan={artisan} />
      {/* ... rest of your components */}
    </main>
  </div>
);
interface ArtisanProfileProps {
  params: { slug: string };
}

// Génération dynamique des métadonnées SEO pour chaque artisan
export async function generateMetadata({ params }: ArtisanProfileProps): Promise<Metadata> {
  try {
    const artisan = await getArtisanBySlug(params.slug);
    
    if (!artisan) {
      return {
        title: 'Artisan non trouvé',
        description: 'Cet artisan n\'existe pas ou n\'est plus disponible.',
      };
    }

    return {
      title: `${artisan.name} - ${artisan.craft} | Artisan ${artisan.city}`,
      description: `Découvrez ${artisan.name}, ${artisan.craft} à ${artisan.city}. ${artisan.shortDescription}`,
      keywords: `${artisan.craft}, artisan ${artisan.city}, ${artisan.region}, savoir-faire français, ${artisan.specialties?.join(', ')}`,
      openGraph: {
        title: `${artisan.name} - Artisan ${artisan.craft}`,
        description: artisan.shortDescription,
        images: artisan.profileImage ? [
          {
            url: artisan.profileImage,
            width: 1200,
            height: 630,
            alt: `Portrait de ${artisan.name}, ${artisan.craft}`,
          }
        ] : [],
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${artisan.name} - Artisan ${artisan.craft}`,
        description: artisan.shortDescription,
        images: artisan.profileImage ? [artisan.profileImage] : [],
      },
      // Données structurées pour le SEO local
      other: {
        'article:author': artisan.name,
        'article:section': 'Artisan',
        'geo.region': artisan.region,
        'geo.placename': artisan.city,
      },
    };
  } catch (error) {
    return {
      title: 'Erreur de chargement',
      description: 'Une erreur est survenue lors du chargement du profil artisan.',
    };
  }
}

// Génération statique des pages pour les artisans principaux
export async function generateStaticParams() {
  // En production, récupérer tous les slugs depuis l'API
  // Pour l'exemple, retourner quelques slugs statiques
  return [
    { slug: 'marie-dubois-ceramiste' },
    { slug: 'pierre-martin-ebeniste' },
    { slug: 'sophie-lambert-maroquiniere' },
  ];
}

export default async function ArtisanProfilePage({ params }: ArtisanProfileProps) {
  let artisan: Artisan | null = null;
  
  try {
    // Récupération des données de l'artisan
    artisan = await getArtisanBySlug(params.slug);
    
    if (!artisan) {
      notFound();
    }
  } catch (error) {
    console.error('Erreur chargement profil artisan:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* En-tête avec photo de couverture et informations principales */}
      <ArtisanHeader artisan={artisan} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation interne rapide */}
        <nav className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-stone-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-8 z-10">
          <div className="flex space-x-8 overflow-x-auto">
            <a href="#biographie" className="whitespace-nowrap text-stone-600 hover:text-amber-600 font-medium">
              Biographie
            </a>
            <a href="#specialites" className="whitespace-nowrap text-stone-600 hover:text-amber-600 font-medium">
              Spécialités
            </a>
            <a href="#galerie" className="whitespace-nowrap text-stone-600 hover:text-amber-600 font-medium">
              Galerie
            </a>
            <a href="#temoignages" className="whitespace-nowrap text-stone-600 hover:text-amber-600 font-medium">
              Témoignages
            </a>
            <a href="#contact" className="whitespace-nowrap text-stone-600 hover:text-amber-600 font-medium">
              Contact
            </a>
          </div>
        </nav>

        <div className="lg:grid lg:grid-cols-3 lg:gap-12 pb-16">
          
          {/* Contenu principal */}
          <main className="lg:col-span-2 space-y-12">
            
            {/* Section biographie */}
            <section id="biographie">
              <Suspense fallback={<LoadingSkeleton type="text-content" />}>
                <ArtisanBiography artisan={artisan} />
              </Suspense>
            </section>

            {/* Section spécialités */}
            <section id="specialites">
              <Suspense fallback={<LoadingSkeleton type="grid" />}>
                <ArtisanSpecialties artisan={artisan} />
              </Suspense>
            </section>

            {/* Section galerie photo */}
            <section id="galerie">
              <Suspense fallback={<LoadingSkeleton type="gallery" />}>
                <ArtisanGallery artisan={artisan} />
              </Suspense>
            </section>

            {/* Section témoignages clients */}
            <section id="temoignages">
              <Suspense fallback={<LoadingSkeleton type="testimonials" />}>
                <ArtisanTestimonials artisanSlug={params.slug} artisanId={''} />
              </Suspense>
            </section>
          </main>

          {/* Sidebar avec contact et informations */}
          <aside className="lg:col-span-1 space-y-8">
            
            {/* Carte de contact sticky */}
            <div className="sticky top-32">
              
              {/* Informations rapides */}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6 mb-6">
                <h3 className="font-semibold text-stone-900 mb-4">
                  Informations pratiques
                </h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-stone-500">Métier</dt>
                    <dd className="text-stone-900">{artisan.craft}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-500">Localisation</dt>
                    <dd className="text-stone-900">{artisan.city}, {artisan.region}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-stone-500">Expérience</dt>
                    <dd className="text-stone-900">{artisan.yearsExperience} ans</dd>
                  </div>
                  {artisan.certifications && (
                    <div>
                      <dt className="text-sm font-medium text-stone-500">Certifications</dt>
                      <dd className="text-stone-900">
                        {artisan.certifications.join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Formulaire de contact */}
              <section id="contact" className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
                <h3 className="font-semibold text-stone-900 mb-4">
                  Contacter {artisan.firstName}
                </h3>
                <Suspense fallback={<LoadingSkeleton type="form" />}>
                  <ContactArtisanForm artisanSlug={params.slug} />
                </Suspense>
              </section>
            </div>
          </aside>
        </div>

        {/* Section artisans similaires */}
        <section className="border-t border-stone-200 pt-12 pb-16">
          <h2 className="text-2xl font-bold text-stone-900 mb-8">
            Autres artisans {artisan.craft.toLowerCase()}
          </h2>
          <Suspense fallback={<LoadingSkeleton type="artisan-grid" />}>
            <RelatedArtisans 
              currentArtisanSlug={params.slug}
              craft={artisan.craft}
              region={artisan.region}
            />
          </Suspense>
        </section>
      </main>

      {/* Données structurées JSON-LD pour le SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": artisan.name,
            "jobTitle": artisan.craft,
            "description": artisan.shortDescription,
            "image": artisan.profileImage,
            "address": {
              "@type": "PostalAddress",
              "addressLocality": artisan.city,
              "addressRegion": artisan.region,
              "addressCountry": "France"
            },
            "sameAs": artisan.socialLinks || [],
            "knowsAbout": artisan.specialties || [],
            "memberOf": {
              "@type": "Organization",
              "name": "Artisanat Français"
            }
          })
        }}
      />
    </div>
  );
}