// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import Header from "@/components/layout/Header";
// import {
// 	Star,
// 	MapPin,
// 	CheckCircle,
// 	Phone,
// 	MessageCircle,
// 	Calendar,
// 	Clock,
// 	ArrowLeft,
// 	Shield,
// 	Briefcase,
// 	Loader2,
// } from "lucide-react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import { createBooking } from "@/api/bookings";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { supabase } from "@/lib/supabaseClient";

// const WorkerDetail = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();
// 	const { user } = useAuth();

// 	// Worker data state
// 	const [worker, setWorker] = useState<any>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	// Booking form state
// 	const [selectedDate, setSelectedDate] = useState<string>("");
// 	const [selectedTime, setSelectedTime] = useState<string>("");
// 	const [location, setLocation] = useState<string>("");
// 	const [notes, setNotes] = useState<string>("");
// 	const [duration, setDuration] = useState<number>(1);
// 	const [isBooking, setIsBooking] = useState(false);
// 	const [dialogOpen, setDialogOpen] = useState(false);

// 	// Fetch worker data from backend
// 	useEffect(() => {
// 		const fetchWorkerDetail = async () => {
// 			if (!id) return;

// 			try {
// 				setLoading(true);
// 				setError(null);

// 				const { data, error } = await supabase
// 					.from("workers")
// 					.select(
// 						`
//             *,
//             users (
//               id,
//               full_name,
//               email,
//               phone_number,
//               location,
//               profile_picture
//             )
//           `
// 					)
// 					.eq("id", id)
// 					.single();

// 				if (error) throw error;

// 				if (!data) {
// 					throw new Error("Worker not found");
// 				}

// 				// Fetch worker services
// 				const { data: servicesData } = await supabase
// 					.from("worker_services")
// 					.select(
// 						`
//             services (
//               name
//             )
//           `
// 					)
// 					.eq("worker_id", id);

// 				const services =
// 					servicesData?.map((s: any) => s.services?.name).filter(Boolean) || [];

// 				// Transform to match component expectations
// 				const workerData = {
// 					id: data.id,
// 					name: data.users?.full_name || "Unknown",
// 					avatar: data.users?.profile_picture || "",
// 					bio: data.bio || "",
// 					hourlyRate: Number(data.hourly_rate) || 0,
// 					rating: Number(data.rating) || 0,
// 					reviewCount: data.total_reviews || 0,
// 					completedJobs: data.total_bookings || 0,
// 					experience: data.experience_years
// 						? `${data.experience_years} years`
// 						: "New",
// 					services: services,
// 					location: data.users?.location || "Unknown",
// 					phone: data.users?.phone_number || "",
// 					email: data.users?.email || "",
// 					isVerified: data.users?.is_verified || false,
// 					availability: ["Mon", "Tue", "Wed", "Thu", "Fri"], // Default or fetch from backend
// 					availabilityStatus: data.availability_status,
// 				};

// 				setWorker(workerData);
// 			} catch (err: any) {
// 				console.error("Error fetching worker:", err);
// 				setError(err.message || "Failed to load worker details");
// 				toast.error("Failed to load worker details");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchWorkerDetail();
// 	}, [id]);

// 	const timeSlots = [
// 		"9:00 AM",
// 		"10:00 AM",
// 		"11:00 AM",
// 		"12:00 PM",
// 		"2:00 PM",
// 		"3:00 PM",
// 		"4:00 PM",
// 		"5:00 PM",
// 	];

// 	const today = new Date().toISOString().split("T")[0];
// 	const platformFee = 25;
// 	const serviceAmount = worker ? worker.hourlyRate * duration : 0;
// 	const totalAmount = serviceAmount + platformFee;

// 	const handleBooking = async () => {
// 		if (!user) {
// 			toast.error("Please login to book a service");
// 			navigate("/login");
// 			return;
// 		}

// 		if (!selectedDate || !selectedTime || !location.trim()) {
// 			toast.error("Please fill in all required fields");
// 			return;
// 		}

// 		setIsBooking(true);

// 		try {
// 			const time24 = convertTo24Hour(selectedTime);

// 			const bookingData = {
// 				worker_id: worker.id,
// 				booking_date: selectedDate,
// 				booking_time: time24,
// 				duration_hours: duration,
// 				location: location.trim(),
// 				notes: notes.trim() || undefined,
// 				hourly_rate: worker.hourlyRate,
// 			};

// 			await createBooking(bookingData);

// 			toast.success("Booking created successfully!");
// 			setDialogOpen(false);
// 			navigate("/bookings");
// 		} catch (error: any) {
// 			console.error("Booking error:", error);
// 			toast.error(error.message || "Failed to create booking");
// 		} finally {
// 			setIsBooking(false);
// 		}
// 	};

// 	const convertTo24Hour = (time12: string): string => {
// 		const [time, period] = time12.split(" ");
// 		let [hours, minutes] = time.split(":");

// 		if (period === "PM" && hours !== "12") {
// 			hours = String(Number(hours) + 12);
// 		} else if (period === "AM" && hours === "12") {
// 			hours = "00";
// 		}

// 		return `${hours.padStart(2, "0")}:${minutes || "00"}`;
// 	};

// 	// Loading state
// 	if (loading) {
// 		return (
// 			<div className='min-h-screen bg-background'>
// 				<Header showAuth={false} />
// 				<main className='container py-8 flex items-center justify-center'>
// 					<div className='text-center space-y-4'>
// 						<Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
// 						<p className='text-muted-foreground'>Loading worker details...</p>
// 					</div>
// 				</main>
// 			</div>
// 		);
// 	}

