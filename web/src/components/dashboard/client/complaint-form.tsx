"use client";

import { useState, useTransition } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { fileComplaint } from "@/app/actions/complaint-actions";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CATEGORIES = ["Booking", "Payment", "Lawyer conduct", "Client conduct", "Case handling", "Technical issue", "Other"];

export function ComplaintForm() {
  const [pending, start] = useTransition();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  function submit() {
    start(async () => {
      const result = await fileComplaint({ subject, category, description });
      if (!result.ok) {
        toast.error("Could not file report", { description: result.error });
        return;
      }
      toast.success("Report filed", { description: "Wakeel360 support will review it from the admin dashboard." });
      setSubject("");
      setCategory("");
      setDescription("");
    });
  }

  return (
    <Card className="border-border/80 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Subject</Label>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Short summary" />
        </div>
        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label>Description</Label>
          <Textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell us what happened, including booking/case/payment references if relevant." />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={submit} disabled={pending} className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          File report
        </Button>
      </div>
    </Card>
  );
}

