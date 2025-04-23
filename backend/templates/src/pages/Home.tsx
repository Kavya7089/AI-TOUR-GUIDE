import { useState } from "react";

export default function Home() {
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [language, setLanguage] = useState("English");
  const [response, setResponse] = useState("");

  const askGuide = async () => {
    
    try {
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, language }),
      });

      const data = await response.json();
      setResponse(data.response || `❌ Error: ${data.error}`);
    } catch (err) {
      setResponse("❌ Failed to fetch response.");
    }
  };


const askWithImage = async () => {
  if (!image) {
    setResponse("❌ Please upload an image.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);
  formData.append("language", language); // send selected language

  try {
    const res = await fetch("http://localhost:5000/image-search", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.error) {
      setResponse(`❌ ${data.error}`);
    } else {
      // Combine caption and detailed info nicely
      const combined = `📸 Caption: ${data.caption}\n\n📖 Info: ${data.info}`;
      setResponse(combined);
    }
  } catch (err) {
    console.error("Image search failed:", err);
    setResponse("❌ Failed to fetch image info.");
  }
};


  return (
    <div className="min-h-screen py-10 bg-gray-50 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🌍 AI Tour Guide
        </h1>

        <input
          type="text"
          placeholder="Enter a location (e.g., Taj Mahal)"
          className="w-full border rounded px-3 py-2 mb-4"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <h3 className="text-lg font-semibold mb-2">🌐 Choose Language:</h3>
        <select
          className="w-full border rounded px-3 py-2 mb-6"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="English">English</option>
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Hindi">Hindi</option>
        </select>

        <button
          onClick={askGuide}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-6"
        >
          Ask
        </button>

        <h3 className="text-lg font-semibold mb-2">📷 Or take a photo:</h3>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="mb-4"
        />

        <button
          onClick={askWithImage}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mb-6"
        >
          Ask With Image
        </button>

        <div className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
          {response}
        </div>
      </div>
    </div>
  );
}


 