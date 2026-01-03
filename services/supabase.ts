
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rzvbytvltizcykawdlmd.supabase.co';
// AVISO: Se esta chave não começar por "eyJ", o sistema usará automaticamente o Modo Local (Failsafe).
const supabaseAnonKey = 'sb_publishable_ElHiFUCWnxYYSudswVE2vQ_YShIeLMW';

const isKeyValid = supabaseAnonKey.startsWith('eyJ');
export const supabase = isKeyValid ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Sistema de persistência local para quando o Supabase falhar
const localDB = {
  get: (key: string) => JSON.parse(localStorage.getItem(`its_uige_${key}`) || '[]'),
  set: (key: string, data: any) => localStorage.setItem(`its_uige_${key}`, JSON.stringify(data)),
};

export const db = {
  profiles: {
    get: async (id: string) => {
      if (supabase) {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
        if (!error) return { data, error };
      }
      const profiles = localDB.get('profiles');
      const found = profiles.find((p: any) => p.id === id);
      return { data: found, error: found ? null : { message: 'Not found' } };
    },
    listAll: async () => {
      if (supabase) {
        const { data, error } = await supabase.from('profiles').select('*').order('full_name');
        if (!error) return { data, error };
      }
      return { data: localDB.get('profiles'), error: null };
    },
    upsert: async (profile: any) => {
      if (supabase) {
        const { data, error } = await supabase.from('profiles').upsert(profile);
        if (!error) return { data, error };
      }
      const profiles = localDB.get('profiles');
      const index = profiles.findIndex((p: any) => p.id === profile.id);
      if (index >= 0) profiles[index] = { ...profiles[index], ...profile };
      else profiles.push(profile);
      localDB.set('profiles', profiles);
      return { data: profile, error: null };
    },
    updateStatus: async (id: string, status: string) => {
      if (supabase) {
        const { data, error } = await supabase.from('profiles').update({ status }).eq('id', id);
        if (!error) return { data, error };
      }
      const profiles = localDB.get('profiles');
      const index = profiles.findIndex((p: any) => p.id === id);
      if (index >= 0) profiles[index].status = status;
      localDB.set('profiles', profiles);
      return { data: null, error: null };
    }
  },
  grades: {
    list: async () => {
      if (supabase) {
        const { data, error } = await supabase.from('grades').select('*').order('date', { ascending: false });
        if (!error) return { data, error };
      }
      return { data: localDB.get('grades'), error: null };
    },
    insert: async (grade: any) => {
      const newGrade = { ...grade, id: Math.random().toString(36).substr(2, 9) };
      if (supabase) {
        const { data, error } = await supabase.from('grades').insert(newGrade);
        if (!error) return { data, error };
      }
      const grades = localDB.get('grades');
      grades.unshift(newGrade);
      localDB.set('grades', grades);
      return { data: newGrade, error: null };
    },
    update: async (id: string, updates: any) => {
      if (supabase) {
        const { data, error } = await supabase.from('grades').update(updates).eq('id', id);
        if (!error) return { data, error };
      }
      const grades = localDB.get('grades');
      const index = grades.findIndex((g: any) => g.id === id);
      if (index >= 0) grades[index] = { ...grades[index], ...updates };
      localDB.set('grades', grades);
      return { data: null, error: null };
    }
  },
  announcements: {
    list: async () => {
      if (supabase) {
        const { data, error } = await supabase.from('announcements').select('*').order('createdAt', { ascending: false });
        if (!error) return { data, error };
      }
      return { data: localDB.get('announcements'), error: null };
    },
    insert: async (announcement: any) => {
      const newAnn = { ...announcement, id: Math.random().toString(36).substr(2, 9) };
      if (supabase) {
        const { data, error } = await supabase.from('announcements').insert(newAnn);
        if (!error) return { data, error };
      }
      const anns = localDB.get('announcements');
      anns.unshift(newAnn);
      localDB.set('announcements', anns);
      return { data: newAnn, error: null };
    }
  }
};
