// Hotels.tsx — Fixed version with better error handling, logging, and clarity

import { useEffect, useState } from 'react';
import { MapPin, Star } from 'lucide-react';

export default function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [place, setPlace] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;

    console.log("🔍 Fetching hotels for:", query);

    fetch("http://localhost:5000/hotels", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ place: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.hotels) {
          console.error("❌ No hotel data received:", data);
          return;
        }

        try {
          const parsed = Array.isArray(data.hotels)
            ? data.hotels.map((item) =>
                typeof item === "string" ? JSON.parse(item) : item
              )
            : [];
          setHotels(parsed);
          console.log("✅ Hotels parsed:", parsed);
        } catch (error) {
          console.error("❌ Error parsing hotel data:", error);
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
        <h1 className="text-3xl font-bold mb-6">Find Hotels Near You</h1>

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
          {hotels.length > 0 ? (
            hotels.map((hotel, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{hotel.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.amenities.map((amenity, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {hotel.price}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No hotels found. Try searching for another place.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
