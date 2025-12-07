import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Phone, 
  ChevronDown, 
  ChevronUp,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Customer {
  userId: string;
  userName: string;
  userAvatar?: string;
  userPhone?: string;
  totalBookings: number;
  totalSpent: number;
}

interface WorkerCustomerListProps {
  customers: Customer[];
}

const WorkerCustomerList = ({ customers }: WorkerCustomerListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Sort customers by total bookings
  const sortedCustomers = [...customers].sort((a, b) => b.totalBookings - a.totalBookings);
  const displayCustomers = isExpanded ? sortedCustomers : sortedCustomers.slice(0, 3);

  if (customers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Your Customers</CardTitle>
            <Badge variant="secondary" className="text-xs">{customers.length}</Badge>
          </div>
          {customers.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 text-xs"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Show Less <ChevronUp className="h-3 w-3 ml-1" />
                </>
              ) : (
                <>
                  View All <ChevronDown className="h-3 w-3 ml-1" />
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {displayCustomers.map((customer, index) => (
          <div 
            key={customer.userId}
            className={cn(
              "flex items-center gap-3 p-2.5 rounded-lg",
              index === 0 && "bg-primary/5 border border-primary/10"
            )}
          >
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={customer.userAvatar} />
              <AvatarFallback>{customer.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-sm truncate">{customer.userName}</p>
                {index === 0 && (
                  <Badge variant="outline" className="text-xs text-primary border-primary/30">
                    Top Customer
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {customer.totalBookings} bookings
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="h-3 w-3" />
                  {customer.totalSpent.toLocaleString()} spent
                </span>
              </div>
            </div>
            
            {customer.userPhone && (
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0">
                <Phone className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkerCustomerList;
