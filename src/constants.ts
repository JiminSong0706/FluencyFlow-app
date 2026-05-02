/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Strategy, Scenario, Level } from './types';

export const LEVELS: Record<Level, { minTurns: number; description: string; tutorProfile: string }> = {
  Beginner: { 
    minTurns: 5, 
    description: 'Pre-A1 to A1: Basic everyday needs. Short sentences, simple words, and one question at a time.',
    tutorProfile: 'Speak using very simple, short sentences. Use limited vocabulary within middle school band A. ASK ONLY ONE QUESTION AT A TIME.'
  },
  Intermediate: { 
    minTurns: 7, 
    description: 'A2 to B1: Familiar school and daily life. Short explanations and simple reasoning.',
    tutorProfile: 'Speak naturally but clearly using common phrases. Encourage simple explanations and comparisons. Use curriculum vocabulary levels A-B.'
  },
  Advanced: { 
    minTurns: 10, 
    description: 'B1+: Complex opinions and persuasion. Advanced reasoning and reflection.',
    tutorProfile: 'Use natural fluency and idioms within curriculum limits. Encourage clear reasoning, fuller opinions, and persuasion.'
  },
};

export const STRATEGIES: Strategy[] = [
  {
    id: 'circumlocution',
    name: 'Paraphrasing / Circumlocution',
    koreanName: '우회적 표현 / 돌려 말하기',
    description: "특정 단어가 떠오르지 않을 때, 그 단어의 특징, 용도, 모양, 재질 등을 풀어서 설명하는 전략입니다. 원어민들도 자주 사용하는 매우 자연스럽고 고급스러운 전략입니다.",
    starters: ['It\'s a thing that...', 'You use it for...', 'It looks like...', 'How can I say... it\'s like...'],
    whenToUse: '단어 대 단어의 번역을 포기하고, 자신이 가진 기초 어휘력을 총동원하여 의미 자체를 스케치하듯 말하세요.',
    koreanWhenToUse: '특정 단어가 생각나지 않을 때, 그 단어의 특징이나 용도를 상세히 설명해 보세요.',
    examples: [
      { english: "You know, the tool you use to open a wine bottle.", korean: "와인병 열 때 쓰는 그 도구 있잖아. (Corkscrew가 생각 안 날 때)" },
      { english: "The glass thing that tells you if you have a fever.", korean: "열 있는지 알려주는 그 유리로 된 거. (Thermometer가 생각 안 날 때)" }
    ]
  },
  {
    id: 'time_gaining_fillers',
    name: 'Fillers / Stalling',
    koreanName: '채워 넣기 / 시간 끌기',
    description: "다음 할 말을 생각하거나 적절한 단어를 찾을 때, 침묵(Awkward silence)을 피하고 대화의 주도권을 유지하기 위해 사용하는 전략입니다.",
    starters: ['Well...', 'Let me see...', 'You know...', 'I mean...', 'Actually...', 'How can I put this...'],
    whenToUse: '대화가 끊기지 않았다는 신호를 상대방에게 주면서, 머릿속으로 다음 문장을 준비할 시간을 확보하세요.',
    koreanWhenToUse: '적절한 단어나 표현이 바로 생각나지 않아 생각할 시간이 필요할 때 사용하세요.',
    examples: [
      { english: "Well... let me see... I think that's a good idea.", korean: "음... 어디 보자... 제 생각에 그건 좋은 아이디어 같아요." },
      { english: "How can I put this... it's a bit complicated.", korean: "이걸 어떻게 말해야 할까... 조금 복잡하네요." }
    ]
  },
  {
    id: 'approximation',
    name: 'Approximation',
    koreanName: '근접어 사용',
    description: "정확한 단어를 모를 때, 그 단어와 의미상 가장 가깝거나 비슷한 상위/하위 개념의 단어로 대체하여 말하는 전략입니다.",
    starters: ['It\'s like a...', 'Something like...', 'A sort of...', 'It\'s a kind of...'],
    whenToUse: '디테일은 약간 떨어지더라도 핵심 카테고리를 전달하여 상대방이 문맥상 이해할 수 있게 하세요.',
    koreanWhenToUse: '정확한 표현은 모르지만 비슷한 범주의 단어가 떠올릴 때 사용하세요.',
    examples: [
      { english: "I need a water pipe for the garden.", korean: "정원에 쓸 물 파이프(호스)가 필요해요." },
      { english: "I saw a weird bird, like a platypus.", korean: "오리너구리 같은 이상한 새(동물)를 봤어요." },
      { english: "She lives in a very big house.", korean: "그녀는 아주 큰 집(대저택)에 살아요." }
    ]
  },
  {
    id: 'literal_translation_awareness',
    name: 'Literal Translation',
    koreanName: '직역하기 (콩글리시)',
    description: "모국어(한국어)에 있는 단어나 표현, 문법 구조를 영어로 단어 하나하나 그대로 옮겨서 말하는 전략입니다.",
    starters: ['In Korean, we say...', 'I mean, directly...'],
    whenToUse: '영어식 표현을 모르기 때문에 자신이 익숙한 한국어 체계에 기대어 일단 의사소통을 시도할 때 사용합니다.',
    koreanWhenToUse: '원어민 표현이 도무지 생각나지 않아 한국어 표현을 그대로 영어 단어로 바꿔야 할 때 사용하세요.',
    examples: [
      { english: "I like this bean vegetable.", korean: "나는 이 콩 채소(콩나물)를 좋아해요." },
      { english: "I'm going to eat age next month.", korean: "나는 다음 달에 나이를 먹어요(한 살 더 먹어요)." },
      { english: "Let's do some eye shopping.", korean: "아이쇼핑(윈도우 쇼핑) 하러 가요." }
    ]
  },
  {
    id: 'appeal_for_assistance',
    name: 'Appeal for Assistance',
    koreanName: '도움 요청하기',
    description: "대화 상대방에게 직접적으로 정답을 물어보거나 도움을 청해 대화를 지속하는 전략입니다.",
    starters: ['How do you say...?', 'What do you call...?', 'Am I saying this right?', 'Can you help me?'],
    whenToUse: '혼자 해결하려 애쓰기보다, 상대방을 학습 도우미로 활용하여 상호작용하며 문제를 해결하세요.',
    koreanWhenToUse: '더 이상 대화를 이어가기 어렵거나 정확한 표현을 즉시 배우고 싶을 때 사용하세요.',
    examples: [
      { english: "How do you say '사과' in English?", korean: "영어로 '사과'를 어떻게 말해?" },
      { english: "What do you call this in English?", korean: "이거 영어로 뭐라고 불러?" },
      { english: "Am I saying this right?", korean: "나 이거 맞게 말하고 있는 거 맞아?" }
    ]
  },
  {
    id: 'word_coinage',
    name: 'Word-coinage',
    koreanName: '단어 만들어내기',
    description: "존재하지 않는 단어지만, 자신이 알고 있는 영어의 규칙을 적용해 즉석에서 새로운 단어를 창조하는 전략입니다.",
    starters: ['Let\'s call it...', 'I think it\'s a...', 'Maybe it\'s a...'],
    whenToUse: '알고 있는 접미사나 합성어 규칙을 통해 상대방이 뜻을 유추할 수 있는 논리적인 단어를 만들어보세요.',
    koreanWhenToUse: '정확한 명칭은 없지만 논리적인 조합으로 새로운 단어를 만들어낼 수 있을 때 사용하세요.',
    examples: [
      { english: "He is a vegetable-ist.", korean: "그는 채소-가(채식주의자)예요." },
      { english: "I want to play with the airball.", korean: "공기-공(풍선)을 가지고 놀고 싶어요." },
      { english: "Where is the picture-place?", korean: "그림-장소(미술관)가 어디예요?" }
    ]
  },
];

