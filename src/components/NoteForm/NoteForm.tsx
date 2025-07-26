import styles from "./NoteForm.module.css";
import { useId } from "react";
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from "formik";
import { type NewNote } from "../../types/note";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../../services/noteService";

interface NoteFormProps {
  onCloseModal: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Too Short!")
    .max(50, "Too Long!")
    .required("Required field"),
  content: Yup.string().max(500, "Too Long!"),
  tag: Yup.string().oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"]),
});

export default function NoteForm({ onCloseModal }: NoteFormProps) {
  const idUse = useId();

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (noteData: NewNote) => addNote(noteData),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCloseModal();
    },
  });

  const handleSubmit = (
    values: FormValues,
    formikHelper: FormikHelpers<FormValues>
  ) => {
    formikHelper.resetForm();
    mutate(values);
  };

  return (
    <Formik
      initialValues={{ title: "", content: "", tag: "Todo" }}
      onSubmit={handleSubmit}
      validationSchema={NoteSchema}
    >
      <Form className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor={`${idUse}-title`}>Title</label>
          <Field
            id={`${idUse}-title`}
            type="text"
            name="title"
            className={styles.input}
          />
          {
            <ErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          }
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${idUse}-content`}>Content</label>
          <Field
            as="textarea"
            id={`${idUse}content`}
            name="content"
            rows={8}
            className={styles.textarea}
          />
          {
            <ErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          }
        </div>

        <div className={styles.formGroup}>
          <label htmlFor={`${idUse}-tag`}>Tag</label>
          <Field
            as="select"
            id={`${idUse}-tag`}
            name="tag"
            className={styles.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          {
            <ErrorMessage
              name="title"
              component="span"
              className={styles.error}
            />
          }
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelButton}
            onClick={onCloseModal}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isPending}
          >
            {isPending ? "Creating new note..." : "Create note"}
          </button>
        </div>
      </Form>
    </Formik>
  );
}
