import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Medical Knowledge Base
const MEDICAL_KNOWLEDGE = {
  conditions: {
    "Viral Upper Respiratory Infection": {
      symptoms: ["fever", "cough", "fatigue", "sore throat"],
      urgency: "routine",
      treatment: "Rest, hydration, fever reducers, monitor symptoms"
    },
    "Influenza": {
      symptoms: ["fever", "cough", "body aches", "fatigue", "headache"],
      urgency: "moderate",
      treatment: "Rest, hydration, antivirals if early, symptom management"
    },
    "Bronchitis": {
      symptoms: ["cough", "chest pain", "fatigue", "fever", "shortness of breath"],
      urgency: "moderate",
      treatment: "Cough suppressants, bronchodilators if needed, rest"
    },
    "Pneumonia": {
      symptoms: ["cough", "chest pain", "fever", "shortness of breath", "fatigue"],
      urgency: "urgent",
      treatment: "Antibiotics, rest, hydration, possible hospitalization"
    },
    "Migraine": {
      symptoms: ["headache", "nausea", "light sensitivity", "fatigue"],
      urgency: "moderate",
      treatment: "Migraine medications, dark room, avoid triggers"
    },
    "Tension Headache": {
      symptoms: ["headache", "neck pain", "stress", "fatigue"],
      urgency: "routine",
      treatment: "OTC analgesics, relaxation techniques, stress management"
    },
    "Anxiety": {
      symptoms: ["worry", "restlessness", "fatigue", "difficulty concentrating"],
      urgency: "routine",
      treatment: "Therapy, relaxation techniques, possible medication"
    },
    "Depression": {
      symptoms: ["sadness", "fatigue", "sleep changes", "appetite changes"],
      urgency: "moderate",
      treatment: "Therapy, medication, lifestyle changes, support"
    }
  },
  symptomPairs: [
    ["headache", "nausea"],
    ["cough", "fever"],
    ["chest pain", "shortness of breath"],
    ["fatigue", "fever"]
  ],
  criticalPairs: [
    ["chest pain", "shortness of breath"]
  ],
  rarity: {
    "pneumonia": 0.4,
    "migraine": 0.3,
    "anxiety": 0.2,
    "depression": 0.3,
    "common cold": 0.1
  }
};

// Helper Functions
function normalizeText(text: string): string {
  return String(text || '').toLowerCase();
}

function matchPatterns(symptomsText: string) {
  const s = normalizeText(symptomsText);
  const tokens = s.split(/[^a-z]+/).filter(Boolean);
  return { s, tokens };
}

function calculateConfidence(condition: string, tokens: string[]): number {
  const info = MEDICAL_KNOWLEDGE.conditions[condition as keyof typeof MEDICAL_KNOWLEDGE.conditions];
  if (!info) return 0;
  
  let direct = 0;
  info.symptoms.forEach((sym: string) => { 
    if (tokens.some(t => sym.includes(t) || t.includes(sym))) direct += 1; 
  });
  
  let base = direct / Math.max(1, info.symptoms.length);
  
  // Phrase-aware boosts
  const text = tokens.join(' ');
  MEDICAL_KNOWLEDGE.symptomPairs.forEach(([a, b]) => {
    const hasPhrases = text.includes(a) && text.includes(b);
    const relevant = info.symptoms.some((x: string) => a.includes(x) || x.includes(a)) && 
                   info.symptoms.some((x: string) => b.includes(x) || x.includes(b));
    if (hasPhrases && relevant) base += 0.2;
  });
  
  // Critical pair boost
  MEDICAL_KNOWLEDGE.criticalPairs.forEach(([a, b]) => {
    if (text.includes(a) && text.includes(b)) base += 0.12;
  });
  
  const rarity = MEDICAL_KNOWLEDGE.rarity[condition.toLowerCase() as keyof typeof MEDICAL_KNOWLEDGE.rarity] ?? 0.5;
  return Math.max(0.3, Math.min(base - 0.03 * rarity, 0.85));
}

function assessRisk(tokens: string[]) {
  const redFlags = [];
  if (tokens.includes('chest') && (tokens.includes('shortness') || tokens.includes('breath'))) {
    redFlags.push('cardiorespiratory');
  }
  if (tokens.includes('fever') && tokens.includes('stiffness')) {
    redFlags.push('meningitis_risk');
  }
  
  const level = redFlags.length >= 1 ? 'high' : 
                tokens.includes('fever') ? 'moderate' : 'low';
  
  return { 
    level, 
    red_flags: redFlags, 
    recommendations: level === 'high' ? ["Seek urgent evaluation"] : ["Monitor and rest"]
  };
}

// Tool Schemas
const SymptomAnalysisResultSchema = z.object({
  patient_summary: z.object({
    age: z.union([z.string(), z.number()]),
    gender: z.string(),
    symptoms: z.array(z.string())
  }),
  confidence_score: z.number(),
  diagnoses: z.array(z.object({
    condition: z.string(),
    confidence: z.number(),
    urgency: z.string(),
    reasoning: z.string()
  })),
  risk_assessment: z.object({
    level: z.string(),
    red_flags: z.array(z.string()),
    recommendations: z.array(z.string())
  })
});

const TreatmentPlanResultSchema = z.object({
  treatment_plan: z.array(z.object({
    treatment_type: z.string(),
    instructions: z.string(),
    medication: z.string().optional(),
    dosage: z.string().optional()
  })),
  follow_up: z.array(z.string()),
  emergency_guidance: z.string()
});

// Medical Tools
export const symptomAnalysisTool = createTool({
  id: 'analyze-symptoms',
  description: 'Analyze patient symptoms and provide medical assessment',
  inputSchema: z.object({
    symptoms: z.string().describe('Patient symptoms separated by commas'),
    age: z.number().optional().describe('Patient age'),
    gender: z.string().optional().describe('Patient gender'),
    medical_history: z.string().optional().describe('Previous medical conditions')
  }),
  outputSchema: SymptomAnalysisResultSchema,
  execute: async ({ context }) => {
    const { symptoms, age = 'Unknown', gender = 'Unknown', medical_history = '' } = context;
    
    // Normalize symptoms
    const symptomArray = symptoms.split(',').map(s => s.trim()).filter(Boolean);
    const { tokens } = matchPatterns(symptoms);
    
    // Analyze conditions
    const diagnoses = Object.keys(MEDICAL_KNOWLEDGE.conditions)
      .map(condition => ({
        condition,
        confidence: calculateConfidence(condition, tokens),
        urgency: MEDICAL_KNOWLEDGE.conditions[condition as keyof typeof MEDICAL_KNOWLEDGE.conditions].urgency,
        reasoning: `Based on symptom analysis: ${symptoms}`
      }))
      .filter(d => d.confidence >= 0.3)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 3);
    
    // Risk assessment
    const risk = assessRisk(tokens);
    
    // Confidence score
    const confidenceScore = diagnoses.length > 0 ? diagnoses[0].confidence : 0.4;
    
    return {
      patient_summary: {
        age,
        gender,
        symptoms: symptomArray
      },
      confidence_score: confidenceScore,
      diagnoses,
      risk_assessment: risk
    };
  }
});

export const treatmentPlanningTool = createTool({
  id: 'create-treatment-plan',
  description: 'Create evidence-based treatment plan for medical condition',
  inputSchema: z.object({
    condition: z.string().describe('Primary medical condition'),
    urgency: z.string().describe('Urgency level: routine, moderate, urgent'),
    patient_age: z.number().optional().describe('Patient age for age-appropriate treatment')
  }),
  outputSchema: TreatmentPlanResultSchema,
  execute: async ({ context }) => {
    const { condition, urgency, patient_age } = context;
    
    const conditionInfo = MEDICAL_KNOWLEDGE.conditions[condition as keyof typeof MEDICAL_KNOWLEDGE.conditions];
    if (!conditionInfo) {
      return {
        treatment_plan: [{
          treatment_type: 'General Care',
          instructions: 'Consult healthcare provider for specific treatment'
        }],
        follow_up: ['Schedule appointment with healthcare provider'],
        emergency_guidance: 'Seek immediate medical attention if symptoms worsen'
      };
    }
    
    const treatment_plan = [{
      treatment_type: 'Primary Treatment',
      instructions: conditionInfo.treatment
    }];
    
    // Add age-specific recommendations
    if (patient_age && patient_age < 18) {
      treatment_plan.push({
        treatment_type: 'Pediatric Considerations',
        instructions: 'Monitor closely, ensure proper hydration, consult pediatrician if needed'
      });
    } else if (patient_age && patient_age > 65) {
      treatment_plan.push({
        treatment_type: 'Geriatric Considerations',
        instructions: 'Monitor for complications, ensure medication interactions are checked'
      });
    }
    
    const follow_up = urgency === 'urgent' ? 
      ['Seek immediate medical attention', 'Monitor symptoms closely'] :
      ['Schedule follow-up appointment', 'Monitor symptoms and rest'];
    
    const emergency_guidance = urgency === 'urgent' ?
      'This condition requires immediate medical attention. Go to emergency room or call 911.' :
      'Monitor symptoms and seek medical attention if they worsen or persist.';
    
    return {
      treatment_plan,
      follow_up,
      emergency_guidance
    };
  }
});

export const riskAssessmentTool = createTool({
  id: 'assess-risk',
  description: 'Assess medical risk level and provide emergency guidance',
  inputSchema: z.object({
    symptoms: z.string().describe('Patient symptoms'),
    age: z.number().optional().describe('Patient age'),
    existing_conditions: z.string().optional().describe('Existing medical conditions')
  }),
  outputSchema: z.object({
    risk_level: z.string(),
    risk_factors: z.array(z.string()),
    recommendations: z.array(z.string()),
    emergency_indicators: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { symptoms, age, existing_conditions } = context;
    const { tokens } = matchPatterns(symptoms);
    const risk = assessRisk(tokens);
    
    const emergency_indicators = [];
    if (tokens.includes('chest') && tokens.includes('pain')) {
      emergency_indicators.push('Chest pain - possible cardiac event');
    }
    if (tokens.includes('shortness') && tokens.includes('breath')) {
      emergency_indicators.push('Shortness of breath - possible respiratory emergency');
    }
    if (tokens.includes('fever') && tokens.includes('stiffness')) {
      emergency_indicators.push('Fever with neck stiffness - possible meningitis');
    }
    
    return {
      risk_level: risk.level,
      risk_factors: risk.red_flags,
      recommendations: risk.recommendations,
      emergency_indicators
    };
  }
});

// Export all tools
export const medicalTools = {
  symptomAnalysisTool,
  treatmentPlanningTool,
  riskAssessmentTool
};