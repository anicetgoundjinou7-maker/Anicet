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

  const { diseaseName } = body;

  if (!diseaseName || typeof diseaseName !== "string") {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Le nom de la maladie ('diseaseName') est requis." }),
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
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: JSON.stringify(ficheData),
    };
  } catch (error: any) {
    console.error("Generate Fiche API Error in Netlify Function:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Impossible de générer la fiche automatique : " + (error?.message || error) }),
    };
  }
}
