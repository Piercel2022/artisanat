// FICHIER: src/lib/admin/produits-data.ts
/**
 * Gestion simulée des produits artisanaux.
 */

export interface Produit {
  id: string;
  nom: string;
  categorie: string;
  prix: number;
  stock: number;
  artisanId: string;
  statut: 'valide' | 'en_attente' | 'rejete';
}

const MOCK_PRODUITS: Produit[] = [
  {
    id: 'p1',
    nom: 'Vase en grès',
    categorie: 'Décoration',
    prix: 45,
    stock: 12,
    artisanId: 'a1',
    statut: 'en_attente'
  },
  {
    id: 'p2',
    nom: 'Table en chêne massif',
    categorie: 'Mobilier',
    prix: 350,
    stock: 2,
    artisanId: 'a2',
    statut: 'valide'
  }
];

export async function getProduits(): Promise<Produit[]> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_PRODUITS;
}

export async function getProduitById(id: string): Promise<Produit | undefined> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_PRODUITS.find((p) => p.id === id);
}
