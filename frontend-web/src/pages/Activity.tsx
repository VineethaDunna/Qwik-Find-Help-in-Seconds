// // import { useState } from 'react';
// // import { Card, CardContent } from '@/components/ui/card';
// // import { Badge } from '@/components/ui/badge';
// // import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// // import { Button } from '@/components/ui/button';
// // import Header from '@/components/layout/Header';
// // import BottomNav from '@/components/layout/BottomNav';
// // import { mockBookings } from '@/data/mockData';
// // import { MapPin, Clock, Phone, MessageCircle, RotateCcw, Star } from 'lucide-react';
// // import { format } from 'date-fns';
// // import { cn } from '@/lib/utils';
// // import { Link } from 'react-router-dom';

// // type TabType = 'upcoming' | 'completed' | 'cancelled';

// // const Activity = () => {
// //   const [activeTab, setActiveTab] = useState<TabType>('upcoming');

// //   const upcomingBookings = mockBookings.filter(b =>
// //     b.status === 'pending' || b.status === 'confirmed'
// //   );
// //   const completedBookings = mockBookings.filter(b => b.status === 'completed');
// //   const cancelledBookings = mockBookings.filter(b =>
// //     b.status === 'cancelled' || b.status === 'declined'
// //   );

// //   const getFilteredBookings = () => {
// //     switch (activeTab) {
// //       case 'upcoming':
// //         return upcomingBookings;
// //       case 'completed':
// //         return completedBookings;
// //       case 'cancelled':
// //         return cancelledBookings;
// //       default:
// //         return [];
// //     }
// //   };

// //   const filteredBookings = getFilteredBookings();

// //   const statusColors = {
// //     pending: 'bg-accent/20 text-accent-foreground border-accent',
// //     confirmed: 'bg-primary/20 text-primary border-primary',
// //     completed: 'bg-green-100 text-green-700 border-green-500',
// //     cancelled: 'bg-destructive/20 text-destructive border-destructive',
// //     declined: 'bg-muted text-muted-foreground border-border',
// //   };

// //   return (
// //     <div className="min-h-screen bg-background pb-20">
// //       <Header showAuth={false} />

// //       <main className="container py-4 md:py-6">
// //         <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-4 animate-fade-in">
// //           Activity
// //         </h1>

// //         {/* Tabs */}
// //         <div className="flex gap-2 mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
// //           {([
// //             { key: 'upcoming', label: 'Upcoming', count: upcomingBookings.length },
// //             { key: 'completed', label: 'Completed', count: completedBookings.length },
// //             { key: 'cancelled', label: 'Cancelled', count: cancelledBookings.length },
// //           ] as const).map((tab) => (
// //             <Badge
// //               key={tab.key}
// //               variant={activeTab === tab.key ? 'default' : 'category'}
// //               className="cursor-pointer px-4 py-1.5"
// //               onClick={() => setActiveTab(tab.key)}
// //             >
// //               {tab.label}
// //               {tab.count > 0 && (
// //                 <span className={cn(
// //                   "ml-1.5 h-4 min-w-[16px] rounded-full text-xs flex items-center justify-center px-1",
// //                   activeTab === tab.key
// //                     ? "bg-primary-foreground/20 text-primary-foreground"
// //                     : "bg-muted text-muted-foreground"
// //                 )}>
// //                   {tab.count}
// //                 </span>
// //               )}
// //             </Badge>
// //           ))}
// //         </div>

// //         {/* Bookings List */}
// //         <div className="space-y-3">
// //           {filteredBookings.length > 0 ? (
// //             filteredBookings.map((booking, index) => (
// //               <Card
// //                 key={booking.id}
// //                 className="animate-fade-in"
// //                 style={{ animationDelay: `${(index + 1) * 100}ms` }}
// //               >
// //                 <CardContent className="p-4">
// //                   <div className="flex items-start gap-3">
// //                     <Avatar className="h-12 w-12">
// //                       <AvatarImage src={`https://images.unsplash.com/photo-${1500000000000 + parseInt(booking.workerId)}?w=150&h=150&fit=crop&crop=face`} />
// //                       <AvatarFallback>{booking.workerName?.charAt(0) || 'W'}</AvatarFallback>
// //                     </Avatar>

