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
  Check,
  Plus,
  X,
  Briefcase,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface WorkerProfileEditorFullProps {
  profile: Worker;
  onProfileChange: (profile: Worker) => void;
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WorkerProfileEditorFull = ({ profile, onProfileChange }: WorkerProfileEditorFullProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(profile);
  const [newSkill, setNewSkill] = useState('');
  const [workPhotos, setWorkPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=200&h=200&fit=crop',
  ]);

  const handleSave = () => {
    onProfileChange(editedProfile);
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const toggleAvailability = (day: string) => {
    const newAvailability = editedProfile.availability.includes(day)
      ? editedProfile.availability.filter(d => d !== day)
      : [...editedProfile.availability, day];
    setEditedProfile(prev => ({ ...prev, availability: newAvailability }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !editedProfile.services.includes(newSkill.trim())) {
      setEditedProfile(prev => ({ 
        ...prev, 
        services: [...prev.services, newSkill.trim()] 
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setEditedProfile(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== skill)
    }));
  };

  if (!isEditing) {
    return (
      <div className="space-y-4">
        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Profile</CardTitle>
              <Button size="sm" variant="outline" className="h-8" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-xl">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.experience} experience</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg font-bold text-primary">₹{profile.hourlyRate}</span>
                  <span className="text-sm text-muted-foreground">/hour</span>
                </div>
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
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Skills & Services</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.services.map(skill => (
                <Badge key={skill} variant="secondary" className="px-3 py-1">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Availability Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Working Days</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <Badge 
                  key={day} 
                  variant={profile.availability.includes(day) ? 'default' : 'outline'}
                  className="px-3 py-1"
                >
                  {day}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Work Photos Card */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-semibold">Work Portfolio</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2">
              {workPhotos.map((photo, index) => (
                <div key={index} className="aspect-square rounded-lg overflow-hidden">
                  <img src={photo} alt={`Work ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
              <button className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Edit Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Check className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-primary/20">
                <AvatarImage src={editedProfile.avatar} />
                <AvatarFallback>{editedProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button 
                size="sm" 
                variant="outline" 
                className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 space-y-2">
              <Input
                value={editedProfile.name}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
              <Input
                value={editedProfile.experience || ''}
                onChange={(e) => setEditedProfile(prev => ({ ...prev, experience: e.target.value }))}
                placeholder="Experience (e.g., 5 years)"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Hourly Rate (₹)</label>
            <Input
              type="number"
              value={editedProfile.hourlyRate}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, hourlyRate: parseInt(e.target.value) || 0 }))}
              placeholder="350"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">About</label>
            <Textarea
              value={editedProfile.bio || ''}
              onChange={(e) => setEditedProfile(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell customers about yourself..."
              rows={3}
            />
          </div>

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
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Skills & Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {editedProfile.services.map(skill => (
              <Badge key={skill} variant="secondary" className="px-3 py-1 gap-1">
                {skill}
                <button onClick={() => removeSkill(skill)}>
                  <X className="h-3 w-3 ml-1 hover:text-destructive" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button size="sm" variant="outline" onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Working Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {DAYS.map(day => (
              <Button
                key={day}
                type="button"
                size="sm"
                variant={editedProfile.availability.includes(day) ? 'default' : 'outline'}
                className="h-10 w-14"
                onClick={() => toggleAvailability(day)}
              >
                {day}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work Photos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">Work Portfolio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {workPhotos.map((photo, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden relative group">
                <img src={photo} alt={`Work ${index + 1}`} className="h-full w-full object-cover" />
                <button className="absolute top-1 right-1 h-6 w-6 rounded-full bg-destructive/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
            <button className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary hover:bg-primary/5 transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Add photos of your completed work to attract more customers</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerProfileEditorFull;
