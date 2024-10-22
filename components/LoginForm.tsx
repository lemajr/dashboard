'use client'
import { useAuth } from '@/context/authContext';
import { useState } from 'react';

interface FormState {
  username: string;
  password: string;
}

export default function Login() {
  const { login, error, setError } = useAuth();
  const [formData, setFormData] = useState<FormState>({ username: '', password: '' });

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
    try {
      await login(formData);
      
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex flex-col justify-center h-screen">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Welcome Back
          </h3>
          <p className="mt-1 text-center text-gray-500 dark:text-gray-400">Login or create account</p>

          <form onSubmit={handleSubmit}>
            <div className="w-full mt-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="block w-full px-4 py-2 mt-2 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600"
                placeholder="Email Address"
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

            {error && <p className="text-red-500 py-3 ">{error}</p>}

            <div className="flex items-center justify-between mt-4">
              <a href="#" className="text-sm text-gray-600 dark:text-gray-200 hover:text-gray-500">
                Forget Password?
              </a>

              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-400"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