// //                     <div className="flex-1 min-w-0">
// //                       <div className="flex items-center justify-between gap-2">
// //                         <Link
// //                           to={`/worker/${booking.workerId}`}
// //                           className="font-semibold text-foreground hover:text-primary truncate"
// //                         >
// //                           {booking.workerName}
// //                         </Link>
// //                         <Badge
// //                           variant="outline"
// //                           className={cn("shrink-0 capitalize text-xs", statusColors[booking.status])}
// //                         >
// //                           {booking.status}
// //                         </Badge>
// //                       </div>

// //                       <p className="text-sm font-medium text-primary mt-0.5">
// //                         {booking.service}
// //                       </p>

// //                       <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
// //                         <div className="flex items-center gap-1">
// //                           <Clock className="h-3.5 w-3.5" />
// //                           <span>{format(booking.date, 'MMM dd, yyyy')} • {booking.time}</span>
// //                         </div>
// //                         <div className="flex items-center gap-1">
// //                           <MapPin className="h-3.5 w-3.5" />
// //                           <span className="truncate">{booking.location}</span>
// //                         </div>
// //                       </div>

// //                       <div className="flex items-center justify-between mt-3">
// //                         <span className="text-lg font-bold text-foreground">
// //                           ₹{booking.price}
// //                         </span>

// //                         {activeTab === 'upcoming' && (
// //                           <div className="flex gap-2">
// //                             <Button size="sm" variant="outline" className="h-8">
// //                               <MessageCircle className="h-4 w-4" />
// //                             </Button>
// //                             <Button size="sm" variant="outline" className="h-8">
// //                               <Phone className="h-4 w-4" />
// //                             </Button>
// //                           </div>
// //                         )}

// //                         {activeTab === 'completed' && (
// //                           <div className="flex gap-2">
// //                             <Button size="sm" variant="outline" className="h-8 gap-1">
// //                               <Star className="h-4 w-4" />
// //                               Rate
// //                             </Button>
// //                             <Button size="sm" variant="outline" className="h-8 gap-1">
// //                               <RotateCcw className="h-4 w-4" />
// //                               Rebook
// //                             </Button>
// //                           </div>
// //                         )}

// //                         {activeTab === 'cancelled' && (
// //                           <Button size="sm" className="h-8 gap-1">
// //                             <RotateCcw className="h-4 w-4" />
// //                             Book Again
// //                           </Button>
// //                         )}
// //                       </div>
// //                     </div>
// //                   </div>
// //                 </CardContent>
// //               </Card>
// //             ))
// //           ) : (
// //             <div className="text-center py-12 animate-fade-in">
// //               <div className="text-4xl mb-3">
// //                 {activeTab === 'upcoming' ? '📅' : activeTab === 'completed' ? '✅' : '❌'}
// //               </div>
// //               <p className="text-muted-foreground font-medium">
// //                 No {activeTab} bookings
// //               </p>
// //               <p className="text-sm text-muted-foreground mt-1">
// //                 {activeTab === 'upcoming'
// //                   ? 'Book a service to see it here'
// //                   : 'Your history will appear here'
// //                 }
// //               </p>
// //               {activeTab === 'upcoming' && (
// //                 <Link to="/dashboard">
// //                   <Button className="mt-4">Find Helpers</Button>
// //                 </Link>
// //               )}
// //             </div>
// //           )}
// //         </div>
// //       </main>

// //       <BottomNav />
// //     </div>
// //   );
// // };

// // export default Activity;

// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import Header from "@/components/layout/Header";
// import BottomNav from "@/components/layout/BottomNav";
// import {
// 	MapPin,
// 	Clock,
// 	Phone,
// 	MessageCircle,
// 	RotateCcw,
// 	Star,
// } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { Link } from "react-router-dom";
// import { supabase } from "@/lib/supabaseClient";
// import { useAuth } from "@/contexts/AuthContext";

// type TabType = "upcoming" | "completed" | "cancelled";

// type ActivityBooking = {
// 	id: string;
// 	workerId: string;
// 	workerName: string;
// 	workerAvatar?: string;
// 	workerPhone?: string;
// 	service: string;
// 	date: Date;
// 	time: string;
// 	price: number;
// 	location: string;
// 	status:
// 		| "pending"
// 		| "confirmed"
// 		| "completed"
// 		| "cancelled"
// 		| "declined"
// 		| "in_progress";
// 	notes?: string;
// };

// const Activity = () => {
// 	const { user } = useAuth();
// 	const [activeTab, setActiveTab] = useState<TabType>("upcoming");
// 	const [bookings, setBookings] = useState<ActivityBooking[]>([]);
// 	const [loading, setLoading] = useState(false);

// 	// fetch bookings for this user from supabase
// 	useEffect(() => {
// 		const fetchUserBookings = async () => {
// 			if (!user?.id) return;

// 			setLoading(true);
// 			try {
// 				const { data, error } = await supabase
// 					.from("bookings")
// 					.select(
// 						`
//             id,
//             user_id,
//             worker_id,
//             service_id,
//             booking_date,
//             duration_hours,
//             total_amount,
//             status,
//             location,
//             notes,
//             created_at,
//             workers (
//               id,
//               hourly_rate,
//               users (
//                 id,
//                 full_name,
//                 profile_picture,
//                 phone_number
//               )
//             ),
//             services (
//               id,
//               name
//             )
//           `
// 					)
// 					.eq("user_id", user.id)
// 					.order("booking_date", { ascending: false });

// 				if (error) {
// 					console.error("Error loading bookings:", error);
// 					return;
// 				}

// 				const mapped: ActivityBooking[] =
// 					(data || []).map((row: any) => {
// 						const workerUser = row.workers?.users;
// 						const workerHourly = Number(row.workers?.hourly_rate ?? 0);
// 						const duration = Number(row.duration_hours ?? 1);
// 						const bookingDate = new Date(row.booking_date);

// 						const totalAmount =
// 							row.total_amount != null
// 								? Number(row.total_amount)
// 								: workerHourly * duration;

// 						return {
// 							id: row.id,
// 							workerId: row.worker_id,
// 							workerName: workerUser?.full_name || "Unknown worker",
// 							workerAvatar: workerUser?.profile_picture || undefined,
// 							workerPhone: workerUser?.phone_number || undefined,
// 							service: row.services?.name || "Service",
// 							date: bookingDate,
// 							time: format(bookingDate, "hh:mm a"),
// 							price: totalAmount || 0,
// 							location: row.location || "Not specified",
// 							status: row.status,
// 							notes: row.notes || "",
// 						};
// 					}) || [];

// 				setBookings(mapped);
// 			} finally {
// 				setLoading(false);
// 			}
// 		};

// 		fetchUserBookings();
// 	}, [user]);

// 	const upcomingBookings = bookings.filter(
// 		(b) =>
// 			b.status === "pending" ||
// 			b.status === "confirmed" ||
// 			b.status === "in_progress"
// 	);
// 	const completedBookings = bookings.filter((b) => b.status === "completed");
// 	const cancelledBookings = bookings.filter(
// 		(b) => b.status === "cancelled" || b.status === "declined"
// 	);

// 	const getFilteredBookings = () => {
// 		switch (activeTab) {
// 			case "upcoming":
// 				return upcomingBookings;
// 			case "completed":
// 				return completedBookings;
// 			case "cancelled":
// 				return cancelledBookings;
// 			default:
// 				return [];
// 		}
// 	};

// 	const filteredBookings = getFilteredBookings();

