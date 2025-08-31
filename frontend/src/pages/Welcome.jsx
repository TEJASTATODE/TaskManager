import React from 'react';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6">
      <h1 className="text-5xl font-bold mb-6 text-center">Welcome to Task Manager</h1>
      <p className="text-lg mb-8 text-center max-w-xl">
        Organize your tasks efficiently, track your progress, and stay productive. Get started now!
      </p>
      <div className="flex space-x-4">
        <Link
          to="/login"
          className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-indigo-600 border-2 border-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300"
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default Welcome;
