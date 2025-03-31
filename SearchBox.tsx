import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';

interface SearchFormValues {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: string;
}

export default function SearchBox() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const form = useForm<SearchFormValues>({
    defaultValues: {
      destination: '',
      startDate: '',
      endDate: '',
      travelers: '2'
    }
  });

  const onSubmit = (data: SearchFormValues) => {
    // In a real app, we would likely redirect to a search results page
    // with query parameters
    console.log('Search data:', data);
    toast({
      title: "Searching destinations",
      description: `Looking for ${data.destination} for ${data.travelers} travelers`,
    });
    
    // Redirect to destinations page with query params
    setLocation(`/destinations?query=${encodeURIComponent(data.destination)}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
      <div className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Where do you want to go?</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-map-pin-line text-gray-400"></i>
                      </div>
                      <Input
                        {...field}
                        placeholder="Enter a destination"
                        className="pl-10"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="ri-calendar-line text-gray-400"></i>
                        </div>
                        <Input
                          {...field}
                          type="date"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Date</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <i className="ri-calendar-line text-gray-400"></i>
                        </div>
                        <Input
                          {...field}
                          type="date"
                          className="pl-10"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="travelers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Travelers</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <i className="ri-user-line text-gray-400"></i>
                      </div>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select number of travelers" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 traveler</SelectItem>
                          <SelectItem value="2">2 travelers</SelectItem>
                          <SelectItem value="3">3 travelers</SelectItem>
                          <SelectItem value="4">4 travelers</SelectItem>
                          <SelectItem value="5+">5+ travelers</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full py-6">
                <i className="ri-search-line mr-2"></i> Search Destinations
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
