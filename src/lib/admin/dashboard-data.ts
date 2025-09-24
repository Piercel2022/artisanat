// FICHIER: src/lib/admin/dashboard-data.ts
/**
 * DESCRIPTION:
 * Fonctions simulées pour récupérer les statistiques et l'activité récente
 * du dashboard administrateur.
 * En production, ces fonctions feraient des appels à vos API ou votre base de données.
 */

export interface DashboardStats {
  totalArtisans: number;
  totalProduits: number;
  totalCommandes: number;
  chiffreAffaires: number;
  nouveauxArtisans: number;
  produitsEnAttente: number;
}

export interface RecentActivity {
  id: string;
  type: 'artisan' | 'produit' | 'commande';
  description: string;
  timestamp: Date;
  status: 'success' | 'pending' | 'warning';
}

/**
 * Récupère les statistiques globales du dashboard.
 * Simulé ici avec des valeurs fixes.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  // Simule un délai comme pour un fetch réel
  await new Promise((res) => setTimeout(res, 100));

  return {
    totalArtisans: 156,
    totalProduits: 1247,
    totalCommandes: 89,
    chiffreAffaires: 25780,
    nouveauxArtisans: 12,
    produitsEnAttente: 8
  };
}

/**
 * Récupère les activités récentes de la plateforme.
 * Simulé avec quelques actions fictives.
 */
export async function getRecentActivity(): Promise<RecentActivity[]> {
  await new Promise((res) => setTimeout(res, 100));

  return [
    {
      id: '1',
      type: 'artisan',
      description: 'Nouveau profil artisan créé: Marie Dubois (Céramique)',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // il y a 30 min
      status: 'success'
    },
    {
      id: '2',
      type: 'produit',
      description: 'Produit en attente de validation: Vase en grès',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // il y a 1h
      status: 'pending'
    },
    {
      id: '3',
      type: 'commande',
      description: 'Nouvelle commande de 3 articles',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // il y a 2h
      status: 'success'
    }
  ];
}
