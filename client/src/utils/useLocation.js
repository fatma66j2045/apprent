import { useState, useEffect } from "react";

const OPENCAGE_API_KEY = "b95e3db350bf433b9794a9dbec9f7513";
const OPENCAGE_API_URL = "https://api.opencagedata.com/geocode/v1/json";


const useLocation = () => {
  const [placeInfo, setPlaceInfo] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async ({ coords: { latitude, longitude } }) => {
          try {
           const res = await fetch(
  `${OPENCAGE_API_URL}?q=${latitude}+${longitude}&key=${OPENCAGE_API_KEY}`
);
            const data = await res.json();
            const components = data.results[0].components;
            setPlaceInfo({
              city: components.city || components.town || components.village,
              region: components.state,
              country: components.country,
            });
          } catch {
            setError("Failed to get place information");
          }
        },
        () => setError("Permission denied or unavailable")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  return { placeInfo, error };
};

export default useLocation;
