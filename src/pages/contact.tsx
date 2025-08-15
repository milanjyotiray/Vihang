import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { contactService } from "@/lib/queryClient";
import { contactSchema, type Contact } from "@shared/schema";
import { Mail, MessageCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();

  const form = useForm<Contact>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: Contact) => {
      // Add validation before submission
      const result = contactSchema.safeParse(data);
      if (!result.success) {
        throw new Error('Please fill in all required fields correctly.');
      }
      return await contactService.submitContact(data);
    },
    onSuccess: () => {
      toast({
        title: "✅ Message Sent Successfully!",
        description: "Thank you for reaching out! We'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      console.error('Contact form error:', error);
      toast({
        title: "❌ Failed to Send Message",
        description: error.message || "Something went wrong. Please try again or contact us directly at contact.vihang@gmail.com",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Contact) => {
    contactMutation.mutate(data);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indian-green/10 to-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indian-green/10 rounded-full mb-6">
            <Mail className="w-8 h-8 text-indian-green" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Have questions, suggestions, or want to get involved? We'd love to hear from you!
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Send us a Message
            </CardTitle>
            <p className="text-gray-600">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your full name" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="your.email@example.com" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What's this about?" 
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us more about your message..."
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indian-green to-green-600 hover:from-indian-green/90 hover:to-green-600/90 text-white text-lg py-6"
                  disabled={contactMutation.isPending}
                >
                  <Mail className="w-5 h-5 mr-2" />
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Mail className="w-8 h-8 text-indian-green mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-sm text-gray-600">
                contact.vihang@gmail.com
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Phone className="w-8 h-8 text-indian-green mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-sm text-gray-600">
                +91 9678165375
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="w-8 h-8 text-indian-green mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Response Time</h3>
              <p className="text-sm text-gray-600">
                Within 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
