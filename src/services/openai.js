import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const detectContentType = (text) => {
    // Common patterns for different content types
    const patterns = {
      scientific: {
        keywords: ['doi:', 'abstract', 'methodology', 'hypothesis', 'p-value', 'clinical trial', 'study design'],
        characteristics: /\(\d{4}\)|et al\.|Fig\.\s\d|Table\s\d/
      },
      news: {
        keywords: ['reported', 'according to', 'says', 'announced', 'published'],
        characteristics: /(AP|Reuters|NPR|CNN|News|Times)/i
      },
      social: {
        keywords: ['posted', 'shared', 'liked', 'followers', 'trending'],
        characteristics: /@|#|\b(facebook|twitter|instagram|tiktok)\b/i
      },
      guidelines: {
        keywords: ['guidelines', 'recommendations', 'protocol', 'best practices', 'standards'],
        characteristics: /\b(WHO|CDC|FDA|NIH)\b/
      },
      commercial: {
        keywords: ['buy', 'product', 'supplement', 'treatment', 'cure', 'guarantee'],
        characteristics: /\$|\b(buy|order|purchase|price|cost)\b/i
      }
    };
  
    // Count matches for each type
    const scores = Object.entries(patterns).reduce((acc, [type, pattern]) => {
      const keywordMatches = pattern.keywords.filter(keyword => 
        text.toLowerCase().includes(keyword.toLowerCase())
      ).length;
      const characteristicMatches = (text.match(pattern.characteristics) || []).length;
      acc[type] = keywordMatches + characteristicMatches;
      return acc;
    }, {});
  
    // Return the type with the highest score, default to 'general' if no clear match
    const maxScore = Math.max(...Object.values(scores));
    const contentType = maxScore > 0 
      ? Object.entries(scores).find(([_, score]) => score === maxScore)[0]
      : 'general';
  
    return contentType;
  };

const getSystemPrompt = (language) => {

    const baseCriteria = `
CRITICAL SCORING CONSISTENCY RULES (MUST BE FOLLOWED):
1. EXACT SAME SCORES for identical content regardless of language
2. Apply scoring criteria identically across all languages
3. Do not adjust scores based on language or interface
4. Use consistent numerical ranges: 0-100
5. Round all scores to nearest 5
6. Always apply same deductions regardless of language:
- No citations: -30 points
- No data verification: -25 points
- No methodology: -25 points
- Vague claims: -20 points

BASELINE SCORING REQUIREMENTS:
- Start at 50 points
- Cannot exceed 70% without peer review
- Cannot exceed 35% without citations
- Minimum score is 20%
- Must provide detailed explanations for each score

CATEGORY ALIGNMENT:
- All categories must be within 10% of overall score
- Categories cannot exceed overall score by more than 5%
- Use same category weights across all languages
`;

        const prompts = {
            en: `You are a highly critical health information analyzer working in multiple languages. Your scoring MUST be consistent regardless of language.

    ${baseCriteria}

    REQUIRED FORMAT:
    CREDIBILITY_SCORE: [number]
    CONTENT_TYPE: [type]

    1. Scientific Evidence: [number]
    [Detailed analysis of evidence, citations, and methodology]
    Score breakdown:
    - Citations and references (-30 if missing)
    - Data verification (-25 if missing)
    - Methodology explanation (-25 if missing)
    - Specific claims details (-20 if vague)

    2. Emotional Manipulation: [number]
    [Analysis of language tone and persuasion tactics]
    Score breakdown:
    - Objective language (+10)
    - Balanced presentation (+10)
    - No pressure tactics (+10)
    - Clear factual focus (+10)

    3. Scientific Terminology: [number]
    [Evaluation of technical accuracy and clarity]
    Score breakdown:
    - Term accuracy (+10)
    - Proper context (+10)
    - Clear explanations (+10)
    - Appropriate level (+10)

    4. Logical Reasoning: [number]
    [Analysis of argument structure and causation]
    Score breakdown:
    - Clear connections (+10)
    - Supported claims (+10)
    - Proper context (+10)
    - Complete reasoning (+10)

    Each category must include detailed explanation of score calculation.`,

        es: `Eres un analizador crítico de información de salud que trabaja en varios idiomas. Tu puntuación DEBE ser consistente independientemente del idioma.

    ${baseCriteria}

    FORMATO REQUERIDO:
    PUNTUACIÓN_DE_CREDIBILIDAD: [número]
    TIPO_DE_CONTENIDO: [tipo]
    
    1. Evidencia Científica: [número]
    [Análisis detallado de evidencia, citas y metodología]
    
    2. Manipulación Emocional: [número]
    [Análisis del tono del lenguaje y tácticas de persuasión]

    
    3. Terminología Científica: [número]
    [Evaluación de precisión técnica y claridad]

    
    4. Razonamiento Lógico: [número]
    [Análisis de estructura de argumentos y causalidad]

    
    Cada categoría debe incluir explicación detallada del cálculo de puntuación.`
    };
    
    return prompts[language] || prompts.en;
    };

export const analyzeHealth = async (text, language = 'en') => {
    try {
        // Add validation functions here
        const normalizeScore = (score) => {
            let normalized = Math.max(15, Math.min(70, score));
            return Math.round(normalized / 5) * 5;
        };
        
        const validateCategoryScore = (score, overall) => {
            const maxScore = overall + 5;
            const minScore = Math.max(20, overall - 10);
            return normalizeScore(Math.min(maxScore, Math.max(minScore, score)));
        };

        const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
            role: "system",
            content: getSystemPrompt(language)
            },
            {
            role: "user",
            content: text
            }
        ],
        temperature: 0.3,
        });
    
        const analysisText = response.choices[0].message.content;
        console.log('Raw analysis:', analysisText);
    
        // Extract overall score and content type
        const overallScoreMatch = analysisText.match(/CREDIBILITY_SCORE: (\d+)/);
        const contentTypeMatch = analysisText.match(/CONTENT_TYPE: (.+)/);
            
        // Initialize categories with scores and explanations
        const categoryScores = {
        scientificEvidence: {
            score: 0,
            explanation: ''
        },
        emotionalManipulation: {
            score: 0,
            explanation: ''
        },
        scientificTerminology: {
            score: 0,
            explanation: ''
        },
        logicalReasoning: {
            score: 0,
            explanation: ''
        }
        };

        // Extract category scores and explanations
        const sections = analysisText.split('\n\n');
        let currentCategory = null;
        let currentExplanation = [];

        sections.forEach(section => {
            // Match both numbered and unnumbered category headers
            const scientificMatch = section.match(/(?:\d+\.)?\s*Scientific Evidence:?\s*(\d+)?/);
            const emotionalMatch = section.match(/(?:\d+\.)?\s*Emotional Manipulation:?\s*(\d+)?/);
            const terminologyMatch = section.match(/(?:\d+\.)?\s*Scientific Terminology:?\s*(\d+)?/);
            const logicalMatch = section.match(/(?:\d+\.)?\s*Logical Reasoning:?\s*(\d+)?/);
            const overallScoreMatch = analysisText.match(/(?:CREDIBILITY_SCORE|PUNTUACIÓN_DE_CREDIBILIDAD): (\d+)/);
            const overallScore = normalizeScore(overallScoreMatch ? parseInt(overallScoreMatch[1]) : 15);
            const contentTypeMatch = analysisText.match(/CONTENT_TYPE: (.+)/);

            // Extract standalone scores
            const standaloneScore = section.match(/(\w+\s*\w*)\s*:\s*(\d+)/);
            
            if (scientificMatch) {
                if (currentCategory) {
                categoryScores[currentCategory].explanation = currentExplanation.join('\n').trim();
                }
                currentCategory = 'scientificEvidence';
                currentExplanation = [];
                if (scientificMatch[2]) {
                    categoryScores.scientificEvidence.score = validateCategoryScore(parseInt(scientificMatch[2]), overallScore);
                }
            } else if (emotionalMatch) {
                if (currentCategory) {
                categoryScores[currentCategory].explanation = currentExplanation.join('\n').trim();
                }
                currentCategory = 'emotionalManipulation';
                currentExplanation = [];
                if (emotionalMatch[2]) {
                    categoryScores.emotionalManipulation.score = validateCategoryScore(parseInt(emotionalMatch[2]), overallScore);
                }
            } else if (terminologyMatch) {
                if (currentCategory) {
                categoryScores[currentCategory].explanation = currentExplanation.join('\n').trim();
                }
                currentCategory = 'scientificTerminology';
                currentExplanation = [];
                if (terminologyMatch[2]) {
                    categoryScores.scientificTerminology.score = validateCategoryScore(parseInt(terminologyMatch[2]), overallScore);
                }
            } else if (logicalMatch) {
                if (currentCategory) {
                categoryScores[currentCategory].explanation = currentExplanation.join('\n').trim();
                }
                currentCategory = 'logicalReasoning';
                currentExplanation = [];
                if (logicalMatch[2]) {
                    categoryScores.logicalReasoning.score = validateCategoryScore(parseInt(logicalMatch[2]), overallScore);
                }
            } else if (standaloneScore) {
                // Handle standalone score lines
                const category = standaloneScore[1].toLowerCase().replace(/\s+/g, '');
                if (categoryScores[category]) {
                categoryScores[category].score = parseInt(standaloneScore[2]);
                }
            } else if (currentCategory && section.trim()) {
                // Collect explanation text
                currentExplanation.push(section.trim());
            }
        });
        
        // Don't forget the last category's explanation
        if (currentCategory) {
        categoryScores[currentCategory].explanation = currentExplanation.join('\n').trim();
        }

        // Set default scores from category scores section if not found in detailed sections
        const categoryScoresSection = analysisText.match(/CATEGORY_SCORES:([\s\S]*?)(?:\n\n|$)/);
        if (categoryScoresSection) {
        const scoreLines = categoryScoresSection[1].split('\n');
        scoreLines.forEach(line => {
            if (line.includes('Scientific Evidence:')) {
                const match = line.match(/: (\d+)/);
                if (match && categoryScores.scientificEvidence.score === 0) {
                    categoryScores.scientificEvidence.score = validateCategoryScore(parseInt(match[1]), overallScore);
                }
            }
            if (line.includes('Emotional Manipulation:')) {
                const match = line.match(/: (\d+)/);
                if (match && categoryScores.emotionalManipulation.score === 0) {
                    categoryScores.emotionalManipulation.score = validateCategoryScore(parseInt(match[1]), overallScore);
                }
            }
            if (line.includes('Scientific Terminology:')) {
                const match = line.match(/: (\d+)/);
                if (match && categoryScores.scientificTerminology.score === 0) {
                    categoryScores.scientificTerminology.score = validateCategoryScore(parseInt(match[1]), overallScore);
                }
            }
            if (line.includes('Logical Reasoning:')) {
                const match = line.match(/: (\d+)/);
                if (match && categoryScores.logicalReasoning.score === 0) {
                    categoryScores.logicalReasoning.score = validateCategoryScore(parseInt(match[1]), overallScore);
                }
            }
        });
        }

        // Add this before the return statement
        console.log('Processed scores:', {
            scientific: categoryScores.scientificEvidence.score,
            emotional: categoryScores.emotionalManipulation.score,
            terminology: categoryScores.scientificTerminology.score,
            logical: categoryScores.logicalReasoning.score
        });
        console.log('Processed explanations:', {
            scientific: categoryScores.scientificEvidence.explanation,
            emotional: categoryScores.emotionalManipulation.explanation,
            terminology: categoryScores.scientificTerminology.explanation,
            logical: categoryScores.logicalReasoning.explanation
        });

        return {
            fullText: analysisText,
            credibilityScore: overallScoreMatch ? parseInt(overallScoreMatch[1]) : 0,
            contentType: contentTypeMatch ? contentTypeMatch[1].trim() : 'Unknown',
            categoryScores: categoryScores
        };
        
    } catch (error) {
        console.error('OpenAI error:', error);
        throw error;
    }
};