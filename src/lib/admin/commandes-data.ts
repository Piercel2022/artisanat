// FICHIER: src/lib/admin/commandes-data.ts
/**
 * Gestion simulée des commandes.
 */

export interface Commande {
  id: string;
  client: string;
  produits: { produitId: string; quantite: number }[];
  montantTotal: number;
  dateCommande: Date;
  statut: 'en_cours' | 'expediee' | 'livree' | 'annulee';
}

const MOCK_COMMANDES: Commande[] = [
  {
    id: 'c1',
    client: 'Alice Moreau',
    produits: [
      { produitId: 'p1', quantite: 2 },
      { produitId: 'p2', quantite: 1 }
    ],
    montantTotal: 440,
    dateCommande: new Date('2024-09-20'),
    statut: 'en_cours'
  },
  {
    id: 'c2',
    client: 'David Leroy',
    produits: [{ produitId: 'p2', quantite: 1 }],
    montantTotal: 350,
    dateCommande: new Date('2024-09-15'),
    statut: 'livree'
  }
];

export async function getCommandes(): Promise<Commande[]> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_COMMANDES;
}

export async function getCommandeById(id: string): Promise<Commande | undefined> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_COMMANDES.find((c) => c.id === id);
}
