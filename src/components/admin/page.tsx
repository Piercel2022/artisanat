/**
 * FICHIER: src/app/admin/page.tsx
 * 
 * DESCRIPTION:
 * Page principale du dashboard administrateur.
 * Utilise le composant AdminDashboardComponent pour afficher les stats et activités.
 */

import { getDashboardStats, getRecentActivity } from '@/lib/admin/dashboard-data';
import AdminDashboardComponent from '@/components/admin/AdminDashboardComponent';

export default async function AdminDashboardPage() {
  // Récupération des données en parallèle
  const [stats, activities] = await Promise.all([
    getDashboardStats(),
    getRecentActivity()
  ]);

  return <AdminDashboardComponent stats={stats} activities={activities} />;
}
