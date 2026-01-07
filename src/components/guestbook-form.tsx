"use client";

import { useFormStatus } from "react-dom";
import { addEntry } from "@/app/actions";
import { useEffect, useRef, useState, useActionState } from "react";

const initialState = {
  message: "" as "error" | "success" | "",
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? "Signing..." : "Sign Guestbook"}
    </button>
  );
}

export function GuestbookForm() {
  const [state, formAction] = useActionState(addEntry, initialState);
  const formRef = useRef<HTMLFormElement>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  useEffect(() => {
    if (state.message === "success") {
      setFormMessage("Your entry has been added to the guestbook.");
      formRef.current?.reset();
    } else if (state.message === "error") {
        const errorMessages = state.errors ? Object.values(state.errors).flat().join(" ") : 'Please check your input and try again.';
        setFormMessage(errorMessages);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="guestbook-form">
      <div className="form-row">
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" name="name" required placeholder="Your Name" />
          {state.errors?.name && <p className="form-error">{state.errors.name[0]}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="website">Website (Optional)</label>
          <input type="url" id="website" name="website" placeholder="https://your-site.com" />
          {state.errors?.website && <p className="form-error">{state.errors.website[0]}</p>}
        </div>
      </div>
      <div className="form-field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" required placeholder="Hello world!" />
        {state.errors?.message && <p className="form-error">{state.errors.message[0]}</p>}
      </div>
      <div className="form-actions">
        <SubmitButton />
      </div>
      {formMessage && <p className="form-status">{formMessage}</p>}
    </form>
  );
}
