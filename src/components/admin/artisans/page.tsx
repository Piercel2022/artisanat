/**
 * FICHIER: src/app/admin/artisans/page.tsx
 * 
 * DESCRIPTION: Page de liste et gestion des artisans dans l'interface admin
 * - Interface CRUD complète pour la gestion des profils artisans
 * - Fonctionnalités de recherche, filtrage, pagination et tri
 * - Actions en lot et gestion des statuts des artisans
 * 
 * RÔLE:
 * - Point d'entrée principal pour la gestion des artisans
 * - Liste paginée avec prévisualisation des informations clés
 * - Navigation vers les détails/édition de chaque artisan
 * - Gestion des actions rapides (activation/désactivation, suppression)
 * 
 * IMPACT/RELATIONS:
 * - Utilise l'API route /api/artisans pour CRUD operations
 * - Connecté aux composants ArtisanCard, SearchFilters, Pagination
 * - Impact direct sur la visibilité des artisans côté public
 * - Relations avec les produits (via foreign keys)
 * - Influence les statistiques du dashboard principal
 * - Navigation vers /admin/artisans/[id] et /admin/artisans/nouveau
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdownmenu';
import { 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  Star,
  Package,
  Download,
  Mail,
  Phone
} from 'lucide-react';

// Types pour les artisans
interface Artisan {
  id: string;
  nom: string;
  prenom: string;
  nomAtelier: string;
  email: string;
  telephone?: string;
  adresse: {
    ville: string;
    departement: string;
    region: string;
  };
  specialites: string[];
  statut: 'actif' | 'inactif' | 'en_attente' | 'suspendu';
  dateInscription: Date;
  dernierConnection?: Date;
  nombreProduits: number;
  notemoyenne?: number;
  nombreAvis: number;
  avatar?: string;
  description: string;
  siteWeb?: string;
  reseauxSociaux: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
}

interface ArtisansPageProps {
  searchParams: {
    page?: string;
    search?: string;
    statut?: string;
    region?: string;
    specialite?: string;
    tri?: string;
  };
}

// Composant pour les filtres
function ArtisansFilters({ 
  searchParams 
}: { 
  searchParams: ArtisansPageProps['searchParams'] 
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Recherche */}
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher par nom, atelier ou spécialité..."
          className="pl-9"
          defaultValue={searchParams.search}
        />
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <Select defaultValue={searchParams.statut}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tous">Tous</SelectItem>
            <SelectItem value="actif">Actif</SelectItem>
            <SelectItem value="inactif">Inactif</SelectItem>
            <SelectItem value="en_attente">En attente</SelectItem>
            <SelectItem value="suspendu">Suspendu</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={searchParams.region}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="toutes">Toutes</SelectItem>
            <SelectItem value="auvergne-rhone-alpes">Auvergne-Rhône-Alpes</SelectItem>
            <SelectItem value="bretagne">Bretagne</SelectItem>
            <SelectItem value="normandie">Normandie</SelectItem>
            <SelectItem value="provence-alpes-cote-azur">PACA</SelectItem>
            <SelectItem value="nouvelle-aquitaine">Nouvelle-Aquitaine</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue={searchParams.tri}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Trier par" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nom">Nom</SelectItem>
            <SelectItem value="inscription">Date d'inscription</SelectItem>
            <SelectItem value="produits">Nb. produits</SelectItem>
            <SelectItem value="note">Note moyenne</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Composant pour le badge de statut
function StatutBadge({ statut }: { statut: Artisan['statut'] }) {
  const variants = {
    actif: 'bg-green-100 text-green-800',
    inactif: 'bg-gray-100 text-gray-800',
    en_attente: 'bg-yellow-100 text-yellow-800',
    suspendu: 'bg-red-100 text-red-800'
  };

  const labels = {
    actif: 'Actif',
    inactif: 'Inactif', 
    en_attente: 'En attente',
    suspendu: 'Suspendu'
  };

  return (
    <Badge variant="secondary" className={variants[statut]}>
      {labels[statut]}
    </Badge>
  );
}

// Composant pour les actions sur un artisan
function ArtisanActions({ artisan }: { artisan: Artisan }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Ouvrir le menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem >
          <Link href={`/artisans/${artisan.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            Voir le profil public
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem >
          <Link href={`/admin/artisans/${artisan.id}`}>
            <Edit className="mr-2 h-4 w-4" />
            Modifier
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Mail className="mr-2 h-4 w-4" />
          Contacter
        </DropdownMenuItem>
        {artisan.statut === 'actif' ? (
          <DropdownMenuItem className="text-orange-600">
            Désactiver
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-green-600">
            Activer
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Composant pour la ligne de tableau
function ArtisanRow({ artisan }: { artisan: Artisan }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            {artisan.avatar ? (
              <img 
                src={artisan.avatar} 
                alt={`${artisan.prenom} ${artisan.nom}`}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {artisan.prenom[0]}{artisan.nom[0]}
              </span>
            )}
          </div>
          <div>
            <div className="font-medium">
              {artisan.prenom} {artisan.nom}
            </div>
            <div className="text-sm text-muted-foreground">
              {artisan.nomAtelier}
            </div>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center space-x-1">
          <MapPin className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">
            {artisan.adresse.ville}, {artisan.adresse.departement}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {artisan.specialites.slice(0, 2).map((specialite) => (
            <Badge key={specialite} variant="outline" className="text-xs">
              {specialite}
            </Badge>
          ))}
          {artisan.specialites.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{artisan.specialites.length - 2}
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <StatutBadge statut={artisan.statut} />
      </TableCell>
      
      <TableCell className="text-center">
        <div className="flex items-center justify-center space-x-1">
          <Package className="h-3 w-3 text-muted-foreground" />
          <span>{artisan.nombreProduits}</span>
        </div>
      </TableCell>
      
      <TableCell className="text-center">
        {artisan.notemoyenne ? (
          <div className="flex items-center justify-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{artisan.notemoyenne.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">
              ({artisan.nombreAvis})
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )}
      </TableCell>
      
      <TableCell className="text-right">
        <ArtisanActions artisan={artisan} />
      </TableCell>
    </TableRow>
  );
}

// Composant pour la pagination
function PaginationControls({ 
  page, 
  totalPages 
}: { 
  page: number; 
  totalPages: number; 
}) {
  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="text-sm text-muted-foreground">
        Page {page} sur {totalPages}
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          asChild
        >
          <Link href={page > 1 ? `?page=${page - 1}` : '#'}>
            Précédent
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          asChild
        >
          <Link href={page < totalPages ? `?page=${page + 1}` : '#'}>
            Suivant
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Fonction pour récupérer les artisans (simulée)
async function getArtisans(searchParams: ArtisansPageProps['searchParams']): Promise<{
  artisans: Artisan[];
  total: number;
  page: number;
  totalPages: number;
}> {
  // En production, ceci ferait appel à l'API avec les paramètres
  // const response = await fetch(`/api/artisans?${new URLSearchParams(searchParams)}`);
  // return response.json();
  
  const mockArtisans: Artisan[] = [
    {
      id: '1',
      nom: 'Dubois',
      prenom: 'Marie',
      nomAtelier: 'Atelier Terre & Feu',
      email: 'marie@terre-et-feu.fr',
      telephone: '06 12 34 56 78',
      adresse: {
        ville: 'Vallauris',
        departement: 'Alpes-Maritimes',
        region: 'PACA'
      },
      specialites: ['Céramique', 'Poterie', 'Grès'],
      statut: 'actif',
      dateInscription: new Date('2023-03-15'),
      dernierConnection: new Date('2024-01-20'),
      nombreProduits: 23,
      notemoyenne: 4.8,
      nombreAvis: 15,
      description: 'Artisan céramiste passionnée par les techniques traditionnelles.',
      reseauxSociaux: {
        instagram: '@terre_et_feu',
        facebook: 'AtelierTerreEtFeu'
      }
    },
    {
      id: '2',
      nom: 'Martin',
      prenom: 'Jean',
      nomAtelier: 'Forge Ancestrale',
      email: 'jean@forge-ancestrale.fr',
      adresse: {
        ville: 'Thiers',
        departement: 'Puy-de-Dôme',
        region: 'Auvergne-Rhône-Alpes'
      },
      specialites: ['Forge', 'Coutellerie', 'Métallurgie'],
      statut: 'actif',
      dateInscription: new Date('2023-01-10'),
      nombreProduits: 18,
      notemoyenne: 4.9,
      nombreAvis: 22,
      description: 'Maître forgeron perpétuant la tradition de la coutellerie thiernoise.',
      reseauxSociaux: {}
    },
    {
      id: '3',
      nom: 'Lecomte',
      prenom: 'Sophie',
      nomAtelier: 'Atelier du Fil',
      email: 'sophie@atelier-du-fil.fr',
      adresse: {
        ville: 'Bayeux',
        departement: 'Calvados',
        region: 'Normandie'
      },
      specialites: ['Broderie', 'Tapisserie', 'Textile'],
      statut: 'en_attente',
      dateInscription: new Date('2024-01-15'),
      nombreProduits: 12,
      notemoyenne: 4.6,
      nombreAvis: 8,
      description: 'Spécialiste de la broderie traditionnelle normande.',
      reseauxSociaux: {
        instagram: '@atelier_du_fil'
      }
    },
    {
      id: '4',
      nom: 'Rousseau',
      prenom: 'Pierre',
      nomAtelier: 'Menuiserie du Chêne',
      email: 'pierre@menuiserie-chene.fr',
      telephone: '05 47 89 12 34',
      adresse: {
        ville: 'La Rochelle',
        departement: 'Charente-Maritime',
        region: 'Nouvelle-Aquitaine'
      },
      specialites: ['Menuiserie', 'Ébénisterie', 'Restauration'],
      statut: 'actif',
      dateInscription: new Date('2022-11-20'),
      dernierConnection: new Date('2024-01-18'),
      nombreProduits: 31,
      notemoyenne: 4.7,
      nombreAvis: 27,
      description: 'Menuisier ébéniste spécialisé dans la restauration de meubles anciens.',
      siteWeb: 'https://menuiserie-chene.fr',
      reseauxSociaux: {
        facebook: 'MenuiserieChene'
      }
    },
    {
      id: '5',
      nom: 'Moreau',
      prenom: 'Catherine',
      nomAtelier: 'Cristal & Lumière',
      email: 'catherine@cristal-lumiere.fr',
      adresse: {
        ville: 'Baccarat',
        departement: 'Meurthe-et-Moselle',
        region: 'Grand Est'
      },
      specialites: ['Verrerie', 'Cristallerie', 'Vitrail'],
      statut: 'inactif',
      dateInscription: new Date('2023-05-08'),
      nombreProduits: 8,
      description: 'Maître verrier spécialisée dans les arts du cristal.',
      nombreAvis: 5,
      reseauxSociaux: {}
    },
    {
      id: '6',
      nom: 'Bertrand',
      prenom: 'Lucas',
      nomAtelier: 'Cuir & Tradition',
      email: 'lucas@cuir-tradition.fr',
      telephone: '02 98 76 54 32',
      adresse: {
        ville: 'Pont-Aven',
        departement: 'Finistère',
        region: 'Bretagne'
      },
      specialites: ['Maroquinerie', 'Sellerie', 'Cuir'],
      statut: 'suspendu',
      dateInscription: new Date('2023-08-12'),
      nombreProduits: 5,
      notemoyenne: 3.2,
      nombreAvis: 4,
      description: 'Artisan maroquinier travaillant le cuir selon les méthodes ancestrales.',
      reseauxSociaux: {
        instagram: '@cuir_tradition'
      }
    }
  ];

  const page = parseInt(searchParams.page || '1');
  const perPage = 10;
  const total = mockArtisans.length;
  const totalPages = Math.ceil(total / perPage);
  
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const artisans = mockArtisans.slice(startIndex, endIndex);

  return {
    artisans,
    total,
    page,
    totalPages
  };
}

// Composant principal
export default async function ArtisansPage({ searchParams }: ArtisansPageProps) {
  const { artisans, total, page, totalPages } = await getArtisans(searchParams);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artisans</h1>
          <p className="text-muted-foreground">
            Gérez les profils et statuts des artisans de la plateforme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button asChild>
            <Link href="/admin/artisans/nouveau">
              <Plus className="mr-2 h-4 w-4" />
              Nouvel artisan
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Artisans
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">
              +12 ce mois-ci
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Artisans Actifs
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {artisans.filter(a => a.statut === 'actif').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((artisans.filter(a => a.statut === 'actif').length / total) * 100).toFixed(1)}% du total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En Attente
            </CardTitle>
            <div className="h-4 w-4 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {artisans.filter(a => a.statut === 'en_attente').length}
            </div>
            <p className="text-xs text-muted-foreground">
              À valider
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Note Moyenne
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7</div>
            <p className="text-xs text-muted-foreground">
              Sur {artisans.reduce((acc, a) => acc + a.nombreAvis, 0)} avis
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres et Recherche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ArtisansFilters searchParams={searchParams} />
        </CardContent>
      </Card>

      {/* Tableau des artisans */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Artisans</CardTitle>
          <CardDescription>
            {total} artisan{total > 1 ? 's' : ''} au total
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div>Chargement...</div>}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Artisan</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Spécialités</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-center">Produits</TableHead>
                  <TableHead className="text-center">Note</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {artisans.map((artisan) => (
                  <ArtisanRow key={artisan.id} artisan={artisan} />
                ))}
              </TableBody>
            </Table>
          </Suspense>
          
          <PaginationControls page={page} totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}