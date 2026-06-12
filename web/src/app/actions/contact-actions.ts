"use server";

import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { sendEmail, basicEmail } from "@/lib/email";

const contactSchema = z.object({
  fullName: z.string().min(3).max(120),
  email: z.string().email().max(160),
  topic: z.string().min(1).max(80),
  message: z.string().min(20).max(4000),
});

export interface ContactActionResult {
  ok: boolean;
  error?: string;
}

export async function submitContactMessage(input: z.infer<typeof contactSchema>): Promise<ContactActionResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check the form and try again." };

  const supabase = (await createClient()) as unknown as SupabaseClient;
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("contact_messages").insert({
    full_name: parsed.data.fullName,
    email: parsed.data.email,
    topic: parsed.data.topic,
    message: parsed.data.message,
    user_id: user?.id ?? null,
  });
  if (error) return { ok: false, error: error.message };

  const supportTo = process.env.SUPPORT_EMAIL;
  if (supportTo) {
    await sendEmail({
      to: supportTo,
      subject: `WakeelHub contact: ${parsed.data.topic}`,
      html: basicEmail(
        `New message from ${parsed.data.fullName}`,
        `${parsed.data.message}<br><br>Email: ${parsed.data.email}`
      ),
      text: `${parsed.data.message}\n\nEmail: ${parsed.data.email}`,
      idempotencyKey: `contact-${parsed.data.email}-${Date.now()}`,
    });
  }

  return { ok: true };
}
