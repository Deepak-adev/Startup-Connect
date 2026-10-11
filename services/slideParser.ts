export interface ParsedSlide {
  slideNumber: number;
  title: string;
  content: string;
  speakerNotes: string;
  rawText: string;
}

/**
 * Parse a pitch deck script into individual slides
 * Handles various formats of slide scripts
 */
export const parseSlideScript = (script: string): ParsedSlide[] => {
  const slides: ParsedSlide[] = [];

  // Split by common slide markers
  const slidePatterns = [
    /Slide\s+(\d+):\s*([^\n]+)/gi,
    /\*\*Slide\s+(\d+):\s*([^\n]+)\*\*/gi,
    /###\s*Slide\s+(\d+):\s*([^\n]+)/gi,
  ];

  // Try to find slide boundaries
  let slideMatches: RegExpMatchArray[] = [];
  let pattern: RegExp | null = null;

  for (const testPattern of slidePatterns) {
    const matches = Array.from(script.matchAll(testPattern));
    if (matches.length > 0) {
      slideMatches = matches;
      pattern = testPattern;
      break;
    }
  }

  if (slideMatches.length === 0) {
    // Fallback: try to split by numbered sections
    const fallbackPattern = /(\d+)\.\s*([^\n]+)/g;
    slideMatches = Array.from(script.matchAll(fallbackPattern));
    pattern = fallbackPattern;
  }

  if (slideMatches.length === 0) {
    // Ultimate fallback: create a single slide
    return [{
      slideNumber: 1,
      title: 'Pitch Deck',
      content: script,
      speakerNotes: '',
      rawText: script
    }];
  }

  // Process each slide
  for (let i = 0; i < slideMatches.length; i++) {
    const match = slideMatches[i];
    const slideNumber = parseInt(match[1] || (i + 1).toString(), 10);
    const title = match[2]?.trim() || `Slide ${slideNumber}`;

    // Extract content between this slide and the next
    const startIndex = match.index || 0;
    const endIndex = i < slideMatches.length - 1
      ? (slideMatches[i + 1].index || script.length)
      : script.length;

    const slideText = script.substring(startIndex, endIndex);

    // Parse content and speaker notes
    const { content, speakerNotes } = extractContentAndNotes(slideText);

    slides.push({
      slideNumber,
      title,
      content,
      speakerNotes,
      rawText: slideText
    });
  }

  return slides;
};

/**
 * Extract slide content and speaker notes from slide text
 */
const extractContentAndNotes = (slideText: string): { content: string; speakerNotes: string } => {
  // Look for speaker notes section
  const speakerNotesPatterns = [
    /Speaker\s+Notes?:\s*([^]*?)(?=\n\nSlide|\n\n\d+\.|\n\n###|$)/i,
    /Notes?:\s*([^]*?)(?=\n\nSlide|\n\n\d+\.|\n\n###|$)/i,
    /\[Speaker\s+Notes?\]:?\s*([^]*?)(?=\n\nSlide|\n\n\d+\.|\n\n###|$)/i,
  ];

  let speakerNotes = '';
  let contentText = slideText;

  for (const pattern of speakerNotesPatterns) {
    const match = slideText.match(pattern);
    if (match) {
      speakerNotes = match[1].trim();
      // Remove speaker notes from content
      contentText = slideText.replace(pattern, '').trim();
      break;
    }
  }

  // Clean up the content - remove the slide header
  contentText = contentText.replace(/^Slide\s+\d+:\s*[^\n]+\n*/i, '');
  contentText = contentText.replace(/^\*\*Slide\s+\d+:\s*[^\n]+\*\*\n*/i, '');
  contentText = contentText.replace(/^###\s*Slide\s+\d+:\s*[^\n]+\n*/i, '');
  contentText = contentText.replace(/^\d+\.\s*[^\n]+\n*/i, '');

  // Remove speaker notes section if it's still there
  for (const pattern of speakerNotesPatterns) {
    contentText = contentText.replace(pattern, '');
  }

  return {
    content: contentText.trim(),
    speakerNotes: speakerNotes.trim()
  };
};

/**
 * Generate a summary of a slide for image generation
 */
export const generateSlideSummary = (slide: ParsedSlide): string => {
  // Create a concise summary for image generation
  const contentPoints = slide.content
    .split('\n')
    .filter(line => line.trim().length > 0)
    .slice(0, 5) // Take first 5 points
    .join('\n');

  return `${slide.title}\n\n${contentPoints}`;
};

/**
 * Validate and clean script before parsing
 */
export const cleanScript = (script: string): string => {
  // Remove excessive whitespace
  let cleaned = script.replace(/\n{3,}/g, '\n\n');

  // Normalize slide headers
  cleaned = cleaned.replace(/\*\*Slide\s+(\d+):\s*([^\*]+)\*\*/gi, 'Slide $1: $2');

  // Trim
  cleaned = cleaned.trim();

  return cleaned;
};
