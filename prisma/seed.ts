import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer les données existantes (optionnel)
  await prisma.produit.deleteMany({})
  await prisma.artisan.deleteMany({})
  await prisma.categorie.deleteMany({})

  // Créer les catégories
  const categories = await Promise.all([
    prisma.categorie.create({
      data: {
        nom: 'Bijouterie',
        description: 'Bijoux artisanaux et créations uniques',
        slug: 'bijouterie'
      }
    }),
    prisma.categorie.create({
      data: {
        nom: 'Poterie & Céramique',
        description: 'Créations en terre cuite et céramique',
        slug: 'poterie-ceramique'
      }
    }),
    prisma.categorie.create({
      data: {
        nom: 'Textile & Couture',
        description: 'Vêtements et accessoires textiles fait main',
        slug: 'textile-couture'
      }
    }),
    prisma.categorie.create({
      data: {
        nom: 'Menuiserie',
        description: 'Meubles et objets en bois artisanaux',
        slug: 'menuiserie'
      }
    }),
    prisma.categorie.create({
      data: {
        nom: 'Maroquinerie',
        description: 'Sacs, ceintures et accessoires en cuir',
        slug: 'maroquinerie'
      }
    })
  ])

  console.log('✅ Catégories créées')

  // Créer les artisans
  const artisans = await Promise.all([
    prisma.artisan.create({
      data: {
        nom: 'Sophie Dubois',
        email: 'sophie.dubois@email.com',
        telephone: '01 23 45 67 89',
        adresse: '12 rue de la Créativité, 75001 Paris',
        specialite: 'Bijouterie moderne',
        description: 'Créatrice de bijoux contemporains alliant tradition et modernité. Spécialisée dans les pièces uniques en or et argent.',
        experience: 8,
        certifications: ['CAP Bijouterie', 'Maître Artisan'],
        siteWeb: 'https://sophie-bijoux.fr',
        instagram: '@sophie_bijoux_paris'
      }
    }),
    prisma.artisan.create({
      data: {
        nom: 'Marc Lefebvre',
        email: 'marc.lefebvre@email.com',
        telephone: '02 34 56 78 90',
        adresse: '45 avenue des Potiers, 69002 Lyon',
        specialite: 'Poterie traditionnelle',
        description: 'Potier passionné depuis plus de 15 ans, je crée des pièces utilitaires et décoratives dans le respect des techniques ancestrales.',
        experience: 15,
        certifications: ['CAP Tournage en céramique', 'BMA Céramique'],
        siteWeb: 'https://poterie-lefebvre.com'
      }
    }),
    prisma.artisan.create({
      data: {
        nom: 'Élise Martin',
        email: 'elise.martin@email.com',
        telephone: '04 45 67 89 01',
        adresse: '8 place du Marché, 13001 Marseille',
        specialite: 'Couture créative',
        description: 'Styliste et couturière, je confectionne des pièces uniques et sur mesure avec des tissus écologiques et locaux.',
        experience: 6,
        certifications: ['CAP Métiers de la mode'],
        siteWeb: 'https://elise-couture.fr',
        instagram: '@elise_couture_marseille'
      }
    }),
    prisma.artisan.create({
      data: {
        nom: 'Pierre Moreau',
        email: 'pierre.moreau@email.com',
        telephone: '05 56 78 90 12',
        adresse: '23 rue des Artisans, 33000 Bordeaux',
        specialite: 'Ébénisterie fine',
        description: 'Ébéniste spécialisé dans la restauration et la création de meubles d\'époque. Chaque pièce est réalisée dans les règles de l\'art.',
        experience: 20,
        certifications: ['CAP Ébéniste', 'Brevet de Maîtrise'],
        siteWeb: 'https://ebenisterie-moreau.fr'
      }
    }),
    prisma.artisan.create({
      data: {
        nom: 'Camille Rousseau',
        email: 'camille.rousseau@email.com',
        telephone: '03 67 89 01 23',
        adresse: '56 rue du Cuir, 67000 Strasbourg',
        specialite: 'Maroquinerie artisanale',
        description: 'Maroquinière passionnée, je travaille uniquement avec des cuirs français de qualité pour créer des pièces durables et élégantes.',
        experience: 10,
        certifications: ['CAP Maroquinerie', 'Titre de Maître Artisan'],
        siteWeb: 'https://cuirs-rousseau.fr',
        instagram: '@camille_maroquinerie'
      }
    })
  ])

  console.log('✅ Artisans créés')

  // Créer les produits
  const produits = await Promise.all([
    // Bijoux - Sophie Dubois
    prisma.produit.create({
      data: {
        nom: 'Collier Constellation',
        description: 'Collier en argent 925 avec pendentifs étoiles, inspiré des constellations. Pièce unique.',
        prix: 145.00,
        categorieId: categories[0].id, // Bijouterie
        artisanId: artisans[0].id, // Sophie Dubois
        materiaux: ['Argent 925', 'Zircons'],
        dimensions: '45cm de longueur',
        poidsEnGrammes: 15,
        tempsCreation: '3 jours',
        stock: 1,
        disponible: true
      }
    }),
    prisma.produit.create({
      data: {
        nom: 'Boucles d\'oreilles Lumière',
        description: 'Boucles d\'oreilles pendantes en or 18 carats avec perles de culture. Élégance et raffinement.',
        prix: 280.00,
        categorieId: categories[0].id,
        artisanId: artisans[0].id,
        materiaux: ['Or 18k', 'Perles de culture'],
        dimensions: '4cm de hauteur',
        poidsEnGrammes: 8,
        tempsCreation: '2 jours',
        stock: 2,
        disponible: true
      }
    }),

    // Poterie - Marc Lefebvre
    prisma.produit.create({
      data: {
        nom: 'Service à thé japonisant',
        description: 'Service à thé composé d\'une théière et de 4 tasses, céramique grès émaillé, style zen.',
        prix: 89.00,
        categorieId: categories[1].id, // Poterie
        artisanId: artisans[1].id, // Marc Lefebvre
        materiaux: ['Grès', 'Émail naturel'],
        dimensions: 'Théière: 20cm, Tasses: 8cm',
        poidsEnGrammes: 1200,
        tempsCreation: '1 semaine',
        stock: 3,
        disponible: true
      }
    }),
    prisma.produit.create({
      data: {
        nom: 'Vase Terre de Provence',
        description: 'Grand vase décoratif en terre cuite, finition mate aux tons ocres. Parfait pour bouquets secs.',
        prix: 65.00,
        categorieId: categories[1].id,
        artisanId: artisans[1].id,
        materiaux: ['Terre cuite', 'Engobe naturel'],
        dimensions: '35cm de hauteur, 20cm de diamètre',
        poidsEnGrammes: 800,
        tempsCreation: '4 jours',
        stock: 5,
        disponible: true
      }
    }),

    // Textile - Élise Martin
    prisma.produit.create({
      data: {
        nom: 'Robe Bohème Lin Bio',
        description: 'Robe longue en lin biologique, coupe fluide avec broderies à la main. Disponible en plusieurs tailles.',
        prix: 185.00,
        categorieId: categories[2].id, // Textile
        artisanId: artisans[2].id, // Élise Martin
        materiaux: ['Lin biologique', 'Fil de coton bio'],
        dimensions: 'Tailles S à XL disponibles',
        poidsEnGrammes: 300,
        tempsCreation: '1 semaine',
        stock: 8,
        disponible: true
      }
    }),
    prisma.produit.create({
      data: {
        nom: 'Sac Cabas Toile Upcyclée',
        description: 'Sac cabas confectionné dans d\'anciennes bâches publicitaires recyclées. Unique et éco-responsable.',
        prix: 45.00,
        categorieId: categories[2].id,
        artisanId: artisans[2].id,
        materiaux: ['Bâche recyclée', 'Sangles récupérées'],
        dimensions: '40x30x15 cm',
        poidsEnGrammes: 200,
        tempsCreation: '2 jours',
        stock: 12,
        disponible: true
      }
    }),

    // Menuiserie - Pierre Moreau
    prisma.produit.create({
      data: {
        nom: 'Table Basse Chêne Massif',
        description: 'Table basse en chêne massif français, finition cirée à la main. Design intemporel et authentique.',
        prix: 450.00,
        categorieId: categories[3].id, // Menuiserie
        artisanId: artisans[3].id, // Pierre Moreau
        materiaux: ['Chêne massif français', 'Cire d\'abeille'],
        dimensions: '120x60x40 cm',
        poidsEnGrammes: 25000,
        tempsCreation: '2 semaines',
        stock: 2,
        disponible: true
      }
    }),
    prisma.produit.create({
      data: {
        nom: 'Étagère Murale Noyer',
        description: 'Étagère murale design en noyer avec fixations invisibles. Parfaite pour exposer vos objets précieux.',
        prix: 120.00,
        categorieId: categories[3].id,
        artisanId: artisans[3].id,
        materiaux: ['Noyer français', 'Huile de lin'],
        dimensions: '80x20x4 cm',
        poidsEnGrammes: 2500,
        tempsCreation: '5 jours',
        stock: 6,
        disponible: true
      }
    }),

    // Maroquinerie - Camille Rousseau
    prisma.produit.create({
      data: {
        nom: 'Sac à Main Cuir Vintage',
        description: 'Sac à main en cuir de vachette pleine fleur, cousu main. Style vintage revisité avec finitions modernes.',
        prix: 280.00,
        categorieId: categories[4].id, // Maroquinerie
        artisanId: artisans[4].id, // Camille Rousseau
        materiaux: ['Cuir de vachette', 'Laiton vieilli'],
        dimensions: '35x25x12 cm',
        poidsEnGrammes: 600,
        tempsCreation: '1 semaine',
        stock: 4,
        disponible: true
      }
    }),
    prisma.produit.create({
      data: {
        nom: 'Portefeuille Cuir Français',
        description: 'Portefeuille compact en cuir français, coutures sellier. Compartiments optimisés pour cartes et billets.',
        prix: 75.00,
        categorieId: categories[4].id,
        artisanId: artisans[4].id,
        materiaux: ['Cuir français', 'Fil polyester haute résistance'],
        dimensions: '11x9x2 cm',
        poidsEnGrammes: 80,
        tempsCreation: '2 jours',
        stock: 15,
        disponible: true
      }
    })
  ])

  console.log('✅ Produits créés')
  console.log(`🎉 Seeding terminé avec succès !`)
  console.log(`   - ${categories.length} catégories créées`)
  console.log(`   - ${artisans.length} artisans créés`)
  console.log(`   - ${produits.length} produits créés`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erreur lors du seeding:', e)
    await prisma.$disconnect()
    process.exit(1)
  })