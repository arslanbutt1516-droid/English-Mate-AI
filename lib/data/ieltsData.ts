import {
  IELTSListeningSection,
  IELTSReadingPassage,
  IELTSWritingPrompt,
  IELTSSpeakingPrompt,
  IELTSPreferences,
} from '../types'

/* =====================================================
   IELTS OFFICIAL BAND CONVERSION CHARTS
   ===================================================== */
export function calculateListeningBand(rawScore: number): number {
  if (rawScore >= 39) return 9.0
  if (rawScore >= 37) return 8.5
  if (rawScore >= 35) return 8.0
  if (rawScore >= 32) return 7.5
  if (rawScore >= 30) return 7.0
  if (rawScore >= 26) return 6.5
  if (rawScore >= 23) return 6.0
  if (rawScore >= 18) return 5.5
  if (rawScore >= 16) return 5.0
  if (rawScore >= 13) return 4.5
  if (rawScore >= 10) return 4.0
  return 3.5
}

export function calculateReadingBandAcademic(rawScore: number): number {
  if (rawScore >= 39) return 9.0
  if (rawScore >= 37) return 8.5
  if (rawScore >= 35) return 8.0
  if (rawScore >= 33) return 7.5
  if (rawScore >= 30) return 7.0
  if (rawScore >= 27) return 6.5
  if (rawScore >= 23) return 6.0
  if (rawScore >= 19) return 5.5
  if (rawScore >= 15) return 5.0
  if (rawScore >= 13) return 4.5
  if (rawScore >= 10) return 4.0
  return 3.5
}

export function calculateReadingBandGeneral(rawScore: number): number {
  if (rawScore >= 40) return 9.0
  if (rawScore >= 39) return 8.5
  if (rawScore >= 37) return 8.0
  if (rawScore >= 36) return 7.5
  if (rawScore >= 34) return 7.0
  if (rawScore >= 32) return 6.5
  if (rawScore >= 30) return 6.0
  if (rawScore >= 27) return 5.5
  if (rawScore >= 23) return 5.0
  if (rawScore >= 19) return 4.5
  if (rawScore >= 15) return 4.0
  return 3.5
}

/* =====================================================
   IELTS STUDY PLANS (7, 14, 30, 60, 90 Days)
   ===================================================== */
