"use client";

import { useFormState, useFormStatus } from "react-dom";
import { addEntry } from "@/app/actions";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

const initialState = {
  message: "" as "error" | "success" | "",
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} className="w-full sm:w-auto">
      {pending ? "Signing..." : "Sign Guestbook"}
    </Button>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useFormState(addEntry, initialState);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message === "success") {
      toast({
        title: "Success!",
        description: "Your entry has been added to the guestbook.",
      });
      formRef.current?.reset();
    } else if (state.message === "error") {
        const errorMessages = state.errors ? Object.values(state.errors).flat().join(" ") : 'Please check your input and try again.';
        toast({
            variant: "destructive",
            title: "Oops! Something went wrong.",
            description: errorMessages,
        });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" required placeholder="Your Name" />
          {state.errors?.name && <p className="text-sm font-medium text-destructive">{state.errors.name[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input type="url" id="website" name="website" placeholder="https://your-site.com" />
          {state.errors?.website && <p className="text-sm font-medium text-destructive">{state.errors.website[0]}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required placeholder="Hello world!" />
        {state.errors?.message && <p className="text-sm font-medium text-destructive">{state.errors.message[0]}</p>}
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
