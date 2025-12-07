import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { SlidersHorizontal, Star, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SortOption, FilterState } from '@/types';

interface FilterSheetProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating-high', label: 'Rating: High to Low' },
  { value: 'rating-low', label: 'Rating: Low to High' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'distance', label: 'Nearest First' },
];

const FilterSheet = ({ filters, onFiltersChange }: FilterSheetProps) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterState = {
      category: null,
      sortBy: 'rating-high',
      minRating: 0,
      maxPrice: null,
    };
    setLocalFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters = filters.minRating > 0 || filters.maxPrice !== null || filters.sortBy !== 'rating-high';

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <SlidersHorizontal className="h-4 w-4" />
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-primary" />
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Filters & Sort</SheetTitle>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-primary">
              Reset All
            </Button>
          </div>
        </SheetHeader>

        <div className="space-y-6 pb-24 overflow-y-auto">
          {/* Sort By */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Sort By</h3>
            <div className="flex flex-wrap gap-2">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setLocalFilters({ ...localFilters, sortBy: option.value })}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    localFilters.sortBy === option.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Minimum Rating</h3>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium">{localFilters.minRating.toFixed(1)}+</span>
              </div>
            </div>
            <Slider
              value={[localFilters.minRating]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, minRating: value })}
              max={5}
              step={0.5}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Any</span>
              <span>5.0</span>
            </div>
          </div>

          {/* Max Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Maximum Hourly Rate</h3>
              <span className="font-medium">
                {localFilters.maxPrice ? `₹${localFilters.maxPrice}` : 'Any'}
              </span>
            </div>
            <Slider
              value={[localFilters.maxPrice ?? 1000]}
              onValueChange={([value]) => setLocalFilters({ ...localFilters, maxPrice: value === 1000 ? null : value })}
              min={100}
              max={1000}
              step={50}
              className="py-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹100</span>
              <span>₹1000+</span>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-card border-t border-border safe-area-pb">
          <Button onClick={handleApply} className="w-full" size="lg">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
