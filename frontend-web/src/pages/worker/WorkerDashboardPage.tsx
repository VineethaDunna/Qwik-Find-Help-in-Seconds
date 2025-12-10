import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import WorkerStatsCards from "@/components/worker/WorkerStatsCards";
import WorkerBookingCard from "@/components/worker/WorkerBookingCard";
import WorkerProfileEditorFull from "@/components/worker/WorkerProfileEditorFull";
import WorkerWorkboard from "@/components/worker/WorkerWorkboard";
import WorkerCustomerList from "@/components/worker/WorkerCustomerList";
import { mockWorkerStats, mockReviews } from "@/data/mockData";

import { useAuth } from "@/contexts/AuthContext";
import { workerApi } from "@/services/api";
import {
	Bell,
	Shield,
	Star,
	ClipboardList,
	User,
	LayoutDashboard,
	Users,
	CheckSquare,
	Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const WorkerDashboardPage = () => {
	const { user, logout } = useAuth();

	const [loading, setLoading] = useState(true);
	const [isAvailable, setIsAvailable] = useState(true);
	const [bookings, setBookings] = useState<any[]>([]);
	const [activeTab, setActiveTab] = useState("overview");
	const [bookingFilter, setBookingFilter] = useState<
		"all" | "pending" | "confirmed" | "completed" | "cancelled"
	>("all");
	const [workerProfile, setWorkerProfile] = useState<any | null>(null);

	// Fetch worker data on mount
	useEffect(() => {
		fetchWorkerData();
	}, []);

	const fetchWorkerData = async () => {
		try {
			setLoading(true);

			// Profile
			const profileRes = await workerApi.getMyProfile();
			const profile = profileRes.data; // { id, full_name, is_verified, worker, services, ... }

			setWorkerProfile(profile);
			setIsAvailable(profile.worker?.availability_status === "available");

			// Bookings
			const bookingsRes = await workerApi.getMyBookings();
			setBookings(bookingsRes.data || []);
		} catch (error: any) {
			console.error("Error fetching worker data:", error);
			toast.error(
				error.response?.data?.message || "Failed to load dashboard data"
			);
		} finally {
			setLoading(false);
		}
	};

	// Booking groups
	const pendingRequests = bookings.filter((b) => b.status === "pending");
	const confirmedBookings = bookings.filter((b) => b.status === "confirmed");
	const completedBookings = bookings.filter((b) => b.status === "completed");
	const cancelledBookings = bookings.filter((b) => b.status === "cancelled");

	const handleAvailabilityToggle = async (checked: boolean) => {
		try {
			await workerApi.updateProfile({
				availability_status: checked ? "available" : "unavailable",
			});
			setIsAvailable(checked);
			toast.success(checked ? "You are now online" : "You are now offline");
		} catch (error: any) {
			toast.error("Failed to update availability");
		}
	};

	const handleAccept = async (id: string) => {
		try {
			await workerApi.acceptBooking(id);
			setBookings((prev) =>
				prev.map((b) => (b.id === id ? { ...b, status: "confirmed" } : b))
			);
			toast.success("Booking accepted!");
		} catch (error: any) {
			toast.error("Failed to accept booking");
		}
	};

	const handleDecline = async (id: string) => {
		try {
			await workerApi.declineBooking(id);
			setBookings((prev) =>
				prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
			);
			toast.info("Booking declined");
		} catch (error: any) {
			toast.error("Failed to decline booking");
		}
	};

	const handleComplete = async (id: string) => {
		try {
			await workerApi.completeBooking(id);
			setBookings((prev) =>
				prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b))
			);
			toast.success("Job marked as completed!");
		} catch (error: any) {
			toast.error("Failed to complete booking");
		}
	};

	// Called by WorkerProfileEditorFull
	const handleProfileUpdate = async (updates: any) => {
		try {
			// Update user profile (name, phone, location)
			if (updates.full_name || updates.phone_number || updates.location) {
				await workerApi.updateUserProfile({
					full_name: updates.full_name,
					phone_number: updates.phone_number,
					location: updates.location,
				});
			}

			// Update worker profile (hourly_rate, experience, bio, availability_status)
			if (
				updates.hourly_rate ||
				updates.experience_years ||
				updates.bio ||
				updates.availability_status
			) {
				await workerApi.updateProfile({
					hourly_rate: updates.hourly_rate,
					experience_years: updates.experience_years,
					bio: updates.bio,
					availability_status: updates.availability_status,
				});
			}

			toast.success("Profile updated successfully");
			fetchWorkerData(); // Refresh
		} catch (error: any) {
			toast.error("Failed to update profile");
		}
	};

	// Called with array of service IDs
	const handleServicesUpdate = async (serviceIds: string[]) => {
		try {
			await workerApi.updateServices(serviceIds);
			toast.success("Services updated successfully");
			fetchWorkerData(); // Refresh
		} catch (error: any) {
			toast.error("Failed to update services");
		}
	};

	const handleLogout = async () => {
		try {
			await logout(); // same behaviour as Profile.tsx
			// after this, your global auth / route guard should push to /login
		} catch (err) {
			console.error(err);
			toast.error("Failed to logout");
		}
	};

	const getFilteredBookings = () => {
		switch (bookingFilter) {
			case "pending":
				return pendingRequests;
			case "confirmed":
				return confirmedBookings;
			case "completed":
				return completedBookings;
			case "cancelled":
				return cancelledBookings;
			default:
				return bookings;
		}
	};

	// Unique customers from bookings
	const customers = bookings.reduce(
		(acc, booking) => {
			const userId = booking.user?.id || booking.user_id;
			if (!userId) return acc;

			if (!acc.find((c) => c.userId === userId)) {
				acc.push({
					userId,
					userName: booking.user?.full_name || "Unknown",
					userAvatar: booking.user?.profile_picture,
					userPhone: booking.user?.phone_number,
					totalBookings: bookings.filter(
						(b) => (b.user?.id || b.user_id) === userId
					).length,
					totalSpent: bookings
						.filter(
							(b) =>
								(b.user?.id || b.user_id) === userId && b.status === "completed"
						)
						.reduce((sum, b) => sum + (b.total_amount || 0), 0),
				});
			}
			return acc;
		},
		[] as Array<{
			userId: string;
			userName: string;
			userAvatar?: string;
			userPhone?: string;
			totalBookings: number;
			totalSpent: number;
		}>
	);

	if (loading) {
		return (
			<div className='min-h-screen bg-background pb-20'>
				<Header showAuth={false} />
				<main className='container py-4 md:py-6'>
					<div className='flex items-center justify-center min-h-[60vh]'>
						<div className='text-center space-y-3'>
							<Loader2 className='h-8 w-8 animate-spin text-primary mx-auto' />
							<p className='text-sm text-muted-foreground'>
								Loading your dashboard...
							</p>
						</div>
					</div>
				</main>
				<BottomNav />
			</div>
		);
	}

	if (!workerProfile) {
		return (
			<div className='min-h-screen bg-gray-50 pb-20'>
				<Header />
				<main className='container py-4 md:py-6'>
					<div className='flex items-center justify-center min-h-[60vh]'>
						<div className='text-center'>
							<p className='text-gray-600'>Failed to load worker profile</p>
						</div>
					</div>
				</main>
				<BottomNav />
			</div>
		);
	}

	const workerName = workerProfile.full_name || user?.full_name || "Worker";
	const isVerified = workerProfile.is_verified || false;
	const rating = workerProfile.worker?.rating || 0;
	const reviewCount = workerProfile.worker?.total_reviews || 0;

	return (
		<div className='min-h-screen bg-gray-50 pb-20'>
			<Header />

			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6'>
				{/* Welcome & Availability */}
				<div className='bg-white rounded-xl shadow-sm p-6'>
					<div className='flex items-center justify-between'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h1 className='text-2xl font-bold text-gray-900'>
									Hello, {workerName.split(" ")[0]} 👋
								</h1>
							</div>
							<p className='text-gray-600 text-sm'>
								{isAvailable
									? "You are online and accepting jobs"
									: "You are offline"}
							</p>
						</div>

						<div className='flex items-center gap-3'>
							<Switch
								checked={isAvailable}
								onCheckedChange={handleAvailabilityToggle}
								className='mt-2'
							/>
						</div>
					</div>

					{/* Verification Banner */}
					{isVerified ? (
						<div className='mt-4 flex items-center justify-between bg-green-50 rounded-lg p-3'>
							<div className='flex items-center gap-2'>
								<Shield className='w-5 h-5 text-green-600' />
								<span className='text-sm font-medium text-green-900'>
									Verified Professional
								</span>
							</div>
							<div className='flex items-center gap-2 text-sm'>
								<div className='flex items-center gap-1'>
									<Star className='w-4 h-4 fill-yellow-400 text-yellow-400' />
									<span className='font-medium text-gray-900'>
										{rating.toFixed(1)}
									</span>
								</div>
								<span className='text-gray-500'>({reviewCount})</span>
							</div>
						</div>
					) : (
						<div className='mt-4 flex items-center gap-2 bg-blue-50 rounded-lg p-3'>
							<Bell className='w-5 h-5 text-blue-600' />
							<span className='text-sm text-blue-900'>
								Complete verification to get more bookings
							</span>
						</div>
					)}
				</div>

				{/* Pending Requests Alert */}
				{pendingRequests.length > 0 && (
					<div
						className='bg-orange-50 border border-orange-200 rounded-xl p-4 cursor-pointer hover:bg-orange-100 transition-colors'
						onClick={() => {
							setActiveTab("bookings");
							setBookingFilter("pending");
						}}>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<Bell className='w-5 h-5 text-orange-600' />
							</div>
							<span className='text-sm font-medium text-orange-900'>
								You have {pendingRequests.length} new booking request
								{pendingRequests.length > 1 ? "s" : ""}
							</span>
							<Badge variant='destructive' className='bg-orange-600'>
								{pendingRequests.length}
							</Badge>
						</div>
					</div>
				)}

				{/* Main Tabs */}
				<Tabs
					value={activeTab}
					onValueChange={setActiveTab}
					className='space-y-4'>
					<TabsList className='grid w-full grid-cols-4 h-auto p-1'>
						<TabsTrigger value='overview' className='flex items-center gap-2'>
							<LayoutDashboard className='w-4 h-4' />
							Overview
						</TabsTrigger>
						<TabsTrigger
							value='bookings'
							className='flex items-center gap-2 relative'>
							<ClipboardList className='w-4 h-4' />
							Bookings
							{pendingRequests.length > 0 && (
								<Badge
									variant='destructive'
									className='ml-1 h-5 min-w-5 p-0 flex items-center justify-center text-xs'>
									{pendingRequests.length}
								</Badge>
							)}
						</TabsTrigger>
						<TabsTrigger value='workboard' className='flex items-center gap-2'>
							<CheckSquare className='w-4 h-4' />
							To-Do
						</TabsTrigger>
						<TabsTrigger value='profile' className='flex items-center gap-2'>
							<User className='w-4 h-4' />
							Profile
						</TabsTrigger>
					</TabsList>

					{/* Overview Tab */}
					<TabsContent value='overview' className='space-y-6'>
						<WorkerStatsCards stats={mockWorkerStats} />

						{/* Quick Stats */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div
								className='bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow'
								onClick={() => setActiveTab("bookings")}>
								<div className='flex items-center justify-between mb-4'>
									<Users className='w-8 h-8 text-blue-600' />
									<span className='text-3xl font-bold text-gray-900'>
										{customers.length}
									</span>
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Total Customers
								</h3>
								<p className='text-sm text-gray-500 mt-1'>Who booked you</p>
							</div>

							<div
								className='bg-white rounded-xl shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow'
								onClick={() => setActiveTab("workboard")}>
								<div className='flex items-center justify-between mb-4'>
									<CheckSquare className='w-8 h-8 text-green-600' />
									<span className='text-3xl font-bold text-gray-900'>
										{confirmedBookings.length}
									</span>
								</div>
								<h3 className='text-lg font-semibold text-gray-900'>
									Upcoming Jobs
								</h3>
								<p className='text-sm text-gray-500 mt-1'>Ready to start</p>
							</div>
						</div>

						{/* Recent Reviews Preview */}
						<div className='bg-white rounded-xl shadow-sm p-6'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg font-semibold text-gray-900'>
									Recent Feedback
								</h2>
								<button className='text-sm text-blue-600 hover:text-blue-700'>
									View all
								</button>
							</div>
							{mockReviews.slice(0, 2).map((review) => (
								<div
									key={review.id}
									className='border-b last:border-0 py-4 first:pt-0'>
									<div className='flex items-start justify-between mb-2'>
										<span className='font-medium text-gray-900'>
											{review.userName}
										</span>
										<div className='flex items-center gap-1'>
											{Array.from({ length: review.rating }).map((_, i) => (
												<Star
													key={i}
													className='w-4 h-4 fill-yellow-400 text-yellow-400'
												/>
											))}
										</div>
									</div>
									<p className='text-sm text-gray-600'>{review.comment}</p>
								</div>
							))}
						</div>
					</TabsContent>

					{/* Bookings Tab */}
					<TabsContent value='bookings' className='space-y-4'>
						{/* Booking Filters */}
						<div className='flex gap-2 overflow-x-auto pb-2'>
							{(
								[
									"all",
									"pending",
									"confirmed",
									"completed",
									"cancelled",
								] as const
							).map((filter) => {
								const count =
									filter === "all"
										? bookings.length
										: filter === "pending"
										? pendingRequests.length
										: filter === "confirmed"
										? confirmedBookings.length
										: filter === "completed"
										? completedBookings.length
										: cancelledBookings.length;

								return (
									<button
										key={filter}
										onClick={() => setBookingFilter(filter)}
										className={cn(
											"px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
											bookingFilter === filter
												? "bg-blue-600 text-white"
												: "bg-white text-gray-700 hover:bg-gray-100"
										)}>
										{filter} ({count})
									</button>
								);
							})}
						</div>

						{/* Customers */}
						<WorkerCustomerList customers={customers} />

						{/* Bookings List */}
						<div className='bg-white rounded-xl shadow-sm p-6'>
							<h2 className='text-lg font-semibold text-gray-900 mb-4'>
								{bookingFilter === "all" ? "All" : bookingFilter} Bookings
							</h2>
							{getFilteredBookings().length > 0 ? (
								getFilteredBookings().map((booking) => (
									<WorkerBookingCard
										key={booking.id}
										booking={booking}
										onAccept={handleAccept}
										onDecline={handleDecline}
										onComplete={handleComplete}
									/>
								))
							) : (
								<div className='text-center py-12'>
									<div className='text-4xl mb-4'>📭</div>
									<h3 className='text-lg font-medium text-gray-900 mb-2'>
										No {bookingFilter} bookings
									</h3>
									<p className='text-sm text-gray-500'>
										{bookingFilter === "pending"
											? "New requests will appear here"
											: "Check back later"}
									</p>
								</div>
							)}
						</div>
					</TabsContent>

					{/* Workboard Tab */}
					<TabsContent value='workboard'>
						<WorkerWorkboard
							bookings={confirmedBookings}
							onComplete={handleComplete}
						/>
					</TabsContent>

					{/* Profile Tab */}
					<TabsContent value='profile'>
						<WorkerProfileEditorFull
							profile={workerProfile}
							onProfileUpdate={handleProfileUpdate}
							onServicesUpdate={handleServicesUpdate}
							onLogout={handleLogout}
						/>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default WorkerDashboardPage;
