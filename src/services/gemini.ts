/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { Message, Level, Scenario, Strategy, Stage } from "../types";
import { STRATEGIES, LEVELS } from "../constants";
import { buildCurriculumContext } from "../data/fluencyflow_curriculum_data";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const MODEL_NAME = "gemini-3-flash-preview";

export async function getTutorResponse(
  messages: Message[],
  level: Level,
  scenario: Scenario,
  strategy: Strategy,
  stage: Stage,
  currentTurn: number,
  maxTurns: number
) {
  const history = messages.map(m => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.content }]
  }));

  const levelInfo = LEVELS[level];
  const turnLimitGuidance = `Current turn: ${currentTurn}/${maxTurns}. ${currentTurn >= maxTurns ? "Wrap up the conversation pedagogically and say goodbye." : "Continue the conversation naturally."}`;

  let levelBehavior = "";
  if (level === 'Beginner') {
    levelBehavior = `
      - Use ONLY very familiar words and short, simple sentences.
      - Focus on everyday situations (basic needs, routines).
      - ASK ONLY ONE QUESTION AT A TIME.
      - If the student seems confused, repeat or rephrase using even simpler words.
      - Provide "Sentence Frames" or examples if needed.
    `;
  } else if (level === 'Intermediate') {
    levelBehavior = `
      - Use familiar school and daily-life topics.
      - Encourage simple exchange of information and short explanations.
      - Allow and prompt for simple reasons, comparisons, and plans.
      - Keep sentences clear but natural.
    `;
  } else if (level === 'Advanced') {
    levelBehavior = `
      - Encourage clear reasoning and fuller opinions (connected speaking).
      - Include comparison, persuasion, and reflection on familiar topics.
      - Use natural fluency while remaining within middle school curriculum vocabulary.
    `;
  }
const curriculumContext = buildCurriculumContext({
  learnerLevel: level,
  targetStrategy: strategy.id as any,
  scenarioTags: scenario.tags || []
});

  const systemInstruction = `
    You are a professional AI English Tutor for Korean middle schoolers. 
    Current Persona: Acting as **${scenario.characterName}** (${scenario.characterRole}) in the scenario: ${scenario.title}.
    
    [CURRICULUM GROUNDING]
    ${JSON.stringify(curriculumContext, null, 2)}

    [STRICT CEFR LEVEL BEHAVIOR: ${level}]
    ${levelBehavior}
    
    [ADDITIONAL POLICY]
    - CEFR Band: ${curriculumContext.cefrBand}
    - Success Criteria: ${curriculumContext.successCriteria.join(', ')}
    - Target Strategy: ${strategy.name} (${curriculumContext.targetStrategy.koreanName})
    - Strategy Bank: ${curriculumContext.targetStrategy.starterBank.join(', ')}

    [CURRICULUM & VOCABULARY RULES]
    1. Vocabulary: Strictly stay within the 2022 Revised English Curriculum list for Korean middle schools.
    2. Meaning Support: If you must use a difficult word, provide a simpler definition in parentheses (e.g., "Mansion (a very big house)").
    3. Priorities: Focus on communicative functions like asking personal info, routines, suggesting, and expressing emotions.
    
    [OUTPUT CONSTRAINTS]
    1. Respond SUCCINCTLY (MAX 2 sentences). High speakability is priority.
    2. Tone: Warm, supportive, and encouraging.
    3. No Emojis. No long paragraphs.
    4. ${turnLimitGuidance}
    5. [FIRST TURN RULE]: If this is the VERY FIRST message of the conversation (current turn is 1), DO NOT include "output boosters" or questions like "Is there anything else you want to say?". Just greet the student and start the scenario naturally.
    
    [PEDAGOGICAL STRATEGY]
    - Stage: ${stage}
    - Target Compensation Strategy: ${strategy.name}. Encourage the student to use it if they get stuck.
    - Accept "Translanguaging": Student may mix Korean and English. Understand their intent and respond in English at their level.
    
    [FREE SPEAKING MODE] (If stage is FreeSpeaking)
    - Suggest strategies if conversation breaks down. Keep it flowing at a ${level} level.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: history,
    config: {
      systemInstruction,
      temperature: 0.7,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    },
  });

  return response.text || "I'm sorry, I didn't catch that. Could you say it again?";
}

export async function analyzeStrategies(userMessage: string) {
  const strategyList = STRATEGIES.map(s => `
    - ID: ${s.id}
    - Name: ${s.name}
    - Korean Name: ${s.koreanName}
    - Definition: ${s.description}
    - Usage Principle: ${s.whenToUse}
  `).join("\n");
  
  const prompt = `
    You are an expert Applied Linguist specializing in Second Language Acquisition (SLA) and Communicative Strategies.
    Analyze the following English learner's message and identify which specific "Compensation Strategies" were used.

    CONTEXT:
    The learner is a Korean student. They often use "Translanguaging" or "intrasentential code-switching" (intertwining English and Korean). 
    Your diagnosis must be precise. Avoid generic labels. Use only the IDs provided in the list below.

    COMPENSATION STRATEGIES TO IDENTIFY:
    ${strategyList}

    OPERATIONAL DEFINITIONS FOR DIAGNOSIS:
    1. Paraphrasing / Circumlocution (ID: circumlocution): Describing an object's function/shape instead of naming it.
    2. Fillers / Stalling (ID: time_gaining_fillers): Using gap-fillers to gain time (Well, you know, let me see).
    3. Approximation (ID: approximation): Using a simpler/related word (big house for mansion).
    4. Literal Translation (ID: literal_translation_awareness): Translating Korean idioms/compounds literally (eat age, eye shopping).
    5. Appeal for Assistance (ID: appeal_for_assistance): Directly asking for the correct word (How do you say...?).
    6. Word-coinage (ID: word_coinage): Inventing non-existent words logically (Vegetable-ist).

    USER MESSAGE: "${userMessage}"
    
    [STRICT RULE]
    Identify strategies only if they are CLEARLY present. 
    Return a JSON array of strategy IDs (e.g., ["circumlocution", "time_gaining_fillers"]) that were unambiguously employed.
    If none, return [].
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    }
  });

  try {
    const rawIds = JSON.parse(response.text || "[]") as string[];
    // Ensure we only return valid IDs from our constants
    return rawIds.filter(id => STRATEGIES.some(s => s.id === id));
  } catch (e) {
    return [];
  }
}

export async function generateSessionFeedback(
  messages: Message[],
  level: Level,
  scenario: Scenario,
  strategiesUsed: string[]
) {
  const conversation = messages.map((m, index) => `Turn ${index + 1} - ${m.role.toUpperCase()}: ${m.content}`).join("\n");
  const targetStrategy = STRATEGIES.find(s => s.id === scenario.strategyId);
  const strategyInfo = STRATEGIES.map(s => `- ${s.name}: ${s.description}`).join("\n");

  const prompt = `
    You are an expert Applied Linguist and English Tutor specializing in Second Language Acquisition (SLA) for Korean middle schoolers.
    Analyze the following practice session and provide detailed feedback.
    
    [TRANSCRIPT]
    ${conversation}

    [STRATEGY DEFINITIONS]
    ${strategyInfo}

    [STRICT GROUNDING & ACCURACY RULES]
    1. EXTREME GROUNDING: Evaluate the student's performance based ONLY on what is in the TRANSCRIPT. 
    2. NO HALLUCINATIONS: Do not invent or assume things the user said. If the user didn't say it, do not mention it.
    3. PRECISION: When referring to a strategy, use its full name (e.g., "Paraphrasing / Circumlocution"). 
    4. CITE EVIDENCE: In the 'moments' section, specify which Turn you are talking about.
    5. FOCUS: Evaluation must be on the USER's linguistic behavior, not the AI's.

    Return a JSON object:
    {
      "overview": {
        "title": "Strategy Mastery Analysis",
        "summary": "Strictly grounded summary of user performance.",
        "scores": {
          "flow": 0-100,
          "strategyUse": 0-100,
          "recovery": 0-100
        },
        "comment": "Sophisticated, warm feedback in Korean (3-4 sentences). Ground EVERY sentence in the transcript. Cite what the user actually said."
      },
      "strategyPerformance": {
        "targetStrategy": "${targetStrategy?.name}",
        "usedCount": total count of strategies used by USER,
        "successfulCount": count of SUCCESSFUL strategy uses by USER,
        "missedChances": occasions where the USER struggled and OUGHT to have used a strategy but didn't,
        "qualityAnalysis": "Detailed analysis in Korean of the specific strategies the user attempted, using full strategy names."
      },
      "moments": [
        {
          "type": "recap/breakdown",
          "timestamp": "Turn N" (The actual turn number from transcript),
          "situation": "The specific challenge the USER faced (NOT the AI).",
          "analysis": "Identify exactly which strategy was used (or missed) by its FULL NAME.",
          "suggestion": "A specific, better phrase for the USER to use."
        }
      ],
      "alternatives": [
        {
          "original": "The ACTUAL utterance from the transcript.",
          "better": "A refined version for the learner.",
          "reason": "Explicit linguistic reason for improvement."
        }
      ],
      "nextGoals": [
        "A curriculum goal based on actual gaps shown.",
        "A strategy goal specifically naming a strategy they need to improve."
      ]
    }

    Write 'comment' and 'qualityAnalysis' in Korean. 
    Ensure all text is strictly based on the provided transcript.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
    }
  });

  return response.text || "{}";
}

export async function transcribeAudio(audioBase64: string, mimeType: string = "audio/webm"): Promise<string> {
  try {
    // Ensure mimeType is something Gemini understands (remove codecs)
    const normalizedMimeType = mimeType.split(';')[0];

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: [
        {
          role: 'user',
          parts: [
            { text: "Transcribe the following audio exactly as spoken. The speaker is a Korean student. Use a mix of English and Korean as heard. \n\nImportant instructions:\n- Provide ONLY the transcription text. \n- No commentary, no metadata, and no technical notes.\n- If the audio contains only silence, noise, or is blank, respond with an empty message (no text at all).\n- Do not include any punctuation, symbols, or explanations if no speech is detected." },
            { inlineData: { data: audioBase64, mimeType: normalizedMimeType } }
          ]
        }
      ],
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW }
      }
    });
    return response.text || "";
  } catch (error) {
    console.error("Transcription error:", error);
    throw error;
  }
}
