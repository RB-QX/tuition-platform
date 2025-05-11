// src/lib/classes.ts
import api from './api';
export const fetchClasses = () =>
  api.get('/api/classes').then(res => res.data as Class[]);
export const createClass = (payload: CreateClassDto) =>
  api.post('/api/classes', payload).then(res => res.data as Class);

export type Class = {
  id: number;
  title: string;
  description: string;
  startAt: string;        // ISO
  durationMinutes: number;
  meetLink: string;
};

export type CreateClassDto = {
  title: string;
  description?: string;
  startAt: string;
  durationMinutes: number;
};
