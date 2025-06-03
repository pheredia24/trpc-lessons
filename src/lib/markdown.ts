import fs from 'fs';
import path from 'path';

export interface LessonMetadata {
  slug: string;
  order: number;
  title: string;
}

export interface LessonContent {
  metadata: LessonMetadata;
  content: string;
}

export function parseFrontmatter(fileContent: string): { metadata: LessonMetadata; content: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = fileContent.match(frontmatterRegex);
  
  if (!match) {
    throw new Error('Invalid frontmatter format');
  }
  
  const frontmatterString = match[1];
  const content = match[2];
  
  // Simple YAML parsing for our specific frontmatter format
  const metadata: any = {};
  frontmatterString.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      const value = line.substring(colonIndex + 1).trim();
      if (key === 'order') {
        metadata[key] = parseInt(value);
      } else {
        metadata[key] = value;
      }
    }
  });
  
  return {
    metadata: metadata as LessonMetadata,
    content: content.trim()
  };
}

export async function getLessonContent(slug: string): Promise<LessonContent | null> {
  try {
    // This function should only run on the server
    if (typeof window !== 'undefined') {
      throw new Error('getLessonContent should only be called on the server side');
    }
    
    const lessonsDir = path.join(process.cwd(), 'src', 'lessons');
    const filePath = path.join(lessonsDir, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      console.warn(`Lesson file not found: ${filePath}`);
      return null;
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return parseFrontmatter(fileContent);
  } catch (error) {
    console.error(`Error loading lesson content for ${slug}:`, error);
    return null;
  }
}

export async function getAllLessons(): Promise<LessonMetadata[]> {
  try {
    const lessonsDir = path.join(process.cwd(), 'src', 'lessons');
    const files = fs.readdirSync(lessonsDir);
    
    const lessons: LessonMetadata[] = [];
    
    for (const file of files) {
      if (file.endsWith('.md')) {
        const slug = file.replace('.md', '');
        const content = await getLessonContent(slug);
        if (content) {
          lessons.push(content.metadata);
        }
      }
    }
    
    return lessons.sort((a, b) => a.order - b.order);
  } catch (error) {
    console.error('Error loading lessons:', error);
    return [];
  }
} 