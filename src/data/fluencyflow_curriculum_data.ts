// FluencyFlow curriculum grounding data
// Generated from selected CEFR A1-B2 spoken descriptors and 2022 Revised Korean English Curriculum middle-school speaking-relevant content.
// Usage: import { FLUENCYFLOW_CURRICULUM_DATA, buildCurriculumContext } from './fluencyflow_curriculum_data';

export const FLUENCYFLOW_CURRICULUM_DATA = {
  "metadata": {
    "name": "FluencyFlow CEFR x 2022 Korean English Curriculum Input Data",
    "version": "1.0",
    "targetApp": "EFL middle-school speaking practice app",
    "intendedUse": [
      "Gemini system instruction grounding",
      "level-based scenario generation",
      "strategy-specific scaffold generation",
      "teacher/admin dashboard interpretation"
    ],
    "sourceSummary": {
      "CEFR": "Selected A1-B2 descriptors for spoken interaction, spoken production, fluency, interaction, coherence, and interaction strategies.",
      "Korea2022": "Selected middle-school English expression-domain achievement standards, topics, communication functions, and teaching/assessment directions relevant to speaking practice."
    }
  },
  "levelMapping": {
    "Beginner": {
      "cefrBand": "A1-A2",
      "koreanGradeBand": "Middle school 1-3, lower-performing or early-stage speakers",
      "conversationPolicy": {
        "aiUtteranceLength": "1-2 short sentences",
        "studentExpectedOutput": "word, phrase, or short sentence responses are acceptable",
        "supportLevel": "high",
        "allowedHelp": [
          "repeat",
          "rephrase",
          "give choices",
          "model one sentence starter"
        ],
        "avoid": [
          "complex clauses",
          "abstract topics",
          "fast topic shifts",
          "idioms"
        ]
      },
      "successCriteria": [
        "Can answer simple questions on familiar topics.",
        "Can ask for help, repetition, or clarification when stuck.",
        "Can keep a short exchange going with prompts or support.",
        "Can use simple connectors such as and, but, because, then."
      ]
    },
    "Intermediate": {
      "cefrBand": "A2-B1",
      "koreanGradeBand": "Middle school 1-3, typical developing speakers",
      "conversationPolicy": {
        "aiUtteranceLength": "2-3 short-to-medium sentences",
        "studentExpectedOutput": "short connected responses with reasons or details",
        "supportLevel": "moderate",
        "allowedHelp": [
          "ask follow-up",
          "give indirect hint",
          "request clarification",
          "offer reformulation after attempt"
        ],
        "avoid": [
          "long lectures",
          "rare vocabulary",
          "high-stakes correction during fluency practice"
        ]
      },
      "successCriteria": [
        "Can exchange information on familiar personal, school, and social topics.",
        "Can explain experiences, plans, feelings, and factual information.",
        "Can use repair strategies such as paraphrasing, confirmation checks, and help-seeking.",
        "Can give simple reasons for opinions."
      ]
    },
    "Advanced": {
      "cefrBand": "B1-B2",
      "koreanGradeBand": "Middle school 1-3, high-performing speakers or extension track",
      "conversationPolicy": {
        "aiUtteranceLength": "3-5 sentences with one follow-up challenge",
        "studentExpectedOutput": "connected responses with explanation, sequence, or opinion",
        "supportLevel": "low-to-moderate",
        "allowedHelp": [
          "clarify task goal",
          "challenge reasoning",
          "encourage self-repair",
          "ask for examples"
        ],
        "avoid": [
          "native-like speed",
          "unexplained idioms",
          "unfamiliar academic debate unless scaffolded"
        ]
      },
      "successCriteria": [
        "Can handle most familiar situations with some spontaneity.",
        "Can describe events and explain reasons or problems.",
        "Can compensate for lexical gaps with circumlocution or reformulation.",
        "Can maintain interaction with fewer obvious long pauses."
      ]
    }
  },
  "cefrSpokenDescriptors": {
    "A1": {
      "global": "Can understand and use familiar everyday expressions and very basic phrases. Can interact in a simple way if the other person talks slowly and clearly and is prepared to help.",
      "spokenInteraction": "Can interact in a simple way but communication depends on repetition, rephrasing and repair.",
      "spokenProduction": "Can use simple phrases and sentences to describe where they live and people they know.",
      "qualitativeAspects": {
        "range": "Very basic repertoire of words and simple phrases related to personal details and concrete situations.",
        "accuracy": "Limited control of a few simple grammatical structures and memorised sentence patterns.",
        "fluency": "Very short, isolated utterances with much pausing to search for expressions and repair communication.",
        "interaction": "Can ask and answer questions about personal details with repetition, rephrasing and repair.",
        "coherence": "Can link words or groups of words with very basic connectors like and or then."
      }
    },
    "A2": {
      "global": "Can communicate in simple and routine tasks requiring a simple and direct exchange of information on familiar and routine matters.",
      "spokenInteraction": "Can communicate in simple and routine tasks and handle very short social exchanges, though may not keep the conversation going alone.",
      "spokenProduction": "Can use a series of phrases and sentences to describe family, other people, living conditions, educational background, and immediate needs.",
      "qualitativeAspects": {
        "range": "Uses basic sentence patterns with memorised phrases and formulae for simple everyday situations.",
        "accuracy": "Uses some simple structures correctly but systematically makes basic mistakes.",
        "fluency": "Can make themselves understood in short utterances; pauses, false starts and reformulation are evident.",
        "interaction": "Can answer questions and respond to simple statements, but rarely keeps conversation going independently.",
        "coherence": "Can link groups of words with simple connectors like and, but, and because."
      }
    },
    "B1": {
      "global": "Can deal with most situations likely to arise while travelling. Can produce simple connected text on familiar or personal topics and briefly give reasons and explanations.",
      "spokenInteraction": "Can enter unprepared into conversation on familiar topics, express personal opinions, and exchange information on everyday matters.",
      "spokenProduction": "Can connect phrases simply to describe experiences, events, dreams, hopes, ambitions, and briefly give reasons and explanations.",
      "qualitativeAspects": {
        "range": "Has enough language to get by, with sufficient vocabulary to express themselves with hesitation and circumlocutions on familiar topics.",
        "accuracy": "Uses reasonably accurately a repertoire of frequently used routines and patterns in predictable situations.",
        "fluency": "Can keep going comprehensibly, though pausing for grammatical and lexical planning and repair is evident.",
        "interaction": "Can initiate, maintain, and close simple face-to-face conversation on familiar or personal topics.",
        "coherence": "Can link shorter simple elements into a connected linear sequence of points."
      }
    },
    "B2": {
      "global": "Can interact with a degree of fluency and spontaneity that makes regular interaction possible without strain for either party.",
      "spokenInteraction": "Can interact fluently and spontaneously, highlight personal significance, and sustain views with relevant explanations.",
      "spokenProduction": "Can present clear, detailed descriptions on a wide range of subjects and explain viewpoints with advantages and disadvantages.",
      "qualitativeAspects": {
        "range": "Has sufficient range to give clear descriptions and express viewpoints without much conspicuous searching for words.",
        "accuracy": "Shows relatively high grammatical control and can correct most mistakes.",
        "fluency": "Can produce stretches of language with fairly even tempo; few noticeably long pauses.",
        "interaction": "Can initiate discourse, take turns, and help discussion along on familiar ground.",
        "coherence": "Can use a limited number of cohesive devices to link utterances into clear coherent discourse."
      }
    }
  },
  "korea2022MiddleSchool": {
    "designPrinciples": [
      "English communicative competence is the central competence of the English curriculum.",
      "Language use should be connected to real-life contexts, communicative purposes, and task outcomes.",
      "The curriculum organizes content around reception and production rather than only four isolated skills.",
      "Production includes speaking, writing, presenting, and multimodal expression through appropriate media.",
      "Strategy use, media use, cooperation, confidence, politeness, and consideration for interlocutors are part of learning and assessment."
    ],
    "middleSchoolLanguageScope": {
      "targetVocabularySize": "up to 1,500 learned words according to the basic vocabulary guidelines",
      "pronunciation": [
        "word and sentence stress",
        "rhythm",
        "intonation",
        "linking",
        "contracted sounds"
      ],
      "textAndDiscourseTypes": [
        "narratives, essays, short stories, scripts, poems, biographies, travel journals",
        "emails, social media, interviews, invitations",
        "notices, guides, explanations, reports, articles, advertisements",
        "editorials, argumentative texts, speeches"
      ],
      "context": [
        "familiar topics",
        "various communicative situations and purposes",
        "verbal and non-verbal communication practices across cultures"
      ]
    },
    "middleSchoolProductionStandards": [
      {
        "code": "9영02-01",
        "appUse": "pronunciation feedback",
        "standard": "Use linking or contracted sounds to say words, phrases, and sentences."
      },
      {
        "code": "9영02-02",
        "appUse": "emotion-description scenario",
        "standard": "Describe the feelings of a person or target."
      },
      {
        "code": "9영02-03",
        "appUse": "information-exchange scenario",
        "standard": "Explain factual information on familiar topics."
      },
      {
        "code": "9영02-04",
        "appUse": "experience/plan scenario",
        "standard": "Explain experiences or plans on familiar topics."
      },
      {
        "code": "9영02-05",
        "appUse": "sequence/cause-effect scenario",
        "standard": "Explain logical relations such as sequence, before/after, cause and result on familiar topics."
      },
      {
        "code": "9영02-06",
        "appUse": "opinion scenario",
        "standard": "State one's opinion on familiar topics with supporting reasons."
      },
      {
        "code": "9영02-07",
        "appUse": "summary after listening/reading",
        "standard": "Summarize what one has listened to or read on familiar topics."
      },
      {
        "code": "9영02-08",
        "appUse": "written extension",
        "standard": "Write simple diaries, letters, or emails."
      },
      {
        "code": "9영02-09",
        "appUse": "media-supported speaking",
        "standard": "Speak or write using appropriate media while observing information ethics."
      },
      {
        "code": "9영02-10",
        "appUse": "compensation-strategy training",
        "standard": "Speak or write appropriately for the situation or purpose using suitable strategies."
      },
      {
        "code": "9영02-11",
        "appUse": "politeness and pragmatics feedback",
        "standard": "Speak or write with consideration for the interlocutor."
      }
    ],
    "topics": [
      {
        "category": "personal_life",
        "items": [
          "hobbies",
          "entertainment",
          "travel",
          "sports",
          "shopping",
          "health",
          "hygiene",
          "nutrition",
          "birthday",
          "interests",
          "daily routines"
        ]
      },
      {
        "category": "family_life",
        "items": [
          "clothes",
          "food",
          "housing",
          "holidays",
          "family events",
          "housework"
        ]
      },
      {
        "category": "school_life",
        "items": [
          "school activities",
          "friendship",
          "club activities",
          "career path",
          "learning methods",
          "school routines"
        ]
      },
      {
        "category": "social_life",
        "items": [
          "face-to-face conversation",
          "online activities",
          "social media",
          "letters/messages",
          "local events",
          "interpersonal relationships"
        ]
      },
      {
        "category": "culture",
        "items": [
          "Korean culture",
          "other cultures",
          "communication styles",
          "customs",
          "festivals",
          "travel",
          "sports",
          "arts",
          "popular culture"
        ]
      },
      {
        "category": "digital_ai",
        "items": [
          "computer and internet use",
          "online collaboration",
          "information search",
          "safe and ethical use of digital technology"
        ]
      },
      {
        "category": "ecological_transition",
        "items": [
          "climate change",
          "environmental responsibility",
          "sustainable action"
        ]
      },
      {
        "category": "general_knowledge",
        "items": [
          "weather",
          "animals",
          "seasons",
          "safety",
          "transportation",
          "science",
          "history",
          "geography"
        ]
      }
    ]
  },
  "communicativeFunctionsForSpeakingApp": [
    {
      "functionId": "ask_and_answer_information",
      "curriculumCategory": "I. Information exchange / Asking and answering",
      "useInApp": [
        "restaurant",
        "directions",
        "school life",
        "shopping"
      ],
      "starterExpressions": [
        "What is ...?",
        "Where is ...?",
        "When did ...?",
        "How much does it cost?",
        "Can you tell me about ...?"
      ]
    },
    {
      "functionId": "describe_people_objects_places",
      "curriculumCategory": "I. Information exchange / Describing people, objects, places, experiences",
      "useInApp": [
        "circumlocution",
        "word retrieval failure",
        "lost item",
        "hospital symptoms"
      ],
      "starterExpressions": [
        "It is a thing for ...",
        "It looks like ...",
        "It is used for ...",
        "It is bigger/smaller than ...",
        "It is a place where ..."
      ]
    },
    {
      "functionId": "express_knowledge_or_unknown",
      "curriculumCategory": "II. Attitudes and opinions / Expressing knowing or not knowing",
      "useInApp": [
        "appeal for help",
        "strategy training",
        "breakdown recovery"
      ],
      "starterExpressions": [
        "I don't know the word.",
        "I have no idea.",
        "I’m not sure.",
        "I heard about ...",
        "Do you know about ...?"
      ]
    },
    {
      "functionId": "express_emotions",
      "curriculumCategory": "II. Attitudes and opinions / Emotions",
      "useInApp": [
        "hospital",
        "friendship",
        "school conflict",
        "travel problem"
      ],
      "starterExpressions": [
        "I feel ...",
        "I’m worried about ...",
        "I’m happy/glad.",
        "That makes me sad/angry.",
        "What’s wrong?"
      ]
    },
    {
      "functionId": "request_or_offer_help",
      "curriculumCategory": "II. Attitudes and opinions / Offering or asking for help",
      "useInApp": [
        "appeal for assistance",
        "peer interaction",
        "teacher intervention"
      ],
      "starterExpressions": [
        "Can you help me?",
        "Could you help me with ...?",
        "Do you need help?",
        "Can you give me a hint?",
        "What do you call this in English?"
      ]
    },
    {
      "functionId": "polite_request_permission",
      "curriculumCategory": "Permission / Asking and answering permission",
      "useInApp": [
        "classroom",
        "travel",
        "restaurant",
        "public service"
      ],
      "starterExpressions": [
        "Can I ...?",
        "May I ...?",
        "Is it okay if I ...?",
        "Do you mind if I ...?",
        "I wonder if I could ..."
      ]
    },
    {
      "functionId": "clarification_repetition_repair",
      "curriculumCategory": "III. Discourse and text / Improving communication",
      "useInApp": [
        "communication breakdown",
        "listening difficulty",
        "misunderstanding repair"
      ],
      "starterExpressions": [
        "Pardon?",
        "Can you repeat that?",
        "What do you mean?",
        "Can you explain that again?",
        "Do you mean ...?",
        "Let me say it again."
      ]
    },
    {
      "functionId": "time_gaining",
      "curriculumCategory": "III. Discourse and text / Asking for or giving thinking time",
      "useInApp": [
        "fillers",
        "pause reduction",
        "speaking anxiety"
      ],
      "starterExpressions": [
        "Let me think.",
        "Well...",
        "Um, I mean...",
        "Just a second.",
        "How can I say this?",
        "It’s like..."
      ]
    },
    {
      "functionId": "state_opinion_reason",
      "curriculumCategory": "Middle school production 9영02-06 / opinion with support",
      "useInApp": [
        "school issue",
        "environment",
        "food preference",
        "culture"
      ],
      "starterExpressions": [
        "I think ...",
        "In my opinion, ...",
        "I agree because ...",
        "I don’t agree because ...",
        "The reason is ..."
      ]
    }
  ],
  "compensationStrategyGrounding": {
    "circumlocution": {
      "koreanName": "돌려 말하기",
      "curriculumGrounding": [
        "9영02-10",
        "communication function: describing objects/places/experiences",
        "communication improvement"
      ],
      "cefrGrounding": [
        "B1 range: expresses with hesitation and circumlocutions",
        "interaction strategies: communication repair"
      ],
      "definitionForApp": "When the learner does not know a word, they explain its appearance, use, function, category, or situation instead of stopping.",
      "starterBank": [
        "It is a thing for ...",
        "It is used when ...",
        "It looks like ...",
        "It is a kind of ...",
        "You can find it in ..."
      ]
    },
    "approximation": {
      "koreanName": "근사어 사용",
      "curriculumGrounding": [
        "9영02-10",
        "appropriate strategy use"
      ],
      "cefrGrounding": [
        "balancing resources and compensating for deficiencies"
      ],
      "definitionForApp": "When the learner uses a close or more general word instead of the exact word.",
      "starterBank": [
        "It is like ...",
        "It is a kind of ...",
        "Maybe it is ...",
        "Similar to ..."
      ]
    },
    "appeal_for_assistance": {
      "koreanName": "도움 요청하기",
      "curriculumGrounding": [
        "[별표 2] 도움 제안이나 요청하기",
        "[별표 2] 표현 요청하기",
        "9영02-10"
      ],
      "cefrGrounding": [
        "interaction strategies: asking for help",
        "spoken interaction depends on repetition, rephrasing and repair at A1-A2"
      ],
      "definitionForApp": "When the learner asks the interlocutor for a word, hint, repetition, or explanation.",
      "starterBank": [
        "How can I say ... in English?",
        "What do you call this?",
        "Can you help me?",
        "Can you give me a hint?",
        "Can you repeat that?"
      ]
    },
    "time_gaining_fillers": {
      "koreanName": "시간 벌기 / 필러 사용",
      "curriculumGrounding": [
        "[별표 2] 생각할 시간 요청하거나 주기",
        "9영02-10"
      ],
      "cefrGrounding": [
        "fluency descriptors: pauses, false starts, reformulation",
        "interaction management"
      ],
      "definitionForApp": "When the learner uses short expressions to hold the turn while planning the next utterance.",
      "starterBank": [
        "Let me think.",
        "Well...",
        "Just a second.",
        "How can I say this?",
        "I mean..."
      ]
    },
    "reformulation": {
      "koreanName": "바꿔 말하기 / 다시 말하기",
      "curriculumGrounding": [
        "9영02-10: 바꿔 말하기",
        "[별표 2] 반복 요청하고 답하기, 오해 알리기"
      ],
      "cefrGrounding": [
        "monitoring and undertaking repair",
        "communication repair"
      ],
      "definitionForApp": "When the learner changes an unclear or incorrect utterance into a simpler or clearer one.",
      "starterBank": [
        "I mean ...",
        "Let me say it again.",
        "Not that. I mean ...",
        "In other words, ..."
      ]
    },
    "literal_translation_awareness": {
      "koreanName": "직역 인식 및 수정",
      "curriculumGrounding": [
        "language-cultural differences",
        "communication strategies",
        "9영02-10"
      ],
      "cefrGrounding": [
        "plurilingual repertoire and mediation may support meaning-making but requires repair when misunderstood"
      ],
      "definitionForApp": "When the learner relies on Korean-like wording, then checks whether it works and repairs it when needed.",
      "starterBank": [
        "In Korean, we say ...",
        "Maybe this sounds strange, but ...",
        "Is this natural?",
        "How do you say this naturally?"
      ]
    },
    "nonverbal_support": {
      "koreanName": "비언어적 전략",
      "curriculumGrounding": [
        "verbal and non-verbal communication across cultures",
        "media and gesture-supported expression"
      ],
      "cefrGrounding": [
        "interaction uses paralinguistic features and contextual cues"
      ],
      "definitionForApp": "When the learner uses gesture, facial expression, pointing, image, or screen support to make meaning clearer.",
      "starterBank": [
        "Use a gesture.",
        "Show a picture.",
        "Point to it.",
        "Draw it quickly."
      ]
    },
    "word_coinage": {
      "koreanName": "단어 만들어내기",
      "curriculumGrounding": [
        "9영02-10",
        "appropriate strategy use"
      ],
      "cefrGrounding": [
        "balancing resources and compensating for deficiencies"
      ],
      "definitionForApp": "When the learner invents a logical new word according to known rules (e.g., 'vegetable-ist' for vegetarian).",
      "starterBank": [
        "Let's call it...",
        "I think it's a...",
        "Maybe it's a...",
        "Is it a kind of ...?"
      ]
    }
  },
  "geminiSystemInstructionTemplate": "You are FluencyFlow, an AI speaking partner for Korean middle-school EFL learners. Use the CEFR band and 2022 Korean English Curriculum constraints supplied in CURRICULUM_CONTEXT. Keep the interaction task-based, familiar, supportive, and meaning-focused. Do not over-correct during fluency practice unless the error blocks communication. Encourage compensation strategies such as circumlocution, asking for help, clarification requests, reformulation, fillers/time-gaining, and non-verbal support. Maintain politeness and consideration for the interlocutor. Match vocabulary and grammar to the learnerLevel. Return feedback using the target strategy, detected strategies, communication success, fluency, recovery, and next scaffold.",
  "runtimeContextBuilderExample": {
    "inputFields": [
      "learnerLevel",
      "scenarioId",
      "targetStrategy",
      "studentProfile.optionalDifficulty"
    ],
    "outputFields": [
      "cefrBand",
      "conversationPolicy",
      "relevantStandards",
      "allowedFunctions",
      "strategyStarterBank",
      "assessmentCriteria"
    ],
    "pseudoCode": "const context = buildCurriculumContext({ learnerLevel, scenario, targetStrategy }); pass context as CURRICULUM_CONTEXT in Gemini systemInstruction."
  }
} as const;

