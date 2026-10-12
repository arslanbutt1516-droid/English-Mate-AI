import { ReadingArticle } from '../types'

export const READING_ARTICLES: ReadingArticle[] = [
  {
    id: 'r1',
    title: 'The Art of Active Listening in the Modern Workplace',
    urduTitle: 'جدید کام کی جگہ پر فعال سننے کا ہنر',
    level: 'B1',
    category: 'Workplace & Career',
    readTime: '3 min read',
    content: `Effective communication is widely regarded as the cornerstone of professional success. However, while most employees focus intensely on speaking eloquently, active listening is often the true differentiator between average and exceptional team players.

Active listening requires complete mental engagement. When a colleague or client explains a challenge, an active listener does not mentally rehearse their reply. Instead, they absorb the speaker's core message, observe non-verbal cues, and ask thoughtful clarifying questions before proposing solutions.

Cultivating this habit eliminates costly misunderstandings, builds deep interpersonal trust, and accelerates career progression. By consciously pausing, paraphrasing what you heard, and validating other perspectives, you transform routine meetings into collaborative breakthroughs.`,
    vocabularyHints: [
      { word: 'cornerstone', meaning: 'an essential foundation', urdu: 'بنیادی ستون / سنگ بنیاد' },
      { word: 'eloquently', meaning: 'speaking fluently and persuasively', urdu: 'فصاحت و بلاغت سے' },
      { word: 'rehearse', meaning: 'practice or prepare in advance', urdu: 'ذہن میں دہرانا / ریہرسل کرنا' },
      { word: 'paraphrasing', meaning: 'rephrasing someone else\'s words in your own speech', urdu: 'اپنے الفاظ میں بیان کرنا' },
    ],
    quiz: [
      {
        question: 'According to the article, what is often the differentiator between average and exceptional team players?',
        options: ['Speaking quickly without pauses', 'Active listening', 'Sending lengthy emails', 'Working overtime'],
        correctIndex: 1,
        explanation: 'The passage explicitly states that active listening is the differentiator between average and exceptional team players.',
      },
      {
        question: 'What does an active listener avoid doing while someone else is speaking?',
        options: [
          'Mentally rehearsing their reply',
          'Observing non-verbal cues',
          'Asking clarifying questions',
          'Absorbing the core message',
        ],
        correctIndex: 0,
        explanation: 'Active listeners do not mentally rehearse their reply while the speaker is talking; they stay fully engaged.',
      },
    ],
  },
  {
    id: 'r2',
    title: 'Morning Routines of High Achievers',
    urduTitle: 'کامیاب لوگوں کے صبح کے معمولات',
    level: 'A2',
    category: 'Lifestyle & Habit',
    readTime: '2 min read',
    content: `How you start your morning frequently determines the productivity of your entire day. Psychological studies demonstrate that high achievers establish intentional morning routines that reduce cognitive fatigue.

First, rather than checking social media notifications immediately upon waking, top performers hydrate their bodies and engage in light physical movement or stretching. Second, they dedicate at least fifteen minutes to focused learning or reading before daily chaos begins.

By controlling the first hour of your day, you establish an emotional anchor of calm confidence. Small daily habits repeated consistently compound into profound long-term growth.`,
    vocabularyHints: [
      { word: 'fatigue', meaning: 'extreme tiredness or mental exhaustion', urdu: 'تھکاوٹ / ذہنی ماندگی' },
      { word: 'intentional', meaning: 'done with purpose on deliberately', urdu: 'سوچ سمجھ کر / بامقصد' },
      { word: 'compound', meaning: 'increase and multiply over time', urdu: 'آہستہ آہستہ ضرب ہونا / بڑھنا' },
    ],
    quiz: [
      {
        question: 'What do high achievers avoid doing immediately upon waking?',
        options: ['Drinking water', 'Stretching their muscles', 'Checking social media notifications', 'Planning their day'],
        correctIndex: 2,
        explanation: 'The passage highlights that high achievers avoid immediately scrolling notifications upon waking.',
      },
      {
        question: 'What is the benefit of controlling the first hour of your day?',
        options: [
          'It guarantees winning the lottery',
          'It establishes an anchor of calm confidence',
          'It allows you to skip breakfast',
          'It eliminates the need to sleep',
        ],
        correctIndex: 1,
        explanation: 'Controlling the first hour builds an emotional anchor of calm confidence and sets a productive tone.',
      },
    ],
  },
]
