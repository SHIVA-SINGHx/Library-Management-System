import React, { useState } from 'react'
import { adminBooksPageStyles as s } from '../assets/dummyStyles'
import { useLibrary } from '../shared/LibraryContext';


const getTodayIso = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};
const createBookDraft = () => ({
  id: `draft-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
  title: "",
  bookCode: "",
  issuedOn: getTodayIso(),
  dueDate: "",
});
const createInitialForm = () => ({
  studentName: "",
  userEmail: "",
  department: "",
  stream: "",
  academicYear: "",
  semester: "",
  rollNumber: "",
  books: [createBookDraft()],
});

const AdminBooksPage = () => {

  const { issueManualBooksToStudent, fineSettings } = useLibrary();
  const [issueForm, setIssueForm] = useState(createInitialForm);
  const [formMessage, setFormMessage] = useState("");
  const [matchingStudents, setMatchingStudents] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchError, setSearchError] = useState("");
  const searchTimeoutRef = useRef(null);
  const isStudentSelected = Boolean(selectedStudent);
  const canSearchRoll =
    issueForm.rollNumber.trim().length > 0 && !isStudentSelected;


  return (
    <div className={s.pageContainer}>
        <section className={s.mainSection}>
            <div className={s.innerContainer}> 
                <div className={s.headerFlex}>
                    <div>
                        <h2 className={s.title}>Issue book to Student</h2>
                        <p className={s.subtitle}>
                            Select a student, and manual book entries with book, code, and the active overdue fine rule will be used automatically after the due date.
                        </p>
                    </div>
                    <div className={s.fineRuleBadge}></div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default AdminBooksPage
