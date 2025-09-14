"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotFound() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto px-4">
        <Result
          status="404"
          title={
            <span className="text-6xl font-bold text-gray-800 mb-4 block">
              404
            </span>
          }
          subTitle={
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Oops! Page Not Found
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
                <br />
                Don't worry, let's get you back on track!
              </p>
            </div>
          }
          extra={
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <Button
                type="primary"
                size="large"
                onClick={() => router.push("/")}
                className="bg-blue-600 hover:bg-blue-700 border-blue-600 hover:border-blue-700 px-8 py-3 h-auto text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              >
                🏠 Go Home
              </Button>
              <Button
                size="large"
                onClick={() => router.back()}
                className="border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 px-8 py-3 h-auto text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
              >
                ← Go Back
              </Button>
            </div>
          }
        />
        
        {/* Additional Help Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
            Need Help?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-300">
              <div className="text-3xl mb-3">🔍</div>
              <h4 className="font-medium text-gray-800 mb-2">Search</h4>
              <p className="text-sm text-gray-600">
                Use the search bar to find what you're looking for
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition-colors duration-300">
              <div className="text-3xl mb-3">📋</div>
              <h4 className="font-medium text-gray-800 mb-2">Dashboard</h4>
              <p className="text-sm text-gray-600">
                Access your main dashboard and features
              </p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition-colors duration-300">
              <div className="text-3xl mb-3">💬</div>
              <h4 className="font-medium text-gray-800 mb-2">Support</h4>
              <p className="text-sm text-gray-600">
                Contact our support team for assistance
              </p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">Quick Links:</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors duration-200"
            >
              Dashboard
            </button>
            <button
              onClick={() => router.push("/dashboard/roles")}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors duration-200"
            >
              Roles
            </button>
            <button
              onClick={() => router.push("/")}
              className="text-blue-600 hover:text-blue-800 underline text-sm font-medium transition-colors duration-200"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
