/**
 * ContactArtisanForm.tsx
 * 
 * Description: Formulaire de contact pour permettre aux visiteurs de contacter un artisan
 * 
 * Rôle:
 * - Affiche un formulaire de contact personnalisé pour chaque artisan
 * - Gère la validation des champs obligatoires
 * - Envoie les messages via l'API de contact
 * - Propose différents types de demandes (devis, information, commande personnalisée)
 * - Affiche les informations de contact de l'artisan (téléphone, email, adresse)
 * 
 * Relations dans l'application:
 * - Utilisé dans: pages/artisans/[slug]/page.tsx (profil artisan)
 * - Utilise: @/components/ui pour les composants de formulaire
 * - Connecté à: API /api/contact/artisan pour l'envoi des messages
 * - Dépend de: @/types/artisan pour les types Artisan et ContactMessage
 * - Intégré avec: système de notification pour confirmer l'envoi
 * - Lié à: système anti-spam (reCAPTCHA ou similaire)
 */

'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle, 
  AlertCircle,
  MessageSquare
} from 'lucide-react';

// Types pour le formulaire de contact
interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  contactType: 'quote' | 'info' | 'custom' | 'other';
}

interface ArtisanContact {
  email: string;
  phone?: string;
  address?: {
    street: string;
    city: string;
    postalCode: string;
    department: string;
  };
  workingHours?: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  responseTime?: string; // ex: "24h", "48h"
}

interface ContactArtisanFormProps {
  artisan: {
    id: string;
    name: string;
    slug: string;
    contact: ArtisanContact;
    specialties: string[];
  };
}

export default function ContactArtisanForm({ artisan }: ContactArtisanFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'info'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Options pour le type de contact
  const contactTypes = [
    { value: 'quote', label: 'Demande de devis', icon: MessageSquare },
    { value: 'info', label: 'Demande d\'information', icon: Mail },
    { value: 'custom', label: 'Commande personnalisée', icon: Send },
    { value: 'other', label: 'Autre', icon: MessageSquare }
  ];

  // Gestion des changements dans le formulaire
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Le nom est obligatoire');
      return false;
    }
    if (!formData.email.trim()) {
      setError('L\'email est obligatoire');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Format d\'email invalide');
      return false;
    }
    if (!formData.subject.trim()) {
      setError('Le sujet est obligatoire');
      return false;
    }
    if (!formData.message.trim()) {
      setError('Le message est obligatoire');
      return false;
    }
    return true;
  };

  // Envoi du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('/api/contact/artisan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          artisanId: artisan.id,
          artisanSlug: artisan.slug
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      setSuccess(true);
      // Réinitialiser le formulaire
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactType: 'info'
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Formatage des horaires de travail
  const formatWorkingHours = () => {
    if (!artisan.contact.workingHours) return null;
    
    const hours = artisan.contact.workingHours;
    const days = [
      { key: 'monday', label: 'Lun' },
      { key: 'tuesday', label: 'Mar' },
      { key: 'wednesday', label: 'Mer' },
      { key: 'thursday', label: 'Jeu' },
      { key: 'friday', label: 'Ven' },
      { key: 'saturday', label: 'Sam' },
      { key: 'sunday', label: 'Dim' }
    ];

    return (
      <div className="grid grid-cols-2 gap-2 text-sm">
        {days.map(day => {
          const dayHours = hours[day.key as keyof typeof hours];
          return (
            <div key={day.key} className="flex justify-between">
              <span className="text-gray-600">{day.label}:</span>
              <span className="text-gray-900">
                {dayHours || 'Fermé'}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* En-tête */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">
          Contacter {artisan.name}
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Spécialités: {artisan.specialties.join(', ')}
        </p>
      </div>

      <div className="p-6">
        {/* Message de succès */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-green-800">Message envoyé !</h4>
                <p className="text-sm text-green-700 mt-1">
                  Votre message a été transmis à {artisan.name}. 
                  {artisan.contact.responseTime && (
                    <span> Temps de réponse habituel: {artisan.contact.responseTime}</span>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message d'erreur */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulaire de contact */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type de contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de demande *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {contactTypes.map(type => (
                    <label
                      key={type.value}
                      className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.contactType === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="contactType"
                        value={type.value}
                        checked={formData.contactType === type.value}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      <type.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Nom */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom complet"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="votre.email@exemple.com"
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone (optionnel)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="06 12 34 56 78"
                />
              </div>

              {/* Sujet */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Résumé de votre demande"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Décrivez votre projet, vos besoins, ou posez votre question..."
                />
              </div>

              {/* Bouton d'envoi */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {loading ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Coordonnées
              </h3>

              <div className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${artisan.contact.email}`}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {artisan.contact.email}
                  </a>
                </div>

                {/* Téléphone */}
                {artisan.contact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a
                      href={`tel:${artisan.contact.phone}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {artisan.contact.phone}
                    </a>
                  </div>
                )}

                {/* Adresse */}
                {artisan.contact.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-gray-700">{artisan.contact.address.street}</p>
                      <p className="text-gray-700">
                        {artisan.contact.address.postalCode} {artisan.contact.address.city}
                      </p>
                      <p className="text-sm text-gray-500">
                        {artisan.contact.address.department}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Horaires de travail */}
            {artisan.contact.workingHours && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Horaires
                </h3>
                {formatWorkingHours()}
              </div>
            )}

            {/* Temps de réponse */}
            {artisan.contact.responseTime && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Temps de réponse habituel:</strong> {artisan.contact.responseTime}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}