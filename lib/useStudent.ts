import { useState, useEffect } from 'react';
import axios from 'axios';

export interface Student {
  id: string;
  full_name: string;
  email: string;
  student_reg_no: string;
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  is_active: boolean;
  courses: { id: string; name: string }[];
}

export const useStudent = (token: string) => {
  const [student, setStudent] = useState<Student>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/v1/student/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStudent(response.data);
      } catch (error) {
        setError('Failed to fetch student data');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchStudent();
    }
  }, [token]);

  return { student, loading, error };
};
