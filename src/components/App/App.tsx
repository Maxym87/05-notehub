import styles from "./App.module.css";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { fetchNotes } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import NoteForm from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";

export default function App() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModal, setIsModal] = useState(false);
  const updateSearchQuery = useDebouncedCallback(setSearchQuery, 300);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["notes", currentPage, searchQuery],
    queryFn: () => fetchNotes(currentPage, searchQuery),
    placeholderData: keepPreviousData,
  });

  const openModal = () => setIsModal(true);
  const closeModal = () => setIsModal(false);

  const totalPages = data?.totalPages ?? 0;

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox value={searchQuery} onSearch={updateSearchQuery} />
        {totalPages > 1 && (
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
          />
        )}
        <button className={styles.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <p className={styles.loading}>Loading notes...</p>}
      {isError && <p className={styles.error}>Server error!</p>}
      {data && !isLoading && <NoteList notes={data.notes} />}
      {isModal && (
        <Modal onClose={closeModal}>
          <NoteForm onCloseModal={closeModal} />
        </Modal>
      )}
    </div>
  );
}
