/* ============================================================
   TERANGA ALOE — Données des protocoles & boutique Forever Living
   Contenu médical = langue source FRANÇAIS.
   ============================================================ */
import type { Protocol, StoreCategory, StoreProduct } from "./types";

// Mapping nom produit -> packshot (sinon placeholder typographique)
export const PRODUCT_IMAGES: Record<string, string> = {
  "Forever Active Pro-B™": "/products/active-prob.png",
  "Forever Aloe Berry Nectar™": "/products/aloe-berry-nectar.png",
  "Forever Marine Collagen™": "/products/marine-collagen.png",
};

// Couleur d'accent par produit-initiale (placeholder)
export const PRODUCT_TINT: Record<string, string> = {
  Aloe: "--aloe-green", Daily: "--sky-blue", Active: "--aloe-green", Absorbent: "--aloe-gold",
  Arctic: "--sky-blue", Calcium: "--earth-brown", Fiber: "--aloe-green", Garlic: "--earth-brown",
  Shape: "--aloe-gold", Move: "--aloe-gold", ARGI: "--sky-blue", Bee: "--aloe-gold",
  Lycium: "--earth-brown", Focus: "--sky-blue", Vitolize: "--aloe-green", Marine: "--earth-brown",
  NutraQ10: "--aloe-gold", Plant: "--aloe-green", Fields: "--aloe-green", Propolis: "--aloe-gold",
  Gelly: "--aloe-green", First: "--aloe-green", B12: "--sky-blue", Vera: "--aloe-green",
};

