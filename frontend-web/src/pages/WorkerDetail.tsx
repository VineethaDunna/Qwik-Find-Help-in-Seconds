import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/layout/Header';
import { featuredWorkers } from '@/data/mockData';
import { 
  Star, MapPin, CheckCircle, Phone, MessageCircle, 
  Calendar, Clock, ArrowLeft, Shield, Briefcase 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const WorkerDetail = () => {
  const { id } = useParams();
  const worker = featuredWorkers.find((w) => w.id === id);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  if (!worker) {
    return (
      <div className="min-h-screen bg-background">
        <Header showAuth={false} />
        <main className="container py-8 text-center">
          <p className="text-muted-foreground">Worker not found</p>
          <Button asChild className="mt-4">
            <Link to="/dashboard">Back to Dashboard</Link>
          </Button>
        </main>
      </div>
    );
  }

  const timeSlots = ['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

  return (
    <div className="min-h-screen bg-background">
      <Header showAuth={false} />
      
      <main className="container py-6 max-w-2xl">
        {/* Back Button */}
        <Button variant="ghost" asChild className="mb-4 -ml-2">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        {/* Profile Header */}
        <div className="animate-fade-in">
          <div className="flex items-start gap-4 mb-6">
            <div className="relative">
              <img
                src={worker.avatar}
                alt={worker.name}
                className="h-24 w-24 rounded-2xl object-cover"
              />
              {worker.isVerified && (
                <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-1 shadow-sm">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-heading font-semibold text-foreground">{worker.name}</h1>
                {worker.isVerified && (
                  <Badge variant="success" className="text-xs">Verified</Badge>
                )}
              </div>
              
              <div className="flex items-center gap-1 mb-2">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{worker.rating}</span>
                <span className="text-muted-foreground">({worker.reviewCount} reviews)</span>
              </div>
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{worker.location}</span>
                <span className="mx-1">•</span>
                <span>{worker.distance} km away</span>
              </div>
            </div>
          </div>

          {/* Price */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Starting from</p>
                <p className="text-2xl font-semibold text-foreground">₹{worker.hourlyRate}<span className="text-sm font-normal text-muted-foreground">/hour</span></p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Services */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-foreground mb-3">Services offered</h2>
            <div className="flex flex-wrap gap-2">
              {worker.services.map((service) => (
                <Badge key={service} variant="category">{service}</Badge>
              ))}
            </div>
          </div>

          {/* About */}
          {worker.bio && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold text-foreground mb-2">About</h2>
              <p className="text-muted-foreground">{worker.bio}</p>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <Briefcase className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-semibold text-foreground">{worker.completedJobs}</p>
                <p className="text-xs text-muted-foreground">Jobs done</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-semibold text-foreground">{worker.experience}</p>
                <p className="text-xs text-muted-foreground">Experience</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Shield className="h-5 w-5 mx-auto mb-1 text-primary" />
                <p className="text-lg font-semibold text-foreground">{worker.isVerified ? 'Yes' : 'Pending'}</p>
                <p className="text-xs text-muted-foreground">Verified</p>
              </CardContent>
            </Card>
          </div>

          {/* Availability */}
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-foreground mb-3">Available days</h2>
            <div className="flex gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div
                  key={day}
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium",
                    worker.availability.includes(day)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground"
                  )}
                >
                  {day.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Book CTA */}
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4">
          <div className="container max-w-2xl">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="xl" className="w-full">
                  <Calendar className="h-5 w-5 mr-2" />
                  Book {worker.name.split(' ')[0]}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Book {worker.name}</DialogTitle>
                  <DialogDescription>
                    Select a date and time for your booking
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          className={cn(
                            "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                            selectedTime === time
                              ? "bg-primary text-primary-foreground"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                          onClick={() => setSelectedTime(time)}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <Input placeholder="Enter your address" />
                  </div>
                  <div className="pt-4 border-t border-border">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Service rate</span>
                      <span className="font-medium">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-muted-foreground">Platform fee</span>
                      <span className="font-medium">₹25</span>
                    </div>
                    <Button className="w-full" size="lg" disabled={!selectedDate || !selectedTime}>
                      Confirm booking
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Spacer for fixed CTA */}
        <div className="h-24" />
      </main>
    </div>
  );
};

export default WorkerDetail;
