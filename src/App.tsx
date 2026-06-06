/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  Brain, 
  Activity, 
  Info, 
  ArrowRight, 
  Filter, 
  HeartPulse, 
  Microscope,
  BookOpen,
  CornerDownRight,
  Share2,
  Copy,
  Check,
  Smartphone,
  Download,
  Laptop,
  X,
  HelpCircle
} from "lucide-react";

import { PRESET_DISEASES, DISEASE_CATEGORIES } from "./data/diseases";
import { DiseaseCondition } from "./types";
import MedicalDisclaimer from "./components/MedicalDisclaimer";
import DiseaseDetails from "./components/DiseaseDetails";
import ScienceAICompanion from "./components/ScienceAICompanion";

export default function App() {
  const [activeTab, setActiveTab ] = useState<"database" | "ai-companion">("database");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isInstallGuideOpen, setIsInstallGuideOpen] = useState(false);
  
  // Custom generated diseases saved in browser/database storage
  const [customDiseases, setCustomDiseases] = useState<DiseaseCondition[]>(() => {
    try {
      const saved = localStorage.getItem("medscientia_custom_diseases");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isGeneratingFiche, setIsGeneratingFiche] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Combine default preset diseases and custom generated ones
  const mergedDiseases = useMemo(() => {
    return [...PRESET_DISEASES, ...customDiseases];
  }, [customDiseases]);

  const [selectedCondition, setSelectedCondition] = useState<DiseaseCondition | null>(mergedDiseases[0] || PRESET_DISEASES[0]);
  const [copiedLink, setCopiedLink] = useState(false);

  // Save custom diseases to local persistence
  useEffect(() => {
    localStorage.setItem("medscientia_custom_diseases", JSON.stringify(customDiseases));
  }, [customDiseases]);

  // Generate disease on-the-fly via the backend AI API
  const handleGenerateFiche = async (name: string) => {
    if (!name.trim()) return;
    setIsGeneratingFiche(true);
    setGenerationError(null);
    try {
      const res = await fetch("/api/generate-fiche", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ diseaseName: name }),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Une erreur s'est produite lors de la génération.");
      }
      const data: DiseaseCondition = await res.json();
      
      // Avoid duplicate slug/id
      setCustomDiseases((prev) => {
        if (prev.some((d) => d.id === data.id || d.name.toLowerCase() === data.name.toLowerCase())) {
          return prev;
        }
        return [...prev, data];
      });
      
      setSelectedCondition(data);
      setSearchQuery(""); // Clear search to easily show selection
      setSelectedCategory(null); // Clear group filter
    } catch (err: any) {
      console.error(err);
      setGenerationError(err.message || "Impossible de joindre le décodeur médical IA.");
    } finally {
      setIsGeneratingFiche(false);
    }
  };

  // Helper to copy current URL to clipboard
  const handleCopyLink = () => {
    const urlToCopy = "https://ais-pre-55l6jtgmsstvjgkglxrjtq-736166569199.europe-west2.run.app";
    navigator.clipboard.writeText(urlToCopy);
    setCopiedLink(true);
    setTimeout(() => {
      setCopiedLink(false);
    }, 2500);
  };

  // Filter diseases based on search bar & category tabs
  const filteredDiseases = useMemo(() => {
    return mergedDiseases.filter((disease) => {
      const matchesSearch = 
        disease.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.pathophysiology.toLowerCase().includes(searchQuery.toLowerCase()) ||
        disease.symptoms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory ? disease.category === selectedCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [mergedDiseases, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#fcfcfd] text-slate-900 font-sans selection:bg-teal-100 selection:text-teal-950 flex flex-col justify-between">
      {/* Dynamic Upper Accent Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-500 via-indigo-600 to-emerald-500" />

      {/* Header */}
      <header className="border-b border-slate-100 bg-white/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo & Corporate Title */}
          <div className="flex items-center space-x-3.5 self-start sm:self-auto" id="main-brand-logo">
            <div className="bg-gradient-to-tr from-teal-600 to-indigo-600 text-white p-2.5 rounded-2xl shadow-md shadow-teal-100 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 flex-shrink-0 animate-pulse" />
            </div>
            <div>
              <h1 className="font-sans font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                Goudjinou <span className="text-teal-600">| MedScientia</span>
              </h1>
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase block mt-1">
                Portail Clinique IA • Anicet GOUDJINOU
              </span>
            </div>
          </div>

          {/* Navigation and Share Button Container */}
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <nav className="flex space-x-1.5 w-full sm:w-auto" id="top-nav-tabs">
              <button
                onClick={() => setActiveTab("database")}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 relative ${
                  activeTab === "database"
                    ? "bg-slate-100 text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
                id="nav-btn-database"
              >
                Fiches Cliniques
              </button>
              <button
                onClick={() => setActiveTab("ai-companion")}
                className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-tight transition-all duration-200 relative flex items-center justify-center gap-1.5 ${
                  activeTab === "ai-companion"
                    ? "bg-slate-100 text-slate-950 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
                id="nav-btn-ai-companion"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                <span>Diagnostic Assisté IA</span>
              </button>
            </nav>

            <button
              onClick={handleCopyLink}
              className={`w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
                copiedLink 
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                  : "bg-teal-50 hover:bg-teal-100/80 text-teal-950 border border-teal-100"
              }`}
              id="header-share-btn"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Lien Copié !</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>Partager le site</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsInstallGuideOpen(true)}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-100 transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              id="header-install-btn"
            >
              <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0 animate-pulse" />
              <span>Installer l'App</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-6 py-10 flex-grow w-full space-y-8">
        
        {/* Core Security Callout */}
        <MedicalDisclaimer />

        {/* Dynamic Patient & QR Link banner */}
        <div 
          className="bg-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden flex flex-col md:flex-row gap-6 items-center justify-between"
          id="persistance-goudjinou-card"
        >
          {/* Ambient background blur circles */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-16 -top-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-xl z-10 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-teal-500/10 border border-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold">
              <Smartphone className="w-3.5 h-3.5 text-teal-400" />
              <span>Lien d'Accès Clinique Mobile & Permanent</span>
            </div>
            <h3 className="text-2xl font-sans font-extrabold tracking-tight text-white leading-tight">
              Application d'Anicet GOUDJINOU
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Pour retrouver instantanément cette application sur votre téléphone ou tablette, vous pouvez l'installer via le guide, copier ce lien fixe sécurisé officiel, ou simplement scanner le Code QR ci-contre directement avec la caméra de votre téléphone.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 items-stretch sm:items-center">
              <div className="bg-slate-900/60 font-mono text-center sm:text-left text-[11px] sm:text-xs text-teal-400 px-4 py-2.5 rounded-xl border border-slate-800 break-all select-all flex-grow">
                https://ais-pre-55l6jtgmsstvjgkglxrjtq-736166569199.europe-west2.run.app
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Lien Copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copier le Lien</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code section */}
          <div className="bg-white/95 p-4 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg border border-white/20 shrink-0 z-10">
            <span className="text-[9px] font-bold text-slate-400 font-mono uppercase tracking-wider mb-2">Scanner vers Mobile</span>
            <img 
              src="https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=https%3A%2F%2Fais-pre-55l6jtgmsstvjgkglxrjtq-736166569199.europe-west2.run.app&color=0f172a"
              alt="QR Code d'accès Anicet Goudjinou"
              className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] rounded"
              referrerPolicy="no-referrer"
            />
            <span className="text-[10px] font-extrabold text-indigo-950 font-sans mt-2">Accès Direct</span>
          </div>
        </div>

        {/* Dynamic Route Frame */}
        <AnimatePresence mode="wait">
          {activeTab === "database" ? (
            <motion.div
              key="database-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="space-y-8"
              id="clinical-fiches-frame"
            >
              {/* Database Home Section Title */}
              <div className="space-y-2 max-w-xl">
                <div className="inline-flex items-center space-x-2 bg-teal-50 border border-teal-100/60 text-teal-800 px-3 py-1 rounded-full text-xs font-semibold">
                  <Microscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>Index de Pharmacologie et Physiologie moléculaire</span>
                </div>
                <h2 className="text-3xl font-sans font-bold tracking-tight text-slate-950">
                  Solutions Scientifiques aux Affections Courantes
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Consultez des descriptions biochimiques exhaustives, examinez les molécules d'intervention standards approuvées par l'ARS/FDA ou explorez les nouvelles voies enzymatiques de la santé humaine.
                </p>
              </div>

              {/* Exploration Dashboard Controls */}
              <div className="bg-white border border-slate-200/70 p-6 rounded-3xl shadow-sm space-y-6" id="dashboard-controls">
                
                {/* Search Bar & Auto-filtering */}
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filtrer par pathologie, symptôme (ex: insuline, neuropathie, maux de tête, colon)..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
                      id="disease-search-bar"
                    />
                  </div>
                  
                  {selectedCategory || searchQuery ? (
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory(null);
                      }}
                      className="w-full sm:w-auto px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-2xl transition-all cursor-pointer text-center"
                      id="reset-filters-btn"
                    >
                      Effacer les filtres
                    </button>
                  ) : null}
                </div>

                {/* Categories filtering pills */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5" />
                    Filtrer par système anatomique / biologique
                  </span>
                  <div className="flex flex-wrap gap-1.5" id="category-filters-container">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                        selectedCategory === null
                          ? "bg-slate-900 text-white shadow-sm"
                          : "bg-slate-50 border border-slate-200/50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      Tous les systèmes
                    </button>
                    {DISEASE_CATEGORIES.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer ${
                          selectedCategory === cat
                            ? "bg-teal-600 text-white shadow-sm"
                            : "bg-slate-50 border border-slate-200/50 text-slate-600 hover:bg-slate-100"
                        }`}
                        id={`cat-filter-${idx}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid Layout: Results Directory & Details Viewer */}
              <div className="grid gap-8 lg:grid-cols-12 items-start">
                
                {/* Left Side: Directory results Column */}
                <div className="lg:col-span-5 space-y-3 lg:sticky lg:top-24 max-h-[500px] overflow-y-auto pr-1" id="results-directory">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-500">
                      Affections répertoriées ({filteredDiseases.length})
                    </span>
                    <span className="text-[10px] text-teal-600 font-medium font-mono">Index scientifique</span>
                  </div>

                  <div className="space-y-2.5">
                    {filteredDiseases.map((disease) => {
                      const isSelected = selectedCondition?.id === disease.id;
                      return (
                        <motion.div
                          key={disease.id}
                          whileHover={{ scale: isSelected ? 1 : 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={() => setSelectedCondition(disease)}
                          className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                            isSelected
                              ? "bg-teal-50/40 border-teal-500/80 shadow-sm"
                              : "bg-white hover:bg-slate-50/50 border-slate-200/85"
                          }`}
                          id={`disease-card-${disease.id}`}
                        >
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-sans font-bold text-slate-900 text-sm sm:text-base leading-tight">
                                {disease.name}
                              </h4>
                              <span className="text-[9px] font-mono font-medium text-slate-400 border border-slate-100 px-1.5 py-0.5 rounded-md uppercase tracking-wider shrink-0">
                                {disease.category.split(" ")[0]}
                              </span>
                            </div>
                            <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">
                              {disease.summary}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}

                    {filteredDiseases.length === 0 && (
                      <div className="text-center py-8 px-5 bg-teal-50/30 rounded-2xl border border-teal-100/80 space-y-4">
                        <Info className="w-8 h-8 text-teal-600 mx-auto animate-pulse" />
                        <div className="space-y-1.5 max-w-[280px] mx-auto">
                          <p className="text-slate-900 font-bold text-sm">
                            {searchQuery ? `« ${searchQuery} »` : "Affection"} non trouvée localement
                          </p>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            Notre base locale contient quelques exemples clés. Souhaitez-vous générer automatiquement la fiche clinique complète pour cette maladie avec tous ses détails ?
                          </p>
                        </div>

                        {searchQuery && (
                          <div className="space-y-2.5">
                            {isGeneratingFiche ? (
                              <div className="flex flex-col items-center gap-1.5 py-2">
                                <span className="inline-block h-5 w-5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-semibold text-teal-700 animate-pulse uppercase tracking-wider">
                                  Rédaction de la fiche par l'IA...
                                </span>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleGenerateFiche(searchQuery)}
                                  className="w-full bg-teal-600 hover:bg-teal-500 hover:shadow-md text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-teal-100 flex items-center justify-center gap-1.5"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                                  <span>Créer la Fiche avec l'IA</span>
                                </button>
                                {generationError && (
                                  <p className="text-[10px] text-red-500 font-medium leading-tight px-2 bg-red-50 py-1 rounded">
                                    {generationError}
                                  </p>
                                )}
                              </>
                            )}
                          </div>
                        )}

                        {!searchQuery && (
                          <button
                            onClick={() => {
                              setActiveTab("ai-companion");
                            }}
                            className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-100"
                          >
                            <span>Basculer sur l'Assistant IA</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: High Fidelity Tabs Details Viewer */}
                <div className="lg:col-span-7" id="details-view-container">
                  <AnimatePresence mode="wait">
                    {selectedCondition && filteredDiseases.some(d => d.id === selectedCondition.id) ? (
                      <motion.div
                        key={selectedCondition.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        className="w-full"
                      >
                        <DiseaseDetails condition={selectedCondition} />
                      </motion.div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-200/60 rounded-3xl p-8 text-center text-slate-400 text-sm flex flex-col justify-center items-center h-[350px] space-y-4">
                        <Microscope className="w-10 h-10 text-slate-300 animate-pulse" />
                        <p className="font-sans font-medium text-slate-500">
                          Veuillez sélectionner une affection dans la liste de gauche pour afficher l'analyse biochimique correspondante.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>

              {/* Callout box for AI Support */}
              <div className="bg-gradient-to-br from-indigo-50/50 via-slate-50 to-indigo-50/30 border border-indigo-100/60 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6" id="ai-companion-callout">
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    Votre affection n'est pas répertoriée ?
                  </h3>
                  <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
                    Notre base clinique locale ne contient que de grandes affections exemples. Vous pouvez utiliser notre moteur d'intelligence de décryptage médical (basé sur Gemini 3.5 Flash) pour n'importe quelle maladie du monde.
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActiveTab("ai-companion")}
                    className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <span>Lancer une recherche IA libre</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ai-companion-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              id="ai-companion-frame"
            >
              <ScienceAICompanion />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 bg-white shrink-0 mt-12">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
            <div className="flex items-center space-x-1.5">
              <span>Moteur de Connaissances :</span>
              <span className="font-bold text-slate-600 bg-slate-50 border border-slate-100 px-2 py-1 rounded-md">Gemini @google/genai SDK</span>
            </div>
            <div className="hidden md:block text-slate-300">|</div>
            <div>Dérèglement moléculaire & Recherche translationnelle</div>
          </div>
          <div className="flex items-center space-x-1 text-slate-400 text-center select-none">
            <span>Développé de manière éthique pour l'accès aux études de recherche © {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>

      {/* Installation Guide Modal (PWA Web App status helper) */}
      <AnimatePresence>
        {isInstallGuideOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInstallGuideOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              id="install-guide-backdrop"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 max-w-lg w-full relative z-10 overflow-hidden text-slate-900"
              id="install-guide-box"
            >
              {/* Green indicator bar */}
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-indigo-600" />
              
              <button
                onClick={() => setIsInstallGuideOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
                id="close-install-modal-btn"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                {/* Header */}
                <div className="flex gap-4 items-start">
                  <div className="bg-teal-50 text-teal-800 p-3 rounded-2xl flex items-center justify-center shrink-0">
                    <Download className="w-6 h-6 text-teal-600 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-slate-900 text-lg sm:text-xl">
                      Installer l'Application MedScientia
                    </h3>
                    <p className="text-slate-500 text-xs mt-1">
                      Convertissez ce site d'exploration clinique en une application mobile et de bureau autonome et ultra-rapide.
                    </p>
                  </div>
                </div>

                {/* Content Instructions */}
                <div className="space-y-4 pt-2">
                  
                  {/* Step 1 iOS */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Smartphone className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">
                        Sur iPhone & iPad (Safari)
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Appuyez sur le bouton de Partage <span className="inline-flex py-0.5 px-1.5 bg-slate-100 rounded text-[10px] font-bold border border-slate-200">Share</span> dans Safari, puis sélectionnez <strong>« Sur l'écran d'accueil »</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 Android */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Smartphone className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">
                        Sur Android (Chrome / Brave)
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Appuyez sur l'icône à trois points <span className="inline-flex py-0.5 px-1 bg-slate-100 rounded text-[10px] font-bold border border-slate-200">⋮</span> dans le coin de votre navigateur, puis cliquez sur <strong>« Installer l'application »</strong> ou <strong>« Ajouter à l'écran d'accueil »</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 PC */}
                  <div className="flex gap-4 items-start">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <Laptop className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest font-mono">
                        Sur Ordinateur (Mac OS / Windows / Chrome)
                      </h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        Cliquez sur le symbole de téléchargement <span className="inline-flex py-0.5 px-1 bg-slate-100 rounded text-[10px] font-bold border border-slate-200">⊕</span> à droite dans votre barre d'adresse Chrome/Edge pour exécuter l'application séparément.
                      </p>
                    </div>
                  </div>

                </div>

                {/* Benefits */}
                <div className="bg-gradient-to-r from-teal-50/50 to-indigo-50/40 border border-slate-100 rounded-2xl p-4 text-[11px] text-slate-600 leading-relaxed space-y-1">
                  <p className="font-semibold text-slate-800">✨ Avantages cliniques & applicatifs :</p>
                  <ul className="list-disc pl-4 space-y-0.5">
                    <li>Raccourci instantané sur votre bureau ou écran d'accueil sans barres d'adresse.</li>
                    <li>Souveraineté totale sur vos données : elles restent chiffrées localement et confidentiellement dans votre écran de session.</li>
                    <li>Accès et fluidité exceptionnels sans trackers publicitaires ni serveurs de ciblage tiers.</li>
                  </ul>
                </div>

                {/* Footer button close */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsInstallGuideOpen(false)}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-all cursor-pointer shadow-md text-center active:scale-[0.98]"
                    id="confirm-close-install-modal-btn"
                  >
                    Compris ! Fermer le guide
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