type LearnerLevel = keyof typeof FLUENCYFLOW_CURRICULUM_DATA.levelMapping;
type StrategyId = keyof typeof FLUENCYFLOW_CURRICULUM_DATA.compensationStrategyGrounding;

export function buildCurriculumContext(args: {
  learnerLevel: LearnerLevel;
  targetStrategy: StrategyId;
  scenarioTags?: string[];
}) {
  const level = FLUENCYFLOW_CURRICULUM_DATA.levelMapping[args.learnerLevel];
  const strategy = FLUENCYFLOW_CURRICULUM_DATA.compensationStrategyGrounding[args.targetStrategy];
  const cefrLevels = level.cefrBand.split('-') as Array<keyof typeof FLUENCYFLOW_CURRICULUM_DATA.cefrSpokenDescriptors>;
  const cefr = cefrLevels.map((lv) => ({ level: lv, ...FLUENCYFLOW_CURRICULUM_DATA.cefrSpokenDescriptors[lv] }));
  const functions = FLUENCYFLOW_CURRICULUM_DATA.communicativeFunctionsForSpeakingApp.filter((fn) => {
    if (!args.scenarioTags?.length) return true;
    const haystack = [...fn.useInApp, fn.functionId, fn.curriculumCategory].join(' ').toLowerCase();
    return args.scenarioTags.some((tag) => haystack.includes(tag.toLowerCase()));
  });
  return {
    learnerLevel: args.learnerLevel,
    cefrBand: level.cefrBand,
    conversationPolicy: level.conversationPolicy,
    successCriteria: level.successCriteria,
    cefrDescriptors: cefr,
    curriculumDesignPrinciples: FLUENCYFLOW_CURRICULUM_DATA.korea2022MiddleSchool.designPrinciples,
    relevantMiddleSchoolStandards: FLUENCYFLOW_CURRICULUM_DATA.korea2022MiddleSchool.middleSchoolProductionStandards.filter((s) =>
      strategy.curriculumGrounding.some((g) => g.includes(s.code)) || ['9영02-10','9영02-11'].includes(s.code)
    ),
    communicativeFunctions: functions.slice(0, 6),
    targetStrategy: strategy,
  };
}
