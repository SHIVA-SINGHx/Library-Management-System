import User from "../models/UserModel.js";

// to the search the student by roll no
export async function searchStudentbyRoll(req, res) {
  try {
    const roll = String(req.query.roll || "").trim();
    if (!roll) {
      return res.status(200).json({
        success: false,
        students: [],
      });
    }

    const rollRegex = new RegExp(roll, "i");
    const students = await User.find({
      role: "user",
      isProfileComplete: true,
      rollNo: { $regex: rollRegex },
    })
      .select("name, email, department, rollNo, stream, semester, year")
      .limit(12);

    const mappedStudents = students.map((student) => ({
      name: student.name,
      email: student.email,
      department: student.department || "",
      stream: student.stream || "",
      academicYear: student.year || "",
      semester: student.semester || "",
      rollNumber: student.rollNo || "",
    }));

    return res.status(200).json({
        success: true,
        students: mappedStudents
    })

  } catch (error) {
    console.log("Error searching by roll no", error.message)
    return res.status(500).json({
        success: false,
        message: "Error searching by roll no"
    });

  }
}
