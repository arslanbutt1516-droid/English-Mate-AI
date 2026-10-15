import { SpeakingCoachTopic, CEFRLevel } from '../types'

export interface SpeakingTopicConfig {
  id: SpeakingCoachTopic
  title: string
  urduTitle: string
  badge: string
  description: string
  urduDescription: string
  suggestedStarters: string[]
  sampleQuestions: string[]
  iconName: 'MessageCircle' | 'Briefcase' | 'Award' | 'GraduationCap' | 'Heart' | 'Sparkles'
}

export const SPEAKING_TOPICS: SpeakingTopicConfig[] = [
  {
    id: 'daily',
    title: 'Daily Conversation',
    urduTitle: 'روزمرہ گفتگو',
    badge: 'Fluency',
    description: 'Casual speaking about your routine, hobbies, travel, weather, and life in a relaxed setting.',
    urduDescription: 'عام زندگی، شوق، موسم اور سفر کے بارے میں پرسکون ماحول میں بات چیت کریں۔',
    iconName: 'MessageCircle',
    suggestedStarters: [
      'Hello! How was your day today?',
      'I want to talk about my favorite weekend hobby.',
      'Can we discuss the weather and seasonal changes in Pakistan?',
      'I am planning a trip next month and need advice.',
    ],
    sampleQuestions: [
      'What did you do earlier today?',
      'What kind of activities help you unwind on weekends?',
      'Which city or country would you love to explore next?',
    ],
  },
  {
    id: 'workplace',
    title: 'Workplace & Business',
    urduTitle: 'دفتری اور کاروباری انگریزی',
    badge: 'Professional',
    description: 'Master standup updates, emails, polite disagreements, client presentations, and professional etiquette.',
    urduDescription: 'میٹنگز، پراجیکٹ اپ ڈیٹس اور دفتری گفتگو میں بااعتماد اور باوقار انداز اپنائیں۔',
    iconName: 'Briefcase',
    suggestedStarters: [
      'Good morning. I would like to give a project status update.',
      'How should I politely disagree with a colleague during a meeting?',
      'Let us practice negotiating a project deadline extension.',
      'Could you review how I explain a technical delay to a client?',
    ],
    sampleQuestions: [
      'What are your primary milestones for this week?',
      'How do you manage competing deadlines when multiple tasks arise?',
      'How would you explain a software bug or operational delay to leadership?',
    ],
  },
  {
    id: 'interview',
    title: 'Job Interview Practice',
    urduTitle: 'جاب انٹرویو پریکٹس',
    badge: 'Career',
    description: 'Practice the STAR method (Situation, Task, Action, Result) and answer common behavioral interview questions.',
    urduDescription: 'انٹرویو کے مشکل سوالات اور اپنی صلاحیتوں کو STAR فارمولے کے تحت بیان کرنے کی مشق کریں۔',
    iconName: 'Award',
    suggestedStarters: [
      'Please ask me the common question: "Tell me about yourself."',
      'Let us practice: "What is your greatest professional achievement?"',
      'Can you test me on handling workplace conflict under pressure?',
      'I want to practice answering: "Why should we hire you over other candidates?"',
    ],
    sampleQuestions: [
      'Could you introduce your background and core areas of expertise?',
      'Describe a time you solved an unexpected problem under a tight deadline.',
      'Where do you see yourself contributing over the next three to five years?',
    ],
  },
  {
    id: 'ielts',
    title: 'IELTS Speaking Simulation',
    urduTitle: 'آئی ایل ٹی ایس اسپیکنگ',
    badge: 'IELTS',
    description: 'Structured practice for Part 1 (Introduction), Part 2 (Cue Card talk), and Part 3 (Analytical discussion) with rubric feedback.',
    urduDescription: 'آئی ایل ٹی ایس ٹیسٹ کے تینوں حصوں کی جامع پریکٹس اور تعلیمی فیڈ بیک حاصل کریں۔',
    iconName: 'GraduationCap',
    suggestedStarters: [
      'Let us start with IELTS Speaking Part 1 questions about my hometown.',
      'Give me an IELTS Part 2 cue card topic to speak on for 2 minutes.',
      'Let us do IELTS Speaking Part 3 analytical questions on technology.',
      'Please evaluate my fluency and vocabulary for band 7+ criteria.',
    ],
    sampleQuestions: [
      'Do you prefer living in a bustling metropolitan area or a quiet countryside?',
      'How has technology reshaped the way modern communities interact?',
      'Describe an important mentor who influenced your educational or career journey.',
    ],
  },
  {
    id: 'friend',
    title: 'AI Conversation Partner',
    urduTitle: 'اے آئی دوست کے ساتھ آزادانہ گفتگو',
    badge: 'Friendly',
    description: 'An open, welcoming friend to talk about movies, books, food, daily thoughts, or just practice speaking without fear.',
    urduDescription: 'بغیر کسی خوف یا جھجھک کے کسی بھی موضوع پر دوستانہ انداز میں گفتگو کی مشق کریں۔',
    iconName: 'Heart',
    suggestedStarters: [
      'Hi! What kind of books or movies do you enjoy discussing?',
      'I want to share my thoughts on learning a new skill.',
      'What is your opinion on working from home versus office culture?',
      'Tell me something interesting about global cultures and food.',
    ],
    sampleQuestions: [
      'What is something that made you smile or inspired you recently?',
      'If you could pick up any new skill overnight, what would you choose?',
      'What is your favorite comfort food when you have had a long day?',
    ],
  },
  {
    id: 'grammar',
    title: 'Grammar & Precision Polish',
    urduTitle: 'گرامر اور جملوں کی درستی',
    badge: 'Accuracy',
    description: 'Focused speaking where the AI coach analyzes tense consistency, prepositions, articles, and sentence restructuring.',
    urduDescription: 'اپنے بولے گئے جملوں کی گرامر، پریپوزیشنز اور تذکیر و تانیث کی باریکیوں کو درست کریں۔',
    iconName: 'Sparkles',
    suggestedStarters: [
      'Please correct my sentences whenever I make a grammatical slip.',
      'I often get confused between "has been" and "had been". Let us practice.',
      'Help me master correct prepositions when describing times and places.',
      'Check if my passive voice sentences sound natural in spoken English.',
    ],
    sampleQuestions: [
      'Tell me about an event you participated in last year using past tenses.',
      'Explain a daily habit using present tenses with correct subject-verb agreement.',
      'Describe a future ambition using conditional phrases (if / when).',
    ],
  },
]

export const LEVEL_DESCRIPTIONS: Record<CEFRLevel, { label: string; urdu: string; tip: string }> = {
  A1: {
    label: 'A1 - Beginner',
    urdu: 'ابتدائی سطح',
    tip: 'Short, clear sentences with foundational vocabulary and supportive pacing.',
  },
  A2: {
    label: 'A2 - Elementary',
    urdu: 'بنیادی سطح',
    tip: 'Simple conversations with familiar expressions and helpful grammar hints.',
  },
  B1: {
    label: 'B1 - Intermediate',
    urdu: 'درمیانی سطح',
    tip: 'Standard speech on work, study, and leisure with polite phrasing.',
  },
  B2: {
    label: 'B2 - Upper Intermediate',
    urdu: 'اعلیٰ درمیانی سطح',
    tip: 'Fluent conversational exchange, nuanced idiomatic phrases, and clear articulation.',
  },
  C1: {
    label: 'C1 - Advanced',
    urdu: 'ایڈوانس سطح',
    tip: 'Complex professional argumentation, sophisticated vocabulary, and rapid turn-taking.',
  },
  C2: {
    label: 'C2 - Mastery',
    urdu: 'ماہرانہ سطح',
    tip: 'Near-native articulation, effortless cultural idioms, and executive rhetoric.',
  },
}
