/**
 * Fichier: src/app/admin/produits/page.tsx
 * 
 * Description: Page de gestion des produits dans l'interface d'administration.
 * Cette page permet aux administrateurs de visualiser, créer, modifier et supprimer
 * les produits artisanaux référencés sur la plateforme.
 * 
 * Rôle du fichier:
 * - Interface principale de gestion des produits pour les administrateurs
 * - Affichage de la liste complète des produits avec filtres et recherche
 * - Accès aux fonctionnalités CRUD (Create, Read, Update, Delete)
 * - Gestion des images, catégories, prix et informations produits
 * - Interface pour associer les produits aux artisans
 * 
 * Impact et relations avec l'application:
 * - Consomme les API routes /api/products/* pour les opérations CRUD
 * - Utilise les composants admin réutilisables du dossier components/admin/
 * - Impacte directement l'affichage public du catalogue (app/(public)/catalogue/)
 * - Synchronisé avec la base de données via Prisma ORM
 * - Influence le SEO et le référencement des pages produits publiques
 * - Connecté au système d'upload d'images (/api/upload/)
 * - Relation forte avec la gestion des artisans (app/admin/artisans/)
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  Euro,
  Tag,
  User,
  Image as ImageIcon,
  MoreHorizontal
} from 'lucide-react';

// Types pour les produits
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: {
    id: string;
    name: string;
  };
  artisan: {
    id: string;
    name: string;
    slug: string;
  };
  slug: string;
  stock: number;
  status: 'ACTIVE' | 'INACTIVE' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

const ProductsAdminPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // États pour les filtres et la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // État pour la sélection multiple
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  // Chargement des produits
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedStatus && { status: selectedStatus }),
      });

      const response = await fetch(`/api/products?${params}`);
      if (!response.ok) throw new Error('Erreur lors du chargement des produits');
      
      const data: ProductsResponse = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Suppression d'un produit
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      // Refresh la liste
      fetchProducts();
    } catch (err) {
      alert('Erreur lors de la suppression du produit');
    }
  };

  // Suppression multiple
  const handleBulkDelete = async () => {
    if (!confirm(`Supprimer ${selectedProducts.length} produit(s) sélectionné(s) ?`)) return;
    
    try {
      await Promise.all(
        selectedProducts.map(id => 
          fetch(`/api/products/${id}`, { method: 'DELETE' })
        )
      );
      
      setSelectedProducts([]);
      fetchProducts();
    } catch (err) {
      alert('Erreur lors de la suppression multiple');
    }
  };

  // Changement de statut
  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      fetchProducts();
    } catch (err) {
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  // Effets
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery, selectedCategory, selectedStatus]);

  // Gestion de la sélection
  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.id));
    }
  };

  const handleSelectProduct = (productId: string) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  // Rendu des statuts
  const getStatusBadge = (status: string) => {
    const styles = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      DRAFT: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      ACTIVE: 'Actif',
      INACTIVE: 'Inactif',
      DRAFT: 'Brouillon'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Erreur: {error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="mt-2 text-red-600 underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8" />
            Gestion des Produits
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les produits artisanaux de votre plateforme
          </p>
        </div>
        
        <Link
          href="/admin/produits/nouveau"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouveau Produit
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Produits</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
            <Package className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Produits Actifs</p>
              <p className="text-2xl font-bold text-green-600">
                {products.filter(p => p.status === 'ACTIVE').length}
              </p>
            </div>
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Rupture</p>
              <p className="text-2xl font-bold text-red-600">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <Tag className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Brouillons</p>
              <p className="text-2xl font-bold text-yellow-600">
                {products.filter(p => p.status === 'DRAFT').length}
              </p>
            </div>
            <Edit className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white p-4 rounded-lg border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Filtres */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les catégories</option>
            <option value="ceramique">Céramique</option>
            <option value="textile">Textile</option>
            <option value="bois">Bois</option>
            <option value="metal">Métal</option>
            <option value="cuir">Cuir</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            <option value="ACTIVE">Actif</option>
            <option value="INACTIVE">Inactif</option>
            <option value="DRAFT">Brouillon</option>
          </select>
        </div>
        
        {/* Actions en lot */}
        {selectedProducts.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-blue-700">
              {selectedProducts.length} produit(s) sélectionné(s)
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="text-red-600 hover:text-red-700 px-3 py-1 border border-red-200 rounded hover:bg-red-50"
              >
                Supprimer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Liste des produits */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === products.length && products.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Produit
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Artisan
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Catégorie
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Prix
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Statut
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => handleSelectProduct(product.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          width={48}
                          height={48}
                          className="rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <Link
                        href={`/admin/artisans/${product.artisan.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {product.artisan.name}
                      </Link>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                      {product.category.name}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <Euro className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{formatPrice(product.price)}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4">
                    <span className={`font-medium ${product.stock === 0 ? 'text-red-600' : 'text-gray-900'}`}>
                      {product.stock}
                    </span>
                  </td>
                  
                  <td className="px-4 py-4">
                    <select
                      value={product.status}
                      onChange={(e) => handleStatusChange(product.id, e.target.value)}
                      className="text-sm rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ACTIVE">Actif</option>
                      <option value="INACTIVE">Inactif</option>
                      <option value="DRAFT">Brouillon</option>
                    </select>
                  </td>
                  
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/catalogue/produit/${product.slug}`}
                        target="_blank"
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Voir sur le site"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      
                      <Link
                        href={`/admin/produits/${product.id}/modifier`}
                        className="text-gray-600 hover:text-gray-800 p-1"
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <button className="text-gray-400 hover:text-gray-600 p-1">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {products.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun produit trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              Commencez par ajouter votre premier produit artisanal
            </p>
            <Link
              href="/admin/produits/nouveau"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Créer un produit
            </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-2 border rounded-lg ${
                  currentPage === i + 1 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsAdminPage;