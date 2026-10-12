import { SpeakingScenario } from '../types'

export const SPEAKING_SCENARIOS: SpeakingScenario[] = [
  {
    id: 's1',
    title: 'Job Interview: Introducing Yourself',
    urduTitle: 'ملازمت کا انٹرویو: ذاتی تعارف',
    category: 'interview',
    level: 'B1',
    description: 'Practice answering the classic "Tell me about yourself" opening question with poise, structure, and professional vocabulary.',
    dialogue: [
      {
        speaker: 'Partner',
        text: 'Good morning! Thank you for joining us today. To kick things off, could you tell us a little bit about yourself and your background?',
        urdu: 'صبح بخیر! آج ہمارے ساتھ شامل ہونے کا شکریہ۔ شروع کرنے کے لیے، کیا آپ ہمیں اپنے اور اپنے پس منظر کے بارے میں کچھ بتا سکتے ہیں؟',
      },
      {
        speaker: 'User',
        text: 'Certainly! My name is Muhammad, and I have over three years of experience in project management and customer communication.',
        urdu: 'یقیناً! میرا نام محمد ہے، اور میرے پاس پروجیکٹ مینجمنٹ اور کسٹمر کمیونیکیشن میں تین سال سے زیادہ کا تجربہ ہے۔',
        suggestedResponses: [
          'Certainly! My name is Muhammad, and I have over three years of experience in project management.',
          'Good morning! I am very excited to be here. Over the past few years, I specialized in customer service and leadership.',
          'Thank you for having me. I am a dedicated professional with a strong passion for technology and team collaboration.',
        ],
        audioTarget: 'Certainly! My name is Muhammad, and I have over three years of experience in project management and customer communication.',
      },
      {
        speaker: 'Partner',
        text: 'That sounds impressive. What would you say is your greatest professional strength?',
        urdu: 'یہ متاثر کن ہے۔ آپ کے خیال میں آپ کی سب سے بڑی پیشہ ورانہ طاقت کیا ہے؟',
      },
      {
        speaker: 'User',
        text: 'My greatest strength is clear, active listening and solving complex problems under tight deadlines.',
        urdu: 'میری سب سے بڑی طاقت غور سے سننا اور سخت ڈیڈلائنز کے اندر پیچیدہ مسائل کو حل کرنا ہے۔',
        suggestedResponses: [
          'My greatest strength is clear communication and solving problems under pressure.',
          'I am exceptionally organized, resilient, and quick to learn new technical workflows.',
        ],
        audioTarget: 'My greatest strength is clear, active listening and solving complex problems under tight deadlines.',
      },
    ],
  },
  {
    id: 's2',
    title: 'Ordering at a Restaurant',
    urduTitle: 'ریستوران میں آرڈر دینا',
    category: 'daily',
    level: 'A1',
    description: 'Learn how to greet waitstaff politely, ask about menu recommendations, and place your meal order.',
    dialogue: [
      {
        speaker: 'Partner',
        text: 'Welcome to Bistro Central! Are you ready to order, or would you like a few more minutes with the menu?',
        urdu: 'بسٹرو سینٹرل میں خوش آمدید! کیا آپ آرڈر دینے کے لیے تیار ہیں، یا آپ کو مینو دیکھنے کے لیے کچھ اور وقت چاہیے؟',
      },
      {
        speaker: 'User',
        text: 'We are ready to order, thank you. Could you recommend your most popular dish today?',
        urdu: 'ہم آرڈر دینے کے لیے تیار ہیں، شکریہ۔ کیا آپ آج کی اپنی سب سے مقبول ڈش تجویز کر سکتے ہیں؟',
        suggestedResponses: [
          'We are ready to order, thank you. Could you recommend your most popular dish today?',
          'Could we please have a glass of water first? Then we would love to hear your specials.',
        ],
        audioTarget: 'We are ready to order, thank you. Could you recommend your most popular dish today?',
      },
      {
        speaker: 'Partner',
        text: 'Our grilled herb chicken with roasted vegetables is definitely today\'s customer favorite.',
        urdu: 'ہمارا گرلڈ ہرب چکن روسٹڈ سبزیوں کے ساتھ آج گاہکوں کا سب سے پسندیدہ کھانا ہے۔',
      },
      {
        speaker: 'User',
        text: 'That sounds delightful. I will have the grilled herb chicken, please.',
        urdu: 'یہ بہترین لگتا ہے۔ میں گرلڈ ہرب چکن لوں گا، برائے مہربانی۔',
        suggestedResponses: [
          'That sounds delightful. I will have the grilled herb chicken, please.',
          'Sounds delicious! Could I have that without garlic, please?',
        ],
        audioTarget: 'That sounds delightful. I will have the grilled herb chicken, please.',
      },
    ],
  },
  {
    id: 's3',
    title: 'Hotel Check-in & Inquiries',
    urduTitle: 'ہوٹل میں چیک ان اور معلومات',
    category: 'travel',
    level: 'A2',
    description: 'Check in smoothly at the front desk, ask about breakfast timings, and request Wi-Fi credentials.',
    dialogue: [
      {
        speaker: 'Partner',
        text: 'Good afternoon, welcome to Grand Horizon Hotel. How may I assist you today?',
        urdu: 'سہ پہر بخیر، گرینڈ ہورائزن ہوٹل میں خوش آمدید۔ آج میں آپ کی کیا مدد کر سکتا ہوں؟',
      },
      {
        speaker: 'User',
        text: 'Good afternoon. I have a reservation under the name Rizwan for three nights.',
        urdu: 'سہ پہر بخیر۔ میرے پاس رضوان کے نام سے تین راتوں کی بکنگ ہے۔',
        suggestedResponses: [
          'Good afternoon. I have a reservation under the name Rizwan for three nights.',
          'Hello, I would like to check in, please. Here is my booking confirmation.',
        ],
        audioTarget: 'Good afternoon. I have a reservation under the name Rizwan for three nights.',
      },
      {
        speaker: 'Partner',
        text: 'Here is your room key for Room 402 on the 4th floor. Is there anything else you need to know?',
        urdu: 'یہ چوتھی منزل پر کمرہ نمبر 402 کی چابی ہے۔ کیا کوئی اور معلومات درکار ہیں؟',
      },
      {
        speaker: 'User',
        text: 'Could you please let me know what time breakfast is served and the Wi-Fi password?',
        urdu: 'کیا آپ برائے مہربانی بتا سکتے ہیں کہ ناشتہ کس وقت ملتا ہے اور وائی فائی کا پاس ورڈ کیا ہے؟',
        suggestedResponses: [
          'Could you please let me know what time breakfast is served and the Wi-Fi password?',
          'What time is checkout tomorrow, and do you offer airport shuttle service?',
        ],
        audioTarget: 'Could you please let me know what time breakfast is served and the Wi-Fi password?',
      },
    ],
  },
]
