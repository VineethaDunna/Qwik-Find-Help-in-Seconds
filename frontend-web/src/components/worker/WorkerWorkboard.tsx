import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Booking } from '@/types';
import { 
  CheckSquare, 
  Clock, 
  MapPin, 
  Phone,
  Calendar,
  IndianRupee,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { useState } from 'react';

interface WorkerWorkboardProps {
  bookings: Booking[];
  onComplete: (id: string) => void;
}

const WorkerWorkboard = ({ bookings, onComplete }: WorkerWorkboardProps) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  // Sort bookings by date
  const sortedBookings = [...bookings].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const todayJobs = sortedBookings.filter(b => isToday(new Date(b.date)));
  const tomorrowJobs = sortedBookings.filter(b => isTomorrow(new Date(b.date)));
  const upcomingJobs = sortedBookings.filter(b => {
    const days = differenceInDays(new Date(b.date), new Date());
    return days > 1;
  });

  const getTimeLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    const days = differenceInDays(date, new Date());
    return `In ${days} days`;
  };

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const JobCard = ({ booking, urgent = false }: { booking: Booking; urgent?: boolean }) => (
    <Card className={`${urgent ? 'border-accent/50 bg-accent/5' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={checkedItems[booking.id] || false}
            onCheckedChange={() => toggleCheck(booking.id)}
            className="mt-1"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{booking.service}</h4>
              {urgent && (
                <Badge variant="outline" className="text-accent border-accent/30 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Urgent
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mb-2">{booking.userName}</p>
            
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {booking.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {booking.location}
              </span>
              <span className="flex items-center gap-1 font-semibold text-foreground">
                <IndianRupee className="h-3 w-3" />
                {booking.price}
              </span>
            </div>

            {booking.notes && (
              <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/30 rounded">
                {booking.notes}
              </p>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <Phone className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0 text-green-500"
              onClick={() => onComplete(booking.id)}
            >
              <CheckSquare className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="text-4xl mb-3">✅</div>
      <p className="text-muted-foreground font-medium">No upcoming jobs</p>
      <p className="text-sm text-muted-foreground mt-1">Accept bookings to see them here</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className={`${todayJobs.length > 0 ? 'bg-accent/10 border-accent/20' : ''}`}>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{todayJobs.length}</p>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{tomorrowJobs.length}</p>
            <p className="text-xs text-muted-foreground">Tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-2xl font-bold">{upcomingJobs.length}</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </CardContent>
        </Card>
      </div>

      {sortedBookings.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Today's Jobs */}
          {todayJobs.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-accent">
                  Today's Jobs ({todayJobs.length})
                </h3>
              </div>
              {todayJobs.map(booking => (
                <JobCard key={booking.id} booking={booking} urgent />
              ))}
            </div>
          )}

          {/* Tomorrow's Jobs */}
          {tomorrowJobs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Tomorrow ({tomorrowJobs.length})
              </h3>
              {tomorrowJobs.map(booking => (
                <JobCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {/* Upcoming Jobs */}
          {upcomingJobs.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Upcoming ({upcomingJobs.length})
              </h3>
              {upcomingJobs.map(booking => (
                <Card key={booking.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{booking.service}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(booking.date), 'EEE, dd MMM')} • {booking.time}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkerWorkboard;
