import pptxgen from "pptxgenjs";
import { AnalysisResult, generatePresentationContent, generateImage } from "./gemini";

export async function generatePresentation(result: AnalysisResult, language: 'ar' | 'en') {
  console.log("Starting presentation generation...");
  try {
    const { slides } = await generatePresentationContent(result, language);
    console.log("Generated slides content:", slides);
    
    const pres = new pptxgen();
    
    // Set layout
    pres.layout = "LAYOUT_16x9";
    
    let idx = 0;
    for (const slideData of slides) {
      const slide = pres.addSlide();
      
      // Background for title slide
      if (idx === 0) {
        slide.background = { color: "0F172A" };
        
        slide.addText(slideData.title, {
          x: 1,
          y: 1.5,
          w: "80%",
          h: 1,
          fontSize: 44,
          bold: true,
          color: "FFFFFF",
          align: "center",
          fontFace: language === 'ar' ? "Arial" : "Inter",
          rtl: language === 'ar'
        } as any);
        
        slide.addText(slideData.content, {
          x: 1,
          y: 2.8,
          w: "80%",
          h: 1.5,
          fontSize: 18,
          color: "94A3B8",
          align: "center",
          fontFace: language === 'ar' ? "Arial" : "Inter",
          rtl: language === 'ar'
        } as any);
      } else {
        // Standard Slide
        slide.addText(slideData.title, {
          x: 0.5,
          y: 0.5,
          w: "90%",
          h: 0.5,
          fontSize: 32,
          bold: true,
          color: "1E293B",
          fontFace: language === 'ar' ? "Arial" : "Inter",
          rtl: language === 'ar',
          align: language === 'ar' ? "right" : "left"
        } as any);
        
        const hasImage = !!slideData.imagePrompt;
        const contentWidth = hasImage ? "55%" : "90%";
        const contentX = (language === 'ar' && hasImage) ? 4 : 0.5;
        
        slide.addText(slideData.content, {
          x: contentX,
          y: 1.2,
          w: contentWidth,
          h: 4,
          fontSize: 14,
          color: "475569",
          bullet: true,
          fontFace: language === 'ar' ? "Arial" : "Inter",
          rtl: language === 'ar',
          align: language === 'ar' ? "right" : "left"
        } as any);
  
        if (slideData.imagePrompt) {
          try {
            console.log(`Generating image for slide ${idx}: ${slideData.imagePrompt}`);
            const imageData = await generateImage(slideData.imagePrompt);
            
            if (imageData) {
              const imageX = language === 'ar' ? 0.5 : 6;
              slide.addImage({
                data: imageData,
                x: imageX,
                y: 1.2,
                w: 3.5,
                h: 3.5,
                sizing: { type: "contain", w: 3.5, h: 3.5 }
              });
            }
          } catch (e) {
            console.warn("Failed to generate or add image to slide:", e);
          }
        }
      }
  
      // Footer
      const footerText = language === 'ar' ? "تحليل مستشار الجودة بالذكاء الاصطناعي" : "AI Quality Consultant Analysis";
      slide.addText(footerText, {
        x: 0.5,
        y: 5.2,
        w: "90%",
        h: 0.3,
        fontSize: 10,
        color: "94A3B8",
        align: language === 'ar' ? "left" : "right",
        rtl: language === 'ar'
      } as any);

      idx++;
    }
  
    // Save the presentation
    const fileName = `${result.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}_Presentation.pptx`;
    console.log("Saving presentation as:", fileName);
    try {
      await pres.writeFile({ fileName });
      console.log("Presentation saved successfully.");
    } catch (saveError) {
      console.error("Error saving presentation file:", saveError);
      throw saveError;
    }
  } catch (error) {
    console.error("Error in generatePresentation:", error);
    throw error;
  }
}
