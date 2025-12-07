import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WorkerStatsCards from '@/components/worker/WorkerStatsCards';
import WorkerServicesManager from '@/components/worker/WorkerServicesManager';
import WorkerBookingCard from '@/components/worker/WorkerBookingCard';
import WorkerProfileEditorFull from '@/components/worker/WorkerProfileEditorFull';
import WorkerAnalytics from '@/components/worker/WorkerAnalytics';
import WorkerWorkboard from '@/components/worker/WorkerWorkboard';
import WorkerCustomerList from '@/components/worker/WorkerCustomerList';
import { mockBookings, mockWorkerProfile, mockWorkerStats, mockWorkerServices, mockReviews } from '@/data/mockData';
import { Booking, Worker, WorkerService } from '@/types';
import { 
  Bell,
  Shield,
  Star,
  Briefcase,
  ClipboardList,
  User,
  LayoutDashboard,
  Users,
  BarChart3,
  CheckSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const WorkerDashboardPage = () => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings.filter(b => b.workerId === '1'));
  const [activeTab, setActiveTab] = useState('overview');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'declined'>('all');
  const [workerProfile, setWorkerProfile] = useState<Worker>(mockWorkerProfile);
  const [workerServices, setWorkerServices] = useState<WorkerService[]>(mockWorkerServices);

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const completedBookings = bookings.filter(b => b.status === 'completed');
  const declinedBookings = bookings.filter(b => b.status === 'declined');

  const handleAccept = (id: string) => {
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'confirmed' as const } : b)
    );
    toast.success('Booking accepted!');
  };

  const handleDecline = (id: string) => {
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'declined' as const } : b)
    );
    toast.info('Booking declined');
  };

  const handleComplete = (id: string) => {
    setBookings(prev => 
      prev.map(b => b.id === id ? { ...b, status: 'completed' as const } : b)
    );
    toast.success('Job marked as completed!');
  };

  const getFilteredBookings = () => {
    switch (bookingFilter) {
      case 'pending': return pendingRequests;
      case 'confirmed': return confirmedBookings;
      case 'completed': return completedBookings;
      case 'declined': return declinedBookings;
      default: return bookings;
    }
  };

  // Get unique customers from bookings
  const customers = bookings.reduce((acc, booking) => {
    if (!acc.find(c => c.userId === booking.userId)) {
      acc.push({
        userId: booking.userId,
        userName: booking.userName || 'Unknown',
        userAvatar: booking.userAvatar,
        userPhone: booking.userPhone,
        totalBookings: bookings.filter(b => b.userId === booking.userId).length,
        totalSpent: bookings.filter(b => b.userId === booking.userId && b.status === 'completed').reduce((sum, b) => sum + b.price, 0),
      });
    }
    return acc;
  }, [] as Array<{ userId: string; userName: string; userAvatar?: string; userPhone?: string; totalBookings: number; totalSpent: number }>);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showAuth={false} />
      
      <main className="container py-4 md:py-6">
        {/* Welcome & Availability */}
        <div className="mb-4 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Hello, {workerProfile.name.split(' ')[0]} 👋
              </h1>
              <p className="text-sm text-muted-foreground">
                {isAvailable ? 'You are online and accepting jobs' : 'You are offline'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className={cn(
                  "text-sm font-medium",
                  isAvailable ? "text-primary" : "text-muted-foreground"
                )}>
                  {isAvailable ? 'Online' : 'Offline'}
                </span>
                <Switch 
                  checked={isAvailable} 
                  onCheckedChange={setIsAvailable}
                />
              </div>
            </div>
          </div>

          {/* Verification Banner */}
          {workerProfile.isVerified ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">Verified Professional</span>
              <div className="ml-auto flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-semibold">{workerProfile.rating}</span>
                <span className="text-xs text-muted-foreground">({workerProfile.reviewCount})</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 mb-4">
              <Shield className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-foreground">Complete verification to get more bookings</span>
            </div>
          )}
        </div>

        {/* Pending Requests Alert */}
        {pendingRequests.length > 0 && (
          <div 
            className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20 mb-4 animate-fade-in cursor-pointer hover:bg-accent/15 transition-colors" 
            style={{ animationDelay: '50ms' }}
            onClick={() => { setActiveTab('bookings'); setBookingFilter('pending'); }}
          >
            <div className="relative">
              <Bell className="h-5 w-5 text-accent" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent animate-pulse" />
            </div>
            <span className="text-sm font-medium text-foreground flex-1">
              You have {pendingRequests.length} new booking request{pendingRequests.length > 1 ? 's' : ''}
            </span>
            <Badge variant="default" className="bg-accent">
              {pendingRequests.length}
            </Badge>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <TabsList className="w-full grid grid-cols-5 mb-4 h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col items-center gap-0.5 py-2 px-1">
              <LayoutDashboard className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex flex-col items-center gap-0.5 py-2 px-1 relative">
              <ClipboardList className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">Bookings</span>
              {pendingRequests.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-[10px] flex items-center justify-center text-white font-bold">
                  {pendingRequests.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="workboard" className="flex flex-col items-center gap-0.5 py-2 px-1">
              <CheckSquare className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">To-Do</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex flex-col items-center gap-0.5 py-2 px-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">Services</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex flex-col items-center gap-0.5 py-2 px-1">
              <User className="h-4 w-4" />
              <span className="text-[10px] hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <WorkerStatsCards stats={mockWorkerStats} />
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div 
                className="p-4 rounded-xl bg-muted/50 border cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => setActiveTab('bookings')}
              >
                <div className="flex items-center justify-between mb-2">
                  <Users className="h-5 w-5 text-primary" />
                  <Badge variant="outline">{customers.length}</Badge>
                </div>
                <p className="text-sm font-medium">Total Customers</p>
                <p className="text-xs text-muted-foreground">Who booked you</p>
              </div>
              <div 
                className="p-4 rounded-xl bg-muted/50 border cursor-pointer hover:bg-muted/70 transition-colors"
                onClick={() => setActiveTab('workboard')}
              >
                <div className="flex items-center justify-between mb-2">
                  <CheckSquare className="h-5 w-5 text-accent" />
                  <Badge variant="outline">{confirmedBookings.length}</Badge>
                </div>
                <p className="text-sm font-medium">Upcoming Jobs</p>
                <p className="text-xs text-muted-foreground">Ready to start</p>
              </div>
            </div>

            {/* Recent Reviews Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Recent Feedback</h3>
                <button className="text-xs text-primary">View all</button>
              </div>
              {mockReviews.slice(0, 2).map(review => (
                <div key={review.id} className="p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{review.userName}</span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{review.comment}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-4">
            {/* Booking Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {(['all', 'pending', 'confirmed', 'completed', 'declined'] as const).map((filter) => {
                const count = filter === 'all' ? bookings.length 
                  : filter === 'pending' ? pendingRequests.length
                  : filter === 'confirmed' ? confirmedBookings.length
                  : filter === 'completed' ? completedBookings.length
                  : declinedBookings.length;
                
                return (
                  <Badge
                    key={filter}
                    variant={bookingFilter === filter ? 'default' : 'category'}
                    className="cursor-pointer capitalize px-3 py-1.5 whitespace-nowrap"
                    onClick={() => setBookingFilter(filter)}
                  >
                    {filter}
                    <span className="ml-1.5 text-xs opacity-70">({count})</span>
                  </Badge>
                );
              })}
            </div>

            {/* Customer List Toggle */}
            <WorkerCustomerList customers={customers} />

            {/* Bookings List */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {bookingFilter === 'all' ? 'All' : bookingFilter} Bookings
              </h3>
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
                <div className="text-center py-12">
                  <div className="text-4xl mb-3">📭</div>
                  <p className="text-muted-foreground font-medium">No {bookingFilter} bookings</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bookingFilter === 'pending' ? 'New requests will appear here' : 'Check back later'}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Workboard Tab */}
          <TabsContent value="workboard">
            <WorkerWorkboard 
              bookings={confirmedBookings} 
              onComplete={handleComplete}
            />
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services" className="space-y-4">
            <WorkerServicesManager 
              services={workerServices} 
              onServicesChange={setWorkerServices} 
            />
            <WorkerAnalytics stats={mockWorkerStats} reviews={mockReviews} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <WorkerProfileEditorFull 
              profile={workerProfile} 
              onProfileChange={setWorkerProfile} 
            />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default WorkerDashboardPage;
