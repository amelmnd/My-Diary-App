// src/types/i_Entry.ts
import { e_Emotion } from "./e_Emotion";

export interface i_Entry {
  id?: string;
  userEmail: string;
  date: string;
  title: string;
  feeling: e_Emotion;
  content: string;
}
