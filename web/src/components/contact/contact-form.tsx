"use client";

import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { submitContactMessage } from "@/app/actions/contact-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const TOPICS = [
  { value: "general", label: "General inquiry" },
  { value: "support", label: "Account support" },
  { value: "lawyer", label: "Lawyer verification" },
  { value: "billing", label: "Billing & payments" },
  { value: "partnership", label: "Partnership / press" },
] as const;

const schema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address"),
  topic: z.string().min(1, "Select a topic"),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a bit more, at least 20 characters"),
});

type ContactValues = z.infer<typeof schema>;

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      topic: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactValues) {
    setSubmitting(true);

    try {
      const result = await submitContactMessage(values);

      if (!result.ok) {
        toast.error("Could not send message", {
          description: result.error,
        });
        return;
      }

      toast.success("Message sent", {
        description:
          "Our team will get back to you within one business day.",
      });

      form.reset();
    } catch {
      toast.error("Something went wrong", {
        description: "Please try again in a moment.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
        noValidate
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Full name
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    placeholder="Your full name"
                    autoComplete="name"
                    className="h-11 bg-background"
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
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email address
                </FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="h-11 bg-background"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-foreground">
                What can we help with?
              </FormLabel>

              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="h-11 w-full bg-background">
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  {TOPICS.map((topic) => (
                    <SelectItem key={topic.value} value={topic.value}>
                      {topic.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between gap-4">
                <FormLabel className="text-sm font-medium text-foreground">
                  Message
                </FormLabel>

                <span className="text-[11px] text-muted-foreground">
                  Minimum 20 characters
                </span>
              </div>

              <FormControl>
                <Textarea
                  {...field}
                  rows={6}
                  placeholder="Tell us how we can help..."
                  className="resize-none bg-background"
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 border-t border-border/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-muted-foreground">
            We&apos;ll only use your details to respond to your inquiry.
          </p>

          <Button
            type="submit"
            disabled={submitting}
            className="h-10 w-full px-5 sm:w-auto"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}

            {submitting ? "Sending..." : "Send message"}
          </Button>
        </div>
      </form>
    </Form>
  );
}