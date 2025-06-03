'use client';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Simple markdown parsing function
  const parseMarkdown = (text: string): string => {
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold text-gray-800 mb-3 mt-6">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold text-gray-900 mb-4 mt-8">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold text-gray-900 mb-6 mt-8">$1</h1>');
    
    // Code blocks
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="bg-gray-900 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto">
        <pre><code class="text-sm">${code.trim()}</code></pre>
      </div>`;
    });
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    
    // Unordered lists
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4">• $1</li>');
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>');
    
    // Ordered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>');
    
    // Wrap consecutive list items
    html = html.replace(/(<li.*?>.*?<\/li>\n?)+/g, (match) => {
      return `<ul class="space-y-1 my-3">${match}</ul>`;
    });
    
    // Paragraphs (only for lines that don't start with HTML tags)
    const lines = html.split('\n');
    const processedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && 
          !trimmedLine.startsWith('<') && 
          !trimmedLine.startsWith('•') &&
          !trimmedLine.match(/^\d+\./) &&
          !trimmedLine.startsWith('*') &&
          !trimmedLine.startsWith('-')) {
        return `<p class="mb-4 text-gray-700 leading-relaxed">${trimmedLine}</p>`;
      }
      return line;
    });
    html = processedLines.join('\n');
    
    // Clean up extra whitespace
    html = html.replace(/\n\s*\n/g, '\n');
    
    return html;
  };

  return (
    <div 
      className="prose max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
} 