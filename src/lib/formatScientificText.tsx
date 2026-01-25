import React from 'react';

interface FormattedTextProps {
  content: string;
  className?: string;
}

// Parse LaTeX-style formulas and convert to readable format
export function parseFormulas(text: string): string {
  if (!text) return '';
  
  let result = text;
  
  // Handle inline math with $ delimiters
  result = result.replace(/\$([^$]+)\$/g, (_, formula) => formatFormula(formula));
  
  // Handle common LaTeX patterns without delimiters
  result = result.replace(/\\alpha/g, 'α');
  result = result.replace(/\\beta/g, 'β');
  result = result.replace(/\\gamma/g, 'γ');
  result = result.replace(/\\delta/g, 'δ');
  result = result.replace(/\\Delta/g, 'Δ');
  result = result.replace(/\\epsilon/g, 'ε');
  result = result.replace(/\\theta/g, 'θ');
  result = result.replace(/\\lambda/g, 'λ');
  result = result.replace(/\\mu/g, 'μ');
  result = result.replace(/\\sigma/g, 'σ');
  result = result.replace(/\\omega/g, 'ω');
  result = result.replace(/\\pi/g, 'π');
  result = result.replace(/\\rho/g, 'ρ');
  result = result.replace(/\\tau/g, 'τ');
  result = result.replace(/\\phi/g, 'φ');
  result = result.replace(/\\psi/g, 'ψ');
  result = result.replace(/\\circ/g, '°');
  result = result.replace(/\\deg/g, '°');
  result = result.replace(/\\approx/g, '≈');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\infty/g, '∞');
  result = result.replace(/\\rightarrow/g, '→');
  result = result.replace(/\\leftarrow/g, '←');
  
  return result;
}

function formatFormula(formula: string): string {
  let result = formula;
  
  // Greek letters
  result = result.replace(/\\alpha/g, 'α');
  result = result.replace(/\\beta/g, 'β');
  result = result.replace(/\\gamma/g, 'γ');
  result = result.replace(/\\delta/g, 'δ');
  result = result.replace(/\\Delta/g, 'Δ');
  result = result.replace(/\\epsilon/g, 'ε');
  result = result.replace(/\\theta/g, 'θ');
  result = result.replace(/\\lambda/g, 'λ');
  result = result.replace(/\\mu/g, 'μ');
  result = result.replace(/\\sigma/g, 'σ');
  result = result.replace(/\\omega/g, 'ω');
  result = result.replace(/\\pi/g, 'π');
  result = result.replace(/\\rho/g, 'ρ');
  result = result.replace(/\\tau/g, 'τ');
  result = result.replace(/\\phi/g, 'φ');
  result = result.replace(/\\psi/g, 'ψ');
  
  // Common operators and symbols
  result = result.replace(/\\circ/g, '°');
  result = result.replace(/\\deg/g, '°');
  result = result.replace(/\\approx/g, '≈');
  result = result.replace(/\\geq/g, '≥');
  result = result.replace(/\\leq/g, '≤');
  result = result.replace(/\\neq/g, '≠');
  result = result.replace(/\\pm/g, '±');
  result = result.replace(/\\cdot/g, '·');
  result = result.replace(/\\times/g, '×');
  result = result.replace(/\\infty/g, '∞');
  result = result.replace(/\\rightarrow/g, '→');
  result = result.replace(/\\leftarrow/g, '←');
  
  // Subscripts: _{...} or _x -> subscript
  result = result.replace(/_\{([^}]+)\}/g, '₍$1₎');
  result = result.replace(/_([a-zA-Z0-9])/g, (_, char) => toSubscript(char));
  
  // Superscripts: ^{...} or ^x -> superscript
  result = result.replace(/\^\{([^}]+)\}/g, (_, content) => toSuperscriptString(content));
  result = result.replace(/\^([a-zA-Z0-9\-+])/g, (_, char) => toSuperscript(char));
  
  // Fractions: \frac{a}{b} -> a/b
  result = result.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1/$2)');
  
  // Square root: \sqrt{...}
  result = result.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  
  // Clean up remaining LaTeX commands
  result = result.replace(/\\[a-zA-Z]+/g, '');
  result = result.replace(/[{}]/g, '');
  
  return result;
}

