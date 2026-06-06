/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DiseaseCondition } from "../types";
import { 
  Dna, 
  ShieldCheck, 
  Binary, 
  BookOpen, 
  HeartHandshake, 
  CornerDownRight, 
  ExternalLink 
} from "lucide-react";

interface DiseaseDetailsProps {
  condition: DiseaseCondition;
}

export default function DiseaseDetails({ condition }: DiseaseDetailsProps) {
  const [tab, setTab] = useState<"physio" | "standards" | "science" | "refs">("physio");

  const tabItems = [
    { id: "physio", label: "🧪 Physiopathologie", icon: Dna },
    { id: "standards", label: "🛡️ Traitements de Ligne", icon: ShieldCheck },
    { id: "science", label: "🔬 Recherche & Bio-solutions", icon: Binary },
    { id: "refs", label: "📚 Études Cliniques", icon: BookOpen }
  ] as const;

  return (
    <div 
      className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-8 w-full" 
      id={`condition-detail-${condition.id}`}
    >
      {/* Short Left Sidebar / Quick facts card */}
      <div className="md:w-1/3 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100 pb-6 md:pb-0 md:pr-8 gap-6 shrink-0">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <span className="bg-teal-50 border border-teal-100/60 text-teal-700 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-bold inline-block">
              {condition.category}
            </span>
            <h3 className="font-sans font-bold text-2xl sm:text-3xl text-slate-950 tracking-tight leading-tight">
              {condition.name}
            </h3>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-normal">
            {condition.summary}
          </p>
        </div>

        {/* Symptoms quick display */}
        <div className="space-y-3 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
          <h4 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-rose-500 shrink-0" />
            Signes & Manifestations Clés
          </h4>
          <ul className="space-y-1.5" id="symptoms-quick-list">
            {condition.symptoms.map((symptom, idx) => (
              <li key={idx} className="flex gap-2 text-xs text-slate-600 font-medium">
                <CornerDownRight className="w-3 h-3 text-slate-400 mt-0.5 shrink-0" />
                <span>{symptom}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 space-y-6">
        {/* Dynamic Personalized Patient Direct Address Callout as requested */}
        <div 
          className="bg-indigo-50/75 border border-indigo-100 rounded-2xl p-5 shadow-sm relative overflow-hidden"
          id="personalized-patient-callout"
        >
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
          <div className="space-y-2">
            <h4 className="font-sans font-bold text-slate-900 text-sm tracking-tight flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping shrink-0" />
              <span>Adresse Thérapeutique Personnalisée</span>
            </h4>
            <p className="text-slate-800 text-sm leading-relaxed">
              <strong>« Patient, tu souffres de {condition.name}. Donc tu ferais mieux de : »</strong>
            </p>
            <ul className="space-y-1.5 pl-4 pt-1.5">
              {condition.id === "diabete-type-2" && (
                <>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Privilégier la marche active postprandiale immédiate pour transloquer les transporteurs GLUT-4 sans requérir d'insuline.
                  </li>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Intégrer des sources d'anthocyanes et de berbérine pour agir de concert sur l'activation saine de l'AMPK cellulaire.
                  </li>
                </>
              )}
              {condition.id === "maladie-crohn" && (
                <>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Consolider l'étanchéité des jonctions intestinales serrées (ZO-1) à l'aide de sources de butyrate de sodium.
                  </li>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Apaiser les voies d'inflammation hyperactives NF-kB en introduisant des phytosomes de curcumine à biodisponibilité scientifiquement vérifiée.
                  </li>
                </>
              )}
              {condition.id === "hypertension-arterielle" && (
                <>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Restaurer le tonus et la libération de monoxyde d'azote (NO) par l'apport endogène de nitrates (betteraves, acides aminés L-Citrulline).
                  </li>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Pratiquer des exercices réguliers de cohérence cardiaque (6 cycles complets par minute) pour rééduquer le baroréflexe sympathique.
                  </li>
                </>
              )}
              {condition.id === "migraine-chronique" && (
                <>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Recharger le magnésium intracellulaire pour bloquer les récepteurs NMDA et éviter la dépolarisation corticale trop sensible.
                  </li>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Soutenir le cycle d'énergie des mitochondries cérébrales grâce à des apports optimisés en coenzyme Q10 et Riboflavine (B2).
                  </li>
                </>
              )}
              {condition.id !== "diabete-type-2" && condition.id !== "maladie-crohn" && condition.id !== "hypertension-arterielle" && condition.id !== "migraine-chronique" && (
                <>
                  <li className="text-xs text-slate-700 list-disc font-medium">
                    Consulter les solutions de bio-recherche listées ci-dessous et en discuter activement avec ton spécialiste pour adapter tes habitudes de vie.
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-slate-100 pb-2 overflow-x-auto" id="disease-tabs">
          {tabItems.map((item) => {
            const Icon = item.icon;
            const isActive = tab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-tight transition-all relative ${
                  isActive
                    ? "text-teal-950"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
                id={`tab-${condition.id}-${item.id}`}
              >
                {isActive && (
                  <motion.div
                    layoutId={`active-indicator-${condition.id}`}
                    className="absolute inset-0 bg-teal-50/70 border border-teal-100/60 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-teal-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Frame */}
        <div className="min-h-[220px]" id="disease-tab-frame">
          <AnimatePresence mode="wait">
            {tab === "physio" && (
              <motion.div
                key="physio"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <h4 className="font-bold text-slate-900 text-sm tracking-tight font-sans">
                  Mécanismes de la cascade moléculaire & Dysfonctionnement organique :
                </h4>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {condition.pathophysiology}
                </p>
                <div className="bg-teal-50/40 p-4 rounded-xl text-[11px] font-mono text-teal-800 leading-normal border border-teal-100/30 mt-4">
                  <strong>Index moléculaire :</strong> L'exploration des marqueurs biologiques et des cytokines d'inflammation permet de comprendre finement la cinétique des poussées et des fluctuations métaboliques.
                </div>
              </motion.div>
            )}

            {tab === "standards" && (
              <motion.div
                key="standards"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-slate-900 text-sm tracking-tight font-sans">
                  Protocoles & Traitements classiques de référence :
                </h4>
                <div className="grid gap-3" id="standards-listing">
                  {condition.standards.map((standard, idx) => {
                    const [title, desc] = standard.split(" : ");
                    return (
                      <div key={idx} className="flex gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <div className="w-5 h-5 bg-teal-100 text-teal-700 font-bold text-xs rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-800 text-sm">{title}</p>
                          {desc && <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{desc}</p>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {tab === "science" && (
              <motion.div
                key="science"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-slate-900 text-sm tracking-tight font-sans">
                  Pistes thérapeutiques émergentes & Nutrition rationnelle :
                </h4>
                <div className="grid gap-3" id="science-listing">
                  {condition.scientificApproaches.map((approach, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {approach}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {tab === "refs" && (
              <motion.div
                key="refs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <h4 className="font-bold text-slate-900 text-sm tracking-tight font-sans">
                  Revues cliniques de haut niveau associées :
                </h4>
                <div className="grid gap-2" id="references-listing">
                  {condition.references.map((reference, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-xl transition-all border border-slate-100 group"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-indigo-500 group-hover:scale-105 transition-transform shrink-0" />
                        <span className="text-xs sm:text-sm text-slate-700 font-semibold group-hover:text-slate-950 transition-colors">
                          {reference}
                        </span>
                      </div>
                      <div className="text-indigo-600 text-xs font-semibold flex items-center gap-1 shrink-0 ml-4">
                        <span className="hidden sm:inline">Consulter la revue</span>
                        <ExternalLink className="w-3 h-3" />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
