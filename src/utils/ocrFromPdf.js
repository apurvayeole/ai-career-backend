import { PDFDocument } from "pdf-lib";
import Tesseract from "tesseract.js-node";

export const extractTextFromPDF = async (buffer) => {
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  let finalText = "";

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];

    // Render PDF page as PNG
    const pngImage = await page.renderToImage({
      scale: 2,
      format: "png"
    });

    const { data: { text } } = await Tesseract.recognize(
      pngImage,
      "eng",
      { logger: false }
    );

    finalText += text + "\n";
  }

  return finalText.trim();
};