export const IELTS_STUDY_PLANS = {
  7: {
    duration: '7-Day Intensive Crash Course',
    focus: 'Exam Format Familiarity & High-Yield Strategy Revision',
    dailyTarget: '2 hours daily',
    schedule: [
      { day: 1, title: 'Orientation & Diagnostic Test', tasks: ['Review test rules & timing', 'Take 1 diagnostic Listening & Reading section'] },
      { day: 2, title: 'Listening Tactics', tasks: ['Section 1 Form completion', 'Section 4 Academic monologues', 'Accents training'] },
      { day: 3, title: 'Reading Mastery', tasks: ['Skimming & Scanning drill', 'True/False/Not Given formula', 'Headings matching'] },
      { day: 4, title: 'Writing Task 1 & Overview', tasks: ['Academic charts & trends', 'General formal letters', 'Model band 8 structures'] },
      { day: 5, title: 'Writing Task 2 Essay Writing', tasks: ['4-paragraph essay template', 'Linking cohesion', 'Brainstorming arguments'] },
      { day: 6, title: 'Speaking Parts 1, 2, 3', tasks: ['Fluency without long pauses', 'Cue card 1-min preparation', 'Abstract Part 3 reasoning'] },
      { day: 7, title: 'Full Timed Mock & Error Analysis', tasks: ['Complete timed mock simulation', 'Review weak areas & strategy checklist'] },
    ],
  },
  14: {
    duration: '14-Day Targeted Skill Booster',
    focus: 'Balanced Practice across All 4 Macro-Skills with Feedback',
    dailyTarget: '90 minutes daily',
    schedule: [
      { day: 1, title: 'Band Requirements & Diagnostic', tasks: ['Understand marking criteria', 'Diagnostic test'] },
      { day: 2, title: 'Listening Sections 1 & 2', tasks: ['Spelling numbers & names', 'Directions and map labelling'] },
      { day: 3, title: 'Listening Sections 3 & 4', tasks: ['Multiple speakers management', 'Fast academic note-taking'] },
      { day: 4, title: 'Reading: Speed & Keywords', tasks: ['Paraphrasing traps', 'Keyword spotting'] },
      { day: 5, title: 'Reading: T/F/NG & Summary Completion', tasks: ['Fact vs opinion differentiation', 'Grammatical fit in summaries'] },
      { day: 6, title: 'Writing Task 1 Academic Graphs', tasks: ['Trend vocabulary (surged, plummeted)', 'Writing a high-scoring overview'] },
      { day: 7, title: 'Writing Task 1 Letters & Maps', tasks: ['Tone matching in letters', 'Spatial language for process maps'] },
      { day: 8, title: 'Writing Task 2: Opinion & Discussion', tasks: ['Thesis statement generation', 'Topic sentences & supporting examples'] },
      { day: 9, title: 'Writing Task 2: Problem-Solution', tasks: ['Developing balanced arguments', 'Avoiding informal vocabulary'] },
      { day: 10, title: 'Speaking Part 1 & Everyday Topics', tasks: ['Expanding answers naturally', 'Avoiding simple yes/no answers'] },
      { day: 11, title: 'Speaking Part 2: Long Turn & Cue Card', tasks: ['Storytelling structure', 'Note-taking in 60 seconds'] },
      { day: 12, title: 'Speaking Part 3: Social Discussion', tasks: ['Giving opinions with nuanced justifications', 'Hypothetical structures'] },
      { day: 13, title: 'Full Mock Test Simulation', tasks: ['Complete 2.5 hour uninterrupted test'] },
      { day: 14, title: 'Final Revision & Strategy Checklist', tasks: ['Review mistake logs', 'Time-management exam day rules'] },
    ],
  },
  30: {
    duration: '30-Day Comprehensive Band 7+ Roadmap',
    focus: 'Deep Vocabulary Acquisition, Systematic Grammar & Full Mocks',
    dailyTarget: '60 minutes daily',
    schedule: [
      { day: 1, title: 'Week 1: Foundations & Diagnostic Assessment', tasks: ['Full diagnostic evaluation', 'Vocabulary notebook setup'] },
      { day: 8, title: 'Week 2: Listening & Reading Deep Dives', tasks: ['Daily section practice', 'Mastering distractors and paraphrases'] },
      { day: 15, title: 'Week 3: Writing Task 1 & 2 Excellence', tasks: ['Mastering all 5 essay structures', 'Task 1 overview formulas'] },
      { day: 22, title: 'Week 4: Speaking Fluency & Advanced Mock Tests', tasks: ['Daily speaking cue cards', 'Timed mock tests with band reports'] },
    ],
  },
}

/* =====================================================
   AUTHENTIC IELTS LISTENING SETS
   ===================================================== */
