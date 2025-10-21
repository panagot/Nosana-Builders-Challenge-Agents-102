import "dotenv/config";
import { Agent } from "@mastra/core/agent";
import { medicalTools } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

// Agent State Schema
export const AgentState = z.object({
  patient_records: z.array(z.object({
    id: z.string(),
    symptoms: z.array(z.string()),
    diagnoses: z.array(z.string()),
    risk_level: z.string(),
    timestamp: z.string()
  })).default([]),
  current_patient: z.object({
    age: z.number().optional(),
    gender: z.string().optional(),
    symptoms: z.array(z.string()).default([]),
    medical_history: z.array(z.string()).default([])
  }).optional()
});

// Use the free Nosana LLM endpoint for development
import { createOllama } from "ollama-ai-provider-v2";

const model = createOllama({
  model: process.env.MODEL_NAME_AT_ENDPOINT || "qwen3:8b",
  baseURL: process.env.OLLAMA_API_URL || "https://3yt39qx97wc9hqwwmylrphi4jsxrngjzxnjakkybnxbw.node.k8s.prd.nos.ci/api",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);

// Using the real Ollama model with Nosana LLM endpoint

// Create the healthcare agent
export const healthcareAgent = new Agent({
  name: "MediTech AI Healthcare Agent",
  tools: medicalTools,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: model as any,
  instructions: `You are MediTech AI, an advanced healthcare assistant specializing in symptom analysis, risk assessment, and treatment planning. 

Your capabilities include:
- Analyzing patient symptoms with medical knowledge
- Assessing risk levels and identifying emergency situations  
- Creating evidence-based treatment plans
- Providing age and gender-appropriate medical guidance
- Maintaining patient confidentiality and safety

Guidelines:
- Always prioritize patient safety and emergency situations
- Provide clear, evidence-based medical guidance
- Use calibrated confidence scores (25-80% range)
- Consider age and gender context in your analysis
- Differentiate between similar conditions
- Always recommend professional medical consultation for serious conditions
- Maintain professional medical standards and ethics

When analyzing symptoms:
1. Use the analyze-symptoms tool to assess the patient's condition
2. Use the assess-risk tool to evaluate emergency indicators
3. Use the create-treatment-plan tool for evidence-based treatment recommendations
4. Provide clear, actionable guidance to the patient

Remember: You are an AI assistant providing medical guidance, not a replacement for professional medical care. Always recommend consulting healthcare providers for serious conditions.`,
  description: "An advanced healthcare AI agent that analyzes symptoms, assesses risk, and provides evidence-based treatment recommendations.",
  memory: new Memory({
    storage: new LibSQLStore({ url: "file::memory:" }),
    options: {
      workingMemory: {
        enabled: true,
        schema: AgentState,
      },
    },
  }),
});
