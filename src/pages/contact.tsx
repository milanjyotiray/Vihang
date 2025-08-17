
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
import { insertNgoSchema, type InsertNgo } from "@/lib/schema";
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
      email: "",
      phone: "",
      website: "",
      description: "",
      focusAreas: [],
      city: "",
      state: "",
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
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with us to learn more about Vihang or to get support. We're here to help bridge communities with those who can make a difference.
          </p>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-poppins font-bold text-gray-900 mb-6">
                Contact Information
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-saffron/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-saffron" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact.vihang@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-indian-green/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-indian-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">+91 9678165375</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-sky-blue/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-sky-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                    <p className="text-gray-600">India</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Statement */}
            <div className="bg-gradient-to-br from-saffron/5 to-indian-green/5 p-6 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                Vihang connects communities with NGOs and volunteers, creating a bridge between those who need help and those ready to provide it. Every story shared brings us closer to building a more supportive society.
              </p>
            </div>
          </div>

          {/* NGO Registration Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  NGO & Volunteer Registration
                </CardTitle>
                <p className="text-gray-600">
                  Join our network to receive stories that match your areas of expertise and help communities across India.
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
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://your-website.com" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-website"
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

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your city" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State *</FormLabel>
                        <FormControl>
                          <Input placeholder="Your state" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="focusAreas"
                  render={() => (
                    <FormItem>
                      <FormLabel>Areas of Support *</FormLabel>
                      <div className="grid grid-cols-2 gap-3">
                        {supportAreas.map((area) => (
                          <FormField
                            key={area.id}
                            control={form.control}
                            name="focusAreas"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(area.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), area.id])
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
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
          </div>
        </div>

        {/* Additional Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
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
          <Card>
            <CardContent className="p-6 text-center">
              <HandHeart className="w-8 h-8 text-saffron mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Make Impact</h3>
              <p className="text-sm text-gray-600">
                Transform communities by providing the support and resources they need most.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
