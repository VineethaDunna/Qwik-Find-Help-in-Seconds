import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { WorkerService } from '@/types';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  IndianRupee,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface WorkerServicesManagerProps {
  services: WorkerService[];
  onServicesChange: (services: WorkerService[]) => void;
}

const WorkerServicesManager = ({ services, onServicesChange }: WorkerServicesManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newService, setNewService] = useState<{ name: string; rate: string; rateType: 'hourly' | 'fixed'; description: string }>({ name: '', rate: '', rateType: 'hourly', description: '' });
  const [editService, setEditService] = useState<{ name: string; rate: string; rateType: 'hourly' | 'fixed'; description: string }>({ name: '', rate: '', rateType: 'hourly', description: '' });

  const handleAddService = () => {
    if (!newService.name || !newService.rate) {
      toast.error('Please fill in service name and rate');
      return;
    }
    const service: WorkerService = {
      id: `ws-${Date.now()}`,
      name: newService.name,
      rate: parseFloat(newService.rate),
      rateType: newService.rateType,
      description: newService.description,
    };
    onServicesChange([...services, service]);
    setNewService({ name: '', rate: '', rateType: 'hourly', description: '' });
    setIsAdding(false);
    toast.success('Service added!');
  };

  const handleEditService = (id: string) => {
    const service = services.find(s => s.id === id);
    if (service) {
      setEditService({
        name: service.name,
        rate: service.rate.toString(),
        rateType: service.rateType,
        description: service.description || '',
      });
      setEditingId(id);
    }
  };

  const handleSaveEdit = (id: string) => {
    if (!editService.name || !editService.rate) {
      toast.error('Please fill in required fields');
      return;
    }
    const updated = services.map(s => 
      s.id === id 
        ? { ...s, name: editService.name, rate: parseFloat(editService.rate), rateType: editService.rateType, description: editService.description }
        : s
    );
    onServicesChange(updated);
    setEditingId(null);
    toast.success('Service updated!');
  };

  const handleDeleteService = (id: string) => {
    onServicesChange(services.filter(s => s.id !== id));
    toast.success('Service removed');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">My Services & Rates</CardTitle>
          <Dialog open={isAdding} onOpenChange={setIsAdding}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Service Name</label>
                  <Input
                    placeholder="e.g., Furniture Repair"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Rate (₹)</label>
                    <Input
                      type="number"
                      placeholder="350"
                      value={newService.rate}
                      onChange={(e) => setNewService(prev => ({ ...prev, rate: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Rate Type</label>
                    <Select
                      value={newService.rateType}
                      onValueChange={(value: 'hourly' | 'fixed') => setNewService(prev => ({ ...prev, rateType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Per Hour</SelectItem>
                        <SelectItem value="fixed">Fixed Price</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Description (optional)</label>
                  <Input
                    placeholder="Brief description of service"
                    value={newService.description}
                    onChange={(e) => setNewService(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <Button onClick={handleAddService} className="w-full">
                  Add Service
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {services.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No services added yet. Add your first service!
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between p-3 rounded-xl bg-muted/50 border border-border/50"
            >
              {editingId === service.id ? (
                <div className="flex-1 space-y-2">
                  <Input
                    value={editService.name}
                    onChange={(e) => setEditService(prev => ({ ...prev, name: e.target.value }))}
                    className="h-8"
                  />
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={editService.rate}
                      onChange={(e) => setEditService(prev => ({ ...prev, rate: e.target.value }))}
                      className="h-8 w-24"
                    />
                    <Select
                      value={editService.rateType}
                      onValueChange={(value: 'hourly' | 'fixed') => setEditService(prev => ({ ...prev, rateType: value }))}
                    >
                      <SelectTrigger className="h-8 w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Per Hour</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleSaveEdit(service.id)}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{service.name}</p>
                    {service.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{service.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="category" className="font-semibold">
                      <IndianRupee className="h-3 w-3" />
                      {service.rate}/{service.rateType === 'hourly' ? 'hr' : 'job'}
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEditService(service.id)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleDeleteService(service.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default WorkerServicesManager;