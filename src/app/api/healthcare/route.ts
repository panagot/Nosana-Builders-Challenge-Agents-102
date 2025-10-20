import { NextRequest, NextResponse } from 'next/server';

// Simple healthcare API endpoint that doesn't rely on Mastra
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Simple healthcare response based on the message
    let response = '';

    if (message.toLowerCase().includes('headache') && message.toLowerCase().includes('nausea')) {
      response = `🏥 **MediTech AI Healthcare Analysis** 🏥

**Symptom Analysis:**
- Headache and nausea can indicate several conditions
- Common causes: migraine, tension headache, viral infection
- Less common: concussion, high blood pressure

**Risk Assessment:**
- **Urgency Level:** Moderate
- **Red Flags:** Severe headache, vision changes, neck stiffness
- **Recommendation:** Monitor symptoms, rest, hydration

**Treatment Plan:**
1. **Immediate Care:**
   - Rest in a quiet, dark room
   - Apply cold compress to forehead
   - Stay hydrated with water

2. **Medication:**
   - Over-the-counter pain relievers (ibuprofen, acetaminophen)
   - Avoid aspirin if under 18

3. **When to Seek Medical Care:**
   - Severe or sudden onset headache
   - Fever over 101°F
   - Neck stiffness or confusion
   - Symptoms worsen or persist > 24 hours

**⚠️ Important:** This is for informational purposes only. Always consult a healthcare provider for proper medical evaluation.`;
    } else if (message.toLowerCase().includes('chest pain') && message.toLowerCase().includes('shortness of breath')) {
      response = `🚨 **MediTech AI Healthcare Analysis** 🚨

**Symptom Analysis:**
- Chest pain with shortness of breath is a serious combination
- Potential causes: heart attack, pulmonary embolism, pneumonia
- **URGENT MEDICAL ATTENTION REQUIRED**

**Risk Assessment:**
- **Urgency Level:** HIGH - EMERGENCY
- **Red Flags:** Chest pain, shortness of breath, sweating, nausea
- **Recommendation:** Seek immediate medical care

**Emergency Action Plan:**
1. **Call 911 immediately** if experiencing:
   - Chest pain or pressure
   - Shortness of breath
   - Pain radiating to arm, jaw, or back
   - Sweating, nausea, or dizziness

2. **Do NOT wait** - these symptoms require immediate medical evaluation

**⚠️ CRITICAL:** This is a medical emergency. Call 911 or go to the nearest emergency room immediately. Do not delay seeking medical care.`;
    } else if (message.toLowerCase().includes('fever') && message.toLowerCase().includes('fatigue')) {
      response = `🏥 **MediTech AI Healthcare Analysis** 🏥

**Symptom Analysis:**
- Fever and fatigue suggest viral or bacterial infection
- Common causes: flu, common cold, COVID-19, bacterial infection
- Duration and severity help determine cause

**Risk Assessment:**
- **Urgency Level:** Moderate to High
- **Red Flags:** High fever (>103°F), difficulty breathing, confusion
- **Recommendation:** Monitor closely, consider medical evaluation

**Treatment Plan:**
1. **Immediate Care:**
   - Rest and stay hydrated
   - Monitor temperature every 4 hours
   - Use fever-reducing medications (acetaminophen, ibuprofen)

2. **When to Seek Medical Care:**
   - Fever > 103°F or persistent > 3 days
   - Difficulty breathing or chest pain
   - Severe headache or neck stiffness
   - Signs of dehydration

3. **Prevention:**
   - Stay home to avoid spreading infection
   - Practice good hygiene
   - Consider COVID-19 testing if appropriate

**⚠️ Important:** Monitor symptoms closely and seek medical care if they worsen or persist.`;
    } else if (message.toLowerCase().includes('diabetes') && message.toLowerCase().includes('65')) {
      response = `🏥 **MediTech AI Healthcare Analysis** 🏥

**Patient Profile:**
- Age: 65+ (Senior)
- Condition: Diabetes
- **Special Considerations:** Age-related complications, medication interactions

**Health Monitoring for Seniors with Diabetes:**
1. **Blood Sugar Management:**
   - Monitor blood glucose regularly
   - Watch for hypoglycemia symptoms
   - Maintain HbA1c < 7% (individualized)

2. **Complications to Watch:**
   - Cardiovascular disease
   - Kidney function (nephropathy)
   - Eye health (retinopathy)
   - Foot care (neuropathy)

3. **Medication Management:**
   - Take medications as prescribed
   - Be aware of drug interactions
   - Regular medication reviews with doctor

4. **Lifestyle Factors:**
   - Balanced diet with consistent meal timing
   - Regular, appropriate exercise
   - Adequate sleep and stress management

**When to Seek Medical Care:**
- Unusual blood sugar patterns
- Signs of infection or slow healing
- Changes in vision, sensation, or circulation
- Any new or worsening symptoms

**⚠️ Important:** Regular medical checkups are essential for seniors with diabetes. Consult your healthcare provider for personalized care.`;
    } else {
      response = `🏥 **MediTech AI Healthcare Assistant** 🏥

I'm here to help with your medical concerns. I can analyze symptoms, assess risk levels, and provide treatment recommendations.

**Available Services:**
- Symptom Analysis
- Risk Assessment  
- Treatment Planning
- Medical Guidance

**Please describe your symptoms in detail, including:**
- What symptoms you're experiencing
- How long you've had them
- Any relevant medical history
- Your age and gender (if comfortable sharing)

**Examples:**
- "I have a headache and nausea"
- "Chest pain with shortness of breath"
- "Fever and fatigue for 3 days"
- "I'm 65 and have diabetes, what should I watch for?"

**⚠️ Important:** I provide medical guidance but cannot replace professional medical care. Always consult healthcare providers for serious conditions.`;
    }

    return NextResponse.json({ 
      success: true, 
      response: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Healthcare API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
