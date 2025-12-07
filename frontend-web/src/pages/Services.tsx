import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import { services } from '@/data/mockData';
import { Search, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const categoryGroups = [
  { name: 'Home Services', category: 'home', color: 'bg-primary/10 text-primary' },
  { name: 'Personal Care', category: 'personal', color: 'bg-accent/10 text-accent-foreground' },
  { name: 'Transport', category: 'transport', color: 'bg-blue-100 text-blue-700' },
  { name: 'Education', category: 'education', color: 'bg-purple-100 text-purple-700' },
];

const Services = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header showAuth={false} />
      
      <main className="container py-4 md:py-6">
        <h1 className="text-xl md:text-2xl font-semibold text-foreground mb-4 animate-fade-in">
          All Services
        </h1>

        {/* Search */}
        <div className="relative mb-6 animate-fade-in" style={{ animationDelay: '50ms' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11"
          />
        </div>

        {/* Service Categories */}
        {searchQuery === '' ? (
          <div className="space-y-6">
            {categoryGroups.map((group, groupIndex) => {
              const categoryServices = services.filter(s => s.category === group.category);
              if (categoryServices.length === 0) return null;

              return (
                <section 
                  key={group.category} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${(groupIndex + 1) * 100}ms` }}
                >
                  <h2 className="text-base font-semibold text-foreground mb-3">
                    {group.name}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {categoryServices.map((service) => (
                      <Link 
                        key={service.id} 
                        to={`/dashboard?category=${encodeURIComponent(service.name)}`}
                      >
                        <Card className="hover:shadow-card-hover transition-all cursor-pointer group">
                          <CardContent className="p-4 flex flex-col items-center text-center">
                            <div className={cn(
                              "h-12 w-12 rounded-xl flex items-center justify-center text-2xl mb-2",
                              group.color
                            )}>
                              {service.icon}
                            </div>
                            <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                              {service.name}
                            </span>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 animate-fade-in">
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <Link 
                  key={service.id} 
                  to={`/dashboard?category=${encodeURIComponent(service.name)}`}
                >
                  <Card className="hover:shadow-card-hover transition-all cursor-pointer group">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-2xl mb-2">
                        {service.icon}
                      </div>
                      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {service.name}
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-muted-foreground font-medium">No services found</p>
                <p className="text-sm text-muted-foreground mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        )}

        {/* Browse All Link */}
        <Link 
          to="/dashboard" 
          className="flex items-center justify-center gap-2 mt-6 py-3 text-primary font-medium hover:underline animate-fade-in"
          style={{ animationDelay: '400ms' }}
        >
          Browse all helpers
          <ChevronRight className="h-4 w-4" />
        </Link>
      </main>

      <BottomNav />
    </div>
  );
};

export default Services;
