"use client";

import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Custom404() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-red-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 mb-6">
            404
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Lost in Space? 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            The page you're looking for has drifted into the digital void. But
            don't worry, we'll help you navigate back to civilization!
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
          <Result
            status="404"
            title={
              <span className="text-3xl font-bold text-gray-800">
                Page Not Found
              </span>
            }
            subTitle={
              <p className="text-lg text-gray-600 mt-4">
                The page you requested could not be found. It might have been
                moved, deleted, or you might have entered the wrong URL.
              </p>
            }
            extra={
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
                <Button
                  type="primary"
                  size="large"
                  onClick={() => router.push("/")}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  🏠 Take Me Home
                </Button>
                <Button
                  size="large"
                  onClick={() => router.back()}
                  className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:text-gray-800 px-8 py-4 h-auto text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  ← Go Back
                </Button>
              </div>
            }
          />
        </div>

        {/* Help Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-4 text-center">🔍</div>
            <h3 className="font-semibold text-gray-800 mb-2 text-center">
              Search
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Use our search feature to find what you need
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-4 text-center">📊</div>
            <h3 className="font-semibold text-gray-800 mb-2 text-center">
              Dashboard
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Access your main dashboard and analytics
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-4 text-center">👥</div>
            <h3 className="font-semibold text-gray-800 mb-2 text-center">
              Users
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Manage users and permissions
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className="text-4xl mb-4 text-center">💬</div>
            <h3 className="font-semibold text-gray-800 mb-2 text-center">
              Support
            </h3>
            <p className="text-sm text-gray-600 text-center">
              Get help from our support team
            </p>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">
            Quick Navigation
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: "Home", path: "/" },
              { label: "Dashboard", path: "/dashboard" },
              { label: "Roles", path: "/dashboard/roles" },
              { label: "Settings", path: "/settings" },
            ].map((link) => (
              <button
                key={link.path}
                type="button"
                onClick={() => router.push(link.path)}
                className="px-6 py-3 bg-white text-gray-700 rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition-all duration-300 font-medium border border-gray-200 hover:border-gray-300"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Animation */}
        <div className="mt-12 text-center">
          <div className="inline-block animate-bounce">
            <div className="text-6xl">🌌</div>
          </div>
          <p className="text-gray-500 mt-4 text-sm">
            Even in the digital void, we're here to help!
          </p>
        </div>
      </div>
    </div>
  );
}
