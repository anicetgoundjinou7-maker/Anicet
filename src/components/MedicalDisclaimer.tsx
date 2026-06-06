/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldAlert, Info, ShieldCheck, Lock } from "lucide-react";

export default function MedicalDisclaimer() {
  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      {/* Clinial Warning */}
      <div 
        className="bg-amber-50/75 border border-amber-200/60 rounded-2xl p-5 shadow-sm relative overflow-hidden" 
        id="medical-disclaimer-card"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
        <div className="flex gap-4 items-start">
          <div className="bg-amber-100 text-amber-800 p-2 rounded-xl mt-0.5 shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-sans font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              Clause d'Avertissement & Sécurité Clinique
            </h4>
            <p className="text-slate-600 font-sans text-xs sm:text-xs leading-relaxed">
              Ce portail est un outil d'exploration <strong>exclusivement académique, scientifique et éducationnel</strong>. 
              Les synthèses et analyses fournies étudient de manière théorique la biochimie corporelle et les pistes de recherche mondiale. 
              Aucune information présentée ici ne remplace les recommandations personnalisées d'un médecin diplômé.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono font-medium text-amber-700">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>En cas d'urgence médicale locale, contactez le 15 ou le 112.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Security & Confidentiality */}
      <div 
        className="bg-emerald-50/60 border border-emerald-250/50 rounded-2xl p-5 shadow-sm relative overflow-hidden" 
        id="data-security-card"
      >
        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
        <div className="flex gap-4 items-start">
          <div className="bg-emerald-100/80 text-emerald-800 p-2 rounded-xl mt-0.5 shrink-0">
            <Lock className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="space-y-1.5">
            <h4 className="font-sans font-bold text-slate-900 text-sm tracking-tight flex items-center gap-1.5">
              Confidentialité Absolue & Données Sécurisées
            </h4>
            <p className="text-slate-600 font-sans text-xs sm:text-xs leading-relaxed">
              Vos requêtes d'analyse et fiches personnalisées ne font l'objet <strong>d'aucun stockage centralisé, ni d'enregistrement partagé</strong>. 
              Toutes les données générées résident uniquement dans le stockage local sécurisé de votre propre navigateur (<em>localStorage</em>). 
              Vos données cliniques ne sont ni revendues, ni utilisées à des fins de ciblage publicitaire.
            </p>
            <div className="flex items-center gap-1.5 pt-1 text-[10px] font-mono font-medium text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>100% Anonyme • Cryptage en cours de session • Pas de trackers tiers.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

