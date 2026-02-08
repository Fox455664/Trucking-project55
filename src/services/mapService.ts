// src/services/mapService.ts

// خدمة البحث عن الأماكن (Nominatim)
export const searchPlaces = async (query: string) => {
  if (!query || query.length < 3) return [];
  
  try {
    // بنضيف delay بسيط عشان سيرفرات OSM المجانية مابتعملش بلوك
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ar`
    );
    const data = await response.json();
    return data.map((item: any) => ({
      label: item.display_name,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error("Error searching places:", error);
    return [];
  }
};

// خدمة حساب المسافة والوقت (OSRM)
export const calculateDistanceOSM = async (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
) => {
  try {
    // OSRM بيحتاج الترتيب: longitude,latitude
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    
    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok" && data.routes.length > 0) {
      const route = data.routes[0];
      const distanceKm = (route.distance / 1000).toFixed(1); // المسافة بالكيلومتر
      
      // تحويل الثواني لساعات ودقائق
      const durationSeconds = route.duration;
      const hours = Math.floor(durationSeconds / 3600);
      const minutes = Math.floor((durationSeconds % 3600) / 60);
      
      let timeString = "";
      if (hours > 0) timeString += `${hours} ساعة `;
      if (minutes > 0) timeString += `${minutes} دقيقة`;

      return {
        distance: `${distanceKm} كم`,
        duration: timeString || "أقل من دقيقة",
        rawDistance: route.distance, // بالمتر
        rawDuration: route.duration // بالثواني
      };
    }
    return null;
  } catch (error) {
    console.error("Error calculating distance:", error);
    return null;
  }
};
