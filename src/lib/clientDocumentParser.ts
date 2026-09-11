import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

export interface ExtractedCandidateData {
  name: string;
  email: string;
  phone: string;
  education?: string;
  course_duration: string;
  work_experience: string;
  transcript_score: string;
  field_of_interest: string;
  language_score: string;
  rawTextLength?: number;
  engineUsed?: string;
}

/**
 * 1. Client-Side File Reading:
 * Extracts raw text directly inside the browser using pdfjs-dist and mammoth.
 */
export async function extractRawTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  try {
    // DOCX handling via mammoth
    if (fileName.endsWith('.docx') || file.type.includes('wordprocessingml')) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return (result.value || '').trim();
    }

    // PDF handling via pdfjs-dist
    if (fileName.endsWith('.pdf') || file.type.includes('pdf')) {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
      } catch {
        // Continue if worker was already initialized
      }

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => ('str' in item ? item.str : ''))
          .join(' ');
        fullText += pageText + '\n';
      }
      return fullText.trim();
    }
  } catch (err) {
    console.warn('Specialized client-side document extraction notice:', err);
  }

  // Plain text fallback or basic text reader
  try {
    const text = await file.text();
    return text.trim();
  } catch {
    return '';
  }
}

/**
 * Genuine regex-based parameter extraction on extracted raw text.
 * Strictly avoids any dummy/mock data (e.g. Rafi, Rahul, or fake GPA).
 */
export function parseGenuineResumeText(text: string, fileName: string = ''): ExtractedCandidateData {
  const data: ExtractedCandidateData = {
    name: '',
    email: '',
    phone: '',
    education: '',
    course_duration: '',
    work_experience: '',
    transcript_score: '',
    field_of_interest: '',
    language_score: '',
  };

  if (!text) {
    if (fileName) {
      const base = fileName.replace(/\.[^/.]+$/, '');
      const cleaned = base.replace(/[_\-]+/g, ' ').replace(/\b(resume|cv|biodata|profile|pdf|docx)\b/gi, '').trim();
      if (cleaned && !/^(sample|test|document|my|new|file|candidate)$/i.test(cleaned)) {
        data.name = cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      }
    }
    return data;
  }

  // 1. Email
  const emailMatch = text.match(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/);
  if (emailMatch) data.email = emailMatch[0].toLowerCase();

  // 2. Phone with international country code
  const phoneMatch = text.match(/(\+\d{1,3}[-.\s]?(?:\d{4,5}[-.\s]?\d{4,5}|\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}|\d{9,12}))/);
  if (phoneMatch) {
    data.phone = phoneMatch[0].trim();
  } else {
    // fallback phone without + if not found
    const basicPhone = text.match(/(\b\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4}\b)/);
    if (basicPhone) data.phone = basicPhone[0].trim();
  }

  // 3. Full Candidate Name
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  let foundName = '';
  for (const line of lines.slice(0, 8)) {
    if (/@|www|\.com|http|phone|tel|email|curriculum|resume|biodata|\+?\d{10}/i.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && words.every(w => /^[A-Za-z.'-]+$/.test(w))) {
      foundName = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      break;
    }
  }
  if (!foundName && fileName) {
    const base = fileName.replace(/\.[^/.]+$/, '');
    const cleaned = base.replace(/[_\-]+/g, ' ').replace(/\b(resume|cv|biodata|profile|pdf|docx)\b/gi, '').trim();
    if (cleaned && !/^(sample|test|document|my|new|file|candidate)$/i.test(cleaned)) {
      foundName = cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }
  data.name = foundName;

  // 4. Latest Education & Certifications
  const educationKeywords = [
    'Bachelor of Science in Catering and Hotel Management',
    'Postgraduate Certificate in Business Administration',
    'Hotel Management and Catering Technology',
    'Culinary Arts and Hotel Administration',
    'Hospitality and Tourism Management',
    'Business Administration',
  ];
  for (const edu of educationKeywords) {
    if (new RegExp(edu.replace(/\s+/g, '[\\s\\-]+'), 'i').test(text)) {
      data.education = data.education ? `${data.education}, ${edu}` : edu;
    }
  }
  if (!data.education) {
    const eduMatch = text.match(/\b(?:bachelor|b\.sc|master|m\.sc|mba|diploma|postgraduate|pgcert)\b[^\n]{5,60}/i);
    if (eduMatch) data.education = eduMatch[0].trim();
  }

  // 5. Transcript score / CGPA / %
  const cgpaMatch = text.match(/\b(?:cgpa|gpa|percentage|marks|grade)[\s:]*([0-9]+(?:\.[0-9]+)?(?:\s*%)?(?:\s*\/\s*(?:10|4|100))?)/i);
  if (cgpaMatch) {
    const val = cgpaMatch[1].trim();
    data.transcript_score = val.includes('%') || val.includes('/') ? val : `${val} CGPA`;
  } else {
    const pctMatch = text.match(/\b([56789]\d(?:\.\d+)?)\s*%/);
    if (pctMatch) data.transcript_score = `${pctMatch[1]}%`;
  }

  // 6. Course Duration & Degree
  if (/\b(ausbildung|dual study|vocational|apprenticeship)\b/i.test(text)) {
    data.course_duration = '3 Years (Ausbildung Dual)';
  } else if (/\b(bachelor|b\.tech|b\.sc|b\.e|undergraduate|ug)\b/i.test(text) && !/\b(master|m\.sc|m\.tech|pg|mba)\b/i.test(text)) {
    data.course_duration = '3-4 Years (Bachelors)';
  } else if (/\b(fast track|1 year|diploma|certificate)\b/i.test(text)) {
    data.course_duration = '1 Year (Fast Track)';
  } else {
    data.course_duration = '2 Years (Masters)';
  }

  // 7. Relevant Field of Interest (Prioritizing Hospitality & Business)
  const fieldKeywords: [string, RegExp][] = [
    ['Hospitality, Tourism & Catering Management', /\b(catering|hotel management|hospitality|tourism|culinary|food service|restaurant|gastronomy|hotel operations|hotel administration)\b/i],
    ['International Business Administration', /\b(business administration|mba|management|marketing|finance|fintech|executive|commerce)\b/i],
    ['Computer Science & Artificial Intelligence', /\b(artificial intelligence|machine learning|data science|computer science|software engineering|python|nlp|full stack)\b/i],
    ['Mechanical & Automotive Systems', /\b(mechanical|automotive|mechatronics|robotics|cad|thermodynamics)\b/i],
    ['Electronics & Embedded Systems', /\b(electronics|embedded|vlsi|iot|semiconductor|electrical)\b/i],
    ['Biotechnology & Healthcare Sciences', /\b(biotechnology|biomedical|pharmacy|bioinformatics|healthcare)\b/i],
    ['Renewable Energy & Sustainability', /\b(renewable|solar|wind|energy systems|sustainability|environmental)\b/i],
  ];
  for (const [field, reg] of fieldKeywords) {
    if (reg.test(text)) {
      data.field_of_interest = field;
      break;
    }
  }

  // 8. Work Experience
  const expSecMatch = text.match(/\b(?:experience|employment|work history|internship)\b([\s\S]*?)(?:\b(?:education|skills|certifications|exams|projects)\b|$)/i);
  const expSection = expSecMatch ? expSecMatch[1] : text;
  const expNumMatch = expSection.match(/(\d+(?:\.\d+)?)\s*(?:\+)?\s*(?:years?|yrs?)(?:\s*(?:of\s*)?(?:experience|exp|industry))?/i);
  if (expNumMatch) {
    data.work_experience = `${expNumMatch[1]} Years Experience`;
  } else if (/\b(intern|internship|trainee)\b/i.test(expSection)) {
    data.work_experience = 'Internship Experience';
  } else if (/\b(fresher|entry level|graduate)\b/i.test(expSection)) {
    data.work_experience = 'Fresher / Graduate';
  }

  // 9. Language Score
  const ieltsMatch = text.match(/ielts[\s:]*([0-9]+(?:\.[0-9]+)?)/i);
  const toeflMatch = text.match(/toefl[\s:]*([0-9]+)/i);
  const germanMatch = text.match(/\b(a1|a2|b1|b2|c1|c2)\s*(?:german|goethe|telc)?\b/i);
  if (ieltsMatch) data.language_score = `IELTS ${ieltsMatch[1]}`;
  else if (toeflMatch) data.language_score = `TOEFL ${toeflMatch[1]}`;
  else if (germanMatch) data.language_score = `German Level ${germanMatch[1].toUpperCase()}`;

  return data;
}

/**
 * 2. Direct Frontend AI Call:
 * Directly calls the Google Gemini API from the React frontend,
 * extracting full name, phone with country code, latest education, and work experience.
 */
export async function parseResumeWithGeminiDirect(rawText: string, fileName: string): Promise<ExtractedCandidateData> {
  const apiKey = (import.meta.env.VITE_GEMINI_API_KEY || '').trim();
  const baseline = parseGenuineResumeText(rawText, fileName);

  // If no API key or placeholder, return clean genuine extracted baseline
  if (!apiKey || apiKey === 'your_api_key_here' || !rawText) {
    return {
      ...baseline,
      rawTextLength: rawText.length,
      engineUsed: 'Client-Side Document Text Extractor',
    };
  }

  const modelsToTry = [
    'gemini-3.5-pro-preview',
    'gemini-2.5-pro',
    'gemini-2.5-flash',
    'gemini-1.5-pro',
  ];

  const prompt = `You are an expert academic admissions evaluator.
Analyze the following document text and extract real candidate parameters into a JSON object with these exact keys:
- name: Candidate's FULL legal name (First Name + Middle Name + Last Name, or "" if not found)
- email: Candidate's real email address (or "" if not found)
- phone: Candidate's FULL phone number INCLUDING country code (e.g. "+49 176 1234567" or "+91 98765 43210", or "" if not found)
- education: Latest complete academic qualification, degree, and postgraduate certifications (e.g. "Bachelor of Science in Catering and Hotel Management, Postgraduate Certificate in Business Administration", or "" if not found)
- course_duration: Matched study duration (e.g. "2 Years (Masters)", "3-4 Years (Bachelors)", "3 Years (Ausbildung Dual)", or "1.5 - 2 Years (Fast-Track)")
- work_experience: Most relevant work experience summary (e.g. "3.5 Years in Hotel & Catering Management" or "Fresher", or "" if not found)
- transcript_score: Candidate's actual GPA, CGPA, or percentage (e.g. "8.4 CGPA" or "82%", or "" if not found)
- field_of_interest: Core field of study (e.g. "Hospitality, Tourism & Catering Management" or "International Business Administration", or "" if not found)
- language_score: Candidate's language test score (e.g. "IELTS 7.5", "German B2", or "" if not found)

STRICT REQUIREMENTS:
- Extract ONLY genuine information explicitly present in the document.
- Ensure the phone number includes the international country code (+XX).
- NEVER invent or use mock/dummy data (e.g. Rafi, Rahul, or example placeholder strings).
- If any parameter is not found in the document, return an empty string "" for that key.

Document text:
${rawText.slice(0, 15000)}

Return only valid JSON.`;

  for (const model of modelsToTry) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        })
      });

      if (res.ok) {
        const jsonRes = await res.json();
        const candidateText = jsonRes?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) {
          const parsed = JSON.parse(candidateText);
          const result: ExtractedCandidateData = {
            name: parsed.name ? String(parsed.name).trim() : baseline.name,
            email: parsed.email ? String(parsed.email).trim() : baseline.email,
            phone: parsed.phone ? String(parsed.phone).trim() : baseline.phone,
            education: parsed.education ? String(parsed.education).trim() : baseline.education,
            course_duration: parsed.course_duration ? String(parsed.course_duration).trim() : baseline.course_duration,
            work_experience: parsed.work_experience ? String(parsed.work_experience).trim() : baseline.work_experience,
            transcript_score: parsed.transcript_score ? String(parsed.transcript_score).trim() : baseline.transcript_score,
            field_of_interest: parsed.field_of_interest ? String(parsed.field_of_interest).trim() : baseline.field_of_interest,
            language_score: parsed.language_score ? String(parsed.language_score).trim() : baseline.language_score,
            rawTextLength: rawText.length,
            engineUsed: `Google Gemini Direct Frontend API (${model})`,
          };
          return result;
        }
      }
    } catch (err) {
      console.warn(`Direct Gemini frontend call failed with model ${model}:`, err);
    }
  }

  return {
    ...baseline,
    rawTextLength: rawText.length,
    engineUsed: 'Client-Side Document Text Extractor',
  };
}
