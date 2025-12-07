import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Check, X, MessageCircle, Phone } from 'lucide-react';
import { Booking } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RequestCardProps {
  booking: Booking;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
}

const RequestCard = ({ booking, onAccept, onDecline }: RequestCardProps) => {
  const isPending = booking.status === 'pending';
  
  const statusColors = {
    pending: 'bg-accent/20 text-accent-foreground border-accent',
    confirmed: 'bg-primary/20 text-primary border-primary',
    completed: 'bg-green-100 text-green-800 border-green-500',
    cancelled: 'bg-destructive/20 text-destructive border-destructive',
    declined: 'bg-muted text-muted-foreground border-border',
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={booking.userAvatar} alt={booking.userName} />
            <AvatarFallback>{booking.userName?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-foreground truncate">
                {booking.userName}
              </h3>
              <Badge 
                variant="outline" 
                className={cn("shrink-0 capitalize text-xs", statusColors[booking.status])}
              >
                {booking.status}
              </Badge>
            </div>
            
            <p className="text-sm font-medium text-primary mt-0.5">
              {booking.service}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{format(booking.date, 'MMM dd')} • {booking.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span className="truncate">{booking.location}</span>
              </div>
            </div>
            
            {booking.notes && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-secondary/50 p-2 rounded-lg">
                "{booking.notes}"
              </p>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-bold text-foreground">
                ₹{booking.price}
              </span>
              
              {isPending ? (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDecline?.(booking.id)}
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => onAccept?.(booking.id)}
                    className="h-8"
                  >
                    <Check className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="h-8">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RequestCard;