function toSubscript(char: string): string {
  const subscripts: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ',
    'k': 'ₖ', 'l': 'ₗ', 'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ',
    'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ',
    'v': 'ᵥ', 'x': 'ₓ',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎'
  };
  return subscripts[char] || `_${char}`;
}

function toSuperscript(char: string): string {
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
    'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
    'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
    'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
    'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾'
  };
  return superscripts[char] || `^${char}`;
}

function toSuperscriptString(str: string): string {
  return str.split('').map(toSuperscript).join('');
}

// Parse markdown-like formatting
export function parseMarkdown(text: string): React.ReactNode[] {
  const parsed = parseFormulas(text);
  const elements: React.ReactNode[] = [];
  let key = 0;
  
  // Split by lines
  const lines = parsed.split('\n');
  
  lines.forEach((line, lineIndex) => {
    if (lineIndex > 0) {
      elements.push(<br key={`br-${key++}`} />);
    }
    
    // Process inline formatting
    const parts = processInlineFormatting(line, key);
    elements.push(...parts.elements);
    key = parts.nextKey;
  });
  
  return elements;
}

function processInlineFormatting(text: string, startKey: number): { elements: React.ReactNode[]; nextKey: number } {
  const elements: React.ReactNode[] = [];
  let key = startKey;
  let remaining = text;
  
  // Process bold: **text** or __text__
  const boldRegex = /\*\*([^*]+)\*\*|__([^_]+)__/;
  
  while (remaining.length > 0) {
    const boldMatch = remaining.match(boldRegex);
    
    if (boldMatch && boldMatch.index !== undefined) {
      // Add text before match
      if (boldMatch.index > 0) {
        elements.push(<span key={`text-${key++}`}>{remaining.slice(0, boldMatch.index)}</span>);
      }
      
      // Add bold text
      const boldContent = boldMatch[1] || boldMatch[2];
      elements.push(<strong key={`bold-${key++}`} className="font-semibold text-foreground">{boldContent}</strong>);
      
      remaining = remaining.slice(boldMatch.index + boldMatch[0].length);
    } else {
      // No more matches, add remaining text
      if (remaining) {
        elements.push(<span key={`text-${key++}`}>{remaining}</span>);
      }
      break;
    }
  }
  
  return { elements, nextKey: key };
}

// Component for formatted scientific text
export function FormattedText({ content, className = '' }: FormattedTextProps) {
  const elements = parseMarkdown(content);
  
  return (
    <span className={className}>
      {elements}
    </span>
  );
}

// Parse citations [1], [2], etc. and extract URLs
export interface Citation {
  number: number;
  url: string;
  title?: string;
}

export function parseCitationsFromResponse(response: string): { 
  cleanText: string; 
  citations: Citation[] 
} {
  const citations: Citation[] = [];
  let cleanText = response;
  
  // Look for reference section patterns like [1]: url or [1] url
  const refPattern = /\[(\d+)\]:?\s*(https?:\/\/[^\s\n]+)(?:\s+"([^"]+)")?/g;
  let match;
  
  while ((match = refPattern.exec(response)) !== null) {
    citations.push({
      number: parseInt(match[1]),
      url: match[2],
      title: match[3]
    });
  }
  
  // Remove reference section from main text
  cleanText = cleanText.replace(/\n*(?:References|Sources|Citations):\s*\n[\s\S]*$/i, '');
  cleanText = cleanText.replace(/\[(\d+)\]:?\s*https?:\/\/[^\s\n]+(?:\s+"[^"]+")?\n?/g, '');
  
  return { cleanText, citations };
}
