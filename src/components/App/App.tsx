import styles from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage],
    queryFn: () => fetchNotes(currentPage),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        {/* Компонент SearchBox */}
        {/* Пагінація */}
        <button className={styles.button}>Create note +</button>
      </header>
      {isLoading && <p className={styles.loading}>Loading notes...</p>}
      {isError && <p className={styles.error}>Server error!</p>}
      {data && !isLoading && <NoteList notes={data.notes} />}
    </div>
  );
}
