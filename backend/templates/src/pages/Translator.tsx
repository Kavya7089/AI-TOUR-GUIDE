import { useState } from "react";

export default function Translator() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("French");
  const [translated, setTranslated] = useState("");

  const handleTranslate = async () => {
    setTranslated("Translating...");
    try {
      const res = await fetch("http://localhost:5000/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, language }),
      });
      const data = await res.json();
      setTranslated(data.translation || `❌ Error: ${data.error}`);
    } catch (err) {
      setTranslated("❌ Translation failed.");
    }
  };

  return (
    <div className="min-h-screen py-10 bg-gray-50 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🌐 Text Translator
        </h1>

        <textarea
          placeholder="Enter text to translate"
          className="w-full border rounded px-3 py-2 mb-4"
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="French">French</option>
          <option value="Spanish">Spanish</option>
          <option value="German">German</option>
          <option value="Hindi">Hindi</option>
          <option value="Japanese">Japanese</option>
          <option value="Arabic">Arabic</option>
        </select>

        <button
          onClick={handleTranslate}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Translate
        </button>

        {translated && (
          <div className="mt-6 p-4 bg-gray-100 rounded text-sm whitespace-pre-wrap">
            {translated}
          </div>
        )}
      </div>
    </div>
  );
}