// 	const statusColors: Record<ActivityBooking["status"], string> = {
// 		pending: "bg-accent/20 text-accent-foreground border-accent",
// 		confirmed: "bg-primary/20 text-primary border-primary",
// 		in_progress: "bg-blue-100 text-blue-700 border-blue-500",
// 		completed: "bg-green-100 text-green-700 border-green-500",
// 		cancelled: "bg-destructive/20 text-destructive border-destructive",
// 		declined: "bg-muted text-muted-foreground border-border",
// 	};

// 	return (
// 		<div className='min-h-screen bg-background pb-20'>
// 			<Header showAuth={false} />

// 			<main className='container py-4 md:py-6'>
// 				<h1 className='text-xl md:text-2xl font-semibold text-foreground mb-4 animate-fade-in'>
// 					Activity
// 				</h1>

// 				{/* Tabs */}
// 				<div
// 					className='flex gap-2 mb-6 animate-fade-in'
// 					style={{ animationDelay: "50ms" }}>
// 					{(
// 						[
// 							{
// 								key: "upcoming",
// 								label: "Upcoming",
// 								count: upcomingBookings.length,
// 							},
// 							{
// 								key: "completed",
// 								label: "Completed",
// 								count: completedBookings.length,
// 							},
// 							{
// 								key: "cancelled",
// 								label: "Cancelled",
// 								count: cancelledBookings.length,
// 							},
// 						] as const
// 					).map((tab) => (
// 						<Badge
// 							key={tab.key}
// 							variant={activeTab === tab.key ? "default" : "category"}
// 							className='cursor-pointer px-4 py-1.5'
// 							onClick={() => setActiveTab(tab.key)}>
// 							{tab.label}
// 							{tab.count > 0 && (
// 								<span
// 									className={cn(
// 										"ml-1.5 h-4 min-w-[16px] rounded-full text-xs flex items-center justify-center px-1",
// 										activeTab === tab.key
// 											? "bg-primary-foreground/20 text-primary-foreground"
// 											: "bg-muted text-muted-foreground"
// 									)}>
// 									{tab.count}
// 								</span>
// 							)}
// 						</Badge>
// 					))}
// 				</div>

// 				{/* Bookings List */}
// 				<div className='space-y-3'>
// 					{loading ? (
// 						<div className='space-y-3'>
// 							{Array.from({ length: 3 }).map((_, i) => (
// 								<Card key={i} className='animate-pulse'>
// 									<CardContent className='p-4 h-24' />
// 								</Card>
// 							))}
// 						</div>
// 					) : filteredBookings.length > 0 ? (
// 						filteredBookings.map((booking, index) => (
// 							<Card
// 								key={booking.id}
// 								className='animate-fade-in'
// 								style={{ animationDelay: `${(index + 1) * 80}ms` }}>
// 								<CardContent className='p-4'>
// 									<div className='flex items-start gap-3'>
// 										<Avatar className='h-12 w-12'>
// 											<AvatarImage src={booking.workerAvatar} />
// 											<AvatarFallback>
// 												{booking.workerName?.charAt(0) || "W"}
// 											</AvatarFallback>
// 										</Avatar>

// 										<div className='flex-1 min-w-0'>
// 											<div className='flex items-center justify-between gap-2'>
// 												<Link
// 													to={`/worker/${booking.workerId}`}
// 													className='font-semibold text-foreground hover:text-primary truncate'>
// 													{booking.workerName}
// 												</Link>
// 												<Badge
// 													variant='outline'
// 													className={cn(
// 														"shrink-0 capitalize text-xs",
// 														statusColors[booking.status]
// 													)}>
// 													{booking.status.replace("_", " ")}
// 												</Badge>
// 											</div>

// 											<p className='text-sm font-medium text-primary mt-0.5'>
// 												{booking.service}
// 											</p>

// 											<div className='flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground'>
// 												<div className='flex items-center gap-1'>
// 													<Clock className='h-3.5 w-3.5' />
// 													<span>
// 														{format(booking.date, "MMM dd, yyyy")} •{" "}
// 														{booking.time}
// 													</span>
// 												</div>
// 												<div className='flex items-center gap-1'>
// 													<MapPin className='h-3.5 w-3.5' />
// 													<span className='truncate'>{booking.location}</span>
// 												</div>
// 											</div>