// 	// Error state
// 	if (error || !worker) {
// 		return (
// 			<div className='min-h-screen bg-background'>
// 				<Header showAuth={false} />
// 				<main className='container py-8 text-center'>
// 					<div className='text-5xl mb-4'>😕</div>
// 					<p className='text-muted-foreground mb-4'>
// 						{error || "Worker not found"}
// 					</p>
// 					<Button asChild>
// 						<Link to='/dashboard'>Back to Dashboard</Link>
// 					</Button>
// 				</main>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className='min-h-screen bg-background'>
// 			<Header showAuth={false} />

// 			<main className='container py-6 max-w-2xl'>
// 				{/* Back Button */}
// 				<Button variant='ghost' asChild className='mb-4 -ml-2'>
// 					<Link to='/dashboard'>
// 						<ArrowLeft className='h-4 w-4 mr-2' />
// 						Back
// 					</Link>
// 				</Button>

// 				{/* Profile Header */}
// 				<div className='animate-fade-in'>
// 					<div className='flex items-start gap-4 mb-6'>
// 						<div className='relative'>
// 							<img
// 								src={
// 									worker.avatar ||
// 									"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
// 								}
// 								alt={worker.name}
// 								className='h-24 w-24 rounded-2xl object-cover'
// 							/>
// 							{worker.isVerified && (
// 								<div className='absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow-sm'>
// 									<CheckCircle className='h-5 w-5 text-primary' />
// 								</div>
// 							)}
// 						</div>

// 						<div className='flex-1'>
// 							<div className='flex items-center gap-2 mb-1'>
// 								<h1 className='text-heading font-semibold text-foreground'>
// 									{worker.name}
// 								</h1>
// 								{worker.isVerified && (
// 									<Badge variant='default' className='text-xs'>
// 										Verified
// 									</Badge>
// 								)}
// 							</div>

// 							<div className='flex items-center gap-1 mb-2'>
// 								<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
// 								<span className='font-medium'>{worker.rating.toFixed(1)}</span>
// 								<span className='text-muted-foreground'>
// 									({worker.reviewCount} reviews)
// 								</span>
// 							</div>

// 							<div className='flex items-center gap-1 text-sm text-muted-foreground'>
// 								<MapPin className='h-4 w-4' />
// 								<span>{worker.location}</span>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Price */}
// 					<Card className='mb-6'>
// 						<CardContent className='p-4 flex items-center justify-between'>
// 							<div>
// 								<p className='text-sm text-muted-foreground'>Starting from</p>
// 								<p className='text-2xl font-semibold text-foreground'>
// 									₹{worker.hourlyRate}
// 									<span className='text-sm font-normal text-muted-foreground'>
// 										/hour
// 									</span>
// 								</p>
// 							</div>
// 							<div className='flex gap-2'>
// 								<Button variant='outline' size='icon'>
// 									<Phone className='h-4 w-4' />
// 								</Button>
// 								<Button variant='outline' size='icon'>
// 									<MessageCircle className='h-4 w-4' />
// 								</Button>
// 							</div>
// 						</CardContent>
// 					</Card>

// 					{/* Services */}
// 					<div className='mb-6'>
// 						<h2 className='text-sm font-semibold text-foreground mb-3'>
// 							Services offered
// 						</h2>
// 						<div className='flex flex-wrap gap-2'>
// 							{worker.services.length > 0 ? (
// 								worker.services.map((service: string) => (
// 									<Badge key={service} variant='secondary'>
// 										{service}
// 									</Badge>
// 								))
// 							) : (
// 								<p className='text-sm text-muted-foreground'>
// 									No services listed
// 								</p>
// 							)}
// 						</div>
// 					</div>

// 					{/* About */}
// 					{worker.bio && (
// 						<div className='mb-6'>
// 							<h2 className='text-sm font-semibold text-foreground mb-2'>
// 								About
// 							</h2>
// 							<p className='text-muted-foreground'>{worker.bio}</p>
// 						</div>
// 					)}

// 					{/* Stats */}
// 					<div className='grid grid-cols-3 gap-4 mb-6'>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Briefcase className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.completedJobs}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Jobs done</p>
// 							</CardContent>
// 						</Card>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Clock className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.experience}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Experience</p>
// 							</CardContent>
// 						</Card>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Shield className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.isVerified ? "Yes" : "Pending"}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Verified</p>
// 							</CardContent>
// 						</Card>
// 					</div>

// 					{/* Availability */}
// 					<div className='mb-8'>
// 						<h2 className='text-sm font-semibold text-foreground mb-3'>
// 							Available days
// 						</h2>
// 						<div className='flex gap-2'>
// 							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
// 								<div
// 									key={day}
// 									className={cn(
// 										"w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium",
// 										worker.availability.includes(day)
// 											? "bg-primary text-primary-foreground"
// 											: "bg-secondary text-muted-foreground"
// 									)}>
// 									{day.charAt(0)}
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				</div>

// 				{/* Book CTA */}
// 				<div className='fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50'>
// 					<div className='container max-w-2xl'>
// 						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// 							<DialogTrigger asChild>
// 								<Button size='lg' className='w-full'>
// 									<Calendar className='h-5 w-5 mr-2' />
// 									Book {worker.name.split(" ")[0]}
// 								</Button>
// 							</DialogTrigger>
// 							<DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto'>
// 								<DialogHeader>
// 									<DialogTitle>Book {worker.name}</DialogTitle>
// 									<DialogDescription>
// 										Select a date and time for your booking
// 									</DialogDescription>
// 								</DialogHeader>
// 								<div className='space-y-4 py-4'>
// 									{/* Date */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Date <span className='text-red-500'>*</span>
// 										</label>
// 										<Input
// 											type='date'
// 											min={today}
// 											value={selectedDate}
// 											onChange={(e) => setSelectedDate(e.target.value)}
// 										/>
// 									</div>

