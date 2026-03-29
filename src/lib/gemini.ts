import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  // Vite's define will replace the exact string 'process.env.GEMINI_API_KEY'
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === '') {
    throw new Error("Gemini API Key is missing. If you are on Vercel, please add GEMINI_API_KEY to your Project Environment Variables.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export type ToolType = 'fishbone' | 'fmea' | 'dmaic' | 'pdca' | 'swot' | 'five_why' | 'document_analysis';

export interface AnalysisResult {
  tool: ToolType;
  title: string;
  summary: string;
  data: any;
  recommendations: string[];
  insights: {
    kpi: string;
    value: string;
    trend: 'up' | 'down' | 'neutral';
  }[];
  documentAnalysis?: {
    summary: string;
    keyPoints: {
      point: string;
      aiOpinion: string;
      importance: 'high' | 'medium' | 'low';
    }[];
  };
}

const SCHEMAS: Record<ToolType, any> = {
  fishbone: {
    type: Type.OBJECT,
    properties: {
      categories: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Category name (Man, Machine, etc.)" },
            causes: { type: Type.ARRAY, items: { type: Type.STRING } },
            deepAnalysis: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                expertOpinion: { type: Type.STRING, description: "Professional expert opinion on this specific category" },
                proposedSolution: { type: Type.STRING, description: "Specific proposed solution for this category's issues" },
                summary: { type: Type.STRING, description: "A concise summary of the findings for this specific category" }
              },
              required: ["content", "expertOpinion", "proposedSolution", "summary"]
            }
          },
          required: ["name", "causes"]
        }
      },
      rootCause: { type: Type.STRING }
    },
    required: ["categories", "rootCause"]
  },
  fmea: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        failureMode: { type: Type.STRING },
        cause: { type: Type.STRING },
        effect: { type: Type.STRING },
        severity: { type: Type.NUMBER },
        occurrence: { type: Type.NUMBER },
        detection: { type: Type.NUMBER },
        rpn: { type: Type.NUMBER },
        deepAnalysis: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            expertOpinion: { type: Type.STRING },
            proposedSolution: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["content", "expertOpinion", "proposedSolution", "summary"]
        }
      },
      required: ["failureMode", "cause", "effect", "severity", "occurrence", "detection", "rpn"]
    }
  },
  dmaic: {
    type: Type.OBJECT,
    properties: {
      define: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      measure: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      analyze: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      improve: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      control: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      ganttTasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            start: { type: Type.STRING, description: "Start date in YYYY-MM-DD format" },
            end: { type: Type.STRING, description: "End date in YYYY-MM-DD format" },
            progress: { type: Type.NUMBER },
            dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            owner: { type: Type.STRING }
          },
          required: ["id", "name", "start", "end", "progress", "owner"]
        }
      }
    },
    required: ["define", "measure", "analyze", "improve", "control", "ganttTasks"]
  },
  pdca: {
    type: Type.OBJECT,
    properties: {
      plan: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      do: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      check: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      act: { 
        type: Type.OBJECT, 
        properties: { 
          summary: { type: Type.STRING }, 
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] } 
        },
        required: ["summary"]
      },
      ganttTasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            start: { type: Type.STRING, description: "Start date in YYYY-MM-DD format" },
            end: { type: Type.STRING, description: "End date in YYYY-MM-DD format" },
            progress: { type: Type.NUMBER },
            dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            owner: { type: Type.STRING }
          },
          required: ["id", "name", "start", "end", "progress", "owner"]
        }
      }
    },
    required: ["plan", "do", "check", "act", "ganttTasks"]
  },
  swot: {
    type: Type.OBJECT,
    properties: {
      strengths: { 
        type: Type.OBJECT,
        properties: {
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] }
        },
        required: ["items"]
      },
      weaknesses: { 
        type: Type.OBJECT,
        properties: {
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] }
        },
        required: ["items"]
      },
      opportunities: { 
        type: Type.OBJECT,
        properties: {
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] }
        },
        required: ["items"]
      },
      threats: { 
        type: Type.OBJECT,
        properties: {
          items: { type: Type.ARRAY, items: { type: Type.STRING } },
          deepAnalysis: { type: Type.OBJECT, properties: { content: { type: Type.STRING }, expertOpinion: { type: Type.STRING }, proposedSolution: { type: Type.STRING }, summary: { type: Type.STRING } }, required: ["content", "expertOpinion", "proposedSolution", "summary"] }
        },
        required: ["items"]
      }
    },
    required: ["strengths", "weaknesses", "opportunities", "threats"]
  },
  five_why: {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        level: { type: Type.NUMBER },
        question: { type: Type.STRING },
        answer: { type: Type.STRING },
        deepAnalysis: {
          type: Type.OBJECT,
          properties: {
            content: { type: Type.STRING },
            expertOpinion: { type: Type.STRING },
            proposedSolution: { type: Type.STRING },
            summary: { type: Type.STRING }
          },
          required: ["content", "expertOpinion", "proposedSolution", "summary"]
        }
      },
      required: ["level", "question", "answer"]
    }
  },
  document_analysis: {
    type: Type.OBJECT,
    properties: {
      summary: { type: Type.STRING, description: "Comprehensive summary of the document" },
      keyPoints: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            point: { type: Type.STRING, description: "A key point extracted from the document" },
            aiOpinion: { type: Type.STRING, description: "The AI's professional opinion and analysis of this specific point" },
            proposedSolution: { type: Type.STRING, description: "A specific recommendation or solution related to this point" },
            importance: { type: Type.STRING, enum: ["high", "medium", "low"] },
            summary: { type: Type.STRING, description: "A concise summary of the findings for this specific point" }
          },
          required: ["point", "aiOpinion", "proposedSolution", "importance", "summary"]
        }
      }
    },
    required: ["summary", "keyPoints"]
  }
};

export async function performAnalysis(
  tool: ToolType, 
  input: string, 
  language: 'ar' | 'en',
  extra?: { projectName?: string; projectGoal?: string; constraints?: string; methodology?: string }
): Promise<AnalysisResult> {
  try {
    let prompt = `Act as a world-class Quality and Management Consultant. Analyze the following problem using the ${tool.toUpperCase()} tool. 
    Input: ${input}
    Language: ${language === 'ar' ? 'Arabic' : 'English'}
    ${extra?.projectName ? `Project Name: ${extra.projectName}` : ''}
    ${extra?.projectGoal ? `Project Goal: ${extra.projectGoal}` : ''}
    ${extra?.constraints ? `Constraints: ${extra.constraints}` : ''}
    ${extra?.methodology ? `Preferred Methodology: ${extra.methodology}` : ''}

    CRITICAL: Output ALL fields (title, summary, data fields, recommendations, insights, etc.) strictly in the specified language (${language === 'ar' ? 'Arabic' : 'English'}).

    CRITICAL: For each element of the analysis (each category in Fishbone, each row in FMEA, each phase in DMAIC/PDCA, each section in SWOT, each level in 5-Why), provide a "deepAnalysis" object.
    The "deepAnalysis" MUST contain:
    - "content": A very detailed, professional, and deep explanation of this specific part of the analysis. Use industry-standard terminology.
    - "expertOpinion": Your professional expert opinion on this specific part of the analysis, focusing on the root causes and implications.
    - "proposedSolution": A concrete, actionable, and specific proposed solution or mitigation strategy for the issues identified in this part.
    - "summary": (Mandatory) Provide a concise, high-level summary of the findings and key takeaways for this specific part of the analysis.

    The analysis must be extremely detailed, specific to the user's problem, and provide deep strategic value.
    `;

    if (tool === 'document_analysis') {
      prompt = `Act as a world-class Business and Strategy Analyst. Analyze the following document content comprehensively and accurately.
      
      Document Content: ${input}
      Language: ${language === 'ar' ? 'Arabic' : 'English'}

      CRITICAL: Output ALL fields (summary, key points, AI opinions, solutions, etc.) strictly in the specified language (${language === 'ar' ? 'Arabic' : 'English'}).

      Your task:
      1. Provide a comprehensive and detailed summary of the document.
      2. Extract the most important key points.
      3. For EACH key point:
         - Provide a deep, professional AI opinion and analysis.
         - Provide a specific proposed solution or recommendation.
         - Provide a concise summary of the findings for this specific point.
      4. Assign an importance level (high, medium, low) to each point.

      The analysis must be thorough, accurate, and provide high-value insights specific to the document's context.`;
    }

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            summary: { type: Type.STRING },
            data: SCHEMAS[tool],
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  kpi: { type: Type.STRING },
                  value: { type: Type.STRING },
                  trend: { type: Type.STRING, enum: ["up", "down", "neutral"] }
                },
                required: ["kpi", "value", "trend"]
              }
            }
          },
          required: ["title", "summary", "data", "recommendations", "insights"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("The AI model returned an empty response. Please try again.");
    }

    const result = JSON.parse(text);
    return {
      tool,
      ...result,
      documentAnalysis: tool === 'document_analysis' ? result.data : undefined
    };
  } catch (error: any) {
    console.error("Error in performAnalysis:", error);
    if (error?.message?.includes("API Key")) {
      throw new Error("Gemini API Key is invalid or missing. Please check your environment variables.");
    }
    throw new Error(`Analysis failed: ${error?.message || "Unknown error"}`);
  }
}

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Create a professional, high-quality illustrative image for a business presentation. 
            The image should be clean, modern, and relevant to this topic: ${prompt}. 
            Avoid text in the image. Style: Professional 3D illustration or high-quality corporate graphic.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    return null;
  }
}

export async function generatePresentationContent(
  result: AnalysisResult, 
  language: 'ar' | 'en'
): Promise<{ slides: { title: string; content: string; imagePrompt?: string }[] }> {
  console.log("Generating presentation content with Gemini...");
  const prompt = `Act as a world-class Presentation Designer. Based on the following analysis result, generate a professional PowerPoint presentation structure.
  
  Analysis Title: ${result.title}
  Analysis Summary: ${result.summary}
  Tool Used: ${result.tool}
  Language: ${language === 'ar' ? 'Arabic' : 'English'}

  CRITICAL: Output ALL slide titles and content strictly in the specified language (${language === 'ar' ? 'Arabic' : 'English'}).
  
  For each slide, provide:
  1. A concise title.
  2. Detailed but bulleted content.
  3. A descriptive English prompt for generating a professional illustrative image for this slide.
  
  Structure the presentation to be engaging, professional, and visually rich. Include slides for:
  - Title Slide
  - Executive Summary
  - Key Findings (multiple slides if needed)
  - Strategic Insights
  - Expert Recommendations
  - Proposed Solutions
  - Conclusion
  
  Return the response in JSON format.
  `;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  imagePrompt: { type: Type.STRING, description: "A descriptive English prompt for generating a professional illustrative image for this slide" }
                },
                required: ["title", "content", "imagePrompt"]
              }
            }
          },
          required: ["slides"]
        }
      }
    });

    console.log("Gemini response received for presentation content.");
    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error in generatePresentationContent:", error);
    // Fallback content if AI fails
    return {
      slides: [
        { title: result.title, content: result.summary },
        { title: "Key Recommendations", content: result.recommendations.join('\n') }
      ]
    };
  }
}
export async function enhanceProblemStatement(input: string, language: 'ar' | 'en'): Promise<string> {
  try {
    const prompt = `Act as a world-class Quality and Management Consultant. 
    The user has provided a basic problem statement. Your task is to enhance it, making it more professional, detailed, and structured (e.g., including context, impact, and specific details if possible).
    
    Original Input: ${input}
    Language: ${language === 'ar' ? 'Arabic' : 'English'}
    
    CRITICAL: Return ONLY the enhanced text strictly in the specified language (${language === 'ar' ? 'Arabic' : 'English'}). Do not include any introductory or concluding remarks.`;

    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || input;
  } catch (error) {
    console.error("Error in enhanceProblemStatement:", error);
    return input;
  }
}
