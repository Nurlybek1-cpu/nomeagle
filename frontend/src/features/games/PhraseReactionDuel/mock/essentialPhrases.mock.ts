export interface PhraseData {
  phrase: string;
  translation: string;
  audioUrl: string;
  distractors: string[];
  cultureNote: string;
}

export const essentialPhrases: PhraseData[] = [
  // --- Japanese ---
  {
    phrase: "Arigatō",
    translation: "Thank you",
    audioUrl: "/assets/audio/ja/arigato.mp3",
    distractors: ["Konnichiwa", "Sumimasen", "Gomen nasai"],
    cultureNote: "In Japan, a slight bow often accompanies this when expressing gratitude."
  },
  {
    phrase: "Sumimasen",
    translation: "Excuse me / Sorry",
    audioUrl: "/assets/audio/ja/sumimasen.mp3",
    distractors: ["Arigatō", "Oishii", "Hai"],
    cultureNote: "This highly versatile phrase is used to apologize, call for a waiter, or as a polite 'thank you'."
  },
  {
    phrase: "Itadakimasu",
    translation: "Let's eat / I humbly receive",
    audioUrl: "/assets/audio/ja/itadakimasu.mp3",
    distractors: ["Gochisōsama", "Oishii", "Kampai"],
    cultureNote: "Said before eating a meal, placing hands together in appreciation for the food and its preparers."
  },

  // --- Spanish ---
  {
    phrase: "Por favor",
    translation: "Please",
    audioUrl: "/assets/audio/es/por_favor.mp3",
    distractors: ["Gracias", "De nada", "Perdón"],
    cultureNote: "In Spanish-speaking countries, adding this to requests shows basic politeness and respect."
  },
  {
    phrase: "¿Dónde está el baño?",
    translation: "Where is the bathroom?",
    audioUrl: "/assets/audio/es/donde_esta_el_bano.mp3",
    distractors: ["¿Cómo estás?", "¿Cuánto cuesta?", "¿Qué hora es?"],
    cultureNote: "A crucial survival phrase for any traveler navigating a new city."
  },
  {
    phrase: "Mucho gusto",
    translation: "Nice to meet you",
    audioUrl: "/assets/audio/es/mucho_gusto.mp3",
    distractors: ["Buenas noches", "Hasta luego", "Buen provecho"],
    cultureNote: "Commonly accompanied by a handshake or cheek kiss depending on the specific cultural norms of the country."
  },

  // --- Arabic ---
  {
    phrase: "Shukran",
    translation: "Thank you",
    audioUrl: "/assets/audio/ar/shukran.mp3",
    distractors: ["Afwan", "Na'am", "Laa"],
    cultureNote: "To be extra polite, you can place your right hand over your heart while saying this."
  },
  {
    phrase: "Yallah",
    translation: "Let's go / Hurry up",
    audioUrl: "/assets/audio/ar/yallah.mp3",
    distractors: ["Inshallah", "Khalas", "Marhaba"],
    cultureNote: "An everyday colloquial expression used extensively across the Arab world to urge someone."
  },
  {
    phrase: "As-salamu alaykum",
    translation: "Peace be upon you",
    audioUrl: "/assets/audio/ar/as_salamu_alaykum.mp3",
    distractors: ["Sabah al-khayr", "Masa' al-khayr", "Ma'a as-salama"],
    cultureNote: "The standard respectful greeting among Muslims, regardless of the time of day."
  },

  // --- Swahili ---
  {
    phrase: "Hakuna Matata",
    translation: "No worries / No problem",
    audioUrl: "/assets/audio/sw/hakuna_matata.mp3",
    distractors: ["Asante sana", "Karibu", "Tafadhali"],
    cultureNote: "A cheerful, common phrase that epitomizes a relaxed, welcoming attitude in East Africa."
  },
  {
    phrase: "Jambo",
    translation: "Hello",
    audioUrl: "/assets/audio/sw/jambo.mp3",
    distractors: ["Kwa heri", "Habari", "Ndiyo"],
    cultureNote: "The most common and accessible greeting for tourists interacting with locals in Kenya and Tanzania."
  },
  {
    phrase: "Asante sana",
    translation: "Thank you very much",
    audioUrl: "/assets/audio/sw/asante_sana.mp3",
    distractors: ["Tafadhali", "Karibu", "Samahani"],
    cultureNote: "A phrase of deep appreciation, often met with 'Karibu' (You're welcome)."
  },

  // --- French ---
  {
    phrase: "S'il vous plaît",
    translation: "Please (formal)",
    audioUrl: "/assets/audio/fr/sil_vous_plait.mp3",
    distractors: ["Merci beaucoup", "De rien", "Pardon"],
    cultureNote: "Essential for maintaining the expected level of politeness when interacting with strangers or elders in France."
  },
  {
    phrase: "L'addition, s'il vous plaît",
    translation: "The bill, please",
    audioUrl: "/assets/audio/fr/laddition_sil_vous_plait.mp3",
    distractors: ["Où sont les toilettes?", "Je ne comprends pas", "Une carafe d'eau"],
    cultureNote: "In French restaurants, the server will generally not bring the bill until you explicitly ask for it."
  },
  {
    phrase: "Santé",
    translation: "Cheers / To your health",
    audioUrl: "/assets/audio/fr/sante.mp3",
    distractors: ["Bon appétit", "C'est la vie", "Bon voyage"],
    cultureNote: "When clinking glasses, it is customary to maintain eye contact with the other person."
  }
];
