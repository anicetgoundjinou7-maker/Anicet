import { GoogleGenAI } from "@google/genai";

export async function handler(event: any, context: any) {
  // CORS configuration
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || "{}");
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "JSON invalide" }),
    };
  }

  const { query, conditionName } = body;

  if (!query || typeof query !== "string") {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "La recherche ('query') est requise et doit être sous forme de texte." }),
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return {
      statusCode: 503,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "La clé API Gemini n'est pas configurée dans les variables d'environnement de Netlify.",
        isNotConfigured: true,
      }),
    };
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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
Répétez cette clause (or une formulation similaire) à la toute fin de la réponse pour garantir la sécurité du patient.
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
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify({ aiExplanation }),
    };
  } catch (error: any) {
    console.error("Gemini API Error in Netlify Function:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Une erreur est survenue lors de l'appel à l'intelligence scientifique : " + (error?.message || error) }),
    };
  }
}
