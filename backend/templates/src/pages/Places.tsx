import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

export default function Places() {
  const [places, setPlaces] = useState([]);
  const [place, setPlace] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!query) return;

    console.log("🔍 Fetching places for:", query);

    fetch("http://localhost:5000/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ place: query }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data || !data.places) {
          console.error("❌ No place data received:", data);
          return;
        }

        try {
          const parsed = Array.isArray(data.places)
            ? data.places.map((item) =>
                typeof item === "string" ? JSON.parse(item) : item
              )
            : [];
          setPlaces(parsed);
          console.log("✅ Places parsed:", parsed);
        } catch (error) {
          console.error("❌ Error parsing place data:", error);
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
        <h1 className="text-3xl font-bold mb-6">Find Places Near You</h1>

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
          {places.length > 0 ? (
            places.map((place, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <img
                  src={place.image} // Assuming place has an image property
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{place.name}</h3>
                    <div className="flex items-center">
                      <span>{place.rating}</span> {/* Assuming place has a rating property */}
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{place.location}</span> {/* Assuming place has a location property */}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {place.description && (
                      <p>{place.description}</p> // Assuming place has a description property
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-blue-600">
                      {/* Assuming place has a price property */}
                      {place.price}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                      More Info
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">
              No places found. Try searching for another location.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}