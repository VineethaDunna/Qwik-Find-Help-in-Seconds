// src/utils/geo.ts
/**
 * Haversine distance in km
 */
export function haversineKm(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) {
	const toRad = (v: number) => (v * Math.PI) / 180;
	const R = 6371; // km
	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) *
			Math.cos(toRad(lat2)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

/**
 * Reverse geocode lat/lon -> address using Nominatim
 */
export async function reverseGeocode(lat: number, lon: number) {
	try {
		const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(
			lat
		)}&lon=${encodeURIComponent(lon)}&addressdetails=1`;
		const res = await fetch(url, {
			headers: { "User-Agent": "QuickConnect/1.0" },
		});
		if (!res.ok) return null;
		const j = await res.json();
		return { display_name: j.display_name, address: j.address || {}, raw: j };
	} catch (err) {
		console.warn("reverseGeocode error", err);
		return null;
	}
}

/**
 * Geocode pincode/address -> first match { lat, lon, display_name, address }
 */
export async function geocodeQuery(q: string) {
	try {
		const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
			q
		)}&addressdetails=1&limit=1`;
		const res = await fetch(url, {
			headers: { "User-Agent": "QuickConnect/1.0" },
		});
		if (!res.ok) return null;
		const j = await res.json();
		if (!Array.isArray(j) || j.length === 0) return null;
		return {
			lat: Number(j[0].lat),
			lon: Number(j[0].lon),
			display_name: j[0].display_name,
			address: j[0].address || {},
			raw: j[0],
		};
	} catch (err) {
		console.warn("geocodeQuery error", err);
		return null;
	}
}