// 									{/* Time */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Time <span className='text-red-500'>*</span>
// 										</label>
// 										<div className='grid grid-cols-3 gap-2'>
// 											{timeSlots.map((time) => (
// 												<button
// 													key={time}
// 													type='button'
// 													className={cn(
// 														"px-3 py-2 rounded-lg text-sm font-medium transition-all",
// 														selectedTime === time
// 															? "bg-primary text-primary-foreground"
// 															: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
// 													)}
// 													onClick={() => setSelectedTime(time)}>
// 													{time}
// 												</button>
// 											))}
// 										</div>
// 									</div>

// 									{/* Duration */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Duration (hours)
// 										</label>
// 										<Input
// 											type='number'
// 											min='1'
// 											max='8'
// 											value={duration}
// 											onChange={(e) => setDuration(Number(e.target.value) || 1)}
// 										/>
// 									</div>

// 									{/* Location */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Location <span className='text-red-500'>*</span>
// 										</label>
// 										<Input
// 											placeholder='Enter your address'
// 											value={location}
// 											onChange={(e) => setLocation(e.target.value)}
// 										/>
// 									</div>

// 									{/* Notes */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Additional notes (optional)
// 										</label>
// 										<Textarea
// 											placeholder='Any special instructions...'
// 											rows={3}
// 											value={notes}
// 											onChange={(e) => setNotes(e.target.value)}
// 										/>
// 									</div>

// 									{/* Pricing Summary */}
// 									<div className='pt-4 border-t border-border space-y-2'>
// 										<div className='flex justify-between text-sm'>
// 											<span className='text-muted-foreground'>
// 												Service rate
// 											</span>
// 											<span className='font-medium'>
// 												₹{worker.hourlyRate} × {duration}h = ₹{serviceAmount}
// 											</span>
// 										</div>
// 										<div className='flex justify-between text-sm'>
// 											<span className='text-muted-foreground'>
// 												Platform fee
// 											</span>
// 											<span className='font-medium'>₹{platformFee}</span>
// 										</div>
// 										<div className='flex justify-between text-base font-semibold pt-2 border-t'>
// 											<span>Total</span>
// 											<span>₹{totalAmount}</span>
// 										</div>
// 									</div>

// 									{/* Confirm Button */}
// 									<Button
// 										className='w-full'
// 										size='lg'
// 										disabled={
// 											!selectedDate ||
// 											!selectedTime ||
// 											!location.trim() ||
// 											isBooking
// 										}
// 										onClick={handleBooking}>
// 										{isBooking ? (
// 											<>
// 												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
// 												Creating booking...
// 											</>
// 										) : (
// 											"Confirm booking"
// 										)}
// 									</Button>
// 								</div>
// 							</DialogContent>
// 						</Dialog>
// 					</div>
// 				</div>

// 				{/* Spacer for fixed CTA */}
// 				<div className='h-24' />
// 			</main>
// 		</div>
// 	);
// };

// export default WorkerDetail;

// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import Header from "@/components/layout/Header";
// import {
// 	Star,
// 	MapPin,
// 	CheckCircle,
// 	Phone,
// 	MessageCircle,
// 	Calendar,
// 	Clock,
// 	ArrowLeft,
// 	Shield,
// 	Briefcase,
// 	Loader2,
// } from "lucide-react";
// import {
// 	Dialog,
// 	DialogContent,
// 	DialogDescription,
// 	DialogHeader,
// 	DialogTitle,
// 	DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { cn } from "@/lib/utils";
// import { createBooking } from "@/api/bookings";
// import { useAuth } from "@/contexts/AuthContext";
// import { toast } from "sonner";
// import { supabase } from "@/lib/supabaseClient";

// const WorkerDetail = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();
// 	const { user } = useAuth();

// 	// Worker data state
// 	const [worker, setWorker] = useState<any>(null);
// 	const [loading, setLoading] = useState(true);
// 	const [error, setError] = useState<string | null>(null);

// 	// Booking form state
// 	const [selectedDate, setSelectedDate] = useState<string>("");
// 	const [selectedTime, setSelectedTime] = useState<string>("");
// 	const [location, setLocation] = useState<string>("");
// 	const [notes, setNotes] = useState<string>("");
// 	const [duration, setDuration] = useState<number>(1);
// 	const [isBooking, setIsBooking] = useState(false);
// 	const [dialogOpen, setDialogOpen] = useState(false);

// 	// Fetch worker data from backend
// 	useEffect(() => {
// 		const fetchWorkerDetail = async () => {
// 			if (!id) return;

// 			try {
// 				setLoading(true);
// 				setError(null);

// 				const { data, error } = await supabase
// 					.from("workers")
// 					.select(
// 						`
//             *,
//             users (
//               id,
//               full_name,
//               email,
//               phone_number,
//               location,
//               profile_picture,
//               is_verified
//             )
//           `
// 					)
// 					.eq("id", id)
// 					.single();

// 				if (error) throw error;

// 				if (!data) {
// 					throw new Error("Worker not found");
// 				}

// 				// Fetch worker services
// 				const { data: servicesData } = await supabase
// 					.from("worker_services")
// 					.select(
// 						`
//             services (
//               id,
//               name
//             )
//           `
// 					)
// 					.eq("worker_id", id);

// 				const services =
// 					servicesData?.map((s: any) => s.services?.name).filter(Boolean) || [];

