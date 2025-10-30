/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { LanguageCode } from "../i18n";

// A curated list of "banger" words and phrases for the random button and welcome screen, now translated.
const PREDEFINED_WORDS_RAW: Record<LanguageCode, string[]> = {
  en: [
    'Balance', 'Harmony', 'Discord', 'Unity', 'Clarity', 'Ambiguity',
    'Creation', 'Destruction', 'Light', 'Shadow', 'Beginning', 'Ending',
    'Connection', 'Isolation', 'Hope', 'Despair', 'Order and chaos',
    'Sound and silence', 'Dream and reality', 'Time and eternity', 'Zigzag',
    'Waves', 'Spiral', 'Float', 'Melt', 'Gravity', 'Fractal', 'Quantum',
    'Entropy', 'Vortex', 'Resonance', 'Liminal', 'Ephemeral', 'Paradox',
    'Zeitgeist', 'Metamorphosis', 'Synesthesia', 'Recursion', 'Emergence',
    'Wubba lubba dub dub', 'Get schwifty', 'Plumbus', 'Veni, vidi, vici',
    'I think, therefore I am', 'What is the sound of one hand clapping',
    'An exploration of the butterfly effect in daily life',
    'The inherent paradox of a self-aware machine',
    'A conversation between a star and a black hole',
  ],
  es: [
    'Equilibrio', 'Armonía', 'Discordia', 'Unidad', 'Claridad', 'Ambigüedad',
    'Creación', 'Destrucción', 'Luz', 'Sombra', 'Principio', 'Fin',
    'Conexión', 'Aislamiento', 'Esperanza', 'Desesperación', 'Orden y caos',
    'Sonido y silencio', 'Sueño y realidad', 'Tiempo y eternidad', 'Zigzag',
    'Olas', 'Espiral', 'Flotar', 'Derretir', 'Gravedad', 'Fractal', 'Quántico',
    'Entropía', 'Vórtice', 'Resonancia', 'Liminal', 'Efímero', 'Paradoja',
    'Zeitgeist', 'Metamorfosis', 'Sinestesia', 'Recursión', 'Emergencia',
    'Pienso, luego existo', 'Ser o no ser, esa es la cuestión',
    'El sonido de una mano aplaudiendo', 'Una exploración del efecto mariposa en la vida diaria',
  ],
  fr: [
    'Équilibre', 'Harmonie', 'Discorde', 'Unité', 'Clarté', 'Ambigüité',
    'Création', 'Destruction', 'Lumière', 'Ombre', 'Début', 'Fin',
    'Connexion', 'Isolement', 'Espoir', 'Désespoir', 'Ordre et chaos',
    'Son et silence', 'Rêve et réalité', 'Temps et éternité', 'Zigzag',
    'Vagues', 'Spirale', 'Flotter', 'Fondre', 'Gravité', 'Fractale', 'Quantique',
    'Entropie', 'Vortex', 'Résonance', 'Liminal', 'Éphémère', 'Paradoxe',
    'Zeitgeist', 'Métamorphose', 'Synesthésie', 'Récursion', 'Émergence',
    'Je pense, donc je suis', 'Être ou ne pas être, telle est la question',
    'Le bruit d\'une seule main qui applaudit', 'Une exploration de l\'effet papillon au quotidien',
  ],
  de: [
    'Gleichgewicht', 'Harmonie', 'Zwietracht', 'Einheit', 'Klarheit', 'Mehrdeutigkeit',
    'Schöpfung', 'Zerstörung', 'Licht', 'Schatten', 'Anfang', 'Ende',
    'Verbindung', 'Isolation', 'Hoffnung', 'Verzweiflung', 'Ordnung und Chaos',
    'Klang und Stille', 'Traum und Realität', 'Zeit und Ewigkeit', 'Zickzack',
    'Wellen', 'Spirale', 'Schweben', 'Schmelzen', 'Schwerkraft', 'Fraktal', 'Quantum',
    'Entropie', 'Wirbel', 'Resonanz', 'Liminal', 'Vergänglich', 'Paradoxon',
    'Zeitgeist', 'Metamorphose', 'Synästhesie', 'Rekursion', 'Emergenz',
    'Ich denke, also bin ich', 'Sein oder Nichtsein, das ist hier die Frage',
    'Der Klang einer klatschenden Hand', 'Eine Untersuchung des Schmetterlingseffekts im täglichen Leben',
  ],
  ja: [
    'バランス', '調和', '不和', '統一', '明快', '曖昧', '創造', '破壊',
    '光', '影', '始まり', '終わり', 'つながり', '孤立', '希望', '絶望',
    '秩序と混沌', '音と沈黙', '夢と現実', '時間と永遠', 'ジグザグ', '波',
    '螺旋', '浮かぶ', '溶ける', '重力', 'フラクタル', '量子', 'エントロピー',
    '渦', '共鳴', '境界', '儚い', '逆説', '時代精神', '変態', '共感覚',
    '再帰', '創発', '我思う、故に我あり', '生きるべきか死ぬべきか、それが問題だ',
    '片手の拍手', '日常生活におけるバタフライ効果の探求',
  ],
  zh: [
    '平衡', '和谐', '冲突', '统一', '清晰', '模糊', '创造', '毁灭',
    '光', '影', '开始', '结束', '连接', '孤立', '希望', '绝望',
    '秩序与混乱', '声音与寂静', '梦想与现实', '时间与永恒', '之字形', '波浪',
    '螺旋', '漂浮', '融化', '引力', '分形', '量子', '熵', '漩涡', '共振',
    '阈限', '短暂', '悖论', '时代精神', '变形', '联觉', '递归', '涌现',
    '我思故我在', '生存还是毁灭，这是一个问题', '单手鼓掌的声音', '探索蝴蝶效应在日常生活中的应用',
  ],
  ar: [
    'توازن', 'انسجام', 'شقاق', 'وحدة', 'وضوح', 'غموض', 'خلق', 'دمار',
    'نور', 'ظل', 'بداية', 'نهاية', 'اتصال', 'عزلة', 'أمل', 'يأس',
    'النظام والفوضى', 'الصوت والصمت', 'الحلم والواقع', 'الزمن والخلود', 'متعرج', 'أمواج',
    'لولب', 'يطفو', 'يذوب', 'جاذبية', 'كسيري', 'كم', 'إنتروبيا', 'دوامة', 'رنين',
    'عتبة', 'عابر', 'مفارقة', 'روح العصر', 'تحول', 'حس مرافق', '재帰', 'انبثاق',
    'أنا أفكر، إذن أنا موجود', 'أكون أو لا أكون، تلك هي المسألة', 'صوت تصفيق اليد الواحدة',
    'استكشاف تأثير الفراشة في الحياة اليومية',
  ],
};

// Programmatically clean the raw data and create unique sets for each language.
export const UNIQUE_WORDS: Record<LanguageCode, string[]> = (Object.keys(PREDEFINED_WORDS_RAW) as LanguageCode[]).reduce((acc, lang) => {
  const cleanedWords = PREDEFINED_WORDS_RAW[lang].map(word => word.trim());
  acc[lang] = [...new Set(cleanedWords)];
  return acc;
}, {} as Record<LanguageCode, string[]>);
