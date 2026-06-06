/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiseaseCondition {
  id: string;
  name: string;
  category: string;
  summary: string;
  pathophysiology: string;
  symptoms: string[];
  standards: string[]; // Solution standard (traitements classiques)
  scientificApproaches: string[]; // Approches scientifiques, nutritionnelles, physiologiques et cibles moléculaires
  references: string[]; // Références d'études cliniques / revues indexées (ex: PubMed, Lancet, NIH)
}

export interface SearchResult {
  condition?: DiseaseCondition;
  isAiResponse: boolean;
  aiExplanation?: string;
  query: string;
}