// 				// Transform to match component expectations
// 				const workerData = {
// 					id: data.id,
// 					name: data.users?.full_name || "Unknown",
// 					avatar: data.users?.profile_picture || "",
// 					bio: data.bio || "",
// 					hourlyRate: Number(data.hourly_rate) || 0,
// 					rating: Number(data.rating) || 0,
// 					reviewCount: data.total_reviews || 0,
// 					completedJobs: data.total_bookings || 0,
// 					experience: data.experience_years
// 						? `${data.experience_years} years`
// 						: "New",
// 					services: services,
// 					location: data.users?.location || "Unknown",
// 					phone: data.users?.phone_number || "",
// 					email: data.users?.email || "",
// 					isVerified: data.users?.is_verified || false,
// 					availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
// 					availabilityStatus: data.availability_status,
// 				};

// 				setWorker(workerData);
// 			} catch (err: any) {
// 				console.error("Error fetching worker:", err);
// 				setError(err.message || "Failed to load worker details");
// 				toast.error("Failed to load worker details");
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchWorkerDetail();
// 	}, [id]);

// 	const timeSlots = [
// 		"9:00 AM",
// 		"10:00 AM",
// 		"11:00 AM",
// 		"12:00 PM",
// 		"2:00 PM",
// 		"3:00 PM",
// 		"4:00 PM",
// 		"5:00 PM",
// 	];

// 	const today = new Date().toISOString().split("T")[0];
// 	const platformFee = 25;
// 	const serviceAmount = worker ? worker.hourlyRate * duration : 0;
// 	const totalAmount = serviceAmount + platformFee;

// 	const handleBooking = async () => {
// 		// Check authentication first
// 		if (!user) {
// 			toast.error("Please login to book a service");
// 			navigate("/login");
// 			return;
// 		}

// 		// Validate form
// 		if (!selectedDate || !selectedTime || !location.trim()) {
// 			toast.error("Please fill in all required fields");
// 			return;
// 		}

// 		// Validate date is not in the past
// 		const selectedDateTime = new Date(
// 			`${selectedDate}T${convertTo24Hour(selectedTime)}`
// 		);
// 		if (selectedDateTime < new Date()) {
// 			toast.error("Please select a future date and time");
// 			return;
// 		}

// 		setIsBooking(true);

// 		try {
// 			const time24 = convertTo24Hour(selectedTime);

// 			const bookingData = {
// 				worker_id: worker.id,
// 				booking_date: selectedDate,
// 				booking_time: time24,
// 				duration_hours: duration,
// 				location: location.trim(),
// 				notes: notes.trim() || undefined,
// 				hourly_rate: worker.hourlyRate,
// 			};

// 			console.log("Submitting booking:", bookingData);

// 			const booking = await createBooking(bookingData);

// 			console.log("Booking created:", booking);

// 			toast.success("Booking created successfully!", {
// 				description: `Your booking with ${worker.name} has been confirmed.`,
// 			});

// 			// Reset form
// 			setSelectedDate("");
// 			setSelectedTime("");
// 			setLocation("");
// 			setNotes("");
// 			setDuration(1);
// 			setDialogOpen(false);

// 			// Navigate to bookings page
// 			setTimeout(() => {
// 				navigate("/activity");
// 			}, 500);
// 		} catch (error: any) {
// 			console.error("Booking error:", error);
// 			toast.error(error.message || "Failed to create booking", {
// 				description:
// 					"Please try again or contact support if the problem persists.",
// 			});
// 		} finally {
// 			setIsBooking(false);
// 		}
// 	};

// 	const convertTo24Hour = (time12: string): string => {
// 		const [time, period] = time12.split(" ");
// 		let [hours, minutes] = time.split(":");

// 		if (period === "PM" && hours !== "12") {
// 			hours = String(Number(hours) + 12);
// 		} else if (period === "AM" && hours === "12") {
// 			hours = "00";
// 		}

// 		return `${hours.padStart(2, "0")}:${minutes || "00"}`;
// 	};

// 	// Loading state
// 	if (loading) {
// 		return (
// 			<div className='min-h-screen bg-background'>
// 				<Header showAuth={false} />
// 				<main className='container py-8 flex items-center justify-center'>
// 					<div className='text-center space-y-4'>
// 						<Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
// 						<p className='text-muted-foreground'>Loading worker details...</p>
// 					</div>
// 				</main>
// 			</div>
// 		);
// 	}

// 	// Error state
// 	if (error || !worker) {
// 		return (
// 			<div className='min-h-screen bg-background'>
// 				<Header showAuth={false} />
// 				<main className='container py-8 text-center'>
// 					<div className='text-5xl mb-4'>😕</div>
// 					<p className='text-muted-foreground mb-4'>
// 						{error || "Worker not found"}
// 					</p>
// 					<Button asChild>
// 						<Link to='/dashboard'>Back to Dashboard</Link>
// 					</Button>
// 				</main>
// 			</div>
// 		);
// 	}

// 	return (
// 		<div className='min-h-screen bg-background'>
// 			<Header showAuth={false} />

// 			<main className='container py-6 max-w-2xl'>
// 				{/* Back Button */}
// 				<Button variant='ghost' asChild className='mb-4 -ml-2'>
// 					<Link to='/dashboard'>
// 						<ArrowLeft className='h-4 w-4 mr-2' />
// 						Back
// 					</Link>
// 				</Button>

// 				{/* Profile Header */}
// 				<div className='animate-fade-in'>
// 					<div className='flex items-start gap-4 mb-6'>
// 						<div className='relative'>
// 							<img
// 								src={
// 									worker.avatar ||
// 									"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
// 								}
// 								alt={worker.name}
// 								className='h-24 w-24 rounded-2xl object-cover'
// 							/>
// 							{worker.isVerified && (
// 								<div className='absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow-sm'>
// 									<CheckCircle className='h-5 w-5 text-primary' />
// 								</div>
// 							)}
// 						</div>

