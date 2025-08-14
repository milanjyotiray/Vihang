import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertNgoSchema, type InsertNgo } from "@shared/schema";
import { HandHeart, Users, Heart, Building2 } from "lucide-react";

const supportAreas = [
  { id: "education", label: "Education" },
  { id: "health", label: "Health" },
  { id: "livelihood", label: "Livelihood" },
  { id: "infrastructure", label: "Infrastructure" },
  { id: "women-empowerment", label: "Women Empowerment" },
  { id: "child-welfare", label: "Child Welfare" },
  { id: "environmental", label: "Environmental" },
  { id: "other", label: "Other" },
];

export default function Contact() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertNgo>({
    resolver: zodResolver(insertNgoSchema),
    defaultValues: {
      name: "",
      organization: "",
      email: "",
      phone: "",
      supportArea: [],
      message: "",
    },
  });

  const registerNgoMutation = useMutation({
    mutationFn: async (data: InsertNgo) => {
      const response = await apiRequest("POST", "/api/ngos", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration Successful",
        description: "Thank you for joining our network! We'll be in touch soon with relevant stories and opportunities to help.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/ngos"] });
      form.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Registration Failed",
        description: error.message || "Failed to register. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNgo) => {
    registerNgoMutation.mutate(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indian-green/10 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indian-green/10 rounded-full mb-6">
            <HandHeart className="w-8 h-8 text-indian-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Join Our Network
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Are you an NGO, volunteer, or organization ready to make a difference? Register with us to receive relevant stories and opportunities to help communities across India.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indian-green mb-1">0</div>
              <div className="text-sm text-gray-600">NGOs Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indian-green mb-1">0</div>
              <div className="text-sm text-gray-600">Families Helped</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-indian-green mb-1">0</div>
              <div className="text-sm text-gray-600">Communities Served</div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              NGO & Volunteer Registration
            </CardTitle>
            <p className="text-gray-600">
              Fill out this form to join our network and start receiving stories that match your areas of expertise.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                            data-testid="input-contact-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="organization"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="NGO or organization name" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-organization"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            {...field}
                            data-testid="input-contact-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel" 
                            placeholder="+91 XXXXX XXXXX" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="supportArea"
                  render={() => (
                    <FormItem>
                      <FormLabel>Areas of Support *</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {supportAreas.map((area) => (
                          <FormField
                            key={area.id}
                            control={form.control}
                            name="supportArea"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, area.id])
                                        : field.onChange(
                                            field.value?.filter((value) => value !== area.id)
                                          );
                                    }}
                                    data-testid={`checkbox-support-${area.id}`}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal cursor-pointer">
                                  {area.label}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your organization and how you'd like to help communities..."
                          className="min-h-24"
                          {...field}
                          value={field.value || ""}
                          data-testid="textarea-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indian-green to-green-600 hover:from-indian-green/90 hover:to-green-600/90 text-white text-lg py-6"
                  disabled={registerNgoMutation.isPending}
                  data-testid="button-join-network"
                >
                  <HandHeart className="w-5 h-5 mr-2" />
                  {registerNgoMutation.isPending ? "Registering..." : "Join Our Network"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-indian-green mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Connect Directly</h3>
              <p className="text-sm text-gray-600">
                Get direct contact information for story authors to provide immediate assistance.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-indian-green mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Targeted Matching</h3>
              <p className="text-sm text-gray-600">
                Receive stories that match your areas of expertise and geographic focus.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
