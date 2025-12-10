// src/components/MapModal.tsx
import React, { useState } from "react";
import { geocodeQuery, reverseGeocode } from "@/utils/geo";
import { Button } from "@/components/ui/button";

type Props = {
	open: boolean;
	onClose: () => void;
	onChoose: (
		lat: number,
		lon: number,
		label?: string,
		postcode?: string | null
	) => void;
};

const MapModal: React.FC<Props> = ({ open, onClose, onChoose }) => {
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [hint, setHint] = useState<string | null>(null);

	const handleUseGeolocation = () => {
		if (!navigator.geolocation) {
			setHint("Geolocation not supported by browser");
			return;
		}
		setLoading(true);
		navigator.geolocation.getCurrentPosition(
			async (pos) => {
				const lat = pos.coords.latitude;
				const lon = pos.coords.longitude;
				const r = await reverseGeocode(lat, lon);
				const label = r?.display_name ?? `${lat},${lon}`;
				const postcode = r?.address?.postcode ?? null;
				setLoading(false);
				onChoose(lat, lon, label, postcode);
				onClose();
			},
			(err) => {
				setLoading(false);
				setHint(
					"Unable to access location: " + (err.message || "permission denied")
				);
			},
			{ enableHighAccuracy: true, timeout: 10000 }
		);
	};

	const handleSearch = async () => {
		if (!query) return setHint("Enter pincode or address");
		setLoading(true);
		const r = await geocodeQuery(query);
		setLoading(false);
		if (!r) {
			setHint("Location not found. Try more details.");
			return;
		}
		const pc = r.address?.postcode ?? null;
		onChoose(r.lat, r.lon, r.display_name, pc);
		onClose();
	};

	if (!open) return null;
	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
			<div className='w-full max-w-xl bg-card rounded-lg shadow-lg overflow-hidden'>
				<div className='p-4 border-b border-border flex items-center justify-between'>
					<h3 className='font-semibold'>Set location</h3>
					<button className='text-sm text-muted-foreground' onClick={onClose}>
						Close
					</button>
				</div>

				<div className='p-4 space-y-3'>
					<p className='text-sm text-muted-foreground'>
						Enter pincode or address, or use your device location.
					</p>

					<div className='flex gap-2'>
						<input
							className='flex-1 rounded border px-3 py-2'
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="e.g. 400001 or 'Andheri West, Mumbai'"
						/>
						<Button onClick={handleSearch} disabled={loading}>
							{loading ? "Searching..." : "Search"}
						</Button>
					</div>

					<div className='flex gap-2'>
						<Button
							variant='outline'
							onClick={handleUseGeolocation}
							disabled={loading}>
							{loading ? "Locating..." : "Use my location"}
						</Button>
						<Button
							variant='ghost'
							onClick={() => {
								setQuery("");
								setHint(null);
							}}>
							Clear
						</Button>
					</div>

					{hint && <div className='text-sm text-red-600'>{hint}</div>}

					<div className='text-xs text-muted-foreground'>
						Note: We use OpenStreetMap (Nominatim) to geocode locations (no API
						key). For heavy production traffic please use a paid geocoding
						provider.
					</div>
				</div>
			</div>
		</div>
	);
};

export default MapModal;
