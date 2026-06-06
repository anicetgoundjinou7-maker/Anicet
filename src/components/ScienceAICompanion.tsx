/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  HelpCircle, 
  BookOpen, 
  Microscope, 
  AlertTriangle, 
  Play, 
  CheckCircle2, 
  X,
  Loader2,
  BookmarkPlus
} from "lucide-react";

interface ScienceAICompanionProps {
  onSearchSelected?: (query: string) => void;
  presetThemeQuery?: string;
}

export default function ScienceAICompanion({ onSearchSelected, presetThemeQuery }: ScienceAICompanionProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentQueries, setRecentQueries] = useState<string[]>([
    "Curcumine phytosome et barrière intestinale",
    "Mécanismes de la rigidité vasculaire eNOS",
    "Cerveau, métabolisme du cétogène et migraine",
    "Solutions cliniques de translocation de GLUT-4"
  ]);

  const loadingSteps = [
    "Initialisation du cortex de recherche clinique...",
    "Interrogation de la base de publications indexées...",
    "Extraction des mécanismes de cascade moléculaire...",
    "Vérification des avertissements et interactions médicamenteuses...",
    "Mise en forme de la synthèse biochimique..."
  ];

  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch("/api/science-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Une erreur inconnue est survenue.");
      }

      setResponse(data.aiExplanation);
      // Save query if not already in recent
      if (!recentQueries.includes(searchQuery)) {
        setRecentQueries((prev) => [searchQuery, ...prev.slice(0, 3)]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Impossible de joindre le serveur d'aide.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  // Helper to parse double asterisks and hash headers into highly styled beautiful components
  const formatAIResponse = (text: string) => {
    if (!text) return null;

    // Simple robust segmenter that splits by markdown titles to create modern visual sections
    const paragraphs = text.split("\n");
    let currentSection: { title: string; type: "header" | "normal" | "bullet" | "disclaimer"; content: string[] }[] = [];
    
    let disclaimerCount = 0;

    paragraphs.forEach((p) => {
      const trimmed = p.trim();
      if (!trimmed) return;

      if (trimmed.startsWith("###")) {
        currentSection.push({
          title: trimmed.replace("###", "").trim(),
          type: "header",
          content: []
        });
      } else if (trimmed.startsWith("**_Clause") || trimmed.includes("Clause de non-responsabilité")) {
        currentSection.push({
          title: "Avertissement Médical",
          type: "disclaimer",
          content: [trimmed]
        });
      } else if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
        const item = trimmed.substring(1).trim();
        // Check if there is an active section, else create general one
        if (currentSection.length === 0) {
          currentSection.push({ title: "Général", type: "normal", content: [] });
        }
        currentSection[currentSection.length - 1].content.push(item);
      } else {
        if (currentSection.length === 0) {
          currentSection.push({ title: "Introduction", type: "normal", content: [] });
        }
        currentSection[currentSection.length - 1].content.push(p);
      }
    });

    return (
      <div className="space-y-6" id="ai-formatted-response">
        {currentSection.map((sect, idx) => {
          if (sect.type === "disclaimer") {
            return (
              <div key={idx} className="bg-amber-50/80 border border-amber-200 p-4 rounded-xl text-xs sm:text-sm text-slate-700 italic flex gap-3 items-start select-none">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p>{sect.content.join("\n")}</p>
              </div>
            );
          }

          if (sect.type === "header") {
            const isAddress = sect.title.toLowerCase().includes("adresse") || sect.title.toLowerCase().includes("personnalis");
            const isPhysio = sect.title.toLowerCase().includes("physio") || sect.title.toLowerCase().includes("cascade");
            const isStandard = sect.title.toLowerCase().includes("classique") || sect.title.toLowerCase().includes("standard");
            const isResearch = sect.title.toLowerCase().includes("piste") || sect.title.toLowerCase().includes("bio-solution") || sect.title.toLowerCase().includes("recherche");
            const isVigilance = sect.title.toLowerCase().includes("vigilance") || sect.title.toLowerCase().includes("alerte") || sect.title.toLowerCase().includes("interaction");

            let headerBg = "bg-slate-100/50 text-slate-900 border-slate-200/60";
            let iconColor = "text-slate-500";
            let Icon = BookOpen;

            if (isAddress) {
              headerBg = "bg-indigo-50 text-indigo-950 border-indigo-100";
              iconColor = "text-indigo-600";
              Icon = Sparkles;
            } else if (isPhysio) {
              headerBg = "bg-teal-50 text-teal-950 border-teal-100";
              iconColor = "text-teal-600";
              Icon = Microscope;
            } else if (isStandard) {
              headerBg = "bg-blue-50 text-blue-950 border-blue-100";
              iconColor = "text-blue-600";
              Icon = CheckCircle2;
            } else if (isResearch) {
              headerBg = "bg-emerald-50 text-emerald-950 border-emerald-100";
              iconColor = "text-emerald-600";
              Icon = Sparkles;
            } else if (isVigilance) {
              headerBg = "bg-rose-50 text-rose-950 border-rose-100";
              iconColor = "text-rose-600";
              Icon = AlertTriangle;
            }

            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4"
              >
                <div className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border ${headerBg}`}>
                  <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
                  <span className="font-bold font-sans text-sm tracking-tight">{sect.title}</span>
                </div>

                <div className="space-y-3 pl-1">
                  {sect.content.map((contentLine, lIdx) => {
                    // Check if it's bullet list item
                    const isBullet = contentLine.trim().startsWith("**") || sect.content.length > 2;
                    return (
                      <p key={lIdx} className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                        {/* Match bold segments inside line */}
                        {contentLine.split("**").map((part, pIdx) => {
                          const isBold = pIdx % 2 === 1;
                          return isBold ? <strong key={pIdx} className="text-slate-900 font-bold">{part}</strong> : part;
                        })}
                      </p>
                    );
                  })}
                </div>
              </motion.div>
            );
          }

          return (
            <div key={idx} className="space-y-2">
              {sect.content.map((c, cIdx) => (
                <p key={cIdx} className="text-slate-500 text-sm leading-relaxed italic pr-4 pl-1">
                  {c}
                </p>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6 w-full" id="science-ai-companion">
      {/* Input panel & suggestions */}
      <div className="bg-gradient-to-br from-teal-950 via-slate-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-6 relative z-10 max-w-2xl">
          <div className="space-y-2">
            <span className="bg-teal-500/20 text-teal-300 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-bold inline-flex items-center gap-1.5 border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              Intelligence Scientifique Médicale
            </span>
            <h3 className="text-2xl sm:text-3xl font-sans font-bold tracking-tight">
              Analyseur d'aide aux patients
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Interrogez notre assistant basé sur l'IA pour explorer la biochimie d'un trouble, décoder des molécules cliniques, ou évaluer des pistes complémentaires issues de la littérature de recherche mondiale.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Entrez une maladie, un symptôme ou un composé (ex: Curcumine, Diabète)..."
                className="w-full bg-white/10 hover:bg-white/15 focus:bg-white focus:text-slate-900 border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 text-white placeholder:text-slate-400 transition-all"
                disabled={loading}
                id="companion-search-input"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="bg-teal-500 hover:bg-teal-400 disabled:bg-slate-800 disabled:text-slate-500 text-teal-950 font-sans font-bold text-sm px-6 py-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95 shadow-lg shadow-teal-500/15"
              id="companion-submit-button"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4 fill-current" />
              )}
              <span>Lancer l'exploration</span>
            </button>
          </form>

          {/* Preset queries chips */}
          <div className="space-y-2.5">
            <span className="text-[11px] font-bold text-teal-300 flex items-center gap-1.5 uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              Sujets d'exploration suggérés :
            </span>
            <div className="flex flex-wrap gap-2" id="preset-queries-container">
              {recentQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(q);
                    handleSearch(q);
                  }}
                  className="bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/5 hover:border-white/10 rounded-xl px-3 py-1.5 text-xs text-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <BookmarkPlus className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span>{q}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Response Panel */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]"
            id="companion-loading-card"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-teal-100 border-t-teal-600 animate-spin" />
              <Microscope className="w-6 h-6 text-teal-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h4 className="font-bold text-slate-900 text-base">Recherche académique en cours</h4>
              <p className="text-slate-500 text-xs sm:text-sm font-medium transition-colors duration-300">
                {loadingSteps[loadingStep]}
              </p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-50/70 border border-red-200 rounded-3xl p-6 shadow-sm flex gap-4 items-start"
            id="companion-error-card"
          >
            <div className="bg-red-100 text-red-800 p-2.5 rounded-xl shrink-0">
              <X className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-red-950 text-sm">Échec du décryptage scientifique</h4>
              <p className="text-red-800 text-xs sm:text-sm leading-relaxed">{error}</p>
            </div>
          </motion.div>
        )}

        {response && (
          <motion.div
            key="response"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-slate-900 font-bold text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-100" />
                Résultats de l'exploration scientifique
              </h4>
              <button 
                onClick={() => setResponse(null)}
                className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-100 rounded-xl transition-all"
                title="Effacer le résultat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Formatted cards representing science details */}
            <div id="ai-response-content">
              {formatAIResponse(response)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
