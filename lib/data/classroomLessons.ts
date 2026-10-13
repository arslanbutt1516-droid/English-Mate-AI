import { ClassroomLesson } from '../types'

export const CLASSROOM_LESSONS: ClassroomLesson[] = [
  {
    id: 'cl-1',
    title: 'Present Perfect vs Past Simple',
    urduTitle: 'پریزنٹ پرفیکٹ اور ماضی مطلق میں فرق',
    category: 'grammar',
    level: 'B1',
    teacherAvatarMood: 'explaining',
    speechText: 'Welcome to class! Today we are mastering the difference between the Present Perfect and the Past Simple. Notice how the Present Perfect connects past events to right now, while the Past Simple stays completely in the past.',
    speechUrdu: 'کلاس میں خوش آمدید! آج ہم پریزنٹ پرفیکٹ اور پاسٹ سمپل کا بنیادی فرق سمجھیں گے۔ پریزنٹ پرفیکٹ کا اثر موجودہ وقت سے جڑا ہوتا ہے۔',
    visualKeyword: 'timeline',
    whiteboard: {
      headline: 'Connecting Past Actions to the Present Moment',
      topic: 'Present Perfect vs Past Simple Tenses',
      conceptFormula: 'Past Simple = V2 (Fixed Past Time) | Present Perfect = have/has + V3 (Connection to Now)',
      bulletPoints: [
        'Use Past Simple when you state a specific past time: yesterday, in 2021, two days ago.',
        'Use Present Perfect for life experiences, unfinished time, or when the result matters right now.',
        'Common signal words for Present Perfect: already, yet, never, ever, since, for.',
      ],
      exampleSentences: [
        {
          en: 'I lost my keys yesterday. (Past Simple — specific time)',
          ur: 'میری چابیاں کل کھو گئیں (ماضی میں واقعہ ہوا)۔',
          highlight: 'lost / yesterday',
        },
        {
          en: 'I have lost my keys! I cannot open the door now. (Present Perfect — result matters now)',
          ur: 'میری چابیاں کھو گئی ہیں! اب میں دروازہ نہیں کھول سکتا۔',
          highlight: 'have lost / cannot open now',
        },
      ],
      timelineOrDiagram: {
        title: 'Tense Timeline Comparison',
        steps: [
          { label: 'Past (Finished)', detail: 'Past Simple happened at a closed time in the past.', status: 'past' },
          { label: 'Present Bridge', detail: 'Present Perfect connects the past action to your current reality.', status: 'present' },
          { label: 'Future Continuation', detail: 'Actions that started in past and continue forward.', status: 'future' },
        ],
      },
      grammarTipUrdu: 'اردو میں "میں نے کھانا کھایا" ماضی مطلق ہے، جبکہ "میں کھانا کھا چکا ہوں" پریزنٹ پرفیکٹ ہے۔',
      interactiveQuestion: {
        question: 'Which sentence is grammatically correct for an event with a specific past time?',
        options: [
          'I have seen that movie yesterday.',
          'I saw that movie yesterday.',
          'I had seen that movie since yesterday.',
          'I am seeing that movie yesterday.',
        ],
        correctIndex: 1,
        explanation: 'Because "yesterday" is a specific completed past time, we must use the Past Simple ("saw") instead of the Present Perfect ("have seen").',
      },
    },
  },
  {
    id: 'cl-2',
    title: 'Prepositions of Time: In, On, At',
    urduTitle: 'وقت کے حروفِ جار: In, On, At کا درست استعمال',
    category: 'grammar',
    level: 'A2',
    teacherAvatarMood: 'pointing',
    speechText: 'Hello! Let us look at the whiteboard. Remember the inverted pyramid rule for prepositions: IN for big general times, ON for specific days and dates, and AT for precise clock moments.',
    speechUrdu: 'وائٹ بورڈ پر دیکھیں! وقت کے حروف جار کے لیے اہرام کا اصول یاد رکھیں: IN بڑے اوقات کے لیے، ON دنوں کے لیے، اور AT گھڑی کے معین وقت کے لیے۔',
    visualKeyword: 'clock',
    whiteboard: {
      headline: 'The Inverted Pyramid of Time Prepositions',
      topic: 'Prepositions of Time: IN • ON • AT',
      conceptFormula: 'IN (General: Years, Months, Seasons) → ON (Specific: Days & Dates) → AT (Precise: Clock Times)',
      bulletPoints: [
        'IN: in 2025, in October, in the summer, in the morning.',
        'ON: on Monday, on 15th August, on my birthday, on the weekend (US).',
        'AT: at 9:00 AM, at noon, at midnight, at sunset, at the moment.',
      ],
      exampleSentences: [
        {
          en: 'Our university semester commences in September.',
          ur: 'ہمارا یونیورسٹی سمسٹر ستمبر میں شروع ہوتا ہے۔',
          highlight: 'in September',
        },
        {
          en: 'We have an important project briefing on Wednesday.',
          ur: 'ہماری بدھ کے روز ایک اہم میٹنگ ہے۔',
          highlight: 'on Wednesday',
        },
        {
          en: 'The executive flight arrives at 7:30 PM sharp.',
          ur: 'فلائٹ شام 7:30 بجے ٹھیک پہنچے گی۔',
          highlight: 'at 7:30 PM',
        },
      ],
      timelineOrDiagram: {
        title: 'Pyramid Hierarchy',
        steps: [
          { label: 'IN (Broadest)', detail: 'Centuries, Decades, Years, Months, Weeks' },
          { label: 'ON (More Specific)', detail: 'Days, Dates, Special Holidays' },
          { label: 'AT (Narrowest)', detail: 'Hours, Precise Moments, Clock Times' },
        ],
      },
      grammarTipUrdu: 'یاد رکھیں: رات کے لیے "at night" بولا جاتا ہے جبکہ صبح کے لیے "in the morning"۔',
      interactiveQuestion: {
        question: 'Choose the correct preposition: "The meeting is scheduled ___ Friday morning."',
        options: ['at', 'in', 'on', 'for'],
        correctIndex: 2,
        explanation: 'Whenever a specific day of the week is stated ("Friday morning"), we use "on".',
      },
    },
  },
  {
    id: 'cl-3',
    title: 'IELTS Academic Writing: Describing Trends',
    urduTitle: 'آئلٹس اکیڈمک ٹاسک 1: گراف اور رجحانات بیان کرنا',
    category: 'ielts',
    level: 'B2',
    teacherAvatarMood: 'greeting',
    speechText: 'Welcome candidates! In IELTS Academic Task 1, examiners look for lexical diversity when describing changes over time. Never repeat "went up" and "went down". Use verbs and adverbs with precision.',
    speechUrdu: 'آئلٹس امیدوارو، خوش آمدید! ٹاسک 1 میں صرف "اوپر گیا یا نیچے گیا" کہنے کی بجائے معیاری الفاظ اور رجحانات کا استعمال کریں۔',
    visualKeyword: 'dialogue',
    whiteboard: {
      headline: 'Vocabulary for IELTS Task 1 Trends & Comparisons',
      topic: 'Line Graphs, Bar Charts & Data Trends',
      conceptFormula: 'Subject + Verb + Adverb (e.g. "surged dramatically") OR Adjective + Noun (e.g. "a dramatic surge")',
      bulletPoints: [
        'Upward Trends: surged, rocketed, escalated, climbed steadily, peaked at.',
        'Downward Trends: plummeted, plunged, deteriorated, dwindled to.',
        'Stability: leveled off at, plateaued at, stabilized at, remained constant.',
        'Fluctuation: fluctuated wildly, experienced erratic shifts.',
      ],
      exampleSentences: [
        {
          en: 'Renewable energy adoption experienced a substantial surge between 2010 and 2020.',
          ur: 'قابل تجدید توانائی کے استعمال میں 2010 سے 2020 کے درمیان نمایاں اضافہ دیکھا گیا۔',
          highlight: 'substantial surge',
        },
        {
          en: 'Manufacturing costs plummeted before stabilizing at 15 percent.',
          ur: 'پیداواری اخراجات میں تیزی سے کمی آئی اور پھر وہ 15 فیصد پر مستحکم ہو گئے۔',
          highlight: 'plummeted / stabilizing',
        },
      ],
      grammarTipUrdu: 'آئلٹس ٹاسک 1 میں ہمیشہ ایک جامع اوورویو (Overview) پیراگراف لکھیں جس میں اہم ترین رجحان بیان ہو۔',
      interactiveQuestion: {
        question: 'Which word represents a sudden, steep drop in data?',
        options: ['Fluctuated', 'Plummeted', 'Plateaued', 'Accelerated'],
        correctIndex: 1,
        explanation: '"Plummeted" means dropped steeply and rapidly, perfect for describing dramatic downward data.',
      },
    },
  },
]
