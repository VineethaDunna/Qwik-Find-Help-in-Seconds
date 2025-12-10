import React, { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WorkerCard from "@/components/workers/WorkerCard";
import { fetchWorkers } from "@/api/workers";
import { haversineKm, reverseGeocode } from "@/utils/geo";
import MapModal from "@/components/MapModal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Search,
	MapPin,
	Filter,
	X,
	SlidersHorizontal,
	ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const UserDashboard: React.FC = () => {
	const { user } = useAuth();
	const [workers, setWorkers] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	// filters/search
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState<string | null>(null);
	const [sortBy, setSortBy] = useState<
		"distance" | "rating" | "price_low" | "price_high"
	>("distance");
	const [minRating, setMinRating] = useState<number>(0);
	const [maxPrice, setMaxPrice] = useState<number | null>(null);

	// location state
	const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
	const [locLabel, setLocLabel] = useState<string | null>(null);
	const [postcode, setPostcode] = useState<string | null>(null);

	const [mapOpen, setMapOpen] = useState(false);
	const [filterOpen, setFilterOpen] = useState(false);

	useEffect(() => {
		// restore saved location
		try {
			const saved = localStorage.getItem("qc_user_location");
			if (saved) {
				const p = JSON.parse(saved);
				if (p?.lat && p?.lon) {
					setLoc({ lat: p.lat, lon: p.lon });
					setLocLabel(p.label || null);
					setPostcode(p.postcode || null);
				}
			}
		} catch {}
	}, []);

	useEffect(() => {
		if (!user) return;
		setLoading(true);
		fetchWorkers()
			.then((rows) => setWorkers(rows))
			.catch((e) => console.error(e))
			.finally(() => setLoading(false));
	}, [user]);

	// compute distance if loc available
	const withDistance = useMemo(() => {
		return workers.map((w) => {
			let distanceKm: number | null = null;
			const candidate = w.raw?.users?.location || w.location_text || "";
			if (loc && typeof candidate === "string" && candidate.includes(",")) {
				const parts = candidate.split(",").map((p: string) => p.trim());
				if (
					parts.length >= 2 &&
					!isNaN(Number(parts[0])) &&
					!isNaN(Number(parts[1]))
				) {
					const lat = Number(parts[0]);
					const lon = Number(parts[1]);
					distanceKm = haversineKm(loc.lat, loc.lon, lat, lon);
				}
			}
			return { ...w, distanceKm };
		});
	}, [workers, loc]);

	// unique categories from workers
	const categories = useMemo(() => {
		const set = new Set<string>();
		workers.forEach((w) =>
			(w.services || []).forEach((s: string) => set.add(s))
		);
		return Array.from(set);
	}, [workers]);

	const results = useMemo(() => {
		const q = search.trim().toLowerCase();
		let out = withDistance.filter((w) => {
			const matchesQ =
				!q ||
				(w.name || "").toLowerCase().includes(q) ||
				(w.services || []).some((s: string) => s.toLowerCase().includes(q));
			const matchesCat = !category || (w.services || []).includes(category);
			const matchesRating = (w.rating || 0) >= (minRating || 0);
			const matchesPrice =
				maxPrice == null ||
				(w.hourly_rate ?? w.hourlyRate ?? Infinity) <= (maxPrice || Infinity);
			return matchesQ && matchesCat && matchesRating && matchesPrice;
		});

		switch (sortBy) {
			case "rating":
				out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
				break;
			case "price_low":
				out.sort(
					(a, b) =>
						(a.hourly_rate ?? a.hourlyRate ?? Infinity) -
						(b.hourly_rate ?? b.hourlyRate ?? Infinity)
				);
				break;
			case "price_high":
				out.sort(
					(a, b) =>
						(b.hourly_rate ?? b.hourlyRate ?? 0) -
						(a.hourly_rate ?? a.hourlyRate ?? 0)
				);
				break;
			case "distance":
			default:
				out.sort(
					(a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
				);
				break;
		}

		return out;
	}, [withDistance, search, category, sortBy, minRating, maxPrice]);

	const handleChooseLocation = async (
		lat: number,
		lon: number,
		label?: string,
		pc?: string | null
	) => {
		setLoc({ lat, lon });
		setLocLabel(label || `${lat},${lon}`);
		setPostcode(pc ?? null);
		localStorage.setItem(
			"qc_user_location",
			JSON.stringify({ lat, lon, label, postcode: pc ?? null })
		);
	};

	const clearLocation = () => {
		setLoc(null);
		setLocLabel(null);
		setPostcode(null);
		localStorage.removeItem("qc_user_location");
	};

	const clearFilters = () => {
		setCategory(null);
		setMinRating(0);
		setMaxPrice(null);
	};

	const activeFilterCount = [
		category !== null,
		minRating > 0,
		maxPrice !== null,
	].filter(Boolean).length;

	return (
		<div className='min-h-screen bg-background pb-20'>
			<Header showAuth={false} />

			<main className='container py-4 md:py-6 space-y-4 md:space-y-6'>
				{/* Header Section */}
				<div className='space-y-3'>
					<div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
						<div className='flex-1'>
							<h1 className='text-2xl md:text-3xl font-bold'>
								Hello
								{user?.full_name ? `, ${user.full_name.split(" ")[0]}` : ""}!
							</h1>
							<div className='flex items-start gap-2 mt-2 text-sm text-muted-foreground'>
								<MapPin className='h-4 w-4 mt-0.5 flex-shrink-0' />
								<div className='flex-1'>
									<div className='font-medium text-foreground'>
										{locLabel ?? user?.location ?? "Location not set"}
									</div>
									{postcode && (
										<div className='text-xs mt-0.5'>Pincode: {postcode}</div>
									)}
								</div>
							</div>
						</div>

						<div className='flex gap-2 sm:flex-shrink-0'>
							<Button
								onClick={() => setMapOpen(true)}
								className='flex-1 sm:flex-none'>
								<MapPin className='h-4 w-4 mr-2' />
								Set Location
							</Button>
							{loc && (
								<Button variant='outline' size='icon' onClick={clearLocation}>
									<X className='h-4 w-4' />
								</Button>
							)}
						</div>
					</div>
				</div>

				{/* Search Bar */}
				<div className='relative'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none' />
					<Input
						className='pl-10 pr-4 h-11 md:h-12'
						placeholder='Search helpers or services...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
				</div>

				{/* Filter Bar - Mobile & Desktop */}
				<div className='flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide'>
					{/* Sort Dropdown */}
					<Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
						<SelectTrigger className='w-[140px] md:w-[160px] flex-shrink-0'>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value='distance'>Nearest</SelectItem>
							<SelectItem value='rating'>Top Rated</SelectItem>
							<SelectItem value='price_low'>Price: Low-High</SelectItem>
							<SelectItem value='price_high'>Price: High-Low</SelectItem>
						</SelectContent>
					</Select>

					{/* Advanced Filters Button */}
					<Sheet open={filterOpen} onOpenChange={setFilterOpen}>
						<SheetTrigger asChild>
							<Button variant='outline' className='flex-shrink-0 relative'>
								<SlidersHorizontal className='h-4 w-4 mr-2' />
								Filters
								{activeFilterCount > 0 && (
									<span className='ml-1 px-1.5 py-0.5 text-xs bg-primary text-primary-foreground rounded-full'>
										{activeFilterCount}
									</span>
								)}
							</Button>
						</SheetTrigger>
						<SheetContent side='right' className='w-full sm:w-[400px]'>
							<SheetHeader>
								<SheetTitle>Filters</SheetTitle>
								<SheetDescription>Refine your search results</SheetDescription>
							</SheetHeader>

							<div className='mt-6 space-y-6'>
								{/* Min Rating */}
								<div className='space-y-2'>
									<div className='flex items-center justify-between'>
										<label className='text-sm font-medium'>
											Minimum Rating
										</label>
										<span className='text-sm text-muted-foreground'>
											{minRating}+
										</span>
									</div>
									<input
										type='range'
										min={0}
										max={5}
										step={0.5}
										value={minRating}
										onChange={(e) => setMinRating(Number(e.target.value))}
										className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary'
									/>
									<div className='flex justify-between text-xs text-muted-foreground'>
										<span>0</span>
										<span>2.5</span>
										<span>5</span>
									</div>
								</div>

								{/* Max Price */}
								<div className='space-y-2'>
									<label className='text-sm font-medium'>
										Maximum Price (₹/hr)
									</label>
									<Input
										type='number'
										placeholder='No limit'
										value={maxPrice ?? ""}
										onChange={(e) =>
											setMaxPrice(
												e.target.value ? Number(e.target.value) : null
											)
										}
									/>
								</div>

								{/* Clear Filters */}
								{activeFilterCount > 0 && (
									<Button
										variant='outline'
										className='w-full'
										onClick={() => {
											clearFilters();
											setFilterOpen(false);
										}}>
										Clear All Filters
									</Button>
								)}
							</div>
						</SheetContent>
					</Sheet>

					{/* Category Pills - Scrollable */}
					<div className='flex gap-2 overflow-x-auto scrollbar-hide'>
						<Badge
							variant={category == null ? "default" : "outline"}
							className='cursor-pointer flex-shrink-0 px-3 py-1.5'
							onClick={() => setCategory(null)}>
							All Services
						</Badge>
						{categories.slice(0, 15).map((c) => (
							<Badge
								key={c}
								variant={category === c ? "default" : "outline"}
								className='cursor-pointer flex-shrink-0 px-3 py-1.5 hover:bg-accent'
								onClick={() => setCategory(category === c ? null : c)}>
								{c}
							</Badge>
						))}
					</div>
				</div>

				{/* Active Filters Display */}
				{(category || minRating > 0 || maxPrice !== null) && (
					<div className='flex flex-wrap gap-2 items-center'>
						<span className='text-sm text-muted-foreground'>
							Active filters:
						</span>
						{category && (
							<Badge variant='secondary' className='gap-1'>
								{category}
								<X
									className='h-3 w-3 cursor-pointer'
									onClick={() => setCategory(null)}
								/>
							</Badge>
						)}
						{minRating > 0 && (
							<Badge variant='secondary' className='gap-1'>
								Rating {minRating}+
								<X
									className='h-3 w-3 cursor-pointer'
									onClick={() => setMinRating(0)}
								/>
							</Badge>
						)}
						{maxPrice !== null && (
							<Badge variant='secondary' className='gap-1'>
								Max ₹{maxPrice}/hr
								<X
									className='h-3 w-3 cursor-pointer'
									onClick={() => setMaxPrice(null)}
								/>
							</Badge>
						)}
						<Button
							variant='ghost'
							size='sm'
							onClick={clearFilters}
							className='h-7 text-xs'>
							Clear all
						</Button>
					</div>
				)}

				{/* Results Section */}
				<section>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-lg md:text-xl font-semibold'>
							{category ? `${category} helpers` : "Helpers near you"}
						</h2>
						<div className='text-sm text-muted-foreground'>
							{results.length} {results.length === 1 ? "helper" : "helpers"}
						</div>
					</div>

					{loading ? (
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{Array.from({ length: 8 }).map((_, i) => (
								<div
									key={i}
									className='p-4 bg-card rounded-xl border animate-pulse h-48'
								/>
							))}
						</div>
					) : results.length > 0 ? (
						<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
							{results.map((w) => (
								<WorkerCard key={w.id} worker={w} />
							))}
						</div>
					) : (
						<div className='text-center py-12 px-4'>
							<div className='max-w-md mx-auto space-y-3'>
								<div className='text-5xl'>🔍</div>
								<h3 className='text-lg font-medium'>No helpers found</h3>
								<p className='text-sm text-muted-foreground'>
									Try adjusting your filters or search terms, or set your
									location to find helpers near you.
								</p>
								{(category || minRating > 0 || maxPrice !== null) && (
									<Button
										variant='outline'
										onClick={clearFilters}
										className='mt-4'>
										Clear Filters
									</Button>
								)}
							</div>
						</div>
					)}
				</section>
			</main>

			<BottomNav />

			<MapModal
				open={mapOpen}
				onClose={() => setMapOpen(false)}
				onChoose={async (lat, lon, label, pc) => {
					if (!label) {
						const r = await reverseGeocode(lat, lon);
						label = r?.display_name ?? `${lat},${lon}`;
						pc = r?.address?.postcode ?? null;
					}
					handleChooseLocation(lat, lon, label, pc);
					setMapOpen(false);
				}}
			/>
		</div>
	);
};

export default UserDashboard;