// 						<div className='flex-1'>
// 							<div className='flex items-center gap-2 mb-1'>
// 								<h1 className='text-heading font-semibold text-foreground'>
// 									{worker.name}
// 								</h1>
// 								{worker.isVerified && (
// 									<Badge variant='default' className='text-xs'>
// 										Verified
// 									</Badge>
// 								)}
// 							</div>

// 							<div className='flex items-center gap-1 mb-2'>
// 								<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
// 								<span className='font-medium'>{worker.rating.toFixed(1)}</span>
// 								<span className='text-muted-foreground'>
// 									({worker.reviewCount} reviews)
// 								</span>
// 							</div>

// 							<div className='flex items-center gap-1 text-sm text-muted-foreground'>
// 								<MapPin className='h-4 w-4' />
// 								<span>{worker.location}</span>
// 							</div>
// 						</div>
// 					</div>

// 					{/* Price */}
// 					<Card className='mb-6'>
// 						<CardContent className='p-4 flex items-center justify-between'>
// 							<div>
// 								<p className='text-sm text-muted-foreground'>Starting from</p>
// 								<p className='text-2xl font-semibold text-foreground'>
// 									₹{worker.hourlyRate}
// 									<span className='text-sm font-normal text-muted-foreground'>
// 										/hour
// 									</span>
// 								</p>
// 							</div>
// 							<div className='flex gap-2'>
// 								<Button variant='outline' size='icon'>
// 									<Phone className='h-4 w-4' />
// 								</Button>
// 								<Button variant='outline' size='icon'>
// 									<MessageCircle className='h-4 w-4' />
// 								</Button>
// 							</div>
// 						</CardContent>
// 					</Card>

// 					{/* Services */}
// 					<div className='mb-6'>
// 						<h2 className='text-sm font-semibold text-foreground mb-3'>
// 							Services offered
// 						</h2>
// 						<div className='flex flex-wrap gap-2'>
// 							{worker.services.length > 0 ? (
// 								worker.services.map((service: string) => (
// 									<Badge key={service} variant='secondary'>
// 										{service}
// 									</Badge>
// 								))
// 							) : (
// 								<p className='text-sm text-muted-foreground'>
// 									No services listed
// 								</p>
// 							)}
// 						</div>
// 					</div>

// 					{/* About */}
// 					{worker.bio && (
// 						<div className='mb-6'>
// 							<h2 className='text-sm font-semibold text-foreground mb-2'>
// 								About
// 							</h2>
// 							<p className='text-muted-foreground'>{worker.bio}</p>
// 						</div>
// 					)}

// 					{/* Stats */}
// 					<div className='grid grid-cols-3 gap-4 mb-6'>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Briefcase className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.completedJobs}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Jobs done</p>
// 							</CardContent>
// 						</Card>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Clock className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.experience}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Experience</p>
// 							</CardContent>
// 						</Card>
// 						<Card>
// 							<CardContent className='p-4 text-center'>
// 								<Shield className='h-5 w-5 mx-auto mb-1 text-primary' />
// 								<p className='text-lg font-semibold text-foreground'>
// 									{worker.isVerified ? "Yes" : "Pending"}
// 								</p>
// 								<p className='text-xs text-muted-foreground'>Verified</p>
// 							</CardContent>
// 						</Card>
// 					</div>

// 					{/* Availability */}
// 					<div className='mb-8'>
// 						<h2 className='text-sm font-semibold text-foreground mb-3'>
// 							Available days
// 						</h2>
// 						<div className='flex gap-2'>
// 							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
// 								<div
// 									key={day}
// 									className={cn(
// 										"w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium",
// 										worker.availability.includes(day)
// 											? "bg-primary text-primary-foreground"
// 											: "bg-secondary text-muted-foreground"
// 									)}>
// 									{day.charAt(0)}
// 								</div>
// 							))}
// 						</div>
// 					</div>
// 				</div>

// 				{/* Book CTA */}
// 				<div className='fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50'>
// 					<div className='container max-w-2xl'>
// 						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
// 							<DialogTrigger asChild>
// 								<Button size='lg' className='w-full'>
// 									<Calendar className='h-5 w-5 mr-2' />
// 									Book {worker.name.split(" ")[0]}
// 								</Button>
// 							</DialogTrigger>
// 							<DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto'>
// 								<DialogHeader>
// 									<DialogTitle>Book {worker.name}</DialogTitle>
// 									<DialogDescription>
// 										Select a date and time for your booking
// 									</DialogDescription>
// 								</DialogHeader>
// 								<div className='space-y-4 py-4'>
// 									{/* Date */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Date <span className='text-red-500'>*</span>
// 										</label>
// 										<Input
// 											type='date'
// 											min={today}
// 											value={selectedDate}
// 											onChange={(e) => setSelectedDate(e.target.value)}
// 										/>
// 									</div>

// 									{/* Time */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Time <span className='text-red-500'>*</span>
// 										</label>
// 										<div className='grid grid-cols-3 gap-2'>
// 											{timeSlots.map((time) => (
// 												<button
// 													key={time}
// 													type='button'
// 													className={cn(
// 														"px-3 py-2 rounded-lg text-sm font-medium transition-all",
// 														selectedTime === time
// 															? "bg-primary text-primary-foreground"
// 															: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
// 													)}
// 													onClick={() => setSelectedTime(time)}>
// 													{time}
// 												</button>
// 											))}
// 										</div>
// 									</div>

