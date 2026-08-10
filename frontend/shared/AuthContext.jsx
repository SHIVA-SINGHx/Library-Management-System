import { createContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

const SESSION_KEY = "library-auth-session";
const TOKEN_KEY = "library-auth-token";
const API_BASE_URl = "http://localhost:0000/api/auth";

const defaultAccounts = [];


    const mapUserToFrontend = (user) => {
  if (!user) return null;
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phoneNo: user.phoneNo || "",
    role: user.role,
    department: user.department || "General",
    stream: user.stream || "General",
    academicYear: user.year || "1st Year",
    semester: user.semester || "Semester 1",
    rollNumber: user.rollNo || "",
    studentId: user.studentId || `ST-${user._id.slice(-6)}`,
    createdAt: user.createdAt,
  };
}; /// fetch all these details coming from the server


export const AuthProvider = ({children}) => {
  const [accounts, setAccounts] = useState(defaultAccounts);
  const [currentUser, setCurrentUser] = useState(null);
  const [ready, setReady] = useState(false);

// if user is admin then fetch all registered user

  const fetchRegisteredUsers = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.users)) {
          const fetchedAccounts = data.users
            .map(mapUserToFrontend)
            .sort(
              (a, b) =>
                new Date(b.createdAt ?? 0).getTime() -
                new Date(a.createdAt ?? 0).getTime(),
            );

          setAccounts((current) => {
            const merged = [...fetchedAccounts];
            defaultAccounts.forEach((account) => {
              const exists = merged.some(
                (item) =>
                  item.email.toLowerCase() === account.email.toLowerCase(),
              );
              if (!exists) {
                merged.push(account);
              }
            });
            return merged;
          });
        }
      }
    } catch (error) {
      console.error("Error fetching users from backend:", error);
    }
  };

  // fetch user profile details
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      const session = localStorage.getItem(SESSION_KEY);

      if (token && session) {
        try {
          const response = await fetch(`${API_BASE_URl}/me`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              const mappedUser = mapUserToFrontend(data.user);
              setCurrentUser(mappedUser);
              localStorage.setItem(SESSION_KEY, JSON.stringify(mappedUser));

              if (mappedUser.role === "admin") {
                await fetchRegisteredUsers(token);
              }
            } else {
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error(
            "Backend auth init failed, falling back to local session:",
            error,
          );
          try {
            setCurrentUser(JSON.parse(session));
          } catch {
            logout();
          }
        }
      } else {
        setCurrentUser(null);
      }
      setReady(true);
    };

    initializeAuth();
  }, []);

  // LOGIN

  


  return <AuthContext.Provider>{children}</AuthContext.Provider>;
};
