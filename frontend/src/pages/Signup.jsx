import React, { useEffect, useState } from "react";
import { signupStyles as s } from "../assets/dummyStyles";
import { useAuth } from "../../shared/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const stepList = [
  { id: 1, title: "Account" },
  { id: 2, title: "OTP" },
  { id: 3, title: "Profile" },
];

const signupHighlights = [
  "Step 1 collects student account details and checks immediately if the email already exists.",
  "Step 2 verifies the OTP before moving forward.",
  "Step 3 saves department, stream, semester, year, and roll number.",
];

const Signup = () => {
  const { registerStudent, verifyOtpCode, completeProfileData, logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNo: "",
    password: "",
    otp: "",
    department: "",
    stream: "",
    semester: "Semester 1",
    academicYear: "1st Year",
    rollNumber: "",
  });

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setError("");

    if (name === "phoneNo") {
      const digitOnly = value.replace(/\D/g, "").slice(0, 10);
      setForm((current) => ({ ...current, [name]: digitOnly }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const validateStepOne = () => {
    if (!form.name.trim() || !form.email.trim() || !form.phoneNo.trim() || !form.password.trim()) {
      setError("Please fill name, email, mobile number, and password first.");
      return false;
    }

    if (form.phoneNo.trim().replace(/\D/g, "").length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      return false;
    }

    return true;
  };

  const validateStepThree = () => {
    if (
      !form.department.trim() ||
      !form.stream.trim() ||
      !form.semester.trim() ||
      !form.academicYear.trim() ||
      !form.rollNumber.trim()
    ) {
      setError("Please complete department, stream, semester, year, and roll number.");
      return false;
    }
    return true;
  };

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
  };

  const goNext = async () => {
    setError("");

    if (step === 1) {
      if (!validateStepOne()) return;

      setLoading(true);
      const res = await registerStudent({
        name: form.name,
        email: form.email,
        phone: form.phoneNo,
        password: form.password,
      });
      setLoading(false);

      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }

      showToast("OTP sent to your email successfully!");
      setStep(2);
      return;
    }

    if (step === 2) {
      if (!form.otp.trim()) {
        setError("Please enter the 6-digit OTP code sent to your email.");
        return;
      }

      setLoading(true);
      const res = await verifyOtpCode({
        email: form.email,
        otp: form.otp,
      });
      setLoading(false);

      if (!res.ok) {
        showToast(res.error, "error");
        setError(res.error);
        return;
      }

      showToast("OTP verified successfully!");
      setStep(3);
    }
  };

  const goBack = () => {
    setError("");
    setStep((current) => Math.max(1, current - 1));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!validateStepThree()) {
      return;
    }

    setLoading(true);
    const result = await completeProfileData({
      email: form.email,
      department: form.department,
      stream: form.stream,
      semester: form.semester,
      academicYear: form.academicYear,
      rollNumber: form.rollNumber,
    });
    setLoading(false);

    if (!result.ok) {
      showToast(result.error, "error");
      setError(result.error);
      return;
    }

    showToast("Student profile completed. Redirecting to login...");
    setTimeout(() => {
      logout();
      navigate("/login", {
        replace: true,
        state: {
          signupEmail: form.email,
          signupPassword: form.password,
        },
      });
    }, 1000);
  };

  return (
    <div className={s.pageContainer}>
      {toast && (
        <div className={`${s.toastBase} ${toast.tone === "error" ? s.toastError : s.toastSuccess}`}>
          <div className={s.toastContent}>
            <CheckCircle size={18} />
            {toast.message}
          </div>
        </div>
      )}

      <div className={s.mainCard}>
        <section className={s.formPanel}>
          <div className={s.formInner}>
            <Link to="/" className={s.backLink}>
              Back to Home
            </Link>
            <h1 className={s.panelTitle}>Create your student library account.</h1>
            <p className={s.panelSubtitle}>
              Complete the student signup steps: account, OTP, and profile details.
            </p>

            <div className={s.stepGrid}>
              {stepList.map((item) => (
                <div
                  key={item.id}
                  className={`${s.stepCard} ${
                    step >= item.id ? s.stepCardCompleted : s.stepCardPending
                  }`}
                >
                  <p className={s.stepLabel}>Step {item.id}</p>
                  <p className={s.stepTitle}>{item.title}</p>
                </div>
              ))}
            </div>

            <form className={s.form} onSubmit={step === 3 ? handleSubmit : (event) => event.preventDefault()}>
              {step === 1 && (
                <>
                  <label className="block">
                    <span className={s.fieldLabel}>
                      <UserRound size={15} />
                      Full Name
                    </span>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Mail size={15} />
                      Email Address
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="student@campus.edu"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <Phone size={15} />
                      Mobile Number
                    </span>
                    <input
                      type="text"
                      name="phoneNo"
                      value={form.phoneNo}
                      onChange={handleChange}
                      placeholder="1234567890"
                      className={s.input}
                    />
                  </label>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <LockKeyhole size={15} />
                      Password
                    </span>
                    <div className={s.passwordWrapper}>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        className={s.passwordInput}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((current) => !current)}
                        className={s.toggleButton}
                        aria-label="Toggle password visibility"
                      >
                        {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                    </div>
                  </label>
                </>
              )}

              {step === 2 && (
                <>
                  <div className={s.otpInfoBox}>
                    <p className={s.otpInfoLabel}>Verification code</p>
                    <p className={s.otpInfoText}>
                      We sent a one-time password to <span className={s.emailHighlight}>{form.email}</span>.
                    </p>
                  </div>

                  <label className="block">
                    <span className={s.fieldLabel}>OTP</span>
                    <input
                      type="text"
                      name="otp"
                      value={form.otp}
                      onChange={handleChange}
                      placeholder="Enter 6-digit OTP"
                      className={s.input}
                    />
                  </label>
                </>
              )}

              {step === 3 && (
                <>
                  <div className={s.twoColumnGrid}>
                    <label className="block">
                      <span className={s.fieldLabelBlock}>Department</span>
                      <select
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        className={s.select}
                      >
                        <option value="">Select department</option>
                        <option value="Computer Science">Computer Science</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical">Mechanical</option>
                        <option value="Civil">Civil</option>
                        <option value="Electronics">Electronics</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className={s.fieldLabelBlock}>Stream</span>
                      <select
                        name="stream"
                        value={form.stream}
                        onChange={handleChange}
                        className={s.select}
                      >
                        <option value="">Select stream</option>
                        <option value="B.Tech">B.Tech</option>
                        <option value="M.Tech">M.Tech</option>
                        <option value="B.Sc">B.Sc</option>
                        <option value="B.Com">B.Com</option>
                        <option value="MCA">MCA</option>
                      </select>
                    </label>
                  </div>

                  <div className={s.twoColumnGrid}>
                    <label className="block">
                      <span className={s.fieldLabelBlock}>Semester</span>
                      <select
                        name="semester"
                        value={form.semester}
                        onChange={handleChange}
                        className={s.select}
                      >
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                        <option value="Semester 3">Semester 3</option>
                        <option value="Semester 4">Semester 4</option>
                        <option value="Semester 5">Semester 5</option>
                        <option value="Semester 6">Semester 6</option>
                        <option value="Semester 7">Semester 7</option>
                        <option value="Semester 8">Semester 8</option>
                      </select>
                    </label>

                    <label className="block">
                      <span className={s.fieldLabelBlock}>Academic year</span>
                      <select
                        name="academicYear"
                        value={form.academicYear}
                        onChange={handleChange}
                        className={s.select}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className={s.fieldLabel}>
                      <GraduationCap size={15} />
                      Roll number
                    </span>
                    <input
                      type="text"
                      name="rollNumber"
                      value={form.rollNumber}
                      onChange={handleChange}
                      placeholder="e.g. CS-201"
                      className={s.input}
                    />
                  </label>
                </>
              )}

              {error && <div className={s.errorMessage}>{error}</div>}

              <div className={s.buttonGroup}>
                {step > 1 && (
                  <button type="button" onClick={goBack} className={s.backButton}>
                    Back
                  </button>
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={loading}
                    className={s.nextButton}
                  >
                    {loading ? "Please wait..." : step === 1 ? "Send OTP" : "Verify OTP"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className={s.submitButton}>
                    {loading ? "Submitting..." : "Complete signup"}
                    {!loading && <ArrowRight size={15} />}
                  </button>
                )}
              </div>
            </form>
          </div>
        </section>

        <aside className={s.infoPanel}>
          <div className={s.infoBadge}>
            <ShieldCheck size={14} />
            Student onboarding
          </div>
          <h2 className={s.infoTitle}>Build your library access in three quick steps.</h2>
          <ul className={s.infoList}>
            {signupHighlights.map((highlight) => (
              <li key={highlight} className={s.infoListItem}>
                <BookOpenCheck size={16} className={s.infoIcon} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Signup;