export const IELTS_LISTENING_SECTIONS: IELTSListeningSection[] = [
  {
    id: 'ils-1',
    sectionNumber: 1,
    title: 'Section 1: Community Sports Club Registration',
    description: 'A conversation between an applicant and a sports club receptionist discussing membership types and facilities.',
    accent: 'British',
    audioVoiceType: 'dialogue',
    audioScript: `Receptionist: Good morning! Welcome to the Greenfield Sports Complex. How can I help you today?
Applicant: Hello! I recently moved to the area and I'm interested in joining the club for fitness and swimming.
Receptionist: Splendid! Let me take down a few details first. May I have your full name, please?
Applicant: Yes, it is David Henderson. That is H-E-N-D-E-R-S-O-N.
Receptionist: Thank you, David. And your primary contact telephone number?
Applicant: It is 07946 228419.
Receptionist: Perfect. Now regarding membership tiers: we have our Gold tier, which includes full gym and Olympic pool access for 45 pounds per month.
Applicant: That sounds reasonable. Does that include weekend tennis court bookings?
Receptionist: Court hire requires a small advance booking fee of 5 pounds during peak weekend hours, but weekdays before 5 PM are completely free.
Applicant: Excellent. When can I schedule my initial gym induction?
Receptionist: We have an available slot this Thursday at 10:30 AM with our certified coach, Sarah.
Applicant: Thursday at 10:30 AM suits me perfectly. Thank you!`,
    questions: [
      {
        id: 'lq-1',
        questionNumber: 1,
        type: 'form-completion',
        prompt: 'Applicant surname: [ 1 ]',
        correctAnswer: 'Henderson',
        acceptableAnswers: ['Henderson', 'henderson'],
        explanation: 'The applicant spells out his surname: H-E-N-D-E-R-S-O-N.',
      },
      {
        id: 'lq-2',
        questionNumber: 2,
        type: 'form-completion',
        prompt: 'Contact telephone number: 07946 [ 2 ]',
        correctAnswer: '228419',
        acceptableAnswers: ['228419', '228 419'],
        explanation: 'The applicant states his number is 07946 228419.',
      },
      {
        id: 'lq-3',
        questionNumber: 3,
        type: 'form-completion',
        prompt: 'Monthly membership fee: £ [ 3 ] per month',
        correctAnswer: '45',
        acceptableAnswers: ['45', 'forty-five', 'forty five'],
        explanation: 'The receptionist confirms the Gold tier fee is 45 pounds per month.',
      },
      {
        id: 'lq-4',
        questionNumber: 4,
        type: 'multiple-choice',
        prompt: 'When are tennis courts free of charge for members?',
        options: [
          'Weekends during morning hours',
          'Weekdays before 5:00 PM',
          'Only on public holidays',
          'Every evening after 8:00 PM',
        ],
        correctAnswer: 'Weekdays before 5:00 PM',
        explanation: 'Receptionist explains: "weekdays before 5 PM are completely free."',
      },
    ],
  },
  {
    id: 'ils-4',
    sectionNumber: 4,
    title: 'Section 4: University Lecture on Deep Sea Bioluminescence',
    description: 'An academic lecture explaining how marine organisms generate biochemical light in total oceanic darkness.',
    accent: 'Australian',
    audioVoiceType: 'monologue',
    audioScript: `Good morning everyone. In today's marine biology seminar, we are exploring one of the ocean's most remarkable evolutionary adaptations: bioluminescence.

Over seventy percent of deep-sea marine species possess the biochemical ability to produce their own light. Unlike terrestrial light sources that generate considerable thermal energy, biological illumination is essentially cold light, wasting virtually no energy as heat.

The core chemical process requires two principal components: a light-emitting substrate called luciferin, and an enzyme known as luciferase. When luciferin reacts with oxygen in the presence of luciferase, photon emissions occur, producing the characteristic blue and green wavelengths that travel farthest through water.

Creatures employ this illumination primarily for three ecological purposes: predator defense, capturing prey, and intra-species communication. For example, the hatchetfish uses counterillumination, emitting ventral light that precisely matches downwelling sunlight, rendering its silhouette invisible to predators hunting from below.`,
    questions: [
      {
        id: 'lq-5',
        questionNumber: 5,
        type: 'note-completion',
        prompt: 'Percentage of deep-sea species capable of bioluminescence: over [ 5 ] percent',
        correctAnswer: '70',
        acceptableAnswers: ['70', 'seventy', '70%'],
        explanation: 'The lecturer notes: "Over seventy percent of deep-sea marine species possess..."',
      },
      {
        id: 'lq-6',
        questionNumber: 6,
        type: 'note-completion',
        prompt: 'Substrate required for light emission: [ 6 ]',
        correctAnswer: 'luciferin',
        acceptableAnswers: ['luciferin'],
        explanation: 'The lecturer identifies the light-emitting substrate as luciferin.',
      },
      {
        id: 'lq-7',
        questionNumber: 7,
        type: 'multiple-choice',
        prompt: 'Why are blue and green light wavelengths predominant in deep-sea organisms?',
        options: [
          'They produce higher heat dissipation',
          'They travel the farthest distance through ocean water',
          'They deter all marine mammals',
          'They are easiest to synthesize without oxygen',
        ],
        correctAnswer: 'They travel the farthest distance through ocean water',
        explanation: 'The lecturer notes that blue and green wavelengths travel farthest through water.',
      },
    ],
  },
]

/* =====================================================
   AUTHENTIC IELTS READING PASSAGES
   ===================================================== */
export const IELTS_READING_PASSAGES: IELTSReadingPassage[] = [
  {
    id: 'irp-acad-1',
    testType: 'Academic',
    passageNumber: 1,
    title: 'Urban Microclimates and the Urban Heat Island Effect',
    urduTitle: 'شہری مائیکرو کلائمیٹ اور گرمی کا اثر',
    topic: 'Environmental Engineering & Urban Planning',
    estimatedMinutes: 20,
    passageText: `Paragraph A:
The phenomenon known as the Urban Heat Island (UHI) effect represents one of the most visible human-induced microclimatic modifications on Earth. Modern metropolitan regions frequently exhibit temperatures between 2°C and 6°C warmer than adjacent rural countryside. This thermal divergence stems primarily from the replacement of natural vegetative land cover with impervious construction materials such as asphalt, concrete, and brick. These materials possess high thermal mass, absorbing vast quantities of solar radiation during daytime hours and reradiating that heat into the lower atmosphere well into the nocturnal cycle.

Paragraph B:
Beyond building materials, the geometrical configuration of modern cities intensifies heat accumulation. High-rise buildings constructed in close proximity create narrow "urban canyons" that restrict natural convective cooling and wind ventilation. Concurrently, anthropogenic heat emissions originating from motor vehicle exhausts, industrial facilities, and building air-conditioning units pump massive thermal loads directly into urban street corridors. Paradoxically, the increased use of air-conditioning systems to achieve indoor comfort exacerbates outdoor thermal distress, producing a self-perpetuating cycle of energetic consumption.

Paragraph C:
The consequences of elevated metropolitan temperatures extend substantially beyond mere thermal discomfort. Public health epidemiological data reveals a direct correlation between sustained heat island episodes and increased hospital admissions for heat-related cardiovascular and respiratory disorders, particularly among elderly and vulnerable demographics. Furthermore, heightened temperatures catalyze photochemical atmospheric reactions, leading to elevated concentrations of ground-level tropospheric ozone and secondary particulate pollutants.

Paragraph D:
In response, contemporary landscape architects and municipal authorities are executing targeted mitigation strategies. Foremost among these is the implementation of extensive urban greening projects, including bioswales, high-canopy street tree planting, and vegetative green roofs. Through the natural biophysical mechanism of evapotranspiration, living plants convert solar energy into water vapor rather than sensible heat, cooling adjacent air parcels by several degrees. Furthermore, the development of high-albedo "cool pavement" materials—which reflect rather than absorb solar radiation—demonstrates promising scalability in reducing urban thermal footprints.`,
    vocabularyList: [
      { word: 'Impervious', meaning: 'Not allowing water or fluid to pass through', urdu: 'غیر نفوذ پذیر / جس سے پانی نہ گزر سکے' },
      { word: 'Anthropogenic', meaning: 'Originating from human activity', urdu: 'انسانی سرگرمیوں سے پیدا شدہ' },
      { word: 'Evapotranspiration', meaning: 'Water loss from soil evaporation and plant transpiration', urdu: 'پودوں اور مٹی سے بخارات کا اخراج' },
      { word: 'Albedo', meaning: 'The proportion of incident light reflected by a surface', urdu: 'سطح سے روشنی کی عکاسی کی شرح' },
    ],
    questions: [
      {
        id: 'rq-1',
        questionNumber: 1,
        type: 'true-false-not-given',
        prompt: 'Concrete and asphalt release stored heat into the air during the night.',
        correctAnswer: 'TRUE',
        explanation: 'Paragraph A states these materials "reradiate that heat into the lower atmosphere well into the nocturnal cycle."',
        evidenceSnippet: 'reradiating that heat into the lower atmosphere well into the nocturnal cycle',
      },
      {
        id: 'rq-2',
        questionNumber: 2,
        type: 'true-false-not-given',
        prompt: 'Air conditioning systems effectively lower outdoor temperatures along street corridors.',
        correctAnswer: 'FALSE',
        explanation: 'Paragraph B explains: "air-conditioning units pump massive thermal loads directly into urban street corridors... exacerbates outdoor thermal distress."',
        evidenceSnippet: 'increased use of air-conditioning systems... exacerbates outdoor thermal distress',
      },
      {
        id: 'rq-3',
        questionNumber: 3,
        type: 'true-false-not-given',
        prompt: 'Green roofs have proven to be more cost-effective than reflective cool pavements.',
        correctAnswer: 'NOT GIVEN',
        explanation: 'Both green roofs and cool pavements are mentioned as mitigations in Paragraph D, but the passage never compares their financial cost.',
      },
      {
        id: 'rq-4',
        questionNumber: 4,
        type: 'matching-headings',
        prompt: 'Which paragraph outlines practical architectural solutions to reduce metropolitan heat?',
        options: ['Paragraph A', 'Paragraph B', 'Paragraph C', 'Paragraph D'],
        correctAnswer: 'Paragraph D',
        explanation: 'Paragraph D discusses targeted mitigation strategies, including green roofs, trees, and high-albedo pavements.',
      },
    ],
  },
  {
    id: 'irp-gen-1',
    testType: 'General',
    passageNumber: 1,
    title: 'Workplace Safety Guidelines: Ergonomics and Computer Use',
    urduTitle: 'دفتر میں صحت اور کمپیوٹر کے استعمال کی حفاظتی ہدایات',
    topic: 'Workplace Health and Administration',
    estimatedMinutes: 15,
    passageText: `Section 1: Workstation Setup
All employees working with visual display terminals (VDTs) for more than four continuous hours per workday must ensure their workstations adhere to company ergonomic standards. 

Your computer monitor must be positioned directly in front of you, approximately an arm's length (50 to 70 centimeters) from your eyes. The top third of the screen should be aligned with or slightly below eye level to minimize cervical neck strain. Employees wearing bifocal lenses may adjust the monitor height downward to maintain a neutral head posture.

Section 2: Seating and Posture
Your office chair must provide adjustable lumbar support conforming to the natural inward curvature of your spine. While typing, elbows should remain bent at roughly a ninety-degree angle, with wrists positioned horizontally rather than bent upward or downward. Feet must rest flat upon the floor; if your chair height prevents your feet from touching the ground comfortably, contact Facilities Management to request an ergonomic footrest.

Section 3: Scheduled Breaks and Eye Care
To prevent repetitive strain injuries (RSI) and visual fatigue, staff are required to observe the 20-20-20 rule. Every twenty minutes of continuous computer engagement, divert your gaze toward an object located at least twenty feet away for a duration of no less than twenty seconds. Additionally, a five-minute change of physical activity (such as standing, walking, or gentle stretching) is recommended every hour.`,
    vocabularyList: [
      { word: 'Ergonomic', meaning: 'Designed for efficiency and comfort in the working environment', urdu: 'آرام دہ اور انسانی ساخت کے موافق' },
      { word: 'Lumbar', meaning: 'Relating to the lower part of the back', urdu: 'کمر کے نچلے حصے سے متعلق' },
      { word: 'Repetitive Strain Injury', meaning: 'Damage to muscles or nerves caused by repetitive movement', urdu: 'مسلسل دہرائی جانے والی حرکت سے پٹھوں کا کھنچاؤ' },
    ],
    questions: [
      {
        id: 'rq-g1',
        questionNumber: 1,
        type: 'sentence-completion',
        prompt: 'The computer monitor should be located roughly an [ 1 ] length from the worker.',
        correctAnswer: "arm's",
        acceptableAnswers: ["arm's", 'arm', "arms'"],
        explanation: 'Section 1 states: "approximately an arm\'s length (50 to 70 centimeters) from your eyes."',
      },
      {
        id: 'rq-g2',
        questionNumber: 2,
        type: 'true-false-not-given',
        prompt: 'Employees must purchase their own footrests if the chair is too elevated.',
        correctAnswer: 'FALSE',
        explanation: 'Section 2 states: "contact Facilities Management to request an ergonomic footrest."',
      },
      {
        id: 'rq-g3',
        questionNumber: 3,
        type: 'multiple-choice',
        prompt: 'According to the 20-20-20 rule, how long should you look away from the monitor?',
        options: ['Twenty minutes', 'Twenty seconds', 'Five minutes', 'Fifty centimeters'],
        correctAnswer: 'Twenty seconds',
        explanation: 'Section 3 explains to look at an object 20 feet away "for a duration of no less than twenty seconds."',
      },
    ],
  },
]

