import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WorkerStats, Review } from '@/types';
import { 
  TrendingUp, 
  Star,
  Calendar,
  Target,
  Users,
  IndianRupee,
  ThumbsUp
} from 'lucide-react';
import { format } from 'date-fns';

interface WorkerAnalyticsProps {
  stats: WorkerStats;
  reviews: Review[];
}

const WorkerAnalytics = ({ stats, reviews }: WorkerAnalyticsProps) => {
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: reviews.length > 0 
      ? (reviews.filter(r => r.rating === rating).length / reviews.length) * 100 
      : 0
  }));

  return (
    <div className="space-y-4">
      {/* Performance Overview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Performance Analytics</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Total Bookings</span>
              </div>
              <p className="text-2xl font-bold">{stats.totalBookings}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <Target className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Acceptance Rate</span>
              </div>
              <p className="text-2xl font-bold">{stats.acceptanceRate}%</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-medium">
                {Math.round((stats.completedBookings / stats.totalBookings) * 100)}%
              </span>
            </div>
            <Progress value={(stats.completedBookings / stats.totalBookings) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Earnings Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-semibold">Earnings Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5 border border-primary/10">
              <div>
                <p className="text-xs text-muted-foreground">This Month</p>
                <p className="text-xl font-bold">₹{stats.monthlyEarnings.toLocaleString()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">This Week</p>
                <p className="text-lg font-semibold">₹{stats.weeklyEarnings.toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30">
                <p className="text-xs text-muted-foreground">Today</p>
                <p className="text-lg font-semibold">₹{stats.todayEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ratings Breakdown */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-accent fill-accent" />
            <CardTitle className="text-base font-semibold">Customer Ratings</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-4xl font-bold">{averageRating.toFixed(1)}</p>
              <div className="flex items-center gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-accent text-accent' : 'text-muted-foreground'}`} 
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
            </div>
            <div className="flex-1 space-y-1.5">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-xs w-3">{rating}</span>
                  <Star className="h-3 w-3 fill-accent text-accent" />
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="space-y-2 pt-3 border-t">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Recent Reviews</p>
            {reviews.slice(0, 3).map(review => (
              <div key={review.id} className="p-2.5 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{review.userName}</span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-accent text-accent" />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {format(new Date(review.date), 'dd MMM')}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerAnalytics;
