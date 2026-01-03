
export enum UserRole {
  ALUNO = 'ALUNO',
  PROFESSOR = 'PROFESSOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  turma?: string;
  assignedTurmas?: string[]; // For Professors
  // Fix: Added 'BANNED' to allowed status types
  status?: 'PENDING' | 'APPROVED' | 'BANNED';
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  value: number;
  term: number; // 1, 2, 3
  type: 'CONTINUOUS' | 'TEST' | 'EXAM';
  comment?: string;
  date: string;
  published: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  senderId: string;
  senderName: string;
  priority: 'NORMAL' | 'IMPORTANT' | 'URGENT';
  targetTurmas: string[]; // ['ALL'] or specific IDs
  createdAt: string;
  readBy: string[]; // Array of User IDs
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  voiceUrl?: string;
  isVideo?: boolean;
  timestamp: string;
}
