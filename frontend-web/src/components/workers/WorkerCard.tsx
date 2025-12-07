import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Worker } from '@/types';
import { Link } from 'react-router-dom';

interface WorkerCardProps {
  worker: Worker;
}

const WorkerCard = ({ worker }: WorkerCardProps) => {
  return (
    <Card className="group cursor-pointer">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={worker.avatar}
              alt={worker.name}
              className="h-16 w-16 rounded-xl object-cover"
            />
            {worker.isVerified && (
              <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-0.5">
                <CheckCircle className="h-4 w-4 text-primary" />
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{worker.name}</h3>
                <p className="text-sm text-muted-foreground">{worker.services[0]}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="text-sm font-medium">{worker.rating}</span>
                <span className="text-sm text-muted-foreground">({worker.reviewCount})</span>
              </div>
            </div>
            
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                <span>{worker.distance} km</span>
              </div>
              <span className="font-medium text-foreground">₹{worker.hourlyRate}/hr</span>
            </div>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-2">
            {worker.services.slice(0, 2).map((service) => (
              <Badge key={service} variant="category" className="text-xs">
                {service}
              </Badge>
            ))}
          </div>
          <Button size="sm" asChild>
            <Link to={`/worker/${worker.id}`}>Book</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerCard;
