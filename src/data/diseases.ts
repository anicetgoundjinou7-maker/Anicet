/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiseaseCondition } from "../types";

export const DISEASE_CATEGORIES = [
  "Métabolisme & Endocrinologie",
  "Système Immunitaire & Inflammatoire",
  "Maladies Cardio-vasculaires",
  "Neurologie & Système Nerveux",
];

export const PRESET_DISEASES: DiseaseCondition[] = [
  {
    id: "diabete-type-2",
    name: "Diabète de Type 2",
    category: "Métabolisme & Endocrinologie",
    summary: "Dysfonctionnement de l'homéostasie du glucose caractérisé par une résistance périphérique à l'insuline et un déclin progressif des cellules bêta pancréatiques.",
    pathophysiology: "Le diabète de type 2 se caractérise par une diminution de la réponse biologique des tissus périphériques (notamment musculaires, adipeux et hépatiques) à l'action de l'insuline. Ce phénomène, appelé insulino-résistance, perturbe sérieusement la translocation des transporteurs GLUT-4 vers la membrane cellulaire pour capter le glucose. Au niveau cellulaire, l'accumulation intracellulaire de lipides (diatacylglycérols et céramides) inhibe la cascade de signalisation du récepteur à l'insuline (IRS-1). En réponse, le pancréas compense initialement par une hyperinsulinémie, mais l'épuisement progressif et la lipotoxicité des cellules bêta des îlots de Langerhans finissent par provoquer une hyperglycémie chronique.",
    symptoms: [
      "Polyurie (augmentation du volume d'urine, surtout la nuit)",
      "Polydipsie (soif excessive et inapaisable)",
      "Asthénie fluctuante liée aux pics glycémiques",
      "Cicatrisation ralentie des tissus conjonctifs",
      "Paresthésies et engourdissements des extrémités (neuropathie précoce)"
    ],
    standards: [
      "Metformine : inhibe la néoglucogenèse hépatique et active la protéine kinase activée par l'AMP (AMPK).",
      "Inhibiteurs des SGLT2 (Gliflozines) : réduisent la réabsorption rénale du glucose au niveau des tubes contournés proximaux.",
      "Agonistes des récepteurs du GLP-1 (Sémaglutide, Liraglutide) : stimulent la sécrétion d'insuline dépendante du glucose et ralentissent la vidange gastrique."
    ],
    scientificApproaches: [
      "Activation ciblée de la voie métabolique de l'AMPK : Utilisation clinique d'agents mimétiques de l'exercice et de modulateurs naturels de haute pureté comme la berbérine, agissant de manière analogue à la metformine.",
      "Optimisation mitochondriale et réduction du stress oxydatif : Administration d'acide alpha-lipoïque et de Coenzyme Q10 pour améliorer l'oxydation du glucose et restaurer la sensibilité à l'insuline.",
      "Nutrition polyphenol-riche et blocage des enzymes alpha-glucosidases : Apports enrichis en anthocyanines capables de ralentir la digestion des glucides complexes et de réduire l'index glycémique global.",
      "Jeûne intermittent thérapeutique et régimes mimétiques de jeûne (FMD) : Protocoles démontrant scientifiquement des phases de régénération partielle des cellules bêta pancréatiques par reprogrammation cellulaire."
    ],
    references: [
      "Mitochondrial dysfunction and insulin resistance - Nature Reviews Endocrinology, 2021",
      "GLP-1 receptor agonists in clinical practice and cardio-protection - The Lancet Diabetes & Endocrinology, 2022",
      "AMPK activation in metabolic health: from molecular mechanisms to therapeutics - Cell Metabolism, 2023"
    ]
  },
  {
    id: "maladie-crohn",
    name: "Maladie de Crohn",
    category: "Système Immunitaire & Inflammatoire",
    summary: "Pathologie inflammatoire chronique de l'intestin (MICI) se manifestant par des lésions segmentaires et transmurales du tube digestif.",
    pathophysiology: "La maladie de Crohn implique une dérégulation majeure du système immunitaire mucosal chez des individus génétiquement prédisposés (gènes NOD2/CARD15). Elle se définit par une réponse immunitaire inappropriée et exacerbée des lymphocytes T helper (Th1 et Th17) dirigés contre la flore microbienne commensale de l'intestin. Cette suractivation produit une libération massive de cytokines pro-inflammatoires clés, principalement le TNF-alpha, l'interleukine-12 (IL-12) et l'interleukine-23 (IL-23). Il en résulte une cascade destructrice qui altère l'intégrité de la barrière épithéliale, favorise l'infiltration de cellules immunitaires infiltrantes et mène à des ulcérations profondes et des sténoses fibreuses.",
    symptoms: [
      "Douleurs abdominales sévères (souvent localisées dans la fosse iliaque droite)",
      "Diarrhée chronique avec parfois présence de mucus ou sang",
      "Perte de poids involontaire due à une malabsorption intestinale active",
      "Fièvre modérée récurrente lors des poussées de la maladie",
      "Manifestations extra-intestinales (arthropathies, aphtes buccaux récurrents)"
    ],
    standards: [
      "Anticorps monoclonaux anti-TNF-alpha (Infliximab, Adalimumab) : neutralisent l'activité biologique de la principale cytokine inflammatoire intestinale.",
      "Inhibiteurs des interleukines IL-12/IL-23 (Ustekinumab) : bloquent l'activation des voies de différenciation lymphocytaire Th1 et Th17.",
      "Corticoïdes (Budésonide, Prednisone) : utilisés pour juguler les poussées aiguës par une puissante action immunosuppressive locale.",
      "Immunomodulateurs de fond (Azathioprine) : diminuent le taux sanguins de globules blancs actifs et stabilisent les périodes de rémission."
    ],
    scientificApproaches: [
      "Restauration de la fonction barrière et modulation des jonctions serrées : Amélioration de l'étanchéité des protéines de jonction (comme Zonula Occludens-1) par l'utilisation de butyrate de sodium (acide gras à chaîne courte issu de la fermentation bactérienne).",
      "Inhibition de la voie inflammatoire NF-kB : L'utilisation clinique de curcumine à haute biodisponibilité (complexes phytosomaux) réduit de façon cliniquement prouvée l'inflammation intestinale en inhibant l'activation du facteur de transcription NF-kB.",
      "Microbiothérapie ciblée de précision : Transplantation de microbiote fécal de donneurs ou protocoles exigeants de greffe probiotique contenant des souches spécifiques de Bifidobacterium et Faecalibacterium prausnitzii (naturellement déficitaire dans la maladie).",
      "Nutrition thérapeutique exclusive (EEN) : Protocoles physiologiques d'alimentation entérale exclusive, cliniquement équivalente aux corticoïdes pour induire la cicatrisation muqueuse chez les patients, sans effet secondaire."
    ],
    references: [
      "The role of gut microbiota and mucosal immunity in Crohn's disease - Gastroenterology, 2022",
      "Anti-TNF therapy and innovative biologics in IBD - The New England Journal of Medicine, 2023",
      "Efficacy and safety of Curcumin phytosome in patients with active IBD - Clinical Gastroenterology and Hepatology, 2021"
    ]
  },
  {
    id: "hypertension-arterielle",
    name: "Hypertension Artérielle Essentielle",
    category: "Maladies Cardio-vasculaires",
    summary: "Élévation chronique de la pression artérielle systémique découlant d'une perte d'élasticité artérielle et d'une hyperactivité de la régulation vasculaire.",
    pathophysiology: "L'hypertension artérielle (HTA) essentielle résulte d'une régulation défaillante de la résistance vasculaire périphérique et du débit cardiaque. Elle implique une hyperactivité chronique du système Rénine-Angiotensine-Aldostérone (SRAA), une surstimulation du système nerveux sympathique et un dysfonctionnement endothélial marqué par une chute drastique de la biodisponibilité locale en monoxyde d'azote (NO). Ce gaz vasodilatateur, normalement synthétisé par l'enzyme eNOS, voit sa production bloquée par un stress oxydatif excessif. Privées de ce relaxant, les cellules musculaires lisses vasculaires se contractent, menant à une augmentation du tonus artériel, une rigidisation de la paroi artérielle et une hausse constante de la postcharge cardiaque.",
    symptoms: [
      "Céphalées caractéristiques (souvent occipitales et matinales)",
      "Acouphènes pulsatiles (sensations de sifflement ou de battement dans les oreilles)",
      "Sensations de vertiges ou d'instabilité à la marche",
      "Palpitations cardiaques atypiques ou essoufflement anormal à l'effort",
      "Épisodes de vision floue ou de fatigue visuelle spontanée"
    ],
    standards: [
      "Inhibiteurs de l'enzyme de conversion (Ramipril, Énalapril) : empêchent la conversion de l'angiotensine I en angiotensine II (puissant vasoconstricteur).",
      "Antagonistes des Récepteurs de l'Angiotensine II (Losartan, Valsartan) : bloquent directement l'action hypertensive de l'angiotensine II sur les récepteurs AT1.",
      "Inhibiteurs calciques (Amlodipine) : bloquent les canaux calciques voltage-dépendants des cellules musculaires lisses, provoquant une vasodilatation périphérique.",
      "Diurétiques thiazidiques (Hydrochlorothiazide) : augmentent l'excrétion urinaire de sodium pour réduire le volume sanguin intravasculaire."
    ],
    scientificApproaches: [
      "Augmentation endogène du monoxyde d'azote (NO) : Utilisation thérapeutique d'aliments riches en nitrates inorganiques (ex : concentré de jus de betterave standardisé) et d'acides aminés précurseurs (L-Arginine, L-Citrulline) pour réactiver la voie alternative de synthèse du NO.",
      "Prévention de la rigidification artérielle via la vitamine K2 (MK-7) : Activation de la Matrix Gla Protéine (MGP) par la Vitamine K2 à haute dose, permettant de chélater le calcium circulant et d'éviter son dépôt sclérosant dans la couche média artérielle.",
      "Antagonisme calcique par le rechargement en Magnésium intracellulaire : Le magnésium agit comme un régulateur naturel des canaux calciques. Une supplémentation ciblant une haute biodisponibilité (bisglycinate, thréonate) limite le tonus de contraction vasculaire.",
      "Entraînement de la sensibilité baroréflexe par résonance respiratoire : Protocoles de biofeedback de variabilité de la fréquence cardiaque (VFC) à un rythme d'environ 6 cycles par minute (0.1 Hz) pour réguler le système nerveux autonome sympathique."
    ],
    references: [
      "Endothelial dysfunction and oxidative stress in cardiovascular diseases - Journal of Hypertension, 2021",
      "Arterial calcification and the therapeutic role of Vitamin K2 in vascular stiffening - Atherosclerosis, 2022",
      "Resonant breathing and heart rate variability biofeedback for blood pressure control - Frontiers in Physiology, 2023"
    ]
  },
  {
    id: "migraine-chronique",
    name: "Migraine Chronique",
    category: "Neurologie & Système Nerveux",
    summary: "Désordre neurologique et vasculaire complexe caractérisé par une hyperexcitabilité neuronale et une inflammation neurogène du système trigémino-vasculaire.",
    pathophysiology: "La migraine est un trouble neurovasculaire complexe d'origine génétique. Elle implique une hyperexcitabilité du cortex cérébral favorisant le déclenchement de la 'dépression corticale envahissante' (CSD), une onde lente d'activation neuronale suivie de dépression qui balaye le cortex. Cette onde stimule les fibres afférentes du nerf trijumeau qui innervent les méninges. En réponse, ces terminaisons nerveuses libèrent des néuropeptides vasoactifs extrêmement inflammatoires, notamment le CGRP (Calcitonin Gene-Related Peptide). Cette décharge provoque une vasodilatation locale intense, une perméabilité vasculaire accrue et une 'inflammation neurogène stérilisante' transmettant un signal douloureux continu vers le thalamus.",
    symptoms: [
      "Céphalée intense, pulsatile, le plus souvent unilatérale",
      "Photophobie marquée (intolérance aiguë à la lumière)",
      "Phonophobie associée (douleur exacerbée par le bruit)",
      "Nausées importantes allant parfois jusqu'aux vomissements",
      "Prise d'aura visuelle (scotomes scintillants, perte de vision partielle transitoire)"
    ],
    standards: [
      "Anticorps monoclonaux anti-CGRP ou anti-récepteurs du CGRP (Erenumab, Galcanezumab) : bloquent de façon prolongée l'action inflammatoire du peptide.",
      "Triptans (Sumatriptan, Zolmitriptan) : agonistes sélectifs des récepteurs sérotoninergiques 5-HT1B/1D induisant une vasoconstriction méningée rapide.",
      "Traitements prophylactiques classiques : comprenant des bêtabloquants (Propranolol) ou des anti-épileptiques (Topiramate) pour réduire l'excitabilité cérébrale."
    ],
    scientificApproaches: [
      "Soutien bioénergétique mitochondrial neuronal : Utilisation synergique de coenzyme Q10 et de Riboflavine (Vitamine B2) pour compenser les micro-déficits énergétiques mitochondriaux, fréquents chez les migraineux, stabilisant ainsi le seuil de déclenchement de la dépression corticale.",
      "Blocage des récepteurs NMDA par le Magnésium : Le magnésium intracellulaire bloque les récepteurs ionotropiques NMDA au glutamate. Un niveau optimal empêche la propagation de l'onde lente d'excitation neuronale à l'origine de l'aura.",
      "Alimentation cétogène et apport de béta-hydroxybutyrate : La transition vers un métabolisme de corps cétoniques fournit un carburant alternatif ultra-efficace pour le cerveau, réduisant le stress oxydatif neuronal et l'inflammation trigéminée.",
      "Identification des peptides immunogènes alimentaires : Élimination ciblée de composés inflammatoires (histamine libérée, excès de tyramine) favorisant la dégranulation mastocytaire péri-vasculaire méningée."
    ],
    references: [
      "Pathophysiology of migraine and the clinical evolution of CGRP antagonists - Nature Reviews Neurology, 2022",
      "High-dose riboflavin, coenzyme Q10, and magnesium in migraine prophylaxis - The Journal of Headache and Pain, 2021",
      "Ketogenic diet as a neuromodulatory therapy in chronic migraine - Frontiers in Neurology, 2023"
    ]
  }
];
