import axios from "axios";
import type { Note, NewNote } from "../types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const token = import.meta.env.VITE_API_KEY;

export const fetchNotes = async (page: number, query: string) => {
  const params: Record<string, string | number> = {
    perPage: 10,
    page,
  };

  if (query.trim() !== "") {
    params.search = query;
  }

  const response = await axios.get<FetchNotesResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params,
    }
  );

  return response.data;
};

export const addNote = async (noteData: NewNote) => {
  const res = await axios.post(
    "https://notehub-public.goit.study/api/notes",
    noteData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
};

export const deleteNote = async (noteId: string) => {
  await axios.delete(`https://notehub-public.goit.study/api/notes/${noteId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