// 											{booking.notes && activeTab !== "cancelled" && (
// 												<p className='mt-2 text-xs text-muted-foreground line-clamp-2'>
// 													Note: {booking.notes}
// 												</p>
// 											)}

// 											<div className='flex items-center justify-between mt-3'>
// 												<span className='text-lg font-bold text-foreground'>
// 													₹{booking.price}
// 												</span>

// 												{activeTab === "upcoming" && (
// 													<div className='flex gap-2'>
// 														<Button size='sm' variant='outline' className='h-8'>
// 															<MessageCircle className='h-4 w-4' />
// 														</Button>
// 														<Button size='sm' variant='outline' className='h-8'>
// 															<Phone className='h-4 w-4' />
// 														</Button>
// 													</div>
// 												)}

// 												{activeTab === "completed" && (
// 													<div className='flex gap-2'>
// 														<Button
// 															size='sm'
// 															variant='outline'
// 															className='h-8 gap-1'>
// 															<Star className='h-4 w-4' />
// 															Rate
// 														</Button>
// 														<Link to={`/worker/${booking.workerId}`}>
// 															<Button
// 																size='sm'
// 																variant='outline'
// 																className='h-8 gap-1'>
// 																<RotateCcw className='h-4 w-4' />
// 																Rebook
// 															</Button>
// 														</Link>
// 													</div>
// 												)}

// 												{activeTab === "cancelled" && (
// 													<Button size='sm' className='h-8 gap-1'>
// 														<RotateCcw className='h-4 w-4' />
// 														Book Again
// 													</Button>
// 												)}
// 											</div>
// 										</div>
// 									</div>
// 								</CardContent>
// 							</Card>
// 						))
// 					) : (
// 						<div className='text-center py-12 animate-fade-in'>
// 							<div className='text-4xl mb-3'>
// 								{activeTab === "upcoming"
// 									? "📅"
// 									: activeTab === "completed"
// 									? "✅"
// 									: "❌"}
// 							</div>
// 							<p className='text-muted-foreground font-medium'>
// 								No {activeTab} bookings
// 							</p>
// 							<p className='text-sm text-muted-foreground mt-1'>
// 								{activeTab === "upcoming"
// 									? "Book a service to see it here"
// 									: "Your history will appear here"}
// 							</p>
// 							{activeTab === "upcoming" && (
// 								<Link to='/dashboard'>
// 									<Button className='mt-4'>Find Helpers</Button>
// 								</Link>
// 							)}
// 						</div>
// 					)}
// 				</div>
// 			</main>

// 			<BottomNav />
// 		</div>
// 	);
// };