/* =====================================================
   AUTHENTIC IELTS WRITING PROMPTS
   ===================================================== */
export const IELTS_WRITING_PROMPTS: IELTSWritingPrompt[] = [
  {
    id: 'iwp-acad-task1',
    taskType: 'Task 1 Academic',
    chartType: 'Line Graph',
    prompt: 'The graph below illustrates the percentage of energy produced from renewable sources in four European countries between 2000 and 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: [
      'Write at least 150 words.',
      'Spend approximately 20 minutes.',
      'Provide a clear overview identifying the key trends.',
      'Select and highlight relevant data comparisons without listing every figure.',
    ],
    minWords: 150,
    suggestedMinutes: 20,
    keyVocabTips: ['experienced a steady upward trajectory', 'surged significantly', 'stabilized at roughly', 'in stark contrast to'],
    sampleAnswerBand8: `The line graph details the proportion of renewable energy generated across four European nations (Sweden, Germany, Spain, and the UK) over a twenty-year timeframe from 2000 to 2020.

Overall, renewable energy production increased substantially across all four countries throughout the period, with Sweden consistently maintaining the highest proportion and the UK registering the most dramatic acceleration in the final decade.

In 2000, Sweden led the group with approximately 38% of its energy derived from renewables. This figure rose steadily, reaching nearly 55% by 2020. Germany also exhibited uninterrupted growth, climbing from 12% at the start of the period to culminate at 35% in 2020.

Conversely, Spain and the United Kingdom began with comparatively modest shares of 8% and 2% respectively. While Spain experienced fluctuating expansion to peak at roughly 28% by the end of the survey, the UK followed a flat trajectory until 2010 before surging sharply over the final decade to exceed 25% by 2020.`,
  },
  {
    id: 'iwp-gen-task1',
    taskType: 'Task 1 General',
    letterType: 'Formal',
    prompt: 'You recently stayed at a hotel on a business trip and left an important work document behind in your room.\n\nWrite a letter to the hotel manager. In your letter:\n• Explain the details of your stay (dates, room number)\n• Describe the document and where you think you left it\n• Explain why it is urgent and what you would like the manager to do.',
    instructions: [
      'Write at least 150 words.',
      'Spend approximately 20 minutes.',
      'Use an appropriate formal tone (e.g. "Dear Sir or Madam", "Yours faithfully").',
    ],
    minWords: 150,
    suggestedMinutes: 20,
    keyVocabTips: ['I am writing to inquire regarding', 'vital business consequence', 'kindly arrange for courier dispatch'],
    sampleAnswerBand8: `Dear Sir or Madam,

I am writing to seek your urgent assistance regarding an essential business document that I inadvertently left behind in my hotel room following a recent stay at your establishment.

I stayed in Room 412 from Monday, 12th October to Thursday, 15th October, registered under the name Muhammad Rizwan. 

The missing item is a black leather portfolio containing confidential client proposals labeled "Global Tech Initiative 2025" together with several signed non-disclosure agreements. To the best of my recollection, I placed the folder inside the top drawer of the mahogany bedside desk next to the reading lamp.

As this portfolio contains sensitive corporate materials required for an executive presentation this coming Monday, its recovery is of utmost urgency. I would be immensely grateful if you could arrange for housekeeping to inspect the room and contact me immediately on +44 7946 228419 once retrieved. I will gladly cover all courier delivery expenses.

Thank you in advance for your prompt attention to this matter.

Yours faithfully,
Muhammad Rizwan`,
  },
  {
    id: 'iwp-task2-opinion',
    taskType: 'Task 2 Essay',
    essayType: 'Opinion',
    prompt: 'Some people believe that university education should be completely free for all citizens, while others argue that students should pay tuition fees because higher education primarily benefits the individual.\n\nDiscuss both views and give your own opinion.',
    instructions: [
      'Write at least 250 words.',
      'Spend approximately 40 minutes.',
      'Give reasons for your answer and include relevant examples from your knowledge or experience.',
    ],
    minWords: 250,
    suggestedMinutes: 40,
    keyVocabTips: ['socioeconomic mobility', 'equitable access', 'fiscal burden', 'public interest'],
    sampleAnswerBand8: `Whether higher education should be funded by the state or financed by individual undergraduates remains a subject of intense socioeconomic debate. While proponents of tuition fees argue that tertiary qualifications primarily yield personal financial rewards, I firmly believe that higher education should be publicly funded because an educated populace generates overwhelming societal and economic benefits.

Those who advocate for student-funded education argue that university graduates secure significantly higher lifetime earnings than non-graduates. From this perspective, requiring public taxpayers—many of whom have never attended university—to subsidize the future high incomes of doctors, engineers, and corporate executives appears unfair. Furthermore, imposing tuition fees instills financial accountability, encouraging students to approach their degrees with diligence and ensuring that academic institutions retain independent operating revenue to modernize research infrastructure.

Nevertheless, treating tertiary education as a private commodity exacerbates social inequality. When universities charge exorbitant tuition fees, capable students from underprivileged socioeconomic backgrounds are deterred by the prospect of lifelong debt, stifling meritocracy and social mobility. In contrast, tuition-free higher education ensures that talent alone determines academic opportunity. Countries with free university systems, such as Germany and Norway, boast highly innovative economies, robust civic engagement, and resilient healthcare infrastructures that benefit all citizens regardless of their personal educational attainment.

In conclusion, while the personal advantages of obtaining a degree are undeniable, the public benefits of a highly skilled, equitable workforce far outweigh individual gains. Governments should therefore regard tertiary education as an indispensable social investment rather than a commercial service.`,
  },
]