export const FREE_SPEAKING_TOPICS = [
  { id: 'topic_hobbies', title: 'Hobbies', icon: '🎨', prompt: 'What do you like to do in your free time?' },
  { id: 'topic_food', title: 'Food', icon: '🍕', prompt: 'What was your favorite lunch today?' },
  { id: 'topic_school', title: 'School', icon: '🏫', prompt: 'Which subject is your favorite or hardest?' },
  { id: 'topic_dreams', title: 'Dreams', icon: '🌟', prompt: 'What do you want to be in the future?' },
  { id: 'topic_weekend', title: 'Weekend', icon: '🎮', prompt: 'What are your plans for this weekend?' },
  { id: 'topic_music', title: 'Music', icon: '🎵', prompt: 'Who is your favorite singer or idol?' },
  { id: 'topic_travel', title: 'Travel', icon: '✈️', prompt: 'Where do you want to travel most?' }
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'hospital',
    title: 'At the Hospital',
    koreanTitle: '병원에서',
    description: 'Explain your symptoms to a doctor.',
    strategyId: 'circumlocution',
    icon: 'Stethoscope',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    characterName: 'Dr. Smith',
    characterRole: 'Doctor',
    characterImageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['hospital', 'symptoms', 'health', 'medicine'],
    openingLines: {
      Beginner: "Hello. I'm Dr. Smith. How do you feel today?",
      Intermediate: "Hello. I'm Dr. Smith. What brings you in today? Tell me about your pain.",
      Advanced: "Good morning. I'm Dr. Smith. I've reviewed your chart, but could you describe your symptoms in detail and tell me when they started?"
    },
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    koreanTitle: '길 찾기',
    description: 'Find your way to a famous landmark.',
    strategyId: 'time_gaining_fillers',
    icon: 'MapPin',
    imageUrl: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80',
    characterName: 'Alex',
    characterRole: 'Local Resident',
    characterImageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['directions', 'map', 'travel', 'location'],
    openingLines: {
      Beginner: "Hi! Are you lost? Where do you want to go?",
      Intermediate: "Hi there! I see you're looking at the map. Are you looking for a specific place?",
      Advanced: "Excuse me, you look a bit confused by the map. Are you trying to find a landmark? I can help you if you tell me where you're headed."
    },
  },
  {
    id: 'shopping',
    title: 'Shopping for Clothes',
    koreanTitle: '쇼핑하기',
    description: 'Ask about sizes, colors, and prices.',
    strategyId: 'approximation',
    icon: 'ShoppingBag',
    imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    characterName: 'Sarah',
    characterRole: 'Shop Assistant',
    characterImageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['shopping', 'clothes', 'price', 'store'],
    openingLines: {
      Beginner: "Welcome! Do you like this red shirt?",
      Intermediate: "Welcome! Our new collection just arrived. What style are you looking for?",
      Advanced: "Welcome to our store! We have a special promotion today. Is there a specific style or size you'd like to compare with our current display?"
    },
  },
  {
    id: 'restaurant',
    title: 'Ordering Food',
    koreanTitle: '음식 주문하기',
    description: 'Order a meal and ask about ingredients.',
    strategyId: 'literal_translation_awareness',
    icon: 'Utensils',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    characterName: 'Marco',
    characterRole: 'Waiter',
    characterImageUrl: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['restaurant', 'food', 'menu', 'order'],
    openingLines: {
      Beginner: "Hello! Are you hungry? What do you want to eat?",
      Intermediate: "Good evening! Can I start you off with some drinks while you look at the menu?",
      Advanced: "Welcome back! Are you in the mood for our chef's special tonight, or would you like me to explain the new seasonal items on the menu?"
    },
  },
  {
    id: 'airport',
    title: 'At the Airport',
    koreanTitle: '공항에서',
    description: 'Check in for your flight and ask about luggage.',
    strategyId: 'appeal_for_assistance',
    icon: 'Plane',
    imageUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&w=800&q=80',
    characterName: 'Officer Chen',
    characterRole: 'Check-in Agent',
    characterImageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['airport', 'travel', 'flight', 'luggage'],
    openingLines: {
      Beginner: "Hello. Passport, please. Where are you going?",
      Intermediate: "Hello! Welcome to the check-in counter. How many bags are you checking in today?",
      Advanced: "Good morning. Please have your travel documents ready. Since the flight is full, would you like to verify your luggage details and seat preference now?"
    },
  },
  {
    id: 'library',
    title: 'At the Library',
    koreanTitle: '도서관에서',
    description: 'Find a book and ask about borrowing rules.',
    strategyId: 'word_coinage',
    icon: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80',
    characterName: 'Mrs. Higgins',
    characterRole: 'Librarian',
    characterImageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['library', 'books', 'borrow', 'rules'],
    openingLines: {
      Beginner: "Hi. Can I help you? Do you want a book?",
      Intermediate: "Good afternoon. Are you looking for a specific book or do you need help with the borrowing rules?",
      Advanced: "Hello there. Our research section has been updated recently. Are you looking for academic resources, or would you like me to explain our new digital lending policy?"
    },
  },
  {
    id: 'cafe',
    title: 'At a Cafe',
    koreanTitle: '카페에서',
    description: 'Order a drink and ask for a specific custom order.',
    strategyId: 'circumlocution',
    icon: 'Coffee',
    imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    characterName: 'Leo',
    characterRole: 'Barista',
    characterImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['cafe', 'coffee', 'order', 'custom'],
    openingLines: {
      Beginner: "Hi! Coffee? or Tea? What do you want?",
      Intermediate: "Hi! Welcome! What can I get started for you today? Our special is the Caramel Macchiato.",
      Advanced: "Good morning! Welcome to our cafe. Would you like to try our new specialty blend, or do you have a specific flavor profile in mind for your custom order today?"
    },
  },
  {
    id: 'school',
    title: 'At School',
    koreanTitle: '학교에서',
    description: 'Talk with your native English teacher about your weekend.',
    strategyId: 'time_gaining_fillers',
    icon: 'MessageSquare',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    characterName: 'Mr. Johnson',
    characterRole: 'Native Teacher',
    characterImageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&h=400&q=80',
    tags: ['school', 'teacher', 'weekend', 'daily'],
    openingLines: {
      Beginner: "Hi! How was your weekend? Did you play soccer?",
      Intermediate: "Hi! How was your weekend? Tell me one interesting thing you did.",
      Advanced: "Hey there! I hope you had a productive weekend. Could you share your thoughts on the activity you did and how it compares to your usual routine?"
    },
  },
];