// export default Activity;

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import {
	MapPin,
	Clock,
	Phone,
	MessageCircle,
	RotateCcw,
	Star,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

type TabType = "upcoming" | "completed" | "cancelled";

type ActivityBookingStatus =
	| "pending"
	| "confirmed"
	| "completed"
	| "cancelled"
	| "declined"
	| "in_progress";

type ActivityBooking = {
	id: string;
	workerId: string;
	workerName: string;
	workerAvatar?: string;
	workerPhone?: string;
	service: string;
	date: Date;
	time: string;
	price: number;
	location: string;
	status: ActivityBookingStatus;
	notes?: string;
};

const Activity = () => {
	const { user } = useAuth();
	const [activeTab, setActiveTab] = useState<TabType>("upcoming");
	const [bookings, setBookings] = useState<ActivityBooking[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchUserBookings = async () => {
			if (!user?.id) return;

			setLoading(true);
			try {
				const { data, error } = await supabase
					.from("bookings")
					.select(
						`
            id,
            user_id,
            worker_id,
            service_id,
            booking_date,
            duration_hours,
            total_amount,
            status,
            location,
            notes,
            created_at,
            workers (
              id,
              hourly_rate,
              users (
                id,
                full_name,
                profile_picture,
                phone_number
              )
            ),
            services (
              id,
              name
            )
          `
					)
					.eq("user_id", user.id)
					.order("booking_date", { ascending: false });

				if (error) {
					console.error("Error loading bookings:", error);
					toast.error("Failed to load your activity");
					return;
				}

				const mapped: ActivityBooking[] =
					data?.map((row: any) => {
						const workerUser = row.workers?.users;
						const workerHourly = Number(row.workers?.hourly_rate ?? 0);
						const duration = Number(row.duration_hours ?? 1);
						const bookingDate = new Date(row.booking_date);

						const totalAmount =
							row.total_amount != null
								? Number(row.total_amount)
								: workerHourly * duration;

						return {
							id: row.id,
							workerId: row.worker_id,
							workerName: workerUser?.full_name || "Unknown worker",
							workerAvatar: workerUser?.profile_picture || undefined,
							workerPhone: workerUser?.phone_number || undefined,
							service: row.services?.name || "Service",
							date: bookingDate,
							time: format(bookingDate, "hh:mm a"),
							price: totalAmount || 0,
							location: row.location || "Not specified",
							status: row.status as ActivityBookingStatus,
							notes: row.notes || "",
						};
					}) || [];

				setBookings(mapped);
			} finally {
				setLoading(false);
			}
		};

		fetchUserBookings();
	}, [user]);

	const upcomingBookings = bookings.filter(
		(b) =>
			b.status === "pending" ||
			b.status === "confirmed" ||
			b.status === "in_progress"
	);
	const completedBookings = bookings.filter((b) => b.status === "completed");
	const cancelledBookings = bookings.filter(
		(b) => b.status === "cancelled" || b.status === "declined"
	);

	const getFilteredBookings = () => {
		switch (activeTab) {
			case "upcoming":
				return upcomingBookings;
			case "completed":
				return completedBookings;
			case "cancelled":
				return cancelledBookings;
			default:
				return [];
		}
	};

	const filteredBookings = getFilteredBookings();

	const statusColors: Record<ActivityBookingStatus, string> = {
		pending: "bg-accent/20 text-accent-foreground border-accent",
		confirmed: "bg-primary/20 text-primary border-primary",
		in_progress: "bg-blue-100 text-blue-700 border-blue-500",
		completed: "bg-green-100 text-green-700 border-green-500",
		cancelled: "bg-destructive/20 text-destructive border-destructive",
		declined: "bg-muted text-muted-foreground border-border",
	};

	return (
		<div className='min-h-screen bg-background pb-20'>
			<Header showAuth={false} />

			<main className='container py-4 md:py-6'>
				<h1 className='text-xl md:text-2xl font-semibold text-foreground mb-4 animate-fade-in'>
					Activity
				</h1>

				{/* Tabs */}
				<div
					className='flex gap-2 mb-6 animate-fade-in'
					style={{ animationDelay: "50ms" }}>
					{(
						[
							{
								key: "upcoming",
								label: "Upcoming",
								count: upcomingBookings.length,
							},
							{
								key: "completed",
								label: "Completed",
								count: completedBookings.length,
							},
							{
								key: "cancelled",
								label: "Cancelled",
								count: cancelledBookings.length,
							},
						] as const
					).map((tab) => (
						<Badge
							key={tab.key}
							variant={activeTab === tab.key ? "default" : "category"}
							className='cursor-pointer px-4 py-1.5'
							onClick={() => setActiveTab(tab.key)}>
							{tab.label}
							{tab.count > 0 && (
								<span
									className={cn(
										"ml-1.5 h-4 min-w-[16px] rounded-full text-xs flex items-center justify-center px-1",
										activeTab === tab.key
											? "bg-primary-foreground/20 text-primary-foreground"
											: "bg-muted text-muted-foreground"
									)}>
									{tab.count}
								</span>
							)}
						</Badge>
					))}
				</div>

				{/* Bookings List */}
				<div className='space-y-3'>
					{loading ? (
						<div className='space-y-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<Card key={i} className='animate-pulse'>
									<CardContent className='p-4 h-24' />
								</Card>
							))}
						</div>
					) : filteredBookings.length > 0 ? (
						filteredBookings.map((booking, index) => (
							<Card
								key={booking.id}
								className='animate-fade-in'
								style={{ animationDelay: `${(index + 1) * 80}ms` }}>
								<CardContent className='p-4'>
									<div className='flex items-start gap-3'>
										<Avatar className='h-12 w-12'>
											<AvatarImage src={booking.workerAvatar} />
											<AvatarFallback>
												{booking.workerName?.charAt(0) || "W"}
											</AvatarFallback>
										</Avatar>

										<div className='flex-1 min-w-0'>
											<div className='flex items-center justify-between gap-2'>
												<Link
													to={`/worker/${booking.workerId}`}
													className='font-semibold text-foreground hover:text-primary truncate'>
													{booking.workerName}
												</Link>
												<Badge
													variant='outline'
													className={cn(
														"shrink-0 capitalize text-xs",
														statusColors[booking.status]
													)}>
													{booking.status.replace("_", " ")}
												</Badge>
											</div>

											<p className='text-sm font-medium text-primary mt-0.5'>
												{booking.service}
											</p>

											<div className='flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground'>
												<div className='flex items-center gap-1'>
													<Clock className='h-3.5 w-3.5' />
													<span>
														{format(booking.date, "MMM dd, yyyy")} •{" "}
														{booking.time}
													</span>
												</div>
												<div className='flex items-center gap-1'>
													<MapPin className='h-3.5 w-3.5' />
													<span className='truncate'>{booking.location}</span>
												</div>
											</div>

											{booking.notes && activeTab !== "cancelled" && (
												<p className='mt-2 text-xs text-muted-foreground line-clamp-2'>
													Note: {booking.notes}
												</p>
											)}

											<div className='flex items-center justify-between mt-3'>
												<span className='text-lg font-bold text-foreground'>
													₹{booking.price}
												</span>

												{activeTab === "upcoming" && (
													<div className='flex gap-2'>
														<Button size='sm' variant='outline' className='h-8'>
															<MessageCircle className='h-4 w-4' />
														</Button>
														<Button size='sm' variant='outline' className='h-8'>
															<Phone className='h-4 w-4' />
														</Button>
													</div>
												)}

												{activeTab === "completed" && (
													<div className='flex gap-2'>
														<Button
															size='sm'
															variant='outline'
															className='h-8 gap-1'>
															<Star className='h-4 w-4' />
															Rate
														</Button>
														<Link to={`/worker/${booking.workerId}`}>
															<Button
																size='sm'
																variant='outline'
																className='h-8 gap-1'>
																<RotateCcw className='h-4 w-4' />
																Rebook
															</Button>
														</Link>
													</div>
												)}

												{activeTab === "cancelled" && (
													<Link to={`/worker/${booking.workerId}`}>
														<Button size='sm' className='h-8 gap-1'>
															<RotateCcw className='h-4 w-4' />
															Book Again
														</Button>
													</Link>
												)}
											</div>
										</div>
									</div>
								</CardContent>
							</Card>
						))
					) : (
						<div className='text-center py-12 animate-fade-in'>
							<div className='text-4xl mb-3'>
								{activeTab === "upcoming"
									? "📅"
									: activeTab === "completed"
									? "✅"
									: "❌"}
							</div>
							<p className='text-muted-foreground font-medium'>
								No {activeTab} bookings
							</p>
							<p className='text-sm text-muted-foreground mt-1'>
								{activeTab === "upcoming"
									? "Book a service to see it here"
									: "Your history will appear here"}
							</p>
							{activeTab === "upcoming" && (
								<Link to='/dashboard'>
									<Button className='mt-4'>Find Helpers</Button>
								</Link>
							)}
						</div>
					)}
				</div>
			</main>

			<BottomNav />
		</div>
	);
};

export default Activity;
