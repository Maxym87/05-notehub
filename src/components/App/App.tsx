import styles from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const updateSearchQuery = useDebouncedCallback((newSearchQuery: string) => {
    setSearchQuery(newSearchQuery);
    setCurrentPage(1);
  }, 500);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={searchQuery} onSearch={updateSearchQuery} />
        {/* Пагінація */}
        <button className={styles.button}>Create note +</button>
      </header>
      {isLoading && <p className={styles.loading}>Loading notes...</p>}
      {isError && <p className={styles.error}>Server error!</p>}
      {data && !isLoading && <NoteList notes={data.notes} />}
    </div>
  );
}
