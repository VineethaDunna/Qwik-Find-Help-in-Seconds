import { Card, CardContent } from '@/components/ui/card';
import { WorkerStats } from '@/types';
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  Target,
  Star,
  Calendar,
  IndianRupee
} from 'lucide-react';

interface WorkerStatsCardsProps {
  stats: WorkerStats;
}

const WorkerStatsCards = ({ stats }: WorkerStatsCardsProps) => {
  return (
    <div className="space-y-4">
      {/* Earnings Row */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Wallet className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Today</span>
            </div>
            <p className="text-lg font-bold text-foreground flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.todayEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Week</span>
            </div>
            <p className="text-lg font-bold text-foreground flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.weeklyEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">Month</span>
            </div>
            <p className="text-lg font-bold text-foreground flex items-center">
              <IndianRupee className="h-4 w-4" />
              {stats.monthlyEarnings.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <Card>
          <CardContent className="p-2.5 text-center">
            <CheckCircle className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.completedBookings}</p>
            <span className="text-[10px] text-muted-foreground">Done</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-2.5 text-center">
            <Clock className="h-4 w-4 text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.pendingBookings}</p>
            <span className="text-[10px] text-muted-foreground">Pending</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-2.5 text-center">
            <Target className="h-4 w-4 text-primary mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.acceptanceRate}%</p>
            <span className="text-[10px] text-muted-foreground">Accept</span>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-2.5 text-center">
            <Star className="h-4 w-4 fill-accent text-accent mx-auto mb-1" />
            <p className="text-lg font-bold text-foreground">{stats.averageRating}</p>
            <span className="text-[10px] text-muted-foreground">Rating</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerStatsCards;