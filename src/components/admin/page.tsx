/**
 * FICHIER: src/app/admin/page.tsx
 * 
 * DESCRIPTION: Page principale du dashboard administrateur
 * - Interface de pilotage centrale pour la gestion du CMS
 * - Affiche les statistiques globales et les raccourcis vers les sections principales
 * - Point d'entrée principal pour tous les flux de gestion administrative
 * 
 * RÔLE: 
 * - Dashboard central de l'interface d'administration
 * - Présentation des métriques clés (artisans, produits, commandes)
 * - Navigation rapide vers les différentes sections de gestion
 * - Aperçu des activités récentes et notifications
 * 
 * IMPACT/RELATIONS:
 * - Route protégée accessible uniquement aux administrateurs authentifiés
 * - Utilise les API routes (/api/artisans, /api/products, /api/stats)
 * - Connecté au système d'authentification et de permissions
 * - Référence les composants admin (StatCard, QuickActions, RecentActivity)
 * - Impacte l'expérience utilisateur admin et l'efficacité de gestion
 * - Point de départ pour naviguer vers artisans/, produits/, contenus/, parametres/
 */

import { Suspense } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Plus,
  Eye,
  Settings,
  FileText,
  ArrowRight
} from 'lucide-react';

// Types pour les statistiques du dashboard
interface DashboardStats {
  totalArtisans: number;
  totalProduits: number;
  totalCommandes: number;
  chiffreAffaires: number;
  nouveauxArtisans: number;
  produitsEnAttente: number;
}

interface RecentActivity {
  id: string;
  type: 'artisan' | 'produit' | 'commande';
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning';
}

// Composant pour les cartes de statistiques
function StatCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend 
}: {
  title: string;
  value: string | number;
  description: string;
  icon: any;
  trend?: { value: number; label: string };
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {trend && (
          <div className="flex items-center pt-1">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span className="text-xs text-green-500">
              +{trend.value}% {trend.label}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Composant pour les actions rapides
function QuickActions() {
  const actions = [
    {
      title: 'Nouvel artisan',
      description: 'Ajouter un artisan au répertoire',
      href: '/admin/artisans/nouveau',
      icon: Users,
      variant: 'default' as const
    },
    {
      title: 'Nouveau produit', 
      description: 'Créer une nouvelle fiche produit',
      href: '/admin/produits/nouveau',
      icon: Package,
      variant: 'secondary' as const
    },
    {
      title: 'Gérer le contenu',
      description: 'Modifier pages et contenus',
      href: '/admin/contenus',
      icon: FileText,
      variant: 'outline' as const
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>
          Raccourcis vers les actions les plus courantes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button 
              variant={action.variant} 
              className="w-full justify-start h-auto p-4"
            >
              <action.icon className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-muted-foreground">
                  {action.description}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

// Composant pour l'activité récente
function RecentActivity({ activities }: { activities: RecentActivity[] }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'warning': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'artisan': return Users;
      case 'produit': return Package;
      case 'commande': return ShoppingCart;
      default: return FileText;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activité récente</CardTitle>
        <CardDescription>
          Dernières actions effectuées sur la plateforme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getTypeIcon(activity.type);
            return (
              <div key={activity.id} className="flex items-center space-x-4">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.status)}`} />
                <IconComponent className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.timestamp.toLocaleDateString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <Link href="/admin/activites">
            <Button variant="ghost" className="w-full">
              Voir toute l'activité
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

// Fonction pour récupérer les statistiques (simulée)
async function getDashboardStats(): Promise<DashboardStats> {
  // En production, ceci ferait appel à l'API
  // const response = await fetch('/api/admin/stats');
  // return response.json();
  
  return {
    totalArtisans: 156,
    totalProduits: 1247,
    totalCommandes: 89,
    chiffreAffaires: 25780,
    nouveauxArtisans: 12,
    produitsEnAttente: 8
  };
}

// Fonction pour récupérer l'activité récente (simulée)
async function getRecentActivity(): Promise<RecentActivity[]> {
  return [
    {
      id: '1',
      type: 'artisan',
      description: 'Nouveau profil artisan créé: Marie Dubois (Céramique)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      status: 'success'
    },
    {
      id: '2', 
      type: 'produit',
      description: 'Produit en attente de validation: Vase en grès',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      status: 'pending'
    },
    {
      id: '3',
      type: 'commande',
      description: 'Nouvelle commande de 3 articles',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'success'
    }
  ];
}

export default async function AdminDashboard() {
  // Récupération des données en parallèle
  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  return (
    <div className="space-y-6">
      {/* En-tête du dashboard */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Vue d'ensemble de votre plateforme d'artisanat français
        </p>
      </div>

      {/* Statistiques principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Artisans"
          value={stats.totalArtisans}
          description={`+${stats.nouveauxArtisans} ce mois`}
          icon={Users}
          trend={{ value: 8.2, label: 'ce mois' }}
        />
        <StatCard
          title="Produits"
          value={stats.totalProduits}
          description={`${stats.produitsEnAttente} en attente`}
          icon={Package}
        />
        <StatCard
          title="Commandes"
          value={stats.totalCommandes}
          description="Ce mois"
          icon={ShoppingCart}
          trend={{ value: 12.5, label: 'vs mois dernier' }}
        />
        <StatCard
          title="Chiffre d'affaires"
          value={`${stats.chiffreAffaires.toLocaleString('fr-FR')} €`}
          description="Ce mois"
          icon={TrendingUp}
          trend={{ value: 15.3, label: 'vs mois dernier' }}
        />
      </div>

      {/* Sections principales */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Actions rapides */}
        <QuickActions />

        {/* Activité récente */}
        <RecentActivity activities={activities} />
      </div>

      {/* Liens vers les sections */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/artisans">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <CardTitle className="text-lg">Artisans</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Gérer les profils et informations des artisans
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{stats.totalArtisans} artisans</Badge>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/produits">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <CardTitle className="text-lg">Produits</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Cataloguer et organiser les créations
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{stats.totalProduits} produits</Badge>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/contenus">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <CardTitle className="text-lg">Contenus</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Modifier les pages et textes du site
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">CMS</Badge>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/parametres">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <CardTitle className="text-lg">Paramètres</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">
                Configuration générale du site
              </p>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Config</Badge>
                <ArrowRight className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}