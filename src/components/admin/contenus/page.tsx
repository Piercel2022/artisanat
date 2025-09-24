/**
 * Fichier: src/app/admin/contenus/page.tsx
 * Description: Page d’administration des contenus éditoriaux (articles, pages statiques, bannières, etc.)
 * Rôle: Ce composant joue le rôle d’interface CMS pour gérer tous les contenus textuels et visuels
 *       utilisés sur le site Artisanat Français (articles de blog, pages de présentation, mentions légales, etc.).
 * Relations:
 *  - Relie la base de données (via API routes /api/contents) avec l’interface admin.
 *  - Impact direct sur la partie publique: tout changement ici est visible par les visiteurs
 *    (par ex. mise à jour des textes de la page "À propos").
 *  - Connecté aux composants UI (tableaux, formulaires, boutons) de src/components/admin/.
 *  - Interagit avec le store global et hooks personnalisés si l’on ajoute une logique de fetching/mutation.
 */

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"

export default function AdminContenusPage() {
  // ⚡ Cette page est un Server Component par défaut (App Router Next.js 14).
  // On peut fetcher ici les contenus depuis la base (via Prisma ou API interne).
  const contenus = [
    { id: 1, titre: "Page d'accueil", type: "Page statique", statut: "Publié" },
    { id: 2, titre: "Histoire de l'artisanat", type: "Article", statut: "Brouillon" },
    { id: 3, titre: "Bannière promo Noël", type: "Bannière", statut: "Publié" },
  ]

  return (
    <section className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gestion des contenus</h1>
        <Button className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Nouveau contenu
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Liste des contenus</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Titre</th>
                  <th className="border px-4 py-2 text-left">Type</th>
                  <th className="border px-4 py-2 text-left">Statut</th>
                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {contenus.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{c.titre}</td>
                    <td className="border px-4 py-2">{c.type}</td>
                    <td className="border px-4 py-2">{c.statut}</td>
                    <td className="border px-4 py-2 text-center space-x-2">
                      <Button size="sm" variant="outline">Éditer</Button>
                      <Button size="sm" variant="destructive">Supprimer</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
