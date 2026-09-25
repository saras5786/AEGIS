import { AIVerificationResult, IncidentType, PriorityLevel } from '../types';

interface AnalysisInput {
  type: IncidentType;
  description: string;
  peopleCount?: number;
  hasPhoto?: boolean;
  photoUrl?: string;
  apiKey?: string;
}

export async function analyzeEmergencyReport(input: AnalysisInput): Promise<AIVerificationResult> {
  // If user provided a Gemini API Key in settings or env, try calling Google Gemini
  const apiKey = input.apiKey || (import.meta.env.VITE_GEMINI_API_KEY as string | undefined);

  if (apiKey && apiKey.trim().length > 10) {
    try {
      const result = await callGeminiAPI(input, apiKey);
      if (result) return result;
    } catch (err) {
      console.warn('Gemini API call failed, using built-in engine:', err);
    }
  }

  // Built-in Smart Deterministic AI Engine (Uses simple, clear English)
  return fallbackRuleBasedAnalysis(input);
}

// Fallback AI Engine: Fast, reliable, offline-capable, uses simple friendly English
function fallbackRuleBasedAnalysis(input: AnalysisInput): AIVerificationResult {
  const desc = (input.description || '').toLowerCase();
  let type = input.type;
  let priority: PriorityLevel = 'MEDIUM';
  let confidence = 88;
  const risks: string[] = [];
  const recommendedUnits: ('Ambulance' | 'Fire Truck' | 'Police Patrol' | 'Traffic Unit')[] = [];
  let reliability = 92;

  // Prank or suspicious keyword checks
  const prankWords = ['fake', 'prank', 'joke', 'haha', 'test only', 'just testing', 'alien', 'ufo', 'ghost'];
  const hasPrankWords = prankWords.some(w => desc.includes(w));
  if (hasPrankWords) {
    reliability = 32;
    confidence = 45;
  }

  // Type & Severity Detection using plain language
  if (type === 'accident' || desc.includes('crash') || desc.includes('accident') || desc.includes('car') || desc.includes('bike') || desc.includes('hit')) {
    type = 'accident';
    recommendedUnits.push('Ambulance', 'Traffic Unit');
    risks.push('Blocked road or traffic slowdown', 'Risk of secondary vehicle crash');

    if (desc.includes('severe') || desc.includes('blood') || desc.includes('unconscious') || desc.includes('trapped') || (input.peopleCount && input.peopleCount > 2)) {
      priority = 'CRITICAL';
      confidence = 94;
      risks.push('Severe injuries needing urgent hospital care');
    } else {
      priority = 'HIGH';
      confidence = 89;
    }
  } else if (type === 'fire' || desc.includes('fire') || desc.includes('smoke') || desc.includes('flame') || desc.includes('burning') || desc.includes('explosion')) {
    type = 'fire';
    priority = 'CRITICAL';
    confidence = 95;
    recommendedUnits.push('Fire Truck', 'Ambulance', 'Police Patrol');
    risks.push('Fire can quickly spread to nearby buildings', 'Heavy smoke and breathing danger', 'Risk of explosion');
  } else if (type === 'medical' || desc.includes('heart') || desc.includes('breathing') || desc.includes('fainted') || desc.includes('chest pain') || desc.includes('stroke') || desc.includes('injury')) {
    type = 'medical';
    recommendedUnits.push('Ambulance');
    if (desc.includes('unconscious') || desc.includes('heart attack') || desc.includes('choking') || desc.includes('cannot breathe')) {
      priority = 'CRITICAL';
      confidence = 96;
      risks.push('Immediate life-threatening health condition');
    } else {
      priority = 'HIGH';
      confidence = 90;
      risks.push('Patient needs fast paramedic check and transport');
    }
  } else if (type === 'police' || desc.includes('theft') || desc.includes('fight') || desc.includes('weapon') || desc.includes('danger') || desc.includes('assault')) {
    type = 'police';
    priority = 'HIGH';
    confidence = 87;
    recommendedUnits.push('Police Patrol');
    risks.push('Safety risk for bystanders', 'Possible violent situation');
    if (desc.includes('weapon') || desc.includes('gun') || desc.includes('knife')) {
      priority = 'CRITICAL';
      risks.push('Armed danger present');
    }
  } else if (type === 'hazard' || desc.includes('wire') || desc.includes('gas') || desc.includes('electric') || desc.includes('fallen tree') || desc.includes('pothole')) {
    type = 'hazard';
    priority = 'MEDIUM';
    confidence = 85;
    recommendedUnits.push('Traffic Unit', 'Police Patrol');
    risks.push('Obstacle on public road', 'Risk to motorists and pedestrians');
  } else if (type === 'natural' || desc.includes('flood') || desc.includes('storm') || desc.includes('earthquake')) {
    type = 'natural';
    priority = 'HIGH';
    confidence = 91;
    recommendedUnits.push('Fire Truck', 'Police Patrol', 'Ambulance');
    risks.push('Water accumulation or debris', 'Multiple people may need rescue');
  } else {
    type = 'other';
    priority = 'MEDIUM';
    confidence = 75;
    recommendedUnits.push('Police Patrol');
    risks.push('Details need human call center verification');
  }

  // Photo bonus
  if (input.hasPhoto) {
    confidence = Math.min(99, confidence + 4);
    reliability = Math.min(99, reliability + 5);
  }

  // Plain English Summary
  const countText = input.peopleCount && input.peopleCount > 0 ? `${input.peopleCount} person(s) reported involved.` : 'People count not specified.';
  const summary = `AI detected ${formatIncidentLabel(type)} with ${priority.toLowerCase()} urgency. ${countText} Recommended team: ${recommendedUnits.join(' and ')}.`;

  return {
    detectedType: type,
    priority,
    confidence,
    summary,
    risks,
    recommendedUnits,
    peopleCountEstimated: input.peopleCount || (type === 'accident' ? 2 : 1),
    reliabilityScore: reliability,
    analyzedAt: new Date().toISOString()
  };
}

