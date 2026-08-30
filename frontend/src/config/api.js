export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://http://3.91.22.87";

export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
export const API_BOOKS_URL = `${API_BASE_URL}/api/books`;
export const API_STUDENTS_URL = `${API_BASE_URL}/api/students`;

export default API_BASE_URL;
