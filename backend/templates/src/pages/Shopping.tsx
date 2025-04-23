import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';

export default function Shopping() {
  const [shops, setShops] = useState([]);
  const [place, setPlace] = useState("Bhopal"); // You can make this dynamic
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;

    console.log("🔍 Fetching shopping places for:", query);

    fetch("http://localhost:5000/shopping", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ place: query })
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.shopping) {
          console.error("❌ No shopping data received:", data);
          return;
        }

        try {
          const parsed = Array.isArray(data.shopping)
            ? data.shopping.map((item) =>
                typeof item === "string" ? JSON.parse(item) : item
              )
            : [];
          setShops(parsed);
          console.log("✅ Shopping places parsed:", parsed);
        } catch (error) {
          console.error("❌ Error parsing shopping data:", error);
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
      });
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (place.trim()) {
      setQuery(place.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">🛍️ Shopping Places Near You</h1>

        <form
          onSubmit={handleSearch}
          className="mb-8 flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="Enter place or city name"
            className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.length > 0 ? (
            shops.map((shop, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                <img src={shop.image} alt={shop.name} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{shop.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{shop.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{shop.type}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{shop.description}</p>
                  <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    View Details
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No shopping places found. Try searching for another location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}