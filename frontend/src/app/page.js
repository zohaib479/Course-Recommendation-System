"use client";

import React, { useState } from "react";

export default function Page() {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) throw new Error("Invalid response from server");

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Request failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (level) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-500";
      case "mixed":
        return "bg-yellow-500";
      case "intermediate":
        return "bg-orange-500";
      case "advanced":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center font-sans">
      <h1 className="text-4xl font-bold mb-6 text-blue-400">Course Recommendations</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-lg"
      >
        <label className="font-semibold mb-2 block">Enter Course Title:</label>
        <input
          type="text"
          placeholder="e.g. Data Science"
          className="w-full p-3 border border-gray-700 rounded-lg mb-4 bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {loading ? "Loading..." : "Get Recommendations"}
        </button>
      </form>

      {error && <p className="text-red-500 font-semibold mt-4">{error}</p>}

      {result && result.recommendations && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-bold mb-6 text-blue-300">Recommended Courses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {result.recommendations.map((course, index) => (
              <div
                key={index}
                className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700"
              >
                <h3 className="text-xl font-bold text-blue-200 mb-1">{course.Title}</h3>
                <p className="text-sm text-gray-400 mb-2">{course.Organization}</p>

                <span className={`inline-block px-3 py-1 rounded-full text-white text-xs ${difficultyColor(course.Difficulty)}`}>Difficulty: {course.Difficulty}</span>

                <div className="mt-3">
                  <p className="font-semibold mb-1">Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {course.Skills.split(",").map((skill, idx) => (
                      <span key={idx} className="bg-blue-700 px-2 py-1 rounded text-xs">{skill.trim()}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}