import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import WorkerCard from '@/components/workers/WorkerCard';
import FilterSheet from '@/components/filters/FilterSheet';
import { services, featuredWorkers, mockBookings, mockCurrentUser } from '@/data/mockData';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Calendar,
  ChevronRight,
  Wallet,
  Receipt,
  Headphones,
  Bell
} from 'lucide-react';
import { FilterState } from '@/types';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const UserDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: null,
    sortBy: 'rating-high',
    minRating: 0,
    maxPrice: null,
  });

  // Get user's bookings
  const userBookings = mockBookings.filter(b => b.userId === mockCurrentUser.id);
  const activeBookings = userBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  const upcomingBooking = activeBookings[0];

  const filteredAndSortedWorkers = useMemo(() => {
    let result = featuredWorkers.filter((worker) => {
      const matchesSearch = 
        worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        worker.services.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || 
        worker.services.some((s) => s.toLowerCase() === selectedCategory.toLowerCase());
      
      const matchesRating = worker.rating >= filters.minRating;
      const matchesPrice = filters.maxPrice === null || worker.hourlyRate <= filters.maxPrice;

      return matchesSearch && matchesCategory && matchesRating && matchesPrice;
    });

    switch (filters.sortBy) {
      case 'rating-high':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating-low':
        result.sort((a, b) => a.rating - b.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price-high':
        result.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'distance':
        result.sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999));
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, filters]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showAuth={false} />
      
      <main className="container py-4 md:py-6 space-y-5">
        {/* Location & Greeting */}
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Mumbai, India</span>
              <Button variant="ghost" size="sm" className="text-primary text-xs p-0 h-auto">
                Change
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            </Button>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            What do you need help with?
          </h1>
        </div>

        {/* Search */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search services or helpers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 rounded-xl"
            />
          </div>
          <FilterSheet filters={filters} onFiltersChange={setFilters} />
        </div>

        {/* Upcoming Booking Card */}
        {upcomingBooking && (
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 animate-fade-in" style={{ animationDelay: '75ms' }}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-primary uppercase tracking-wide">Upcoming Booking</span>
                <Badge variant="outline" className="text-xs">{upcomingBooking.status}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">{upcomingBooking.service}</p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(upcomingBooking.date), 'dd MMM')} at {upcomingBooking.time}
                  </p>
                </div>
                <Button size="sm" variant="secondary" asChild>
                  <Link to="/activity">View</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Categories */}
        <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Categories</h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            <Badge
              variant={selectedCategory === null ? "default" : "category"}
              className="shrink-0 cursor-pointer h-9 px-4 rounded-full"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Badge>
            {services.map((service) => (
              <Badge
                key={service.id}
                variant={selectedCategory === service.name ? "default" : "category"}
                className="shrink-0 cursor-pointer h-9 px-4 rounded-full"
                onClick={() => setSelectedCategory(service.name)}
              >
                <span className="mr-1.5">{service.icon}</span>
                {service.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {(filters.minRating > 0 || filters.maxPrice !== null) && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {filters.minRating > 0 && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-accent text-accent" />
                {filters.minRating}+ rating
              </Badge>
            )}
            {filters.maxPrice !== null && (
              <Badge variant="outline">
                Max ₹{filters.maxPrice}/hr
              </Badge>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 animate-fade-in" style={{ animationDelay: '125ms' }}>
          <Link to="/activity">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-3 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1.5 text-primary" />
                <p className="text-xs font-medium">Bookings</p>
              </CardContent>
            </Card>
          </Link>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 text-center">
              <Wallet className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-xs font-medium">Payments</p>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-3 text-center">
              <Headphones className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-xs font-medium">Support</p>
            </CardContent>
          </Card>
        </div>

        {/* Results Header */}
        <section className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">
              Helpers near you
            </h2>
            <span className="text-sm text-muted-foreground">
              {filteredAndSortedWorkers.length} available
            </span>
          </div>

          {/* Worker Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedWorkers.map((worker, index) => (
              <div
                key={worker.id}
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 50}ms` }}
              >
                <WorkerCard worker={worker} />
              </div>
            ))}
          </div>

          {filteredAndSortedWorkers.length === 0 && (
            <div className="text-center py-12 animate-fade-in">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-muted-foreground font-medium">No helpers found</p>
              <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
            </div>
          )}
        </section>
      </main>

      <BottomNav />
    </div>
  );
};

export default UserDashboard;
