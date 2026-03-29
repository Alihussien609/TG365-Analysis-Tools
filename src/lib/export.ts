import * as XLSX from 'xlsx';
import pptxgen from 'pptxgenjs';
import { AnalysisResult } from './gemini';

export function exportToExcel(result: AnalysisResult) {
  const wb = XLSX.utils.book_new();
  
  // Flatten data for Excel
  let dataToExport: any[] = [];
  if (Array.isArray(result.data)) {
    dataToExport = result.data;
  } else if (typeof result.data === 'object') {
    // For objects like SWOT or Fishbone, we might need custom flattening
    if (result.tool === 'swot') {
      const maxLen = Math.max(
        result.data.strengths.length,
        result.data.weaknesses.length,
        result.data.opportunities.length,
        result.data.threats.length
      );
      for (let i = 0; i < maxLen; i++) {
        dataToExport.push({
          Strengths: result.data.strengths[i] || '',
          Weaknesses: result.data.weaknesses[i] || '',
          Opportunities: result.data.opportunities[i] || '',
          Threats: result.data.threats[i] || ''
        });
      }
    } else {
      dataToExport = [result.data];
    }
  }

  const ws = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.book_append_sheet(wb, ws, result.tool.toUpperCase());
  
  // Add recommendations sheet
  const recWs = XLSX.utils.json_to_sheet(result.recommendations.map(r => ({ Recommendation: r })));
  XLSX.utils.book_append_sheet(wb, recWs, "Recommendations");

  XLSX.writeFile(wb, `TG365_${result.tool}_Analysis.xlsx`);
}

export function exportToPPT(result: AnalysisResult) {
  const pptx = new pptxgen();
  
  // Title Slide
  let slide = pptx.addSlide();
  slide.addText("TG365 Analysis Report", { x: 1, y: 1, fontSize: 32, bold: true, color: "363636" });
  slide.addText(`${result.title} (${result.tool.toUpperCase()})`, { x: 1, y: 2, fontSize: 24, color: "666666" });
  slide.addText(new Date().toLocaleDateString(), { x: 1, y: 3, fontSize: 14 });

  // Summary Slide
  slide = pptx.addSlide();
  slide.addText("Executive Summary", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
  slide.addText(result.summary, { x: 0.5, y: 1.2, w: 9, fontSize: 14 });

  // Data Slide(s)
  slide = pptx.addSlide();
  slide.addText("Analysis Details", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
  // Add table or text based on tool
  if (Array.isArray(result.data)) {
    const headers = Object.keys(result.data[0]);
    const rows = result.data.map(item => Object.values(item));
    slide.addTable([headers, ...rows], { x: 0.5, y: 1.2, w: 9 });
  } else {
    slide.addText(JSON.stringify(result.data, null, 2), { x: 0.5, y: 1.2, w: 9, fontSize: 10 });
  }

  // Recommendations Slide
  slide = pptx.addSlide();
  slide.addText("Recommendations", { x: 0.5, y: 0.5, fontSize: 24, bold: true });
  result.recommendations.forEach((rec, i) => {
    slide.addText(`• ${rec}`, { x: 0.5, y: 1.2 + (i * 0.5), w: 9, fontSize: 14 });
  });

  pptx.writeFile({ fileName: `TG365_${result.tool}_Analysis.pptx` });
}
