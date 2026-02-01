// lib/fileParser.ts

import * as mammoth from 'mammoth';

/**
 * Parse text content from various file types
 */
export async function parseFile(file: File): Promise<string> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'txt':
      return parseTextFile(file);
    case 'pdf':
      return parsePDFFile(file);
    case 'docx':
      return parseDocxFile(file);
    case 'doc':
      return parseDocxFile(file);
    case 'pptx':
      return parsePptxFile(file);
    default:
      throw new Error(`Unsupported file type: ${fileType}`);
  }
}

/**
 * Parse plain text file
 */
async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
}

/**
 * Parse PDF file using PDF.js
 */
async function parsePDFFile(file: File): Promise<string> {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Use local worker file
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    
    const arrayBuffer = await file.arrayBuffer();
    
    const pdf = await pdfjsLib.getDocument({
      data: arrayBuffer,
    }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    
    if (!fullText.trim()) {
      throw new Error('No text content found. The PDF might contain only images.');
    }
    
    return fullText.trim();
  } catch (error: any) {
    console.error('PDF parsing error:', error);
    throw new Error(error.message || 'Failed to parse PDF. Please try pasting text manually.');
  }
}

/**
 * Parse DOCX file using Mammoth
 */
async function parseDocxFile(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse Word document. Please try copying the text manually.');
  }
}

/**
 * Parse PPTX file (basic text extraction)
 */
async function parsePptxFile(file: File): Promise<string> {
  try {
    // PPTX files are ZIP archives containing XML
    const JSZip = (await import('jszip')).default;
    
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);
    
    let fullText = '';
    
    // Find all slide XML files
    const slideFiles = Object.keys(zip.files).filter(
      name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml')
    );
    
    // Sort slides by number
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)/)?.[1] || '0');
      const numB = parseInt(b.match(/slide(\d+)/)?.[1] || '0');
      return numA - numB;
    });
    
    // Extract text from each slide
    for (const slideFile of slideFiles) {
      const content = await zip.file(slideFile)?.async('string');
      if (content) {
        // Extract text between <a:t> tags (PowerPoint text elements)
        const textMatches = content.match(/<a:t>([^<]*)<\/a:t>/g) || [];
        const slideText = textMatches
          .map(match => match.replace(/<\/?a:t>/g, ''))
          .join(' ');
        
        if (slideText.trim()) {
          fullText += slideText + '\n\n';
        }
      }
    }
    
    if (!fullText.trim()) {
      throw new Error('No text content found in PowerPoint file');
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PPTX parsing error:', error);
    throw new Error('Failed to parse PowerPoint file. Please try copying the text manually.');
  }
}

/**
 * Get supported file extensions
 */
export function getSupportedExtensions(): string[] {
  return ['.txt', '.pdf', '.docx', '.doc', '.pptx'];
}

/**
 * Check if file type is supported
 */
export function isFileSupported(fileName: string): boolean {
  const ext = '.' + fileName.split('.').pop()?.toLowerCase();
  return getSupportedExtensions().includes(ext);
}