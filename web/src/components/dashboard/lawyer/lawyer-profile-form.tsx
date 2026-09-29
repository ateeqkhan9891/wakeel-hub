"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { CITIES } from "@/lib/constants";
import type { Lawyer } from "@/lib/types";

const schema = z.object({
  city: z.string().min(1, "Select your city"),
  consultationFee: z
    .string()
    .min(1, "Enter your consultation fee")
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, "Enter a valid amount"),
  responseTime: z.string().min(2, "Enter your typical response time"),
  about: z.string().min(30, "Write at least 30 characters about your practice"),
});

type ProfileValues = z.infer<typeof schema>;

export function LawyerProfileForm({ lawyer }: { lawyer: Lawyer }) {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: lawyer.city,
      consultationFee: String(lawyer.consultationFee),
      responseTime: lawyer.responseTime,
      about: lawyer.about,
    },
  });

  function onSubmit() {
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Profile updated", { description: "Your changes are now visible on your public profile." });
    }, 700);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consultationFee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consultation fee (PKR)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} placeholder="e.g. 5000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="responseTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Typical response time</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Within a few hours" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="about"
          render={({ field }) => (
            <FormItem>
              <FormLabel>About your practice</FormLabel>
              <FormControl>
                <Textarea rows={5} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={submitting} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {submitting ? "Saving changes..." : "Save changes"}
        </Button>
      </form>
    </Form>
  );
}

