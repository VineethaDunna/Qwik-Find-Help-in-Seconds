import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Booking } from '@/types';
import { 
  MapPin, 
  Clock, 
  Calendar,
  Phone,
  MessageCircle,
  Check,
  X,
  IndianRupee,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface WorkerBookingCardProps {
  booking: Booking;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  onComplete?: (id: string) => void;
}

const WorkerBookingCard = ({ booking, onAccept, onDecline, onComplete }: WorkerBookingCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-accent/10 text-accent border-accent/20',
    confirmed: 'bg-primary/10 text-primary border-primary/20',
    completed: 'bg-green-500/10 text-green-600 border-green-500/20',
    cancelled: 'bg-muted text-muted-foreground border-border',
    declined: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-200",
      booking.status === 'pending' && "border-accent/30 shadow-md"
    )}>
      <CardContent className="p-0">
        {/* Header */}
        <div 
          className="p-3 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12 border-2 border-background shadow">
              <AvatarImage src={booking.userAvatar} alt={booking.userName} />
              <AvatarFallback>{booking.userName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm truncate">{booking.userName}</h3>
                <Badge className={cn("text-xs", statusColors[booking.status])}>
                  {booking.status}
                </Badge>
              </div>
              
              <p className="text-sm text-primary font-medium mb-1">{booking.service}</p>
              
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(new Date(booking.date), 'dd MMM')}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {booking.time}
                </span>
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <IndianRupee className="h-3 w-3" />
                  {booking.price}
                </span>
              </div>
            </div>
            
            {expanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="px-3 pb-3 pt-0 border-t border-border/50">
            <div className="space-y-3 pt-3">
              {/* Location */}
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium">{booking.location}</p>
                </div>
              </div>

              {/* Duration & Price */}
              {booking.duration && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">{booking.duration} hrs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Price</p>
                      <p className="text-sm font-semibold text-primary">₹{booking.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {booking.notes && (
                <div className="p-2.5 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground mb-1">Customer Note</p>
                  <p className="text-sm">{booking.notes}</p>
                </div>
              )}

              {/* Contact Actions */}
              {(booking.status === 'confirmed' || booking.status === 'pending') && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 h-9">
                    <Phone className="h-4 w-4 mr-1.5" />
                    Call
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-9">
                    <MessageCircle className="h-4 w-4 mr-1.5" />
                    Message
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              {booking.status === 'pending' && (
                <div className="flex gap-2 pt-1">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 h-10 border-red-200 text-red-500 hover:bg-red-50"
                    onClick={() => onDecline?.(booking.id)}
                  >
                    <X className="h-4 w-4 mr-1.5" />
                    Decline
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 h-10"
                    onClick={() => onAccept?.(booking.id)}
                  >
                    <Check className="h-4 w-4 mr-1.5" />
                    Accept
                  </Button>
                </div>
              )}

              {booking.status === 'confirmed' && (
                <Button 
                  size="sm" 
                  className="w-full h-10 bg-green-500 hover:bg-green-600"
                  onClick={() => onComplete?.(booking.id)}
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Mark as Completed
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerBookingCard;