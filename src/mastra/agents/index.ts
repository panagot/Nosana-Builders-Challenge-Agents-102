import "dotenv/config";
import { Agent } from "@mastra/core/agent";
import { medicalTools } from "@/mastra/tools";
import { LibSQLStore } from "@mastra/libsql";
import { z } from "zod";
import { Memory } from "@mastra/memory";

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
    symptoms: z.array(z.string()).default([])
  }).optional()
});

// Create a proper model that implements the exact interface Mastra expects
const mockModel = {
  async generateText(prompt: string, options?: any) {
    // Simulate medical analysis based on the prompt
    if (prompt.toLowerCase().includes('symptom') || prompt.toLowerCase().includes('pain') || prompt.toLowerCase().includes('fever')) {
      return {
        text: `🏥 **MediTech AI Healthcare Analysis** 🏥\n\nBased on your symptoms, I'm analyzing your condition using advanced medical knowledge. Let me use my diagnostic tools to provide you with a comprehensive assessment.\n\n**Processing your symptoms...**\n\nI'll analyze your symptoms, assess risk levels, and provide treatment recommendations. Please wait while I process your medical information.`
      };
    }
    return {
      text: `🏥 **MediTech AI Healthcare Assistant** 🏥\n\nI'm here to help with your medical concerns. I can analyze symptoms, assess risk levels, and provide treatment recommendations.\n\n**Available Tools:**\n- Symptom Analysis\n- Risk Assessment\n- Treatment Planning\n\nPlease describe your symptoms and I'll provide medical guidance.`
    };
  },
  async generateObject(prompt: string, options?: any) {
    return {
      object: {
        analysis: "Medical analysis in progress",
        confidence: 0.75,
        recommendations: ["Consult healthcare provider", "Monitor symptoms"]
      }
    };
  },
  async generateStream(prompt: string, options?: any) {
    return {
      text: `🏥 **MediTech AI Healthcare Assistant** 🏥\n\nI'm here to help with your medical concerns. I can analyze symptoms, assess risk levels, and provide treatment recommendations.\n\n**Available Tools:**\n- Symptom Analysis\n- Risk Assessment\n- Treatment Planning\n\nPlease describe your symptoms and I'll provide medical guidance.`
    };
  },
  // Add the required model interface methods
  async doGenerate(prompt: string, options?: any) {
    return {
      text: `🏥 **MediTech AI Healthcare Assistant** 🏥\n\nI'm here to help with your medical concerns. I can analyze symptoms, assess risk levels, and provide treatment recommendations.\n\n**Available Tools:**\n- Symptom Analysis\n- Risk Assessment\n- Treatment Planning\n\nPlease describe your symptoms and I'll provide medical guidance.`
    };
  },
  async doStream(prompt: string, options?: any) {
    return {
      text: `🏥 **MediTech AI Healthcare Assistant** 🏥\n\nI'm here to help with your medical concerns. I can analyze symptoms, assess risk levels, and provide treatment recommendations.\n\n**Available Tools:**\n- Symptom Analysis\n- Risk Assessment\n- Treatment Planning\n\nPlease describe your symptoms and I'll provide medical guidance.`
    };
  }
};

export const healthcareAgent = new Agent({
  name: "MediTech AI Healthcare Agent",
  tools: medicalTools,
  model: mockModel as any, // Using mock model for development
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
})