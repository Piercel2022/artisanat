// FICHIER: src/components/admin/AdminDashboardComponent.tsx

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Package, ShoppingCart, TrendingUp,
  FileText, Settings, ArrowRight
} from 'lucide-react';

// Types
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

interface AdminDashboardProps {
  stats: DashboardStats;
  activities: RecentActivity[];
}

// Composant cartes statistiques
function StatCard({ title, value, description, icon: Icon, trend }: any) {
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

// Actions rapides
function QuickActions() {
  const actions = [
    { title: 'Nouvel artisan', description: 'Ajouter un artisan', href: '/admin/artisans/nouveau', icon: Users, variant: 'default' as const },
    { title: 'Nouveau produit', description: 'Créer une fiche produit', href: '/admin/produits/nouveau', icon: Package, variant: 'secondary' as const },
    { title: 'Gérer le contenu', description: 'Modifier pages et contenus', href: '/admin/contenus', icon: FileText, variant: 'outline' as const }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions rapides</CardTitle>
        <CardDescription>Raccourcis vers les actions les plus courantes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Button variant={action.variant} className="w-full justify-start h-auto p-4">
              <action.icon className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

// Activité récente
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
        <CardDescription>Dernières actions effectuées sur la plateforme</CardDescription>
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
                    {activity.timestamp.toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardComponent({ stats, activities }: AdminDashboardProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Vue d'ensemble de votre plateforme d'artisanat français</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Artisans" value={stats.totalArtisans} description={`+${stats.nouveauxArtisans} ce mois`} icon={Users} trend={{ value: 8.2, label: 'ce mois' }} />
        <StatCard title="Produits" value={stats.totalProduits} description={`${stats.produitsEnAttente} en attente`} icon={Package} />
        <StatCard title="Commandes" value={stats.totalCommandes} description="Ce mois" icon={ShoppingCart} trend={{ value: 12.5, label: 'vs mois dernier' }} />
        <StatCard title="Chiffre d'affaires" value={`${stats.chiffreAffaires.toLocaleString('fr-FR')} €`} description="Ce mois" icon={TrendingUp} trend={{ value: 15.3, label: 'vs mois dernier' }} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QuickActions />
        <RecentActivity activities={activities} />
      </div>
    </div>
  );
}
