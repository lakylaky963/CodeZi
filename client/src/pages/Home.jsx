import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Options for selection
  const options = {
    blue: "bg-blue-500",
    red: "bg-red-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
  };

  const [selection, setSelection] = useState("blue");
  const [count, setCount] = useState(0);

  return (
    <div className="container mx-auto py-12 px-6">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">React Workshop</h1>
        <p className="mt-4 text-lg text-gray-600">
          Hello World 2025
        </p>
      </div>

      {/* Axios Link */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Demos</h2>
        <Link
          to="/axios"
          className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition"
        >
          Server Demo →
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Selection Box Demo */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-green-600">Selection Box</h2>
          <p className="mt-2 text-gray-600">
            Use a dropdown to update the selection box below.
          </p>

          <select
            value={selection}
            onChange={(e) => setSelection(e.target.value)}
            className="mt-4 block w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-400"
          >
            {Object.keys(options).map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>

          <div
            className={`w-full h-32 rounded-xl shadow flex items-center justify-center text-white text-lg font-semibold mt-4 ${options[selection]}`}
          >
            {selection.charAt(0).toUpperCase() + selection.slice(1)} Selected
          </div>
        </div>

        {/* Counter Demo */}
        <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
          <h2 className="text-2xl font-semibold text-purple-600">Counter</h2>
          <p className="mt-2 text-gray-600">
            Simple counter that uses the useState hook.
          </p>

          <div className="flex flex-col items-center gap-3 mt-6">
            <p className="text-xl text-gray-700">Count: {count}</p>
            <div className="flex gap-3">
              <button
                onClick={() => setCount(count + 1)}
                className="px-5 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600 transition"
              >
                + Add One
              </button>
              <button
                onClick={() => setCount(0)}
                className="px-5 py-2 bg-gray-300 text-gray-700 rounded-lg shadow hover:bg-gray-400 transition"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
