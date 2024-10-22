'use client';
import { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

interface FormState {
  full_name: string;
  email: string;
  student_reg_no: string;
  password: string;
  confirmPassword: string;
}

export default function Register() {
  const [formData, setFormData] = useState<FormState>({
    full_name: '',
    email: '',
    student_reg_no: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [warning, setWarning] = useState<string>('');
  const router = useRouter();
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Retrieve OAuth token from cookies
    const token = Cookies.get('access_token');  // 'access_token' is what was set in the login process

    if (!token) {
      setError('Authentication error: no token found.');
      return;
    }


    try {
      const response = await axios.post('http://localhost:8000/api/v1/student/', {
        full_name: formData.full_name,
        email: formData.email,
        student_reg_no: formData.student_reg_no,
        password: formData.password,
      }, {
        headers: { 
          'Content-Type': 'application/json',  
          Authorization: `Bearer ${token}`,     // Pass the Bearer token for authentication
        },
        withCredentials: true,
      });
    
      if (response.status === 201) {
        // Reset the form by setting formData back to initial state
        setFormData({
          full_name: '',
          email: '',
          student_reg_no: '',
          password: '',
          confirmPassword: '',  // Added this based on your code
        });
        setWarning('');
        setStatus('Student successfully created');
      }
    } catch (err:any) {
      if (err.response && err.response.status === 400) {
        setStatus('')
        setError('')
        // Handle specific 400 error (already taken email or registration number)
        setWarning('Already taken email or registration number.');
      } else {
        setStatus('');
        setWarning('');
        // Handle general registration errors
        console.error('Registration error:', err);
        setError('Registration failed. Please check your details.');
      }
    }
  }
  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Create a Student Account
          </h3>
          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">Sign up for a new account</p>

          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Full Name"
              />
            </div>

            <div className="w-full mt-4">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Email Address"
              />
            </div>

            <div className="w-full mt-4">
              <input
                type="text"
                name="student_reg_no"
                value={formData.student_reg_no}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Student Registration No"
              />
            </div>

            <div className="w-full mt-4">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Password"
              />
            </div>

            <div className="w-full mt-4">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Confirm Password"
              />
            </div>

         {/* Conditional messages */}
          {error && <p className="text-red-500 py-3">{error}</p>}
          {status && <p className="text-green-500 py-3">{status}</p>}
          {warning && <p className="text-yellow-500 py-3">{warning}</p>}

            <div className="flex items-center justify-between mt-4">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">
                Already have an account? Login
              </a>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