// 									{/* Duration */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Duration (hours)
// 										</label>
// 										<Input
// 											type='number'
// 											min='1'
// 											max='8'
// 											value={duration}
// 											onChange={(e) => setDuration(Number(e.target.value) || 1)}
// 										/>
// 									</div>

// 									{/* Location */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Location <span className='text-red-500'>*</span>
// 										</label>
// 										<Input
// 											placeholder='Enter your address'
// 											value={location}
// 											onChange={(e) => setLocation(e.target.value)}
// 										/>
// 									</div>

// 									{/* Notes */}
// 									<div className='space-y-2'>
// 										<label className='text-sm font-medium text-foreground'>
// 											Additional notes (optional)
// 										</label>
// 										<Textarea
// 											placeholder='Any special instructions...'
// 											rows={3}
// 											value={notes}
// 											onChange={(e) => setNotes(e.target.value)}
// 										/>
// 									</div>

// 									{/* Pricing Summary */}
// 									<div className='pt-4 border-t border-border space-y-2'>
// 										<div className='flex justify-between text-sm'>
// 											<span className='text-muted-foreground'>
// 												Service rate
// 											</span>
// 											<span className='font-medium'>
// 												₹{worker.hourlyRate} × {duration}h = ₹{serviceAmount}
// 											</span>
// 										</div>
// 										<div className='flex justify-between text-sm'>
// 											<span className='text-muted-foreground'>
// 												Platform fee
// 											</span>
// 											<span className='font-medium'>₹{platformFee}</span>
// 										</div>
// 										<div className='flex justify-between text-base font-semibold pt-2 border-t'>
// 											<span>Total</span>
// 											<span>₹{totalAmount}</span>
// 										</div>
// 									</div>

// 									{/* Confirm Button */}
// 									<Button
// 										className='w-full'
// 										size='lg'
// 										disabled={
// 											!selectedDate ||
// 											!selectedTime ||
// 											!location.trim() ||
// 											isBooking
// 										}
// 										onClick={handleBooking}>
// 										{isBooking ? (
// 											<>
// 												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
// 												Creating booking...
// 											</>
// 										) : (
// 											"Confirm booking"
// 										)}
// 									</Button>
// 								</div>
// 							</DialogContent>
// 						</Dialog>
// 					</div>
// 				</div>

// 				{/* Spacer for fixed CTA */}
// 				<div className='h-24' />
// 			</main>
// 		</div>
// 	);
// };

// export default WorkerDetail;

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import {
	Star,
	MapPin,
	CheckCircle,
	Phone,
	MessageCircle,
	Calendar,
	Clock,
	ArrowLeft,
	Shield,
	Briefcase,
	Loader2,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createBooking } from "@/api/bookings";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

type WorkerService = {
	id: string;
	name: string;
};

