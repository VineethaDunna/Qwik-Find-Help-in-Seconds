import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { mockCurrentUser, mockWorkerProfile } from '@/data/mockData';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Settings, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Shield,
  Star,
  Bell,
  FileText,
  Heart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  href?: string;
  onClick?: () => void;
  badge?: string;
  danger?: boolean;
}

const MenuItem = ({ icon: Icon, label, description, href, onClick, badge, danger }: MenuItemProps) => {
  const content = (
    <div className={cn(
      "flex items-center gap-3 p-3 rounded-xl transition-colors cursor-pointer",
      danger ? "hover:bg-destructive/10" : "hover:bg-secondary"
    )}>
      <div className={cn(
        "h-10 w-10 rounded-xl flex items-center justify-center",
        danger ? "bg-destructive/10 text-destructive" : "bg-secondary text-foreground"
      )}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "font-medium",
          danger ? "text-destructive" : "text-foreground"
        )}>
          {label}
        </p>
        {description && (
          <p className="text-xs text-muted-foreground truncate">{description}</p>
        )}
      </div>
      {badge && (
        <Badge variant="default" className="shrink-0">{badge}</Badge>
      )}
      <ChevronRight className={cn(
        "h-4 w-4 shrink-0",
        danger ? "text-destructive" : "text-muted-foreground"
      )} />
    </div>
  );

  if (href) {
    return <Link to={href}>{content}</Link>;
  }

  return <div onClick={onClick}>{content}</div>;
};

const Profile = () => {
  // Use mockCurrentUser for demo - in real app would come from auth
  const user = mockCurrentUser;
  const isWorker = user.role === 'worker';
  const workerData = isWorker ? mockWorkerProfile : null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showAuth={false} />
      
      <main className="container py-4 md:py-6">
        {/* Profile Header */}
        <Card className="mb-4 animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-lg">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-foreground truncate">
                    {user.name}
                  </h1>
                  {isWorker && workerData?.isVerified && (
                    <Shield className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                
                {isWorker && workerData && (
                  <div className="flex items-center gap-2 mt-0.5">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{workerData.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({workerData.reviewCount} reviews)
                    </span>
                  </div>
                )}
                
                <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{user.location}</span>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>

            {/* Contact Info */}
            <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            </div>

            {/* Worker Services */}
            {isWorker && workerData && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">Services</p>
                <div className="flex flex-wrap gap-2">
                  {workerData.services.map((service) => (
                    <Badge key={service} variant="category">{service}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <Card>
            <CardContent className="p-2">
              <MenuItem 
                icon={User} 
                label="Personal Information" 
                description="Manage your personal details"
              />
              <MenuItem 
                icon={Bell} 
                label="Notifications" 
                description="Customize notification preferences"
              />
              <MenuItem 
                icon={CreditCard} 
                label="Payment Methods" 
                description="Add or manage payment options"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <MenuItem 
                icon={Heart} 
                label="Favorites" 
                description="Your saved helpers"
                badge="3"
              />
              <MenuItem 
                icon={FileText} 
                label="Documents" 
                description="ID verification and certificates"
              />
              <MenuItem 
                icon={Settings} 
                label="Settings" 
                description="App preferences and security"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-2">
              <MenuItem 
                icon={HelpCircle} 
                label="Help & Support" 
                description="FAQs and customer support"
              />
              <MenuItem 
                icon={LogOut} 
                label="Log Out" 
                danger
                onClick={() => {
                  // Handle logout
                }}
              />
            </CardContent>
          </Card>
        </div>

        {/* App Version */}
        <p className="text-center text-xs text-muted-foreground mt-6 animate-fade-in" style={{ animationDelay: '200ms' }}>
          QuickConnect v1.0.0
        </p>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
