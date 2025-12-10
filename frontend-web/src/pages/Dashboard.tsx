import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "./user/UserDashboard";
import WorkerDashboardPage from "./worker/WorkerDashboardPage";
import Header from "@/components/layout/Header"; // optional, if you render header inside pages
import BottomNav from "@/components/layout/BottomNav";

const Dashboard: React.FC = () => {
	const { user, loading } = useAuth();

	// still loading auth state — show a centered loader or skeleton
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div>Loading dashboard…</div>
			</div>
		);
	}

	// if no user, ProtectedRoute should have redirected — but being defensive:
	if (!user) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-background'>
				<div>Not logged in.</div>
			</div>
		);
	}

	// decide based on real user role
	if (user.user_type === "worker") {
		return <WorkerDashboardPage />;
	}

	return <UserDashboard />;
};

export default Dashboard;