export const PROTOCOLS: Protocol[] = [
  {
    id: "diabete",
    name: { fr: "Diabète — Type 1 & 2", en: "Diabetes — Type 1 & 2", pt: "Diabetes — Tipo 1 & 2" },
    icon: "droplets",
    accent: "--sky-blue",
    tagline: { fr: "Réguler la glycémie, protéger cœur & reins", en: "Regulate glycemia, protect heart & kidneys", pt: "Regular a glicemia, proteger coração e rins" },
    overview: {
      fr: "Approche en fondation (Aloe Vera Gel, Pro-B, Daily) + régulation glycémique directe (chrome, fibres, ail) + protection des complications. Le Type 2 démarre par un reset DX4™/C9™ ; le Type 1 priorise l'immunomodulation.",
      en: "Foundation (Aloe Vera Gel, Pro-B, Daily) + direct glycemic regulation (chromium, fiber, garlic) + complication protection.",
      pt: "Fundação (Aloe Vera Gel, Pro-B, Daily) + regulação glicémica direta (crómio, fibras, alho) + proteção de complicações.",
    },
    duration: { fr: "6 mois + maintien", en: "6 months + maintenance", pt: "6 meses + manutenção" },
    phases: [
      { id: "p1", name: { fr: "Reset", en: "Reset", pt: "Reset" }, range: "M1", focus: { fr: "DX4™ / C9™ — perte de poids initiale (T2)", en: "DX4™ / C9™ — initial weight loss (T2)", pt: "DX4™ / C9™ — perda de peso inicial (T2)" } },
      { id: "p2", name: { fr: "Régulation", en: "Regulation", pt: "Regulação" }, range: "M1–M3", focus: { fr: "Vital5® + Shape® (chrome) + Fiber™", en: "Vital5® + Shape® (chromium) + Fiber™", pt: "Vital5® + Shape® (crómio) + Fiber™" } },
      { id: "p3", name: { fr: "Protection", en: "Protection", pt: "Proteção" }, range: "M3–M6", focus: { fr: "Arctic Sea™, B12 Plus™, Lycium Plus®", en: "Arctic Sea™, B12 Plus™, Lycium Plus®", pt: "Arctic Sea™, B12 Plus™, Lycium Plus®" } },
      { id: "p4", name: { fr: "Maintien", en: "Maintenance", pt: "Manutenção" }, range: "M6+", focus: { fr: "Base quotidienne à vie, HbA1c tous les 3 mois", en: "Lifelong daily base, HbA1c every 3 months", pt: "Base diária vitalícia, HbA1c a cada 3 meses" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — à jeun", en: "Morning — fasting", pt: "Manhã — em jejum" }, time: "07:30", items: [
        { p: "Forever Aloe Vera Gel™", dose: { fr: "90 ml pur", en: "90 ml pure", pt: "90 ml puro" }, why: { fr: "Absorption, muqueuse intestinale", en: "Absorption, gut lining", pt: "Absorção, mucosa intestinal" } },
        { p: "Forever Daily™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Carences du diabétique", en: "Diabetic deficiencies", pt: "Carências do diabético" } },
        { p: "Forever Active Pro-B™", dose: { fr: "1 capsule", en: "1 capsule", pt: "1 cápsula" }, why: { fr: "Microbiome → glycémie", en: "Microbiome → glycemia", pt: "Microbioma → glicemia" } },
      ] },
      { id: "midi", label: { fr: "Midi — avec repas", en: "Noon — with meal", pt: "Meio-dia — com refeição" }, time: "12:30", items: [
        { p: "Forever Fiber™", dose: { fr: "1 stick (grand verre d'eau)", en: "1 stick (large glass of water)", pt: "1 stick (copo grande de água)" }, why: { fr: "Ralentit l'absorption du glucose", en: "Slows glucose absorption", pt: "Retarda a absorção da glicose" } },
        { p: "Forever Shape®", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Chrome — sensibilité à l'insuline", en: "Chromium — insulin sensitivity", pt: "Crómio — sensibilidade à insulina" } },
        { p: "Forever Garlic-Thyme®", dose: { fr: "2 gélules", en: "2 softgels", pt: "2 cápsulas" }, why: { fr: "Effet hypoglycémiant", en: "Hypoglycemic effect", pt: "Efeito hipoglicemiante" } },
      ] },
      { id: "soir", label: { fr: "Soir — repas", en: "Evening — meal", pt: "Noite — refeição" }, time: "19:30", items: [
        { p: "Forever Arctic Sea™", dose: { fr: "2 gélules", en: "2 softgels", pt: "2 cápsulas" }, why: { fr: "Oméga-3 — cœur & reins", en: "Omega-3 — heart & kidneys", pt: "Ómega-3 — coração e rins" } },
        { p: "Forever B12 Plus™", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Si metformine — neuropathie", en: "If on metformin — neuropathy", pt: "Se metformina — neuropatia" } },
        { p: "Forever Lycium Plus®", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Rétine & reins (T1)", en: "Retina & kidneys (T1)", pt: "Retina e rins (T1)" } },
      ] },
    ],
    tracking: [
      { fr: "Glycémie à jeun (mg/dL)", en: "Fasting glucose (mg/dL)", pt: "Glicemia em jejum (mg/dL)", target: "80–130" },
      { fr: "HbA1c — J0 / M3 / M6", en: "HbA1c — D0 / M3 / M6", pt: "HbA1c — D0 / M3 / M6", target: "< 7 %" },
      { fr: "Poids (kg)", en: "Weight (kg)", pt: "Peso (kg)", target: "−2 à −4 kg" },
    ],
    warnings: [
      { fr: "Ne jamais réduire l'insuline ou les antidiabétiques sans avis médical, même avec d'excellents résultats.", en: "Never reduce insulin or anti-diabetics without medical advice.", pt: "Nunca reduzir a insulina ou antidiabéticos sem aconselhamento médico." },
      { fr: "Mesurer l'HbA1c à J0, M3 et M6 pour objectiver les progrès.", en: "Measure HbA1c at D0, M3 and M6 to track progress.", pt: "Medir a HbA1c em D0, M3 e M6 para acompanhar o progresso." },
      { fr: "Type 1 : pas de DX4™/C9™ ; maintenir B12 à vie.", en: "Type 1: no DX4™/C9™; maintain B12 for life.", pt: "Tipo 1: sem DX4™/C9™; manter B12 vitalício." },
    ],
  },
  {
    id: "asthme",
    name: { fr: "Asthme", en: "Asthma", pt: "Asma" },
    icon: "wind",
    accent: "--sky-blue",
    tagline: { fr: "Espacer les crises, réduire la pompe de fond", en: "Space out attacks, reduce maintenance inhaler", pt: "Espaçar as crises, reduzir a bomba de fundo" },
    overview: {
      fr: "Éteindre l'inflammation bronchique (oméga-3, curcumine, vitamine D, magnésium) puis désensibiliser progressivement au pollen sur 8 semaines, comme une immunothérapie orale.",
      en: "Calm bronchial inflammation then gradually desensitise to pollen over 8 weeks.",
      pt: "Acalmar a inflamação brônquica e dessensibilizar progressivamente ao pólen em 8 semanas.",
    },
    duration: { fr: "3–4 mois + maintien à vie", en: "3–4 months + lifelong maintenance", pt: "3–4 meses + manutenção vitalícia" },
    phases: [
      { id: "p1", name: { fr: "Anti-inflammatoire", en: "Anti-inflammatory", pt: "Anti-inflamatório" }, range: "S1–S2", focus: { fr: "Arctic Sea™, Move™, Absorbent-D™", en: "Arctic Sea™, Move™, Absorbent-D™", pt: "Arctic Sea™, Move™, Absorbent-D™" } },
      { id: "p2", name: { fr: "Désensibilisation", en: "Desensitisation", pt: "Dessensibilização" }, range: "S3–S10", focus: { fr: "Bee Pollen® 0→3 cp/j progressif", en: "Bee Pollen® 0→3 tabs/day gradual", pt: "Bee Pollen® 0→3 cp/dia gradual" } },
      { id: "p3", name: { fr: "Stabilisation", en: "Stabilisation", pt: "Estabilização" }, range: "M2–M3", focus: { fr: "Crises rares, début réduction pompe", en: "Rare attacks, begin inhaler reduction", pt: "Crises raras, início da redução da bomba" } },
      { id: "p4", name: { fr: "Maintien", en: "Maintenance", pt: "Manutenção" }, range: "M4+", focus: { fr: "Bee Pollen 2–3 cp/j à vie, renfort saisonnier", en: "Bee Pollen 2–3 tabs/day for life, seasonal boost", pt: "Bee Pollen 2–3 cp/dia vitalício, reforço sazonal" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — repas", en: "Morning — meal", pt: "Manhã — refeição" }, time: "08:00", items: [
        { p: "Forever Arctic Sea™", dose: { fr: "2 gélules", en: "2 softgels", pt: "2 cápsulas" }, why: { fr: "Oméga-3 — bloque les leucotriènes", en: "Omega-3 — blocks leukotrienes", pt: "Ómega-3 — bloqueia leucotrienos" } },
        { p: "Forever Absorbent-D™", dose: { fr: "1–2 comprimés", en: "1–2 tablets", pt: "1–2 comprimidos" }, why: { fr: "Vitamine D — −50 % de crises", en: "Vitamin D — −50% attacks", pt: "Vitamina D — −50% de crises" } },
        { p: "Forever Move™", dose: { fr: "2 gélules", en: "2 capsules", pt: "2 cápsulas" }, why: { fr: "Curcumine — inhibe NF-κB", en: "Curcumin — inhibits NF-κB", pt: "Curcumina — inibe NF-κB" } },
      ] },
      { id: "midi", label: { fr: "Midi — repas", en: "Noon — meal", pt: "Meio-dia — refeição" }, time: "13:00", items: [
        { p: "Forever Bee Pollen®", dose: { fr: "0 → 3 cp (montée 8 sem.)", en: "0 → 3 tabs (8-wk ramp)", pt: "0 → 3 cp (subida 8 sem.)" }, why: { fr: "Désensibilisation allergénique", en: "Allergen desensitisation", pt: "Dessensibilização alérgica" } },
        { p: "Forever ARGI+®", dose: { fr: "1 stick", en: "1 stick", pt: "1 stick" }, why: { fr: "Oxyde nitrique — bronchodilatateur", en: "Nitric oxide — bronchodilator", pt: "Óxido nítrico — broncodilatador" } },
      ] },
      { id: "soir", label: { fr: "Soir — coucher", en: "Evening — bedtime", pt: "Noite — deitar" }, time: "21:30", items: [
        { p: "Forever Calcium™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Magnésium — crises 2h–4h du matin", en: "Magnesium — 2–4am attacks", pt: "Magnésio — crises 2h–4h da manhã" } },
        { p: "Forever Bee Propolis®", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Antihistaminique naturel (CAPE)", en: "Natural antihistamine (CAPE)", pt: "Anti-histamínico natural (CAPE)" } },
      ] },
    ],
    tracking: [
      { fr: "Crises / semaine", en: "Attacks / week", pt: "Crises / semana", target: "→ 0" },
      { fr: "Bouffées de pompe de secours", en: "Reliever puffs", pt: "Doses da bomba de alívio", target: "↓" },
      { fr: "Qualité du sommeil (0–10)", en: "Sleep quality (0–10)", pt: "Qualidade do sono (0–10)", target: "≥ 7" },
    ],
    warnings: [
      { fr: "La pompe de secours (Ventolin) reste disponible à vie. Ne jamais l'abandonner.", en: "Keep the reliever inhaler available for life.", pt: "Manter a bomba de alívio disponível para sempre." },
      { fr: "Réduire la pompe de fond uniquement après 4 semaines sans crise, validé par spirométrie.", en: "Reduce maintenance inhaler only after 4 attack-free weeks.", pt: "Reduzir a bomba de fundo apenas após 4 semanas sem crises." },
    ],
  },
  {
    id: "hemorroides",
    name: { fr: "Hémorroïdes", en: "Hemorrhoids", pt: "Hemorroidas" },
    icon: "shield",
    accent: "--earth-brown",
    tagline: { fr: "Double action : tonus veineux + transit", en: "Dual action: venous tone + transit", pt: "Dupla ação: tónus venoso + trânsito" },
    overview: {
      fr: "Traiter les deux causes profondes — le transit (Fiber™, Pro-B, Fields of Greens) et le tonus veineux (Absorbent-C, ARGI+, Lycium) — avec un soin local jour/nuit.",
      en: "Treat both root causes — transit and venous tone — with day/night local care.",
      pt: "Tratar as duas causas — trânsito e tónus venoso — com cuidado local dia/noite.",
    },
    duration: { fr: "6–8 semaines + Fiber™ à vie", en: "6–8 weeks + Fiber™ for life", pt: "6–8 semanas + Fiber™ vitalício" },
    phases: [
      { id: "p1", name: { fr: "Soulagement", en: "Relief", pt: "Alívio" }, range: "J1–J7", focus: { fr: "Fiber™ + Aloe Vera Gelly™ (règle 48h)", en: "Fiber™ + Aloe Vera Gelly™ (48h rule)", pt: "Fiber™ + Aloe Vera Gelly™ (regra 48h)" } },
      { id: "p2", name: { fr: "Cicatrisation", en: "Healing", pt: "Cicatrização" }, range: "S2–S4", focus: { fr: "Gelly jour / Propolis Creme nuit", en: "Gelly day / Propolis Creme night", pt: "Gelly dia / Propolis Creme noite" } },
      { id: "p3", name: { fr: "Tonus veineux", en: "Venous tone", pt: "Tónus venoso" }, range: "S4–S8", focus: { fr: "Absorbent-C, ARGI+, Lycium, Arctic Sea", en: "Absorbent-C, ARGI+, Lycium, Arctic Sea", pt: "Absorbent-C, ARGI+, Lycium, Arctic Sea" } },
      { id: "p4", name: { fr: "Anti-récidive", en: "Anti-relapse", pt: "Anti-recidiva" }, range: "À vie", focus: { fr: "Fiber™ avant repas + Aloe First® (hygiène)", en: "Fiber™ before meals + Aloe First® (hygiene)", pt: "Fiber™ antes das refeições + Aloe First® (higiene)" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — avant repas", en: "Morning — before meal", pt: "Manhã — antes da refeição" }, time: "07:30", items: [
        { p: "Forever Fiber™", dose: { fr: "1 stick (grand verre d'eau)", en: "1 stick (large glass of water)", pt: "1 stick (copo grande de água)" }, why: { fr: "Ramollit les selles en 48–72h", en: "Softens stool in 48–72h", pt: "Amolece as fezes em 48–72h" } },
        { p: "Forever Aloe Vera Gel™", dose: { fr: "60 ml", en: "60 ml", pt: "60 ml" }, why: { fr: "Anti-inflammatoire interne", en: "Internal anti-inflammatory", pt: "Anti-inflamatório interno" } },
        { p: "Forever Absorbent-C™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Tonus de la paroi veineuse", en: "Venous wall tone", pt: "Tónus da parede venosa" } },
      ] },
      { id: "local-jour", label: { fr: "Après chaque selle — soin local", en: "After each stool — local care", pt: "Após cada dejeção — cuidado local" }, time: "—", items: [
        { p: "Aloe First® (spray)", dose: { fr: "Nettoyer à l'eau tiède + vaporiser", en: "Cleanse with warm water + spray", pt: "Limpar com água morna + vaporizar" }, why: { fr: "Remplace le papier irritant", en: "Replaces irritating paper", pt: "Substitui o papel irritante" } },
        { p: "Aloe Vera Gelly™", dose: { fr: "Application locale", en: "Local application", pt: "Aplicação local" }, why: { fr: "Apaise & cicatrise (jour)", en: "Soothes & heals (day)", pt: "Acalma e cicatriza (dia)" } },
      ] },
      { id: "soir", label: { fr: "Soir — coucher", en: "Evening — bedtime", pt: "Noite — deitar" }, time: "22:00", items: [
        { p: "Forever Active Pro-B™", dose: { fr: "1 capsule", en: "1 capsule", pt: "1 cápsula" }, why: { fr: "Transit régulier", en: "Regular transit", pt: "Trânsito regular" } },
        { p: "Forever Bee Propolis® Creme", dose: { fr: "Application locale", en: "Local application", pt: "Aplicação local" }, why: { fr: "Cicatrisation profonde la nuit", en: "Deep overnight healing", pt: "Cicatrização profunda noturna" } },
      ] },
    ],
    tracking: [
      { fr: "Douleur (0–10) matin & soir", en: "Pain (0–10) AM & PM", pt: "Dor (0–10) manhã e noite", target: "≤ 3 dès J3" },
      { fr: "Saignements (oui/non)", en: "Bleeding (yes/no)", pt: "Sangramento (sim/não)", target: "Disparu < S2" },
      { fr: "Selles / jour", en: "Stools / day", pt: "Dejeções / dia", target: "1–2 sans effort" },
    ],
    warnings: [
      { fr: "Saignements rectaux persistants → consultation médicale (autre pathologie possible).", en: "Persistent rectal bleeding → see a doctor.", pt: "Sangramento retal persistente → consultar médico." },
      { fr: "Le Forever Fiber™ ne s'arrête jamais : 60 % des récidives surviennent à l'arrêt.", en: "Forever Fiber™ never stops: 60% of relapses occur when stopped.", pt: "Forever Fiber™ nunca para: 60% das recidivas ocorrem ao parar." },
    ],
  },
  {
    id: "prevention-cancer",
    name: { fr: "Prévention — sein & utérus", en: "Prevention — breast & uterus", pt: "Prevenção — mama e útero" },
    icon: "flower-2",
    accent: "--aloe-green",
    tagline: { fr: "Renforcer les défenses, équilibrer les hormones", en: "Strengthen defenses, balance hormones", pt: "Reforçar defesas, equilibrar hormonas" },
    overview: {
      fr: "Trio central Vitolize™ for Women + Move™ (curcumine) + Absorbent-D™, soutenu par Active Pro-B™ et les antioxydants. Le dépistage reste indispensable.",
      en: "Core trio Vitolize™ for Women + Move™ + Absorbent-D™. Screening remains essential.",
      pt: "Trio central Vitolize™ for Women + Move™ + Absorbent-D™. O rastreio continua indispensável.",
    },
    duration: { fr: "En continu", en: "Ongoing", pt: "Contínuo" },
    phases: [
      { id: "p1", name: { fr: "Fondation hormonale", en: "Hormonal foundation", pt: "Fundação hormonal" }, range: "En continu", focus: { fr: "Vitolize™ Women + Pro-B™", en: "Vitolize™ Women + Pro-B™", pt: "Vitolize™ Women + Pro-B™" } },
      { id: "p2", name: { fr: "Antioxydant", en: "Antioxidant", pt: "Antioxidante" }, range: "En continu", focus: { fr: "Move™, Absorbent-D™, Arctic Sea™", en: "Move™, Absorbent-D™, Arctic Sea™", pt: "Move™, Absorbent-D™, Arctic Sea™" } },
      { id: "p3", name: { fr: "Dépistage", en: "Screening", pt: "Rastreio" }, range: "Annuel", focus: { fr: "Mammographie / frottis — non remplaçable", en: "Mammogram / smear — irreplaceable", pt: "Mamografia / citologia — insubstituível" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — repas", en: "Morning — meal", pt: "Manhã — refeição" }, time: "08:00", items: [
        { p: "Vitolize™ for Women", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Équilibre hormonal féminin", en: "Female hormonal balance", pt: "Equilíbrio hormonal feminino" } },
        { p: "Forever Move™", dose: { fr: "2 gélules", en: "2 capsules", pt: "2 cápsulas" }, why: { fr: "Curcumine — anti-cancéreuse", en: "Curcumin — anti-cancer", pt: "Curcumina — anticancerígena" } },
        { p: "Forever Absorbent-D™", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Vitamine D3 — −50 % de risque", en: "Vitamin D3 — −50% risk", pt: "Vitamina D3 — −50% de risco" } },
      ] },
      { id: "midi", label: { fr: "Midi — repas", en: "Noon — meal", pt: "Meio-dia — refeição" }, time: "13:00", items: [
        { p: "Forever Active Pro-B™", dose: { fr: "1 capsule", en: "1 capsule", pt: "1 cápsula" }, why: { fr: "Estrobolome — régule les estrogènes", en: "Estrobolome — regulates estrogens", pt: "Estroboloma — regula estrogénios" } },
        { p: "Forever Fields of Greens®", dose: { fr: "3 comprimés", en: "3 tablets", pt: "3 comprimidos" }, why: { fr: "Détox & alcalinisation", en: "Detox & alkalinisation", pt: "Detox e alcalinização" } },
      ] },
      { id: "soir", label: { fr: "Soir — repas", en: "Evening — meal", pt: "Noite — refeição" }, time: "19:30", items: [
        { p: "Forever Arctic Sea™", dose: { fr: "2 gélules", en: "2 softgels", pt: "2 cápsulas" }, why: { fr: "Réduction des estrogènes (sein)", en: "Estrogen reduction (breast)", pt: "Redução de estrogénios (mama)" } },
        { p: "Forever B12 Plus™", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Folate — protège l'ADN (col/utérus)", en: "Folate — protects DNA", pt: "Folato — protege o ADN" } },
      ] },
    ],
    tracking: [
      { fr: "Dépistage à jour (date)", en: "Screening up to date (date)", pt: "Rastreio em dia (data)", target: "Annuel" },
      { fr: "Taux de vitamine D (ng/mL)", en: "Vitamin D level (ng/mL)", pt: "Nível de vitamina D (ng/mL)", target: "30–60" },
      { fr: "Bien-être hormonal (0–10)", en: "Hormonal wellbeing (0–10)", pt: "Bem-estar hormonal (0–10)", target: "≥ 7" },
    ],
    warnings: [
      { fr: "Aucun complément ne remplace la mammographie, le frottis ou l'échographie pelvienne.", en: "No supplement replaces mammogram, smear or pelvic ultrasound.", pt: "Nenhum suplemento substitui a mamografia." },
      { fr: "Le dépistage précoce guérit jusqu'à 98 % des lésions précancéreuses.", en: "Early screening cures up to 98% of precancerous lesions.", pt: "O rastreio precoce cura até 98% das lesões pré-cancerosas." },
    ],
  },
  {
    id: "post-cancer",
    name: { fr: "Accompagnement post-cancer", en: "Post-cancer support", pt: "Acompanhamento pós-cancro" },
    icon: "heart-pulse",
    accent: "--aloe-green",
    tagline: { fr: "Réparer, reconstruire, prévenir la récidive", en: "Repair, rebuild, prevent recurrence", pt: "Reparar, reconstruir, prevenir recidiva" },
    overview: {
      fr: "Phase 1 : réparer les dommages des traitements. Phases 2–3 : routine complète anti-récidive. Curcumine (Move™) synergique avec le tamoxifène.",
      en: "Phase 1: repair treatment damage. Phases 2–3: full anti-recurrence routine.",
      pt: "Fase 1: reparar os danos dos tratamentos. Fases 2–3: rotina completa anti-recidiva.",
    },
    duration: { fr: "Phases 1→3 puis maintien", en: "Phases 1→3 then maintenance", pt: "Fases 1→3 depois manutenção" },
    phases: [
      { id: "p1", name: { fr: "Réparation", en: "Repair", pt: "Reparação" }, range: "M1–M2", focus: { fr: "Microbiome, os, neuropathie", en: "Microbiome, bones, neuropathy", pt: "Microbioma, ossos, neuropatia" } },
      { id: "p2", name: { fr: "Reconstruction", en: "Rebuild", pt: "Reconstrução" }, range: "M2–M4", focus: { fr: "Routine quotidienne complète", en: "Full daily routine", pt: "Rotina diária completa" } },
      { id: "p3", name: { fr: "Anti-récidive", en: "Anti-recurrence", pt: "Anti-recidiva" }, range: "M4+", focus: { fr: "Move™, Pro-B™, Absorbent-D™, Calcium™", en: "Move™, Pro-B™, Absorbent-D™, Calcium™", pt: "Move™, Pro-B™, Absorbent-D™, Calcium™" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — à jeun", en: "Morning — fasting", pt: "Manhã — em jejum" }, time: "07:30", items: [
        { p: "Forever Aloe Vera Gel™", dose: { fr: "90 ml pur", en: "90 ml pure", pt: "90 ml puro" }, why: { fr: "Muqueuse intestinale", en: "Gut lining", pt: "Mucosa intestinal" } },
        { p: "Forever Daily™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Carences post-traitement", en: "Post-treatment deficiencies", pt: "Carências pós-tratamento" } },
        { p: "Forever Active Pro-B™", dose: { fr: "1 capsule", en: "1 capsule", pt: "1 cápsula" }, why: { fr: "Reconstitution du microbiome", en: "Microbiome rebuild", pt: "Reconstituição do microbioma" } },
        { p: "Forever Move™", dose: { fr: "2 gélules", en: "2 capsules", pt: "2 cápsulas" }, why: { fr: "Curcumine — synergie tamoxifène", en: "Curcumin — tamoxifen synergy", pt: "Curcumina — sinergia tamoxifeno" } },
        { p: "Forever Focus™", dose: { fr: "2 gélules", en: "2 capsules", pt: "2 cápsulas" }, why: { fr: "Ginkgo — chemo brain", en: "Ginkgo — chemo brain", pt: "Ginkgo — chemo brain" } },
      ] },
      { id: "midi", label: { fr: "Midi — repas", en: "Noon — meal", pt: "Meio-dia — refeição" }, time: "12:30", items: [
        { p: "Forever ARGI+®", dose: { fr: "1 stick", en: "1 stick", pt: "1 stick" }, why: { fr: "Circulation, lymphœdème", en: "Circulation, lymphedema", pt: "Circulação, linfedema" } },
        { p: "Forever Lycium Plus®", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Cellules NK — surveillance immunitaire", en: "NK cells — immune surveillance", pt: "Células NK — vigilância imunitária" } },
        { p: "Forever Marine Collagen™", dose: { fr: "1 stick", en: "1 stick", pt: "1 stick" }, why: { fr: "Cicatrisation, peau, os", en: "Healing, skin, bones", pt: "Cicatrização, pele, ossos" } },
      ] },
      { id: "soir", label: { fr: "Soir — repas & coucher", en: "Evening — meal & bedtime", pt: "Noite — refeição e deitar" }, time: "20:00", items: [
        { p: "Forever Arctic Sea™", dose: { fr: "2 gélules", en: "2 softgels", pt: "2 cápsulas" }, why: { fr: "Oméga-3 — anti-métastatique", en: "Omega-3 — anti-metastatic", pt: "Ómega-3 — anti-metastático" } },
        { p: "Forever Calcium™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Os — priorité inhibiteurs d'aromatase", en: "Bones — aromatase-inhibitor priority", pt: "Ossos — prioridade inibidores de aromatase" } },
        { p: "Forever B12 Plus™", dose: { fr: "1 comprimé", en: "1 tablet", pt: "1 comprimido" }, why: { fr: "Neuropathie, méthylation ADN", en: "Neuropathy, DNA methylation", pt: "Neuropatia, metilação do ADN" } },
      ] },
    ],
    tracking: [
      { fr: "Ostéodensitométrie (annuelle)", en: "Bone density (annual)", pt: "Densitometria óssea (anual)", target: "Stable" },
      { fr: "Énergie / fatigue (0–10)", en: "Energy / fatigue (0–10)", pt: "Energia / fadiga (0–10)", target: "↑" },
      { fr: "Neuropathie (0–10)", en: "Neuropathy (0–10)", pt: "Neuropatia (0–10)", target: "↓" },
    ],
    warnings: [
      { fr: "Montrez cette liste à votre oncologue AVANT de commencer.", en: "Show this list to your oncologist BEFORE starting.", pt: "Mostre esta lista ao seu oncologista ANTES de começar." },
      { fr: "Sous inhibiteurs d'aromatase : Calcium™ + Absorbent-D™ non optionnels, ostéodensitométrie annuelle.", en: "On aromatase inhibitors: Calcium™ + Absorbent-D™ not optional.", pt: "Com inibidores de aromatase: Calcium™ + Absorbent-D™ não opcionais." },
    ],
  },
  {
    id: "stress",
    name: { fr: "Stress & bien-être mental", en: "Stress & mental wellbeing", pt: "Stress e bem-estar mental" },
    icon: "waves",
    accent: "--sky-blue",
    tagline: { fr: "Apaiser le système nerveux, retrouver le calme", en: "Calm the nervous system, restore calm", pt: "Acalmar o sistema nervoso, recuperar a calma" },
    overview: {
      fr: "Pivot Forever Focus™ (Rhodiola, Brahmi, L-théanine) + axe intestin-cerveau (Active Pro-B™) + magnésium relaxant le soir.",
      en: "Pivot Forever Focus™ + gut-brain axis + relaxing magnesium at night.",
      pt: "Pivô Forever Focus™ + eixo intestino-cérebro + magnésio relaxante à noite.",
    },
    duration: { fr: "8 semaines + entretien", en: "8 weeks + upkeep", pt: "8 semanas + manutenção" },
    phases: [
      { id: "p1", name: { fr: "Apaisement", en: "Calming", pt: "Acalmar" }, range: "S1–S2", focus: { fr: "Focus™ matin + Calcium™ soir", en: "Focus™ AM + Calcium™ PM", pt: "Focus™ manhã + Calcium™ noite" } },
      { id: "p2", name: { fr: "Axe intestin-cerveau", en: "Gut-brain axis", pt: "Eixo intestino-cérebro" }, range: "S2–S8", focus: { fr: "Active Pro-B™ — sérotonine", en: "Active Pro-B™ — serotonin", pt: "Active Pro-B™ — serotonina" } },
      { id: "p3", name: { fr: "Entretien", en: "Upkeep", pt: "Manutenção" }, range: "S8+", focus: { fr: "Focus™ + Pro-B™ selon besoin", en: "Focus™ + Pro-B™ as needed", pt: "Focus™ + Pro-B™ conforme necessário" } },
    ],
    schedule: [
      { id: "matin", label: { fr: "Matin — repas", en: "Morning — meal", pt: "Manhã — refeição" }, time: "08:00", items: [
        { p: "Forever Focus™", dose: { fr: "2 gélules", en: "2 capsules", pt: "2 cápsulas" }, why: { fr: "Rhodiola + Brahmi + L-théanine", en: "Rhodiola + Brahmi + L-theanine", pt: "Rhodiola + Brahmi + L-teanina" } },
        { p: "Forever Aloe Vera Gel™", dose: { fr: "60 ml", en: "60 ml", pt: "60 ml" }, why: { fr: "Digestion & absorption", en: "Digestion & absorption", pt: "Digestão e absorção" } },
      ] },
      { id: "midi", label: { fr: "Midi — repas", en: "Noon — meal", pt: "Meio-dia — refeição" }, time: "13:00", items: [
        { p: "Forever Active Pro-B™", dose: { fr: "1 capsule", en: "1 capsule", pt: "1 cápsula" }, why: { fr: "95 % de la sérotonine est intestinale", en: "95% of serotonin is gut-made", pt: "95% da serotonina é intestinal" } },
        { p: "Forever NutraQ10™", dose: { fr: "1 stick", en: "1 stick", pt: "1 stick" }, why: { fr: "Magnésium + CoQ10 — énergie", en: "Magnesium + CoQ10 — energy", pt: "Magnésio + CoQ10 — energia" } },
      ] },
      { id: "soir", label: { fr: "Soir — coucher", en: "Evening — bedtime", pt: "Noite — deitar" }, time: "22:00", items: [
        { p: "Forever Calcium™", dose: { fr: "2 comprimés", en: "2 tablets", pt: "2 comprimidos" }, why: { fr: "Magnésium — relaxation, sommeil", en: "Magnesium — relaxation, sleep", pt: "Magnésio — relaxamento, sono" } },
      ] },
    ],
    tracking: [
      { fr: "Niveau de stress ressenti (0–10)", en: "Perceived stress (0–10)", pt: "Stress percebido (0–10)", target: "↓" },
      { fr: "Qualité du sommeil (0–10)", en: "Sleep quality (0–10)", pt: "Qualidade do sono (0–10)", target: "≥ 7" },
      { fr: "Énergie matinale (0–10)", en: "Morning energy (0–10)", pt: "Energia matinal (0–10)", target: "↑" },
    ],
    warnings: [
      { fr: "Désespoir profond ou pensées envahissantes > 2 semaines → consulter un professionnel.", en: "Deep hopelessness or intrusive thoughts > 2 weeks → see a professional.", pt: "Desespero profundo ou pensamentos intrusivos > 2 semanas → consultar um profissional." },
      { fr: "Ces compléments soutiennent le bien-être ; ils ne remplacent pas un accompagnement psychologique.", en: "These supplements support wellbeing; they do not replace psychological support.", pt: "Estes suplementos apoiam o bem-estar; não substituem o acompanhamento psicológico." },
    ],
  },
];

/* ============================================================
   BOUTIQUE — Catalogue produits, prix FCFA, catégories
   ============================================================ */
export const fmtCFA = (n: number): string =>
  String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " FCFA";

export const STORE_CATS: StoreCategory[] = [
  { id: "all", fr: "Tout", en: "All", pt: "Tudo" },
  { id: "aloe", fr: "Aloe", en: "Aloe", pt: "Aloe" },
  { id: "daily", fr: "Quotidien", en: "Daily", pt: "Diário" },
  { id: "targeted", fr: "Ciblé", en: "Targeted", pt: "Específico" },
  { id: "fit", fr: "Forme", en: "Fitness", pt: "Forma" },
  { id: "hive", fr: "Ruche", en: "Bee", pt: "Colmeia" },
  { id: "care", fr: "Soins", en: "Body care", pt: "Cuidados" },
  { id: "beauty", fr: "Beauté", en: "Beauty", pt: "Beleza" },
];

const _P = (
  id: string, name: string, cat: string, price: number, size: Loc,
  rating: number, reviews: number, tag: string | null, blurb: Loc, best?: boolean,
): StoreProduct => ({ id, name, cat, price, size, rating, reviews, tag: tag || null, blurb, best: !!best });

type Loc = { fr: string; en: string; pt: string };

export const STORE_PRODUCTS: StoreProduct[] = [
  _P("aloe-vera-gel", "Forever Aloe Vera Gel™", "aloe", 22000, { fr: "1 L", en: "1 L", pt: "1 L" }, 4.9, 214, "best",
    { fr: "99,7 % de gel d'aloès pur, sans conservateurs. Le geste fondateur de chaque cure.", en: "99.7% pure inner-leaf aloe gel, preservative-free.", pt: "99,7% de gel de aloé puro, sem conservantes." }, true),
  _P("aloe-berry-nectar", "Forever Aloe Berry Nectar™", "aloe", 22000, { fr: "1 L", en: "1 L", pt: "1 L" }, 4.8, 156, null,
    { fr: "Aloès, canneberge et pomme — soutient le confort urinaire au quotidien.", en: "Aloe, cranberry and apple — supports daily urinary comfort.", pt: "Aloé, airela e maçã — apoia o conforto urinário diário." }, true),
  _P("daily", "Forever Daily™", "daily", 18000, { fr: "60 cp", en: "60 tabs", pt: "60 cp" }, 4.7, 88, null,
    { fr: "55 nutriments essentiels à diffusion progressive AOS™.", en: "55 essential nutrients with AOS™ time-release delivery.", pt: "55 nutrientes essenciais com libertação progressiva AOS™." }),
  _P("active-pro-b", "Forever Active Pro-B™", "daily", 32000, { fr: "30 caps", en: "30 caps", pt: "30 caps" }, 4.8, 132, null,
    { fr: "6 souches probiotiques, 8 milliards de ferments — l'axe intestin santé.", en: "6 probiotic strains, 8 billion cultures.", pt: "6 estirpes probióticas, 8 mil milhões de fermentos." }, true),
  _P("fields-of-greens", "Forever Fields of Greens®", "daily", 14000, { fr: "80 cp", en: "80 tabs", pt: "80 cp" }, 4.6, 54, null,
    { fr: "Blé, orge et luzerne — un concentré de verdure alcalinisante.", en: "Wheat, barley and alfalfa — an alkalising greens concentrate.", pt: "Trigo, cevada e luzerna — concentrado verde alcalinizante." }),
  _P("fiber", "Forever Fiber™", "daily", 27000, { fr: "30 sticks", en: "30 sticks", pt: "30 sticks" }, 4.7, 76, null,
    { fr: "5 g de fibres solubles par stick — transit et glycémie maîtrisés.", en: "5 g soluble fibre per stick.", pt: "5 g de fibra solúvel por stick." }),
  _P("shape", "Forever Shape®", "fit", 21000, { fr: "60 cp", en: "60 tabs", pt: "60 cp" }, 4.5, 48, null,
    { fr: "Chrome et plantes — soutient la sensibilité à l'insuline et la silhouette.", en: "Chromium and botanicals.", pt: "Crómio e plantas." }),
  _P("argi", "Forever ARGI+®", "fit", 52000, { fr: "30 sticks", en: "30 sticks", pt: "30 sticks" }, 4.9, 167, "best",
    { fr: "5 g de L-arginine + vitamines — circulation et énergie (oxyde nitrique).", en: "5 g L-arginine + vitamins.", pt: "5 g de L-arginina + vitaminas." }, true),
  _P("nutraq10", "Forever NutraQ10™", "fit", 38000, { fr: "30 sticks", en: "30 sticks", pt: "30 sticks" }, 4.7, 41, null,
    { fr: "CoQ10 + magnésium — vitalité cellulaire et soutien cardiaque.", en: "CoQ10 + magnesium.", pt: "CoQ10 + magnésio." }),
  _P("garlic-thyme", "Forever Garlic-Thyme®", "targeted", 16000, { fr: "100 gél", en: "100 softgels", pt: "100 cáps" }, 4.6, 39, null,
    { fr: "Ail et thym inodores — défenses et confort cardiovasculaire.", en: "Odourless garlic and thyme.", pt: "Alho e tomilho inodoros." }),
  _P("arctic-sea", "Forever Arctic Sea™", "targeted", 28000, { fr: "120 gél", en: "120 softgels", pt: "120 cáps" }, 4.8, 121, null,
    { fr: "Oméga-3 EPA/DHA + huile d'olive — cœur, cerveau, articulations.", en: "Omega-3 EPA/DHA + olive oil.", pt: "Ómega-3 EPA/DHA + azeite." }),
  _P("b12-plus", "Forever B12 Plus™", "targeted", 13000, { fr: "60 cp", en: "60 tabs", pt: "60 cp" }, 4.6, 33, null,
    { fr: "Vitamine B12 et acide folique — énergie et système nerveux.", en: "Vitamin B12 and folic acid.", pt: "Vitamina B12 e ácido fólico." }),
  _P("lycium-plus", "Forever Lycium Plus®", "targeted", 24000, { fr: "100 cp", en: "100 tabs", pt: "100 cp" }, 4.7, 45, null,
    { fr: "Baie de Lycium — antioxydant, vision et microcirculation.", en: "Lycium berry — antioxidant.", pt: "Baga de Lycium — antioxidante." }),
  _P("absorbent-d", "Forever Absorbent-D™", "targeted", 15000, { fr: "60 cp", en: "60 tabs", pt: "60 cp" }, 4.7, 58, null,
    { fr: "Vitamine D3 hautement assimilable — immunité et ossature.", en: "Highly absorbable vitamin D3.", pt: "Vitamina D3 altamente assimilável." }),
  _P("absorbent-c", "Forever Absorbent-C™", "targeted", 15000, { fr: "100 cp", en: "100 tabs", pt: "100 cp" }, 4.6, 42, null,
    { fr: "Vitamine C + son d'avoine — défenses et tonus des parois veineuses.", en: "Vitamin C + oat bran.", pt: "Vitamina C + farelo de aveia." }),
  _P("move", "Forever Move™", "targeted", 49000, { fr: "90 gél", en: "90 caps", pt: "90 cáps" }, 4.8, 97, null,
    { fr: "NEM® + curcumine BiovaFlex® — souplesse et confort articulaire.", en: "NEM® + BiovaFlex® curcumin.", pt: "NEM® + curcumina BiovaFlex®." }, true),
  _P("calcium", "Forever Calcium™", "targeted", 19000, { fr: "90 cp", en: "90 tabs", pt: "90 cp" }, 4.6, 51, null,
    { fr: "Calcium, magnésium et vitamine D — os, dents et relaxation.", en: "Calcium, magnesium and vitamin D.", pt: "Cálcio, magnésio e vitamina D." }),
  _P("vitolize-women", "Vitolize™ for Women", "targeted", 26000, { fr: "120 cp", en: "120 tabs", pt: "120 cp" }, 4.7, 64, null,
    { fr: "Plantes et nutriments dédiés à l'équilibre hormonal féminin.", en: "Botanicals and nutrients for female hormonal balance.", pt: "Plantas e nutrientes para o equilíbrio hormonal feminino." }),
  _P("focus", "Forever Focus™", "targeted", 45000, { fr: "120 caps", en: "120 caps", pt: "120 cáps" }, 4.7, 38, null,
    { fr: "Rhodiola, Brahmi et L-théanine — clarté mentale et concentration.", en: "Rhodiola, Brahmi and L-theanine.", pt: "Rhodiola, Brahmi e L-teanina." }),
  _P("bee-pollen", "Forever Bee Pollen®", "hive", 17000, { fr: "100 cp", en: "100 tabs", pt: "100 cp" }, 4.6, 29, null,
    { fr: "Pollen récolté en zones préservées — énergie et vitalité naturelles.", en: "Pollen harvested in pristine areas.", pt: "Pólen colhido em zonas preservadas." }),
  _P("bee-propolis", "Forever Bee Propolis®", "hive", 31000, { fr: "60 cp", en: "60 tabs", pt: "60 cp" }, 4.8, 47, null,
    { fr: "Propolis pure — bouclier naturel des défenses immunitaires.", en: "Pure propolis.", pt: "Própolis pura." }),
  _P("propolis-creme", "Forever Bee Propolis® Creme", "care", 18000, { fr: "113 g", en: "113 g", pt: "113 g" }, 4.7, 35, null,
    { fr: "Crème à la propolis, camomille et aloès — apaise et répare la peau.", en: "Propolis, chamomile and aloe cream.", pt: "Creme de própolis, camomila e aloé." }),
  _P("aloe-first", "Aloe First® (spray)", "care", 20000, { fr: "473 ml", en: "473 ml", pt: "473 ml" }, 4.8, 73, null,
    { fr: "Spray à l'aloès et plantes — premier soin des peaux sensibles.", en: "Aloe and botanicals spray.", pt: "Spray de aloé e plantas." }),
  _P("aloe-vera-gelly", "Aloe Vera Gelly™", "care", 16000, { fr: "118 ml", en: "118 ml", pt: "118 ml" }, 4.8, 112, "best",
    { fr: "Gel d'aloès translucide — hydrate, apaise et accompagne la cicatrisation.", en: "Translucent aloe gel.", pt: "Gel de aloé translúcido." }, true),
  _P("marine-collagen", "Forever Marine Collagen™", "beauty", 46000, { fr: "30 sticks", en: "30 sticks", pt: "30 sticks" }, 4.9, 89, "best",
    { fr: "Peptides de collagène marin + acide hyaluronique — peau, ongles, cheveux.", en: "Marine collagen peptides + hyaluronic acid.", pt: "Péptidos de colagénio marinho + ácido hialurónico." }, true),
];
