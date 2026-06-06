/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini safely
let ai: GoogleGenAI | null = null;
try {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } else {
    console.warn("WARNING: GEMINI_API_KEY is not defined or is placeholder. AI assistant features will require user configuration.");
  }
} catch (err) {
  console.error("Error setting up Gemini API client:", err);
}

/// Full-stack API Endpoints
app.post("/api/generate-fiche", async (req, res) => {
  const { diseaseName } = req.body;

  if (!diseaseName || typeof diseaseName !== "string") {
    res.status(400).json({ error: "Le nom de la maladie ('diseaseName') est requis." });
    return;
  }

  if (!ai) {
    res.status(503).json({
      error: "La clé API Gemini n'est pas encore configurée. Veuillez l'ajouter dans l'onglet des secrets.",
      isNotConfigured: true
    });
    return;
  }

  try {
    const prompt = `Génère une fiche clinique et physiopathologique structurée de haut niveau pour l'affection suivante : "${diseaseName}".`;

    const systemInstruction = `
Vous êtes un "Explorateur Scientifique Médical" de classe mondiale.
Votre but principal est de vulgariser la science médicale et d'aider les utilisateurs à explorer la physiopathologie moléculaire d'une affection.

RÈGLES CRITIQUES D'EMPATHIE ET DE SÉCURITÉ :
1. NE blessez JAMAIS verbalement l'utilisateur ou le patient en aucun cas. Soyez d'une bienveillance absolue, extrêmement chaleureux, poli, rassurant et respectueux. Tout jugement ou mépris est strictement interdit.
2. N'émettez aucun jugement négatif ou culpabilisant sur le style de vie ou l'état de l'utilisateur. Écrivez avec empathie et espoir, comme un scientifique soucieux du bien-être humain.
3. Ne donnez pas de prescription médicale définitive. Rappelez avec douceur que ces informations guident l'esprit de recherche et doivent être partagées avec un professionnel de santé diplômé d'État.
4. Rédigez tout en FRANÇAIS fluide et élégant.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            id: { type: "STRING", description: "Un identifiant URL-safe sous forme de slug en minuscules, ex 'asthme-bronchique' ou 'polyarthrite-rhumatoide'" },
            name: { type: "STRING", description: "Le nom officiel de la maladie en français, correctement orthographié (ex: 'Asthme Bronchique')" },
            category: { type: "STRING", description: "Le système anatomique/biologique d'appartenance de la maladie (ex: 'Système Respiratoire', 'Système Cardiovasculaire', 'Rhumatologie', 'Endocrinologie', etc.)" },
            summary: { type: "STRING", description: "Un résumé clair, chaleureux et vulgarisé en 2 à 3 phrases pour rassurer le patient et vulgariser l'affection." },
            pathophysiology: { type: "STRING", description: "Description scientifique approfondie mais pédagogue des enzymes, récepteurs ou déséquilibres moléculaires impliqués." },
            symptoms: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "3 à 5 principaux symptômes d'expression de l'affection"
            },
            standards: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "2 à 4 traitements conventionnels ou molécules usuelles recommandés par l'ARS/FDA et leurs mécanismes biologiques simplifiés"
            },
            scientificApproaches: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "3 à 5 pistes de recherche de pointe, bio-solutions naturelles, ou optimisations d'hygiène de vie (nutrition ciblée, modulateurs de gènes, etc.)"
            },
            references: {
              type: "ARRAY",
              items: { type: "STRING" },
              description: "2 références de publications scientifiques sérieuses fictives ou réelles (ex: 'New England Journal of Medicine (2023)', 'Cell Metabolism (2024)')"
            }
          },
          required: ["id", "name", "category", "summary", "pathophysiology", "symptoms", "standards", "scientificApproaches", "references"]
        }
      },
    });

    const ficheData = JSON.parse(response.text || "{}");
    res.json(ficheData);
  } catch (error: any) {
    console.error("Generate Fiche API Error:", error);
    res.status(500).json({ error: "Impossible de générer la fiche automatique : " + (error?.message || error) });
  }
});

app.post("/api/science-info", async (req, res) => {
  const { query, conditionName } = req.body;

  if (!query || typeof query !== "string") {
    res.status(400).json({ error: "La recherche ('query') est requise et doit être sous forme de texte." });
    return;
  }

  if (!ai) {
    res.status(503).json({
      error: "La clé API Gemini n'est pas encore configurée sur cet environnement de prévisualisation. Veuillez l'ajouter dans l'onglet des secrets ou configurer le fichier .env.",
      isNotConfigured: true
    });
    return;
  }

  try {
    // Elegant clinical/scientific prompt that forces balanced, objective scientific information.
    const prompt = conditionName 
      ? `Recherche approfondie sur : ${conditionName}. Question spécifique du patient : "${query}".`
      : `Question scientifique sur l'affection/phénomène biologique suivant : "${query}".`;

    const systemInstruction = `
Vous êtes un "Explorateur Scientifique Médical" de pointe, extrêmement rigoureux, objectif, bienveillant et instructif. 
Votre but est d'aider les patients à comprendre la science derrière leur maladie (ou les symptômes/mécanismes qu'ils soumettent) et d'explorer les solutions scientifiques issues des dernières recherches cliniques et universitaires mondiales.

RÈGLES CRITIQUES D'EMPATHIE ET DE SÉCURITÉ :
1. NE blessez JAMAIS verbalement l'utilisateur ou le patient en aucun cas. Soyez d'une bienveillance absolue, extrêmement chaleureux, poli, rassurant et respectueux. Tout jugement ou mépris est strictement interdit.
2. N'émettez aucun jugement négatif ou culpabilisant sur le style de vie ou l'état de l'utilisateur. Écrivez avec empathie et espoir, comme un scientifique soucieux du bien-être humain.
3. NE JAMAIS donner de conseils médicaux directs sous forme d'ordonnance définitive. Vous fournissez des clés de compréhension scientifique.

Vous devez STRICTEMENT suivre les règles de structure et de contenu suivantes :
1. Commencer TOUJOURS votre réponse par une clause de non-responsabilité en gras et italique rédigée exactement ainsi :
"**_Clause de non-responsabilité : Les informations cliniques et scientifiques présentées ci-dessous le sont à des fins d'éducation et d'exploration intellectuelle uniquement. Elles ne constituent pas un avis médical de diagnostic ou de traitement et ne remplacent jamais la consultation d'un médecin diplômé._**"
Répétez cette clause (ou une formulation similaire) à la toute fin de la réponse pour garantir la sécurité du patient.
2. Rédiger la réponse entièrement en FRANÇAIS, en utilisant un langage précis, élégant et vulgarisé cliniquement (les termes moléculaires et biochimiques sont encouragés s'ils sont expliqués simplement).
3. Structurer la réponse avec des titres clairs de niveau Markdown (###) selon ce canevas précis :
   - ### 🤝 Adresse Thérapeutique Personnalisée :
     Inscrivez OBLIGATOIREMENT cette phrase textuellement en gras au début de cette section :
     "**Patient, tu souffres de [Nom de l'affection]. Donc tu ferais mieux de :**" (Adaptez [Nom de l'affection] avec l'élément recherché).
     Ajoutez en dessous 2 à 3 puces claires et directes de conseils ou bonnes pratiques basés sur l'hygiène de vie, la nutrition ou l'adaptation quotidienne de manière attentionnée et engageante.
   - ### 🧠 Physiopathologie & Cascade Moléculaire : Expliquez précisément la physiologie du phénomène, les récepteurs, les voies de signalisation endommagées ou suractivées d'une manière passionnante et compréhensible.
   - ### 🛡️ Approches Thérapeutiques Classiques (Standards) : Rappelez brièvement les axes médicaux actuels (médicaments de première ligne, mécanismes biologiques des molécules approuvées).
   - ### 🔬 Pistes de Recherche Nova & Bio-solutions : Abordez les approches de nutrition scientifique de pointe, la supplémentation micro-nutritionnelle ciblée (par ex. principes actifs précis stimulant l'AMPK ou calmant la voie NF-kB), l'activation de voies physiologiques réflexes (vagus, baroréflexe, etc.), ou les approches basées sur le mode de vie validées par des études d'impact.
   - ### ⚠️ Vigilance, Interactions & Signaux d'Alerte : Listez les mises en garde scientifiques de sécurité indispensables, les interactions plantes-médicaments possibles pour ce cas, et les barrières où l'accès à un service d'urgence est requis.
4. Soyez complet mais allez droit au but. Citez de temps en temps des concepts d'études cliniques ou des revues renommées (ex: PubMed, Lancet, Cell) de manière pédagogique.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const aiExplanation = response.text;
    res.json({ aiExplanation });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Une erreur est survenue lors de l'appel à l'intelligence scientifique : " + (error?.message || error) });
  }
});

// Setup Vite Dev server or Serve static files
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite Middleware.");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode.");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[MedScientia Host] Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Critical error starting Express host server:", err);
});
