/**
 * FOOTER - src/components/layout/Footer.tsx
 * 
 * Description:
 * Composant footer de l'application avec liens utiles,
 * informations de contact et mentions légales.
 */

import React from 'react'
import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  navigation: [
    { name: 'Accueil', href: '/' },
    { name: 'Artisans', href: '/artisans' },
    { name: 'Créations', href: '/creations' },
    { name: 'Régions', href: '/regions' },
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Notre mission', href: '/mission' },
    { name: 'Équipe', href: '/team' },
    { name: 'Actualités', href: '/news' },
  ],
  support: [
    { name: 'Contact', href: '/contact' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Aide', href: '/help' },
    { name: 'Support', href: '/support' },
  ],
  legal: [
    { name: 'Mentions légales', href: '/legal' },
    { name: 'Confidentialité', href: '/privacy' },
    { name: 'CGU', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
  ],
}

const socialLinks = [
  { name: 'Facebook', href: '#', icon: Facebook },
  { name: 'Instagram', href: '#', icon: Instagram },
  { name: 'Twitter', href: '#', icon: Twitter },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">AF</span>
              </div>
              <span className="font-playfair text-xl font-semibold">
                Artisanat Français
              </span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Découvrez l'excellence de l'artisanat français à travers des créateurs 
              passionnés qui perpétuent les traditions et savoir-faire ancestraux.
            </p>
            
            {/* Coordonnées */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin size={16} />
                <span>Paris, France</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} />
                <span>contact@artisanat-francais.fr</span>
              </div>
            </div>
          </div>

          {/* Liens Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4">Navigation</h3>
            <ul className="space-y-2">
              {footerLinks.navigation.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Entreprise */}
          <div>
            <h3 className="font-semibold text-white mb-4">Entreprise</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Liens Légaux */}
          <div>
            <h3 className="font-semibold text-white mb-4">Légal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Section réseaux sociaux et copyright */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 sm:mb-0">
            {socialLinks.map((social) => {
              const Icon = social.icon
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{social.name}</span>
                  <Icon size={20} />
                </Link>
              )
            })}
          </div>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Artisanat Français. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}