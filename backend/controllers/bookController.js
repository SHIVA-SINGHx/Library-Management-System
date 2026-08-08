import Issues from "../models/Issues.js";
import Setting from "../models/Setting.js";
import User from "../models/UserModel.js";


const getLocalIsoDate = (value = new Date()) => {
  const d = new Date(value);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const getStartOfDay = (value) => new Date(new Date(value).setHours(0, 0, 0, 0));

const getDiffInDays = (targetDateString) => 
  Math.round((getStartOfDay(targetDateString) - getStartOfDay(new Date())) / 86400000);

const getOverdueUnits = (overdueDays, interval) => {
  if (overdueDays <= 0) return 0;
  const divisor = { week: 7, month: 30, year: 365 }[interval] || 1;
  return Math.ceil(overdueDays / divisor);
};

const calculateFine = (issue, fineRate = 10, fineInterval = "day") => {
  if (!issue || issue.fineCleared || issue.returnedOn) return 0;
  const overdueDays = Math.max(0, -getDiffInDays(issue.dueDate));
  return getOverdueUnits(overdueDays, fineInterval) * fineRate + (Number(issue.manualFine) || 0);
};


// issue manual book to a student
export async function issueManualBook(req, res){
    try {
        const {studentDetails, books}= req.body;
        if(!Array.isArray(books) || books.length === 0){
            return res.status(400).json({
                success: false,
                message: "No books were entered"
            })
        }

        const students = await User.findOne({rollno: studentDetails.rollno })
        if(!students){
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        const todayIssue = getLocalIsoDate();
        const validBooks = books.filter(b => b.title && b.bookCode && b.dueDate)
        if(validBooks.length === 0){
            return res.status(400).json({
                success: false,
                message: "Please add at least one valid manual book with book-code, book-dueDate"
            })
        }
    
      const createdIssues = await Promise.all(validBooks.map(book => Issue.create({
      source: "manual",
      bookCode: book.bookCode.trim(),
      title: book.title.trim(),
      userEmail: student.email,
      userName: student.name,
      issuedOn: todayIso,
      dueDate: book.dueDate,
      returnedOn: null,
      fineRate: Number(book.fineRate ?? req.body.fineRate ?? 10),
      fineInterval: book.fineInterval ?? req.body.fineInterval ?? "day",
      manualFine: 0,
      fineCleared: false,
      clearedFineAmount: 0,
      department: studentDetails.department?.trim() || student.department || "General",
      stream: studentDetails.stream?.trim() || student.stream || "General",
      year: studentDetails.academicYear?.trim() || student.year || "1st Year",
      semester: studentDetails.semester?.trim() || student.semester || "Semester 1",
      rollNumber: studentDetails.rollNumber?.trim() || student.rollNo || "Not assigned",
      studentId: student.rollNo || `ST-${student._id.toString().slice(-4)}`
    })));

    return res.status(201).json({
        success: true,
        message: `${createdIssues.length} manual book issued successfully`,
        count: createdIssues.length,
        issue: createdIssues

    })
    
    } catch (error) {
        console.log("Error issuing fething books", error.message)
        return res.status(500).json({
            success: false,
            message: "Error issuing fething books"
        })
    }
}

// get all manual issue (admin)
export async function getIssueManual(req, res){
    try {
        const issues = await Issues.find({}).sort({createdAd: -1});
        return res.status(200).json({
            success: true,
            issues
        })
    } catch (error) {
        console.log("Error while fetching manaul books", error.message)
        return res.status(500).json({
            success:false,
            message: "Error while fething manual books", error: error.message
        })
    }
}

// get manual issues for logged-in student
export async function getStudentIssue(req,res){
    try {
        const issue = await Issues.find({
            userEmail: req.user.email.toLowerCase().trim()
        }).sort({createdAd: -1})
        res.status(200).json({
            success: true,
            issue
        })
    } catch (error) {
        console.log("Error while fetching student issues", error.message)
        return res.status(500).json({
            success:false,
            message: "Error while fething student issues", error: error.message
        })
    }
}