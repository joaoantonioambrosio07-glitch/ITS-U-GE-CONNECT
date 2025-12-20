
import { Subject } from './types';

export const SUBJECTS: Subject[] = [
  { id: 'port', name: 'Português', icon: '📖' },
  { id: 'math', name: 'Matemática', icon: '📐' },
  { id: 'bio', name: 'Biologia', icon: '🧬' },
  { id: 'chem', name: 'Química', icon: '🧪' },
  { id: 'phys', name: 'Física', icon: '⚡' },
  { id: 'eng', name: 'Inglês', icon: '🇬🇧' },
  { id: 'fra', name: 'Francês', icon: '🇫🇷' },
  { id: 'ethics', name: 'Ética e Ed. Cívica', icon: '⚖️' },
  { id: 'iec', name: 'IEC', icon: '📢' },
  { id: 'fai', name: 'FAI', icon: '🤝' },
];

export const EDUCATIONAL_LINKS = [
  { name: 'Khan Academy', url: 'https://www.khanacademy.org', desc: 'Aulas de matemática e ciências.' },
  { name: 'YouTube Educação', url: 'https://www.youtube.com/education', desc: 'Vídeos educativos variados.' },
  { name: 'TV Escola', url: 'https://tvescola.org.br', desc: 'Conteúdo pedagógico em vídeo.' },
  { name: 'British Council', url: 'https://learnenglish.britishcouncil.org', desc: 'Recursos para aprender Inglês.' },
  { name: 'Français Facile', url: 'https://www.francaisfacile.com', desc: 'Gramática e exercícios de Francês.' },
  { name: 'OpenStax', url: 'https://openstax.org', desc: 'Livros didáticos gratuitos.' },
];

// A = 10ª Classe
export const MOCK_TURMAS = ['A1', 'A2', 'A3', 'A4'];
