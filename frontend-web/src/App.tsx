import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import WorkerDashboardPage from "./pages/worker/WorkerDashboardPage";
import WorkerDetail from "./pages/WorkerDetail";
import Services from "./pages/Services";
import Activity from "./pages/Activity";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
	<QueryClientProvider client={queryClient}>
		<TooltipProvider>
			<Toaster />
			<Sonner />

			<AuthProvider>
				<BrowserRouter>
					<Routes>
						{/* PUBLIC ROUTES */}
						<Route path='/login' element={<Index />} />
						<Route path='/signup' element={<Signup />} />

						{/* PRIVATE ROUTES */}
						<Route
							path='/'
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/dashboard'
							element={
								<ProtectedRoute>
									<Dashboard />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/worker-dashboard'
							element={
								<ProtectedRoute>
									<WorkerDashboardPage />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/worker/:id'
							element={
								<ProtectedRoute>
									<WorkerDetail />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/services'
							element={
								<ProtectedRoute>
									<Services />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/activity'
							element={
								<ProtectedRoute>
									<Activity />
								</ProtectedRoute>
							}
						/>

						<Route
							path='/profile'
							element={
								<ProtectedRoute>
									<Profile />
								</ProtectedRoute>
							}
						/>

						{/* FALLBACK */}
						<Route path='*' element={<NotFound />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</TooltipProvider>
	</QueryClientProvider>
);

export default App;
