import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// Medical Knowledge Base
const MEDICAL_KNOWLEDGE = {
  conditions: {
    'migraine': {
      symptoms: ['headache', 'nausea', 'sensitivity to light', 'sensitivity to sound'],
      treatments: ['rest in dark room', 'cold compress', 'pain medication', 'avoid triggers'],
      urgency: 'moderate'
    },
    'heart attack': {
      symptoms: ['chest pain', 'shortness of breath', 'sweating', 'nausea', 'arm pain'],
      treatments: ['call 911 immediately', 'aspirin if not allergic', 'stay calm'],
      urgency: 'emergency'
    },
    'pneumonia': {
      symptoms: ['cough', 'fever', 'shortness of breath', 'chest pain', 'fatigue'],
      treatments: ['antibiotics', 'rest', 'hydration', 'oxygen if needed'],
      urgency: 'high'
    },
    'diabetes': {
      symptoms: ['excessive thirst', 'frequent urination', 'fatigue', 'blurred vision'],
      treatments: ['blood sugar monitoring', 'insulin', 'diet management', 'exercise'],
      urgency: 'moderate'
    }
  },
  emergencySymptoms: ['chest pain', 'shortness of breath', 'severe headache', 'loss of consciousness'],
  ageConsiderations: {
    pediatric: ['croup', 'fever', 'ear infection'],
    elderly: ['pneumonia', 'heart failure', 'stroke risk']
  }
};

