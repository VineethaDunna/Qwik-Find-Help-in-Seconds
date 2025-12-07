import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Worker } from '@/types';
import { 
  Camera, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WorkerProfileEditorProps {
  profile: Worker;
  onProfileChange: (profile: Worker) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WorkerProfileEditor = ({ profile, onProfileChange }: WorkerProfileEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onProfileChange(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated!');
  };

  const toggleAvailability = (day: string) => {
    const newAvailability = editedProfile.availability.includes(day)
      ? editedProfile.availability.filter(d => d !== day)
      : [...editedProfile.availability, day];
    setEditedProfile(prev => ({ ...prev, availability: newAvailability }));
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Profile</CardTitle>
            <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{profile.name}</h3>
              <p className="text-sm text-muted-foreground">{profile.experience} experience</p>
            </div>
          </div>

          <p className="text-sm text-muted-foreground">{profile.bio}</p>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{profile.email}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm mb-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Availability</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(day => (
                <Badge 
                  key={day} 
                  variant={profile.availability.includes(day) ? 'default' : 'category'}
                  className="text-xs"
                >
                  {day}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Edit Profile</CardTitle>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="sm" className="h-8" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={editedProfile.avatar} />
              <AvatarFallback>{editedProfile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <Button 
              size="sm" 
              variant="outline" 
              className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full p-0"
            >
              <Camera className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="flex-1">
            <Input
              value={editedProfile.name}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Your name"
              className="mb-2"
            />
            <Input
              value={editedProfile.experience || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, experience: e.target.value }))}
              placeholder="Experience (e.g., 5 years)"
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-medium mb-1.5 block">About</label>
          <Textarea
            value={editedProfile.bio || ''}
            onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell customers about yourself..."
            rows={3}
          />
        </div>

        {/* Contact */}
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Location</label>
            <Input
              value={editedProfile.location || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="City, India"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Phone</label>
            <Input
              value={editedProfile.phone || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+91 98765 43210"
            />
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="text-sm font-medium mb-2 block">Working Days</label>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <Button
                key={day}
                type="button"
                size="sm"
                variant={editedProfile.availability.includes(day) ? 'default' : 'outline'}
                className={cn(
                  "h-9 w-12",
                  editedProfile.availability.includes(day) && "bg-primary"
                )}
                onClick={() => toggleAvailability(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkerProfileEditor;