import { GrammarLesson } from '../types'

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    id: 'g1',
    title: 'Present Simple vs Present Continuous',
    urduTitle: 'فعل حال مطلق بمقابلہ فعل حال جاری',
    level: 'A1',
    category: 'Tenses',
    estimatedMinutes: 10,
    rule: 'Use Present Simple for daily habits, routines, and universal truths. Use Present Continuous for actions happening right now or temporary situations.',
    ruleUrdu: 'روزمرہ کی عادات اور معمولات کے لیے پریزنٹ سمپل استعمال کریں، اور جو کام ابھی اس وقت ہو رہا ہو اس کے لیے پریزنٹ کنٹینیوئس استعمال کریں۔',
    formula: 'Present Simple: Subject + Verb(s/es) | Present Continuous: Subject + is/am/are + Verb-ing',
    examples: [
      {
        en: 'I drink coffee every morning.',
        ur: 'میں ہر صبح کافی پیتا ہوں۔ (معمول)',
        highlight: 'drink',
      },
      {
        en: 'I am drinking green tea right now.',
        ur: 'میں اس وقت سبز چائے پی رہا ہوں۔ (جاری)',
        highlight: 'am drinking',
      },
      {
        en: 'The sun rises in the east.',
        ur: 'سورج مشرق سے نکلتا ہے۔ (حقیقت)',
        highlight: 'rises',
      },
    ],
    commonMistakes: [
      {
        incorrect: 'I am knowing him very well.',
        correct: 'I know him very well.',
        explanation: 'State verbs (know, believe, want, like) are rarely used in the continuous form.',
        explanationUrdu: 'کیفیت بتانے والے الفاظ جیسے know، like، want کو عموماً ing فارم میں استعمال نہیں کیا جاتا۔',
      },
      {
        incorrect: 'He go to office by metro.',
        correct: 'He goes to office by metro.',
        explanation: 'Third person singular (he/she/it) requires "-s" or "-es" in Present Simple.',
        explanationUrdu: 'He, She, It کے ساتھ فعل میں s یا es کا اضافہ لازمی ہے۔',
      },
    ],
    practiceQuestions: [
      {
        question: 'Look outside! It ________ heavily.',
        options: ['rains', 'is raining', 'was raining', 'rained'],
        correctIndex: 1,
        explanation: '"Look outside!" signals an event happening right now in front of you, so Present Continuous is correct.',
      },
      {
        question: 'She usually ________ up at 6:30 AM on weekdays.',
        options: ['wakes', 'is waking', 'wake', 'waking'],
        correctIndex: 0,
        explanation: '"Usually" indicates a routine habit, so we use Present Simple with third-person "-s": wakes.',
      },
      {
        question: 'Which sentence is grammatically correct?',
        options: [
          'I am understanding this rule clearly.',
          'I understand this rule clearly.',
          'I understands this rule clearly.',
          'I understood this rule now.',
        ],
        correctIndex: 1,
        explanation: '"Understand" is a stative verb expressing a cognitive state, used in Present Simple.',
      },
    ],
  },
  {
    id: 'g2',
    title: 'Prepositions of Place: In, On, At',
    urduTitle: 'حروف ربط: In, On, At کا درست استعمال',
    level: 'A2',
    category: 'Prepositions',
    estimatedMinutes: 8,
    rule: 'Use "IN" for enclosed spaces, cities, and countries. Use "ON" for flat surfaces and streets. Use "AT" for specific points, addresses, and venues.',
    ruleUrdu: 'بند جگہوں اور ممالک کے لیے IN، سطح اور سڑکوں کے لیے ON، اور مخصوص مقامات یا ایڈریس کے لیے AT استعمال کریں۔',
    formula: 'AT (Specific Point) ➔ ON (Surface/Street) ➔ IN (Enclosed/Region)',
    examples: [
      {
        en: 'Meet me at the airport terminal.',
        ur: 'مجھ سے ایئرپورٹ ٹرمینل پر ملیں۔',
        highlight: 'at',
      },
      {
        en: 'Your passport is on the dining table.',
        ur: 'آپ کا پاسپورٹ کھانے کی میز پر ہے۔',
        highlight: 'on',
      },
      {
        en: 'They live in Lahore.',
        ur: 'وہ لاہور میں رہتے ہیں۔',
        highlight: 'in',
      },
    ],
    commonMistakes: [
      {
        incorrect: 'I am at Pakistan right now.',
        correct: 'I am in Pakistan right now.',
        explanation: 'Always use "in" for countries, territories, and cities.',
        explanationUrdu: 'ملکوں اور بڑے شہروں کے ساتھ ہمیشہ "in" استعمال کریں۔',
      },
      {
        incorrect: 'The keys are in the table.',
        correct: 'The keys are on the table.',
        explanation: 'Objects resting on top of a surface use "on", not "in".',
        explanationUrdu: 'کسی سطح کے اوپر چیز رکھنے پر "on" آتا ہے نہ کہ "in"۔',
      },
    ],
    practiceQuestions: [
      {
        question: 'The meeting will take place ________ Room 304.',
        options: ['at', 'in', 'on', 'by'],
        correctIndex: 1,
        explanation: 'A room is an enclosed 3D space, which uses "in".',
      },
      {
        question: 'I saw a great advertisement ________ the billboard.',
        options: ['in', 'at', 'on', 'with'],
        correctIndex: 2,
        explanation: 'A billboard is a surface, which requires "on".',
      },
    ],
  },
  {
    id: 'g3',
    title: 'Modal Verbs: Can, Could, Should, Must',
    urduTitle: 'امدادی افعال: Can, Could, Should, Must کی رہنمائی',
    level: 'B1',
    category: 'Modals',
    estimatedMinutes: 12,
    rule: 'Modals express ability (can/could), advice (should), or strong necessity/obligation (must). They are followed directly by the base verb without "to".',
    ruleUrdu: 'Can/Could صلاحیت، Should مشورہ یا نصیحت، اور Must لازمی ضرورت یا حکم کے لیے استعمال ہوتے ہیں۔ ان کے بعد ہمیشہ ورب کی پہلی فارم بغیر "to" کے آتی ہے۔',
    formula: 'Subject + Modal + Base Verb (V1)',
    examples: [
      {
        en: 'You should practice speaking 15 minutes a day.',
        ur: 'آپ کو روزانہ 15 منٹ بولنے کی مشق کرنی چاہیے۔ (مشورہ)',
        highlight: 'should practice',
      },
      {
        en: 'You must wear a seatbelt while driving.',
        ur: 'ڈرائیونگ کے دوران سیٹ بیلٹ باندھنا لازمی ہے۔ (قانون/حکم)',
        highlight: 'must wear',
      },
      {
        en: 'Could you please repeat that slowly?',
        ur: 'کیا آپ برائے مہربانی اسے آہستہ سے دہرا سکتے ہیں؟ (شائستہ التجا)',
        highlight: 'Could you please repeat',
      },
    ],
    commonMistakes: [
      {
        incorrect: 'You should to sleep early.',
        correct: 'You should sleep early.',
        explanation: 'Never put "to" after modal verbs (except ought to).',
        explanationUrdu: 'Modal verbs کے بعد "to" کبھی نہ لگائیں۔',
      },
      {
        incorrect: 'She can speaks English fluently.',
        correct: 'She can speak English fluently.',
        explanation: 'The verb following a modal verb is always in base form (no "-s" or "-ed").',
        explanationUrdu: 'Modal کے بعد ورب کے ساتھ "s" نہیں لگتا، صرف پہلی فارم آتی ہے۔',
      },
    ],
    practiceQuestions: [
      {
        question: 'You look exhausted. You ________ take a short nap.',
        options: ['must to', 'should', 'could to', 'can to'],
        correctIndex: 1,
        explanation: '"should" is used for friendly advice followed by bare infinitive.',
      },
      {
        question: 'Passengers ________ smoke on the airplane. It is strictly forbidden.',
        options: ['must not', 'should not to', 'cannot to', 'might not'],
        correctIndex: 0,
        explanation: 'For prohibition and safety violations, "must not" (mustn\'t) is required.',
      },
    ],
  },
]
