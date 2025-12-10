import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Briefcase } from "lucide-react";

type WorkerProp = {
	worker: any;
};

const WorkerCard: React.FC<WorkerProp> = ({ worker }) => {
	if (!worker) {
		return (
			<Card className='p-4'>
				<CardContent>
					<div className='text-sm text-muted-foreground'>No worker data</div>
				</CardContent>
			</Card>
		);
	}

	// Normalize data from backend
	const avatar =
		worker.profile_picture ||
		worker.avatar ||
		worker.photo ||
		"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80&auto=format&fit=crop";

	const serviceNames: string[] = Array.isArray(worker.services)
		? worker.services.map((s: any) =>
				typeof s === "string" ? s : s?.name ?? String(s)
		  )
		: typeof worker.services === "string"
		? [worker.services]
		: [];

	const primaryService = serviceNames?.[0] ?? "General";

	const rating =
		typeof worker.rating === "number"
			? worker.rating
			: Number(worker.avg_rating) || 0;

	const hourlyRate =
		typeof worker.hourlyRate === "number"
			? worker.hourlyRate
			: Number(worker.hourly_rate) || worker.rate || null;

	const distanceKm = worker.distanceKm;
	const name = worker.name || worker.full_name || "Unnamed";
	const bio = worker.bio || "No bio available";

	return (
		<Link to={`/worker/${worker.id}`} className='block'>
			<Card className='hover:shadow-lg transition-all cursor-pointer h-full'>
				<CardContent className='p-4'>
					<div className='flex items-start gap-3'>
						<Avatar className='h-16 w-16 flex-shrink-0'>
							<AvatarImage src={avatar} alt={name} />
							<AvatarFallback>{(name || " ")[0].toUpperCase()}</AvatarFallback>
						</Avatar>

						<div className='flex-1 min-w-0'>
							<div className='flex items-start justify-between gap-2'>
								<h3 className='font-semibold text-foreground truncate'>
									{name}
								</h3>
								<div className='flex items-center gap-1 text-sm flex-shrink-0'>
									<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
									<span className='font-medium'>
										{rating?.toFixed ? rating.toFixed(1) : rating}
									</span>
								</div>
							</div>

							<p className='text-sm text-muted-foreground truncate mt-0.5'>
								{primaryService}
							</p>

							<div className='mt-2 flex items-center gap-3 text-xs text-muted-foreground'>
								{distanceKm !== null && distanceKm !== undefined && (
									<div className='flex items-center gap-1'>
										<MapPin className='h-3.5 w-3.5' />
										<span>{distanceKm.toFixed(1)} km</span>
									</div>
								)}
								{hourlyRate !== null && (
									<span className='font-medium text-foreground'>
										₹{hourlyRate}/hr
									</span>
								)}
							</div>

							{bio && (
								<p className='text-xs text-muted-foreground line-clamp-2 mt-2'>
									{bio}
								</p>
							)}
						</div>
					</div>

					<div className='mt-3 flex items-center justify-between gap-2'>
						<div className='flex gap-1.5 flex-wrap'>
							{serviceNames.slice(0, 2).map((service, idx) => (
								<Badge key={idx} variant='secondary' className='text-xs'>
									{service}
								</Badge>
							))}
							{serviceNames.length > 2 && (
								<Badge variant='outline' className='text-xs'>
									+{serviceNames.length - 2}
								</Badge>
							)}
						</div>
						<Button size='sm' className='flex-shrink-0'>
							Book Now
						</Button>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
};

export default WorkerCard;