// Symptom Analysis Tool
export const symptomAnalysisTool = createTool({
  id: 'symptom-analysis',
  description: 'Analyzes patient symptoms to identify potential medical conditions and urgency level.',
  inputSchema: z.object({
    symptoms: z.string().describe('Comma-separated list of patient symptoms'),
    age: z.number().optional().describe('Patient age for context'),
    gender: z.string().optional().describe('Patient gender for context'),
    duration: z.string().optional().describe('How long symptoms have been present')
  }),
  outputSchema: z.object({
    potentialConditions: z.array(z.object({
      condition: z.string(),
      confidence: z.number(),
      urgency: z.string(),
      reasoning: z.string()
    })),
    emergency: z.boolean(),
    recommendations: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { symptoms, age } = context;
    const symptomList = symptoms.toLowerCase().split(',').map(s => s.trim());
    
    // Check for emergency symptoms
    const isEmergency = symptomList.some(symptom => 
      MEDICAL_KNOWLEDGE.emergencySymptoms.some(emergency => 
        symptom.includes(emergency) || emergency.includes(symptom)
      )
    );

    // Analyze potential conditions
    const potentialConditions = [];
    for (const [condition, info] of Object.entries(MEDICAL_KNOWLEDGE.conditions)) {
      const matchedSymptoms = symptomList.filter(symptom =>
        info.symptoms.some(infoSymptom =>
          symptom.includes(infoSymptom) || infoSymptom.includes(symptom)
        )
      );
      
      if (matchedSymptoms.length > 0) {
        const confidence = Math.min(0.3 + (matchedSymptoms.length / info.symptoms.length) * 0.6, 0.9);
        potentialConditions.push({
          condition,
          confidence,
          urgency: info.urgency,
          reasoning: `Matched ${matchedSymptoms.length} symptoms: ${matchedSymptoms.join(', ')}`
        });
      }
    }

    // Sort by confidence
    potentialConditions.sort((a, b) => b.confidence - a.confidence);

    // Generate recommendations
    const recommendations = [];
    if (isEmergency) {
      recommendations.push('🚨 SEEK IMMEDIATE MEDICAL ATTENTION - Emergency symptoms detected');
    } else if (potentialConditions.length > 0) {
      recommendations.push('📋 Schedule appointment with healthcare provider');
      recommendations.push('📝 Monitor symptoms and document changes');
    }
    
    if (age && age < 18) {
      recommendations.push('👶 Pediatric considerations: Monitor for dehydration and fever');
    } else if (age && age > 65) {
      recommendations.push('👴 Senior considerations: Watch for complications and medication interactions');
    }

    return {
      potentialConditions: potentialConditions.slice(0, 3), // Top 3
      emergency: isEmergency,
      recommendations
    };
  }
});

// Risk Assessment Tool
export const riskAssessmentTool = createTool({
  id: 'risk-assessment',
  description: 'Assesses medical risk level based on symptoms, age, and medical history.',
  inputSchema: z.object({
    symptoms: z.array(z.string()).describe('List of current symptoms'),
    age: z.number().optional().describe('Patient age'),
    medicalHistory: z.array(z.string()).optional().describe('Previous medical conditions'),
    medications: z.array(z.string()).optional().describe('Current medications')
  }),
  outputSchema: z.object({
    riskLevel: z.enum(['low', 'moderate', 'high', 'critical']),
    riskFactors: z.array(z.string()),
    immediateActions: z.array(z.string()),
    followUpRequired: z.boolean()
  }),
  execute: async ({ context }) => {
    const { symptoms, age, medicalHistory = [], medications = [] } = context;
    
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    const riskFactors = [];
    const immediateActions = [];
    let followUpRequired = false;

    // Age-based risk assessment
    if (age && age < 2) {
      riskLevel = 'moderate';
      riskFactors.push('Pediatric patient - requires specialized care');
    } else if (age && age > 65) {
      riskLevel = 'moderate';
      riskFactors.push('Senior patient - higher complication risk');
    }

    // Symptom-based risk assessment
    const emergencySymptoms = ['chest pain', 'shortness of breath', 'severe headache', 'loss of consciousness'];
    const hasEmergencySymptoms = symptoms.some(symptom =>
      emergencySymptoms.some(emergency => symptom.toLowerCase().includes(emergency))
    );

    if (hasEmergencySymptoms) {
      riskLevel = 'critical';
      riskFactors.push('Emergency symptoms present');
      immediateActions.push('Call 911 immediately');
      immediateActions.push('Do not delay seeking medical care');
    }

    // Medical history risk factors
    const highRiskConditions = ['diabetes', 'heart disease', 'hypertension', 'asthma'];
    const hasHighRiskHistory = medicalHistory.some(condition =>
      highRiskConditions.some(risk => condition.toLowerCase().includes(risk))
    );

    if (hasHighRiskHistory) {
      riskLevel = riskLevel === 'critical' ? 'critical' : 'high';
      riskFactors.push('High-risk medical history');
      followUpRequired = true;
    }

    // Medication interactions
    if (medications.length > 0) {
      riskFactors.push('Multiple medications - check for interactions');
      followUpRequired = true;
    }

    if (riskLevel !== 'low') {
      followUpRequired = true;
    }

    return {
      riskLevel,
      riskFactors,
      immediateActions,
      followUpRequired
    };
  }
});

// Treatment Planning Tool
export const treatmentPlanningTool = createTool({
  id: 'treatment-planning',
  description: 'Creates personalized treatment plans based on diagnosis and patient context.',
  inputSchema: z.object({
    diagnosis: z.string().describe('Primary medical diagnosis'),
    severity: z.enum(['mild', 'moderate', 'severe']).describe('Condition severity'),
    age: z.number().optional().describe('Patient age'),
    allergies: z.array(z.string()).optional().describe('Known allergies'),
    preferences: z.string().optional().describe('Patient treatment preferences')
  }),
  outputSchema: z.object({
    treatmentPlan: z.object({
      immediate: z.array(z.string()),
      shortTerm: z.array(z.string()),
      longTerm: z.array(z.string())
    }),
    medications: z.array(z.object({
      name: z.string(),
      dosage: z.string(),
      frequency: z.string(),
      notes: z.string()
    })),
    lifestyleModifications: z.array(z.string()),
    followUpSchedule: z.array(z.string())
  }),
  execute: async ({ context }) => {
    const { diagnosis, age, allergies = [] } = context;
    
    const treatmentPlan = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    };

    const medications = [];
    const lifestyleModifications = [];
    const followUpSchedule = [];

    // Diagnosis-specific treatment planning
    switch (diagnosis.toLowerCase()) {
      case 'migraine':
        treatmentPlan.immediate.push('Rest in dark, quiet room');
        treatmentPlan.immediate.push('Apply cold compress to forehead');
        treatmentPlan.shortTerm.push('Over-the-counter pain relief (ibuprofen, acetaminophen)');
        treatmentPlan.longTerm.push('Identify and avoid migraine triggers');
        treatmentPlan.longTerm.push('Consider preventive medications if frequent');
        
        medications.push({
          name: 'Ibuprofen',
          dosage: '400-600mg',
          frequency: 'Every 6-8 hours as needed',
          notes: 'Take with food to avoid stomach upset'
        });
        
        lifestyleModifications.push('Maintain regular sleep schedule');
        lifestyleModifications.push('Stay hydrated');
        lifestyleModifications.push('Manage stress levels');
        
        followUpSchedule.push('Follow up in 1 week if symptoms persist');
        break;

      case 'heart attack':
        treatmentPlan.immediate.push('🚨 CALL 911 IMMEDIATELY');
        treatmentPlan.immediate.push('Chew aspirin if not allergic');
        treatmentPlan.immediate.push('Stay calm and rest');
        treatmentPlan.shortTerm.push('Emergency medical evaluation');
        treatmentPlan.shortTerm.push('Cardiac monitoring');
        treatmentPlan.longTerm.push('Cardiac rehabilitation program');
        treatmentPlan.longTerm.push('Lifestyle modifications for heart health');
        
        followUpSchedule.push('Immediate emergency care');
        followUpSchedule.push('Cardiology follow-up within 1 week');
        break;

      case 'pneumonia':
        treatmentPlan.immediate.push('Rest and stay hydrated');
        treatmentPlan.shortTerm.push('Antibiotic treatment (if bacterial)');
        treatmentPlan.shortTerm.push('Fever management');
        treatmentPlan.longTerm.push('Complete antibiotic course');
        treatmentPlan.longTerm.push('Monitor for complications');
        
        medications.push({
          name: 'Antibiotic',
          dosage: 'As prescribed by doctor',
          frequency: 'As directed',
          notes: 'Complete full course even if feeling better'
        });
        
        lifestyleModifications.push('Get plenty of rest');
        lifestyleModifications.push('Stay hydrated');
        lifestyleModifications.push('Avoid smoking and secondhand smoke');
        
        followUpSchedule.push('Follow up in 3-5 days');
        followUpSchedule.push('Chest X-ray follow-up if needed');
        break;

      case 'diabetes':
        treatmentPlan.immediate.push('Check blood glucose levels');
        treatmentPlan.shortTerm.push('Adjust insulin/medication as needed');
        treatmentPlan.longTerm.push('Regular blood glucose monitoring');
        treatmentPlan.longTerm.push('Diet and exercise management');
        
        lifestyleModifications.push('Follow diabetic diet plan');
        lifestyleModifications.push('Regular exercise routine');
        lifestyleModifications.push('Regular medical checkups');
        
        followUpSchedule.push('Endocrinology follow-up in 3 months');
        followUpSchedule.push('Regular HbA1c testing');
        break;

      default:
        treatmentPlan.immediate.push('Consult with healthcare provider');
        treatmentPlan.shortTerm.push('Monitor symptoms closely');
        treatmentPlan.longTerm.push('Follow medical advice');
        followUpSchedule.push('Schedule appointment with doctor');
    }

    // Age-specific considerations
    if (age && age < 18) {
      treatmentPlan.immediate.push('👶 Pediatric considerations: Monitor for dehydration');
    } else if (age && age > 65) {
      treatmentPlan.immediate.push('👴 Senior considerations: Watch for medication interactions');
    }

    // Allergy considerations
    if (allergies.length > 0) {
      medications.forEach(med => {
        med.notes += ` (Check for allergies: ${allergies.join(', ')})`;
      });
    }

  return {
      treatmentPlan,
      medications,
      lifestyleModifications,
      followUpSchedule
    };
  }
});

export const medicalTools = {
  symptomAnalysisTool,
  riskAssessmentTool,
  treatmentPlanningTool
};
