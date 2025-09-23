// =============================================================================
// FICHIER: src/app/(public)/contact/page.tsx
// NOM: Page de contact
// DESCRIPTION: Formulaire de contact et informations de communication
// RÔLE: Point de contact principal, gestion des demandes et communication
// RELATION: Page de service, accessible depuis toute l'application
// =============================================================================

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Contactez-nous</h1>
      
      <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
        {/* Formulaire */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  Prénom *
                </label>
                <input 
                  type="text" 
                  id="firstName"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Nom *
                </label>
                <input 
                  type="text" 
                  id="lastName"
                  className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  required 
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email *
              </label>
              <input 
                type="email" 
                id="email"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Sujet *
              </label>
              <select 
                id="subject"
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un sujet</option>
                <option value="general">Question générale</option>
                <option value="artisan">Devenir artisan partenaire</option>
                <option value="product">Question sur un produit</option>
                <option value="technical">Problème technique</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Message *
              </label>
              <textarea 
                id="message"
                rows={6}
                className="w-full border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
            >
              Envoyer le message
            </button>
          </form>
        </div>

        {/* Informations de contact */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">Nos coordonnées</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">📧 Email</h3>
              <p className="text-gray-700">contact@artisanat-francais.fr</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📞 Téléphone</h3>
              <p className="text-gray-700">+33 1 23 45 67 89</p>
              <p className="text-sm text-gray-600">Du lundi au vendredi, 9h-18h</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">📍 Adresse</h3>
              <p className="text-gray-700">
                123 Rue de l'Artisanat<br />
                75001 Paris<br />
                France
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">⏰ Horaires</h3>
              <p className="text-gray-700">
                Lundi - Vendredi: 9h00 - 18h00<br />
                Samedi: 10h00 - 16h00<br />
                Dimanche: Fermé
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}