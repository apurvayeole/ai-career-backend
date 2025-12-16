import pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

export const extractPdfText = async (buffer) => {
  const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;
  let finalText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const strings = content.items.map(item => item.str || "");
    finalText += strings.join(" ") + "\n";
  }

  return finalText.trim();
};
