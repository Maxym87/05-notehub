import axios from "axios";
import type { Note } from "../types/note";

export interface FetchNotesResponse {
  results: Note[];
  totalPages: number;
}

const token = import.meta.env.VITE_API_KEY;

export const fetchNotes = async (page: number) => {
  const response = await axios.get<FetchNotesResponse>(
    `https://notehub-public.goit.study/api/notes`,
    {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, perPage: 12 },
    }
  );

  return response.data;
};