const WorkerDetail = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { user } = useAuth();

	// Worker data state
	const [worker, setWorker] = useState<any>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Booking form state
	const [selectedDate, setSelectedDate] = useState<string>("");
	const [selectedTime, setSelectedTime] = useState<string>("");
	const [location, setLocation] = useState<string>("");
	const [notes, setNotes] = useState<string>("");
	const [duration, setDuration] = useState<number>(1);
	const [isBooking, setIsBooking] = useState(false);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
		null
	);

	// Fetch worker data from backend (via Supabase)
	useEffect(() => {
		const fetchWorkerDetail = async () => {
			if (!id) return;

			try {
				setLoading(true);
				setError(null);

				const { data, error } = await supabase
					.from("workers")
					.select(
						`
            *,
            users (
              id,
              full_name,
              email,
              phone_number,
              location,
              profile_picture,
              is_verified
            )
          `
					)
					.eq("id", id)
					.single();

				if (error) throw error;

				if (!data) {
					throw new Error("Worker not found");
				}

				// Fetch worker services (keep id + name)
				const { data: servicesData } = await supabase
					.from("worker_services")
					.select(
						`
            services (
              id,
              name
            )
          `
					)
					.eq("worker_id", id);

				const services: WorkerService[] =
					servicesData
						?.map((s: any) => s.services)
						.filter((s: any) => s && s.id && s.name)
						.map((s: any) => ({ id: s.id, name: s.name })) || [];

				// Transform to match component expectations
				const workerData = {
					id: data.id,
					name: data.users?.full_name || "Unknown",
					avatar: data.users?.profile_picture || "",
					bio: data.bio || "",
					hourlyRate: Number(data.hourly_rate) || 0,
					rating: Number(data.rating) || 0,
					reviewCount: data.total_reviews || 0,
					completedJobs: data.total_bookings || 0,
					experience: data.experience_years
						? `${data.experience_years} years`
						: "New",
					services, // array of {id, name}
					location: data.users?.location || "Unknown",
					phone: data.users?.phone_number || "",
					email: data.users?.email || "",
					isVerified: data.users?.is_verified || false,
					availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
					availabilityStatus: data.availability_status,
				};

				setWorker(workerData);
				setSelectedServiceId(workerData.services[0]?.id || null);
			} catch (err: any) {
				console.error("Error fetching worker:", err);
				setError(err.message || "Failed to load worker details");
				toast.error("Failed to load worker details");
			} finally {
				setLoading(false);
			}
		};

		fetchWorkerDetail();
	}, [id]);

	const timeSlots = [
		"9:00 AM",
		"10:00 AM",
		"11:00 AM",
		"12:00 PM",
		"2:00 PM",
		"3:00 PM",
		"4:00 PM",
		"5:00 PM",
	];

	const today = new Date().toISOString().split("T")[0];
	const platformFee = 25;
	const serviceAmount = worker ? worker.hourlyRate * duration : 0;
	const totalAmount = serviceAmount + platformFee;

	const handleBooking = async () => {
		// Check authentication first
		if (!user) {
			toast.error("Please login to book a service");
			navigate("/login");
			return;
		}

		if (!worker?.id) {
			toast.error("Worker not loaded");
			return;
		}

		if (!selectedServiceId) {
			toast.error("Please select a service");
			return;
		}

		// Validate form
		if (!selectedDate || !selectedTime || !location.trim()) {
			toast.error("Please fill in all required fields");
			return;
		}

		// Validate date is not in the past
		const selectedDateTime = new Date(
			`${selectedDate}T${convertTo24Hour(selectedTime)}`
		);
		if (selectedDateTime < new Date()) {
			toast.error("Please select a future date and time");
			return;
		}

		setIsBooking(true);

		try {
			const bookingData = {
				worker_id: worker.id,
				service_id: selectedServiceId, // ✅ REQUIRED by backend
				booking_date: selectedDate,
				duration_hours: duration,
				location: location.trim(),
				notes: notes.trim() || undefined,
			};

			console.log("Submitting booking:", bookingData);

			const booking = await createBooking(bookingData);

			console.log("Booking created:", booking);

			toast.success("Booking created successfully!", {
				description: `Your booking with ${worker.name} has been created.`,
			});

			// Reset form
			setSelectedDate("");
			setSelectedTime("");
			setLocation("");
			setNotes("");
			setDuration(1);
			setDialogOpen(false);

			// Navigate to bookings page
			setTimeout(() => {
				navigate("/activity");
			}, 500);
		} catch (error: any) {
			console.error("Booking error:", error);
			toast.error(error?.message || "Failed to create booking", {
				description:
					"Please try again or contact support if the problem persists.",
			});
		} finally {
			setIsBooking(false);
		}
	};

	const convertTo24Hour = (time12: string): string => {
		const [time, period] = time12.split(" ");
		let [hours, minutes] = time.split(":");

		if (period === "PM" && hours !== "12") {
			hours = String(Number(hours) + 12);
		} else if (period === "AM" && hours === "12") {
			hours = "00";
		}

		return `${hours.padStart(2, "0")}:${minutes || "00"}`;
	};

	// Loading state
	if (loading) {
		return (
			<div className='min-h-screen bg-background'>
				<Header showAuth={false} />
				<main className='container py-8 flex items-center justify-center'>
					<div className='text-center space-y-4'>
						<Loader2 className='h-8 w-8 animate-spin mx-auto text-primary' />
						<p className='text-muted-foreground'>Loading worker details...</p>
					</div>
				</main>
			</div>
		);
	}

	// Error state
	if (error || !worker) {
		return (
			<div className='min-h-screen bg-background'>
				<Header showAuth={false} />
				<main className='container py-8 text-center'>
					<div className='text-5xl mb-4'>😕</div>
					<p className='text-muted-foreground mb-4'>
						{error || "Worker not found"}
					</p>
					<Button asChild>
						<Link to='/dashboard'>Back to Dashboard</Link>
					</Button>
				</main>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-background'>
			<Header showAuth={false} />

			<main className='container py-6 max-w-2xl'>
				{/* Back Button */}
				<Button variant='ghost' asChild className='mb-4 -ml-2'>
					<Link to='/dashboard'>
						<ArrowLeft className='h-4 w-4 mr-2' />
						Back
					</Link>
				</Button>

				{/* Profile Header */}
				<div className='animate-fade-in'>
					<div className='flex items-start gap-4 mb-6'>
						<div className='relative'>
							<img
								src={
									worker.avatar ||
									"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200"
								}
								alt={worker.name}
								className='h-24 w-24 rounded-2xl object-cover'
							/>
							{worker.isVerified && (
								<div className='absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow-sm'>
									<CheckCircle className='h-5 w-5 text-primary' />
								</div>
							)}
						</div>

						<div className='flex-1'>
							<div className='flex items-center gap-2 mb-1'>
								<h1 className='text-heading font-semibold text-foreground'>
									{worker.name}
								</h1>
								{worker.isVerified && (
									<Badge variant='default' className='text-xs'>
										Verified
									</Badge>
								)}
							</div>

							<div className='flex items-center gap-1 mb-2'>
								<Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
								<span className='font-medium'>{worker.rating.toFixed(1)}</span>
								<span className='text-muted-foreground'>
									({worker.reviewCount} reviews)
								</span>
							</div>

							<div className='flex items-center gap-1 text-sm text-muted-foreground'>
								<MapPin className='h-4 w-4' />
								<span>{worker.location}</span>
							</div>
						</div>
					</div>

					{/* Price */}
					<Card className='mb-6'>
						<CardContent className='p-4 flex items-center justify-between'>
							<div>
								<p className='text-sm text-muted-foreground'>Starting from</p>
								<p className='text-2xl font-semibold text-foreground'>
									₹{worker.hourlyRate}
									<span className='text-sm font-normal text-muted-foreground'>
										/hour
									</span>
								</p>
							</div>
							<div className='flex gap-2'>
								<Button variant='outline' size='icon'>
									<Phone className='h-4 w-4' />
								</Button>
								<Button variant='outline' size='icon'>
									<MessageCircle className='h-4 w-4' />
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Services */}
					<div className='mb-6'>
						<h2 className='text-sm font-semibold text-foreground mb-3'>
							Services offered
						</h2>
						<div className='flex flex-wrap gap-2'>
							{worker.services.length > 0 ? (
								worker.services.map((service: WorkerService) => (
									<Badge key={service.id} variant='secondary'>
										{service.name}
									</Badge>
								))
							) : (
								<p className='text-sm text-muted-foreground'>
									No services listed
								</p>
							)}
						</div>
					</div>

					{/* About */}
					{worker.bio && (
						<div className='mb-6'>
							<h2 className='text-sm font-semibold text-foreground mb-2'>
								About
							</h2>
							<p className='text-muted-foreground'>{worker.bio}</p>
						</div>
					)}

					{/* Stats */}
					<div className='grid grid-cols-3 gap-4 mb-6'>
						<Card>
							<CardContent className='p-4 text-center'>
								<Briefcase className='h-5 w-5 mx-auto mb-1 text-primary' />
								<p className='text-lg font-semibold text-foreground'>
									{worker.completedJobs}
								</p>
								<p className='text-xs text-muted-foreground'>Jobs done</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4 text-center'>
								<Clock className='h-5 w-5 mx-auto mb-1 text-primary' />
								<p className='text-lg font-semibold text-foreground'>
									{worker.experience}
								</p>
								<p className='text-xs text-muted-foreground'>Experience</p>
							</CardContent>
						</Card>
						<Card>
							<CardContent className='p-4 text-center'>
								<Shield className='h-5 w-5 mx-auto mb-1 text-primary' />
								<p className='text-lg font-semibold text-foreground'>
									{worker.isVerified ? "Yes" : "Pending"}
								</p>
								<p className='text-xs text-muted-foreground'>Verified</p>
							</CardContent>
						</Card>
					</div>

					{/* Availability */}
					<div className='mb-8'>
						<h2 className='text-sm font-semibold text-foreground mb-3'>
							Available days
						</h2>
						<div className='flex gap-2'>
							{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
								<div
									key={day}
									className={cn(
										"w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium",
										worker.availability.includes(day)
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-muted-foreground"
									)}>
									{day.charAt(0)}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Book CTA */}
				<div className='fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50'>
					<div className='container max-w-2xl'>
						<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
							<DialogTrigger asChild>
								<Button size='lg' className='w-full'>
									<Calendar className='h-5 w-5 mr-2' />
									Book {worker.name.split(" ")[0]}
								</Button>
							</DialogTrigger>
							<DialogContent className='sm:max-w-md max-h-[90vh] overflow-y-auto'>
								<DialogHeader>
									<DialogTitle>Book {worker.name}</DialogTitle>
									<DialogDescription>
										Select a service, date and time for your booking
									</DialogDescription>
								</DialogHeader>
								<div className='space-y-4 py-4'>
									{/* Service selection */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Service <span className='text-red-500'>*</span>
										</label>
										{worker.services.length > 0 ? (
											<select
												className='w-full rounded-md border border-input bg-background px-3 py-2 text-sm'
												value={selectedServiceId || ""}
												onChange={(e) =>
													setSelectedServiceId(e.target.value || null)
												}>
												{worker.services.map((s: WorkerService) => (
													<option key={s.id} value={s.id}>
														{s.name}
													</option>
												))}
											</select>
										) : (
											<p className='text-xs text-muted-foreground'>
												This worker has no services configured yet.
											</p>
										)}
									</div>

									{/* Date */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Date <span className='text-red-500'>*</span>
										</label>
										<Input
											type='date'
											min={today}
											value={selectedDate}
											onChange={(e) => setSelectedDate(e.target.value)}
										/>
									</div>

									{/* Time */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Time <span className='text-red-500'>*</span>
										</label>
										<div className='grid grid-cols-3 gap-2'>
											{timeSlots.map((time) => (
												<button
													key={time}
													type='button'
													className={cn(
														"px-3 py-2 rounded-lg text-sm font-medium transition-all",
														selectedTime === time
															? "bg-primary text-primary-foreground"
															: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
													)}
													onClick={() => setSelectedTime(time)}>
													{time}
												</button>
											))}
										</div>
									</div>

									{/* Duration */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Duration (hours)
										</label>
										<Input
											type='number'
											min='1'
											max='8'
											value={duration}
											onChange={(e) => setDuration(Number(e.target.value) || 1)}
										/>
									</div>

									{/* Location */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Location <span className='text-red-500'>*</span>
										</label>
										<Input
											placeholder='Enter your address'
											value={location}
											onChange={(e) => setLocation(e.target.value)}
										/>
									</div>

									{/* Notes */}
									<div className='space-y-2'>
										<label className='text-sm font-medium text-foreground'>
											Additional notes (optional)
										</label>
										<Textarea
											placeholder='Any special instructions...'
											rows={3}
											value={notes}
											onChange={(e) => setNotes(e.target.value)}
										/>
									</div>

									{/* Pricing Summary */}
									<div className='pt-4 border-t border-border space-y-2'>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												Service rate
											</span>
											<span className='font-medium'>
												₹{worker.hourlyRate} × {duration}h = ₹{serviceAmount}
											</span>
										</div>
										<div className='flex justify-between text-sm'>
											<span className='text-muted-foreground'>
												Platform fee
											</span>
											<span className='font-medium'>₹{platformFee}</span>
										</div>
										<div className='flex justify-between text-base font-semibold pt-2 border-t'>
											<span>Total</span>
											<span>₹{totalAmount}</span>
										</div>
									</div>

									{/* Confirm Button */}
									<Button
										className='w-full'
										size='lg'
										disabled={
											!selectedServiceId ||
											!selectedDate ||
											!selectedTime ||
											!location.trim() ||
											isBooking
										}
										onClick={handleBooking}>
										{isBooking ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Creating booking...
											</>
										) : (
											"Confirm booking"
										)}
									</Button>
								</div>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* Spacer for fixed CTA */}
				<div className='h-24' />
			</main>
		</div>
	);
};

export default WorkerDetail;