/* =====================================================
   AUTHENTIC IELTS SPEAKING PROMPTS
   ===================================================== */
export const IELTS_SPEAKING_PROMPTS: IELTSSpeakingPrompt[] = [
  {
    id: 'isp-part1',
    part: 1,
    topic: 'Work, Studies & Daily Routine',
    questions: [
      'Do you work or are you a student?',
      'Why did you choose your current field of work or study?',
      'What is your favorite time of the day to study or work productively?',
      'Do you prefer a strict routine or a flexible schedule?',
    ],
    usefulPhrases: [
      'Currently, I am working as a...',
      'What primarily attracted me to this domain was...',
      'I tend to be most productive during the early morning hours because...',
      'To be completely honest, I lean toward having a structured routine.',
    ],
    sampleAnswer: 'Currently, I am working as a software professional while simultaneously preparing for international examinations. What primarily attracted me to this domain was the creative problem-solving element. I tend to be most productive during early mornings when there are minimal distractions.',
  },
  {
    id: 'isp-part2',
    part: 2,
    topic: 'Describe a skill you learned that proved valuable in your life',
    cueCard: {
      topic: 'Describe a useful skill you learned that you found valuable.',
      bulletPoints: [
        'What the skill was and who taught it to you',
        'How long it took you to learn it',
        'How you practice and use this skill today',
        'And explain why you consider this skill so important to your personal growth.',
      ],
      followUpQuestion: 'Do you believe young people today are learning practical life skills early enough?',
    },
    usefulPhrases: [
      'I would like to talk about...',
      'It required considerable persistence initially...',
      'In today’s fast-paced environment, this capability has proven indispensable...',
      'Looking back, it marked a turning point in my personal development.',
    ],
    sampleAnswer: 'I would like to speak about learning public speaking and presentation skills. Initially, I suffered from severe anxiety whenever I had to address a group. However, during my second year at university, a supportive mentor encouraged me to join a debate society. Over the course of twelve months, through regular feedback, I learned how to structure arguments, control breathing, and maintain eye contact. Today, this skill has proven invaluable in interviews and workplace negotiations.',
  },
  {
    id: 'isp-part3',
    part: 3,
    topic: 'Education, Technology & Future Skills',
    questions: [
      'Which skills do you think will become most essential for the future workplace?',
      'Should schools focus more on academic theory or practical vocational abilities?',
      'How has artificial intelligence changed the way people acquire new knowledge?',
    ],
    usefulPhrases: [
      'In my estimation, adaptable digital literacy combined with critical thinking...',
      'There needs to be a harmonious equilibrium between theoretical rigor and hands-on application...',
      'Rather than replacing human intelligence, modern tools serve as intellectual catalysts...',
    ],
    sampleAnswer: 'In my estimation, adaptability combined with critical thinking will be far more decisive than rote memorization. As automated systems handle repetitive tasks, human workers will be valued primarily for their ability to interpret complex data, collaborate across cultures, and solve nuanced ethical dilemmas.',
  },
]
