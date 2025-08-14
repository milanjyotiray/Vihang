import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertStorySchema, type InsertStory, type Story } from "@shared/schema";
import { Feather, CheckCircle, Copy, Upload } from "lucide-react";

const indianStates = [
"Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Puducherry", "Chandigarh", "Andaman and Nicobar Islands", "Lakshadweep",
  "Dadra and Nagar Haveli and Daman and Diu"

];

export default function SubmitStory() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedStory, setSubmittedStory] = useState<Story | null>(null);
  const [wordCount, setWordCount] = useState(0);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertStory>({
    resolver: zodResolver(insertStorySchema),
    defaultValues: {
      name: "",
      email: "",
      city: "",
      state: "",
      category: undefined,
      title: "",
      story: "",
      photoUrl: "",
    },
  });

  // Auto detect location (city & state)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();

          const detectedCity = data.address.city || data.address.town || data.address.village || "";
          const detectedStateRaw = data.address.state || "";

          // Fuzzy state match
          const detectedState = indianStates.find(st =>
            detectedStateRaw.toLowerCase().includes(st.toLowerCase())
          ) || "";

          if (detectedCity) form.setValue("city", detectedCity);
          if (detectedState) form.setValue("state", detectedState.toLowerCase().replace(" ", "-"));

        } catch (err) {
          console.error("Location fetch error:", err);
        }
      });
    }
  }, [form]);

  const submitStoryMutation = useMutation({
    mutationFn: async (data: InsertStory) => {
      const response = await apiRequest("POST", "/api/stories", data);
      return response.json();
    },
    onSuccess: (story: Story) => {
      setSubmittedStory(story);
      setShowSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["/api/stories"] });
      form.reset();
      setWordCount(0);
      setMediaPreview(null);
      setMediaType(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertStory) => {
    submitStoryMutation.mutate(data);
  };

  const handleStoryChange = (value: string) => {
    const words = value.trim() === "" ? 0 : value.trim().split(/\s+/).length;
    setWordCount(words);
    form.setValue("story", value);
  };

  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const type = file.type.startsWith("image") ? "image" : file.type.startsWith("video") ? "video" : null;
    if (!type) {
      toast({ title: "Invalid file", description: "Please upload an image or video." });
      return;
    }

    setMediaType(type);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setMediaPreview(reader.result);
        form.setValue("photoUrl", reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyStoryLink = () => {
    if (submittedStory) {
      const link = `${window.location.origin}/story/${submittedStory.id}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied",
        description: "Story link has been copied to your clipboard.",
      });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-saffron/10 rounded-full mb-4">
            <Feather className="w-8 h-8 text-saffron" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-poppins font-bold text-gray-900 mb-4">
            Share Your Story
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us about the challenges your community faces. Your story could be the key to finding the help you need.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Story Submission Form</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                {/* Name & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="your.email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* City & State */}
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
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {indianStates.map((state) => (
                              <SelectItem key={state} value={state.toLowerCase().replace(" ", "-")}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="livelihood">Livelihood</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Give your story a descriptive title" maxLength={100} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Story */}
                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Your Story * <span className="text-sm text-gray-500">(Max 500 words)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the challenge..."
                          className="min-h-32"
                          maxLength={3000}
                          {...field}
                          onChange={(e) => handleStoryChange(e.target.value)}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center text-sm">
                        <FormMessage />
                        <span className={`${wordCount > 500 ? "text-red-500" : "text-gray-500"}`}>
                          {wordCount} / 500 words
                        </span>
                      </div>
                    </FormItem>
                  )}
                />

                {/* File Upload */}
                <div>
                  <FormLabel>Upload Image/Video (Optional)</FormLabel>
                  <div className="flex items-center gap-4 mt-2">
                    <Input type="file" accept="image/*,video/*" onChange={handleMediaUpload} />
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  {mediaPreview && (
                    <div className="mt-4">
                      {mediaType === "image" ? (
                        <img src={mediaPreview} alt="Preview" className="rounded-lg max-h-60 object-cover" />
                      ) : (
                        <video controls className="rounded-lg max-h-60">
                          <source src={mediaPreview} />
                        </video>
                      )}
                    </div>
                  )}
                </div>

                {/* Photo URL */}
                <FormField
                  control={form.control}
                  name="photoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo/Video URL (Optional)</FormLabel>
                      <FormControl>
                        <Input type="url" placeholder="https://example.com/media.jpg" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button type="submit" className="w-full bg-gradient-to-r from-saffron to-orange-500 text-white text-lg py-6" disabled={submitStoryMutation.isPending}>
                  <Feather className="w-5 h-5 mr-2" />
                  {submitStoryMutation.isPending ? "Submitting..." : "Submit Your Story"}
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  By submitting your story, you agree to our terms and allow us to share it publicly to connect you with potential helpers.
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Success Modal */}
        <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-indian-green/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-indian-green" />
              </div>
              <DialogTitle className="text-xl">Story Submitted Successfully!</DialogTitle>
            </DialogHeader>
            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Your story has been received and assigned ID:{" "}
                <strong className="text-saffron font-mono">{submittedStory?.id}</strong>
              </p>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Share this story:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-xs bg-white px-2 py-1 rounded border overflow-hidden">
                    {submittedStory ? `${window.location.origin}/story/${submittedStory.id}` : ""}
                  </code>
                  <Button size="sm" variant="outline" onClick={copyStoryLink}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <Button onClick={() => setShowSuccess(false)} className="w-full">
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