// Call Google Gemini API (gemini-1.5-flash / gemini-2.5-flash)
async function callGeminiAPI(input: AnalysisInput, apiKey: string): Promise<AIVerificationResult | null> {
  const prompt = `
You are the AI verification assistant for AEGIS Emergency Simulation.
Analyze this emergency report using plain, simple English (no complex buzzwords).

Incident Type Reported: ${input.type}
Description: "${input.description}"
Reported People: ${input.peopleCount || 'unknown'}
Has Photo Attached: ${input.hasPhoto ? 'Yes' : 'No'}

Respond ONLY with valid JSON in this exact structure:
{
  "detectedType": "${input.type}",
  "priority": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": 85,
  "summary": "Simple one sentence explanation of what happened.",
  "risks": ["Simple risk 1", "Simple risk 2"],
  "recommendedUnits": ["Ambulance", "Police Patrol"],
  "peopleCountEstimated": 2,
  "reliabilityScore": 90
}
  `.trim();

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP Error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return null;

  const parsed = JSON.parse(text);
  return {
    detectedType: parsed.detectedType || input.type,
    priority: parsed.priority || 'MEDIUM',
    confidence: parsed.confidence || 85,
    summary: parsed.summary || 'Emergency report analyzed by Gemini.',
    risks: Array.isArray(parsed.risks) ? parsed.risks : ['Requires quick on-site check'],
    recommendedUnits: Array.isArray(parsed.recommendedUnits) ? parsed.recommendedUnits : ['Police Patrol'],
    peopleCountEstimated: parsed.peopleCountEstimated || input.peopleCount || 1,
    reliabilityScore: parsed.reliabilityScore || 90,
    analyzedAt: new Date().toISOString()
  };
}

function formatIncidentLabel(type: IncidentType): string {
  switch (type) {
    case 'accident': return 'Road Accident';
    case 'fire': return 'Fire Incident';
    case 'medical': return 'Medical Emergency';
    case 'police': return 'Safety / Police Alert';
    case 'hazard': return 'Road / Power Hazard';
    case 'natural': return 'Natural Hazard';
    default: return 'Emergency Incident';
  }
}
