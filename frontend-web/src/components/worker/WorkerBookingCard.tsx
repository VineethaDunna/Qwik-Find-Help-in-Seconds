

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	MapPin,
	Clock,
	Calendar,
	Phone,
	MessageCircle,
	Check,
	X,
	IndianRupee,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface WorkerBookingCardProps {
	// this is the raw booking coming from backend (/workers/my/bookings)
	booking: any;
	onAccept?: (id: string) => void;
	onDecline?: (id: string) => void;
	onComplete?: (id: string) => void;
}

const WorkerBookingCard = ({
	booking,
	onAccept,
	onDecline,
	onComplete,
}: WorkerBookingCardProps) => {
	const [expanded, setExpanded] = useState(false);

	// ---- map backend fields to UI-friendly vars ----
	const userName = booking.user?.full_name || "Unknown";
	const userAvatar = booking.user?.profile_picture;
	const userPhone = booking.user?.phone_number;

	const serviceName = booking.service?.name || "Service";

	const dateObj = booking.booking_date ? new Date(booking.booking_date) : null;

	const dateLabel = dateObj ? format(dateObj, "dd MMM") : "Unknown";
	const timeLabel = dateObj ? format(dateObj, "hh:mm a") : "--:--";

	const duration = booking.duration_hours || 1;

	const price =
		booking.total_amount ?? (booking.worker?.hourly_rate || 0) * duration;

	const location = booking.location || "No location specified";
	const notes = booking.notes as string | undefined;

	const status = booking.status as
		| "pending"
		| "confirmed"
		| "completed"
		| "cancelled"
		| "declined";

	const statusColors: Record<string, string> = {
		pending: "bg-accent/10 text-accent border-accent/20",
		confirmed: "bg-primary/10 text-primary border-primary/20",
		completed: "bg-green-500/10 text-green-600 border-green-500/20",
		cancelled: "bg-muted text-muted-foreground border-border",
		declined: "bg-red-500/10 text-red-500 border-red-500/20",
	};

	return (
		<Card
			className={cn(
				"overflow-hidden transition-all duration-200",
				status === "pending" && "border-accent/30 shadow-md"
			)}>
			<CardContent className='p-0'>
				{/* Header */}
				<div
					className='p-3 cursor-pointer'
					onClick={() => setExpanded(!expanded)}>
					<div className='flex items-start gap-3'>
						<Avatar className='h-12 w-12 border-2 border-background shadow'>
							<AvatarImage src={userAvatar} alt={userName} />
							<AvatarFallback>
								{userName ? userName.charAt(0) : "U"}
							</AvatarFallback>
						</Avatar>

						<div className='flex-1 min-w-0'>
							<div className='flex items-center justify-between mb-1'>
								<h3 className='font-semibold text-sm truncate'>{userName}</h3>
								<Badge
									className={cn("text-xs capitalize", statusColors[status])}>
									{status}
								</Badge>
							</div>

							<p className='text-sm text-primary font-medium mb-1'>
								{serviceName}
							</p>

							<div className='flex items-center gap-3 text-xs text-muted-foreground'>
								<span className='flex items-center gap-1'>
									<Calendar className='h-3 w-3' />
									{dateLabel}
								</span>
								<span className='flex items-center gap-1'>
									<Clock className='h-3 w-3' />
									{timeLabel}
								</span>
								<span className='flex items-center gap-1 font-semibold text-foreground'>
									<IndianRupee className='h-3 w-3' />
									{price ?? 0}
								</span>
							</div>
						</div>

						{expanded ? (
							<ChevronUp className='h-5 w-5 text-muted-foreground' />
						) : (
							<ChevronDown className='h-5 w-5 text-muted-foreground' />
						)}
					</div>
				</div>

				{/* Expanded Details */}
				{expanded && (
					<div className='px-3 pb-3 pt-0 border-t border-border/50'>
						<div className='space-y-3 pt-3'>
							{/* Location */}
							<div className='flex items-start gap-2'>
								<MapPin className='h-4 w-4 text-muted-foreground mt-0.5' />
								<div>
									<p className='text-xs text-muted-foreground'>Location</p>
									<p className='text-sm font-medium'>{location}</p>
								</div>
							</div>

							{/* Duration & Price */}
							<div className='flex items-center gap-4'>
								<div className='flex items-center gap-2'>
									<Clock className='h-4 w-4 text-muted-foreground' />
									<div>
										<p className='text-xs text-muted-foreground'>Duration</p>
										<p className='text-sm font-medium'>{duration} hrs</p>
									</div>
								</div>
								<div className='flex items-center gap-2'>
									<IndianRupee className='h-4 w-4 text-muted-foreground' />
									<div>
										<p className='text-xs text-muted-foreground'>Total Price</p>
										<p className='text-sm font-semibold text-primary'>
											₹{price ?? 0}
										</p>
									</div>
								</div>
							</div>

							{/* Notes */}
							{notes && (
								<div className='p-2.5 rounded-lg bg-muted/50'>
									<p className='text-xs text-muted-foreground mb-1'>
										Customer Note
									</p>
									<p className='text-sm'>{notes}</p>
								</div>
							)}

							{/* Contact Actions */}
							{(status === "confirmed" || status === "pending") && (
								<div className='flex gap-2'>
									{userPhone && (
										<Button
											variant='outline'
											size='sm'
											className='flex-1 h-9'
											asChild>
											<a href={`tel:${userPhone}`}>
												<Phone className='h-4 w-4 mr-1.5' />
												Call
											</a>
										</Button>
									)}
									<Button variant='outline' size='sm' className='flex-1 h-9'>
										<MessageCircle className='h-4 w-4 mr-1.5' />
										Message
									</Button>
								</div>
							)}

							{/* Action Buttons */}
							{status === "pending" && (
								<div className='flex gap-2 pt-1'>
									<Button
										variant='outline'
										size='sm'
										className='flex-1 h-10 border-red-200 text-red-500 hover:bg-red-50'
										onClick={() => onDecline?.(booking.id)}>
										<X className='h-4 w-4 mr-1.5' />
										Decline
									</Button>
									<Button
										size='sm'
										className='flex-1 h-10'
										onClick={() => onAccept?.(booking.id)}>
										<Check className='h-4 w-4 mr-1.5' />
										Accept
									</Button>
								</div>
							)}

							{status === "confirmed" && (
								<Button
									size='sm'
									className='w-full h-10 bg-green-500 hover:bg-green-600'
									onClick={() => onComplete?.(booking.id)}>
									<Check className='h-4 w-4 mr-1.5' />
									Mark as Completed
								</Button>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default WorkerBookingCard;
