"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, BookOpen, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Page() {
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState("cosine");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, metric }),
      });

      if (!res.ok) throw new Error("Server error");
      const data = await res.json();
      setResult(data.results);
    } catch (err) {
      setError("X" + err.message);
    } finally {
      setLoading(false);
    }
  };

  const difficultyColor = (level) => {
    const map = {
      beginner: "bg-green-500",
      mixed: "bg-yellow-500",
      intermediate: "bg-orange-500",
      advanced: "bg-red-500",
    };
    return map[level?.toLowerCase()] || "bg-gray-500";
  };

  const CourseCard = ({ course, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl shadow-xl hover:scale-[1.02] transition">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold text-blue-300 mb-1">
            {course.Title.toUpperCase()}
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            {course.Organization}
          </p>

          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${difficultyColor(
              course.Difficulty
            )}`}
          >
            {course.Difficulty}
          </span>

          <div className="mt-4">
            <p className="font-semibold text-white text-sm mb-2">Skills</p>
            <div className="flex text-white flex-wrap gap-2">
              {course.Skills.split(",").map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-blue-600/20 border border-blue-500/30 px-2 py-1 rounded text-xs"
                >
                  {skill.trim()}
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-5xl font-extrabold flex items-center gap-3 text-blue-400">
            <Sparkles className="w-8 h-8" /> Smart Course Recommender
          </h1>
          <p className="text-gray-400 mt-2">
            AI-powered recommendations tailored for you
          </p>
        </motion.div>

        {/* Search */}
        <motion.form
          onSubmit={handleSubmit}
          className="mt-10 bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 shadow-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-sm font-semibold">Course title</label>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Machine Learning, React, AI..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/60 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold">Metric</label>
              <select
                className="w-full mt-2 p-3 rounded-xl bg-black/60 border border-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
              >
                <option value="cosine">Cosine</option>
                <option value="adjusted_cosine">Adjusted Cosine</option>
                <option value="euclidean">Euclidean</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="mt-8 w-full text-lg rounded-xl h-12"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" /> Searching...
              </span>
            ) : (
              "✨ Get Recommendations"
            )}
          </Button>
        </motion.form>

        {/* Error */}
        {error && <p className="text-red-400 mt-6">{error}</p>}

        {/* Results */}
        {result && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-blue-300 flex items-center gap-2">
              <BookOpen /> TF-IDF Results
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {result.tfidf.map((c, i) => (
                <CourseCard key={i} course={c} index={i} />
              ))}
            </div>

            <h2 className="text-3xl font-bold text-yellow-300 flex items-center gap-2 mt-14">
              <BookOpen /> CountVectorizer Results
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {result.countvectorizer.map((c, i) => (
                <CourseCard key={i} course={c} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
