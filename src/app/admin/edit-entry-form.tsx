"use client";

import type { Entry } from "@/lib/db";
import { useActionState, useEffect, useRef, useState } from "react";
import { updateEntry } from "@/app/actions";
import { useFormStatus } from "react-dom";

type EditEntryFormProps = {
    entry: Entry;
    adminSecret: string;
};

const initialState = {
  message: "" as "error" | "success" | "",
  errors: undefined,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" aria-disabled={pending}>
      {pending ? "Updating..." : "Update Entry"}
    </button>
  );
}

export function EditEntryForm({ entry, adminSecret }: EditEntryFormProps) {
    const [state, formAction] = useActionState(updateEntry, initialState);
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state.message === "success") {
            setIsEditing(false);
        }
    }, [state]);

    if (!isEditing) {
        return (
             <div>
                <div className="entry-header">
                  <h3>
                    <span className="entry-name">{entry.name}</span>
                  </h3>
                  <p className="entry-date">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                 {entry.website && (
                    <a href={entry.website} target="_blank" rel="noopener noreferrer" className="entry-website">
                        {entry.website}
                    </a>
                )}
                <div className="entry-body">
                  <p>{entry.message}</p>
                </div>
                <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
        );
    }
    
    return (
        <form ref={formRef} action={formAction} className="guestbook-form">
            <input type="hidden" name="id" value={entry.id} />
            <input type="hidden" name="adminSecret" value={adminSecret} />

            <div className="form-row">
                <div className="form-field">
                  <label htmlFor={`name-${entry.id}`}>Name</label>
                  <input type="text" id={`name-${entry.id}`} name="name" required defaultValue={entry.name} />
                  {state.errors?.name && <p className="form-error">{state.errors.name[0]}</p>}
                </div>
                <div className="form-field">
                  <label htmlFor={`website-${entry.id}`}>Website (Optional)</label>
                  <input type="url" id={`website-${entry.id}`} name="website" defaultValue={entry.website || ''} />
                  {state.errors?.website && <p className="form-error">{state.errors.website[0]}</p>}
                </div>
            </div>
             <div className="form-field message-field">
                <label htmlFor={`message-${entry.id}`}>Message</label>
                <textarea id={`message-${entry.id}`} name="message" required defaultValue={entry.message} />
                {state.errors?.message && <p className="form-error">{state.errors.message[0]}</p>}
            </div>

            <div className="form-actions">
              <SubmitButton />
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
            {state.message === 'error' && state.errors?._form && <p className="form-status">{state.errors._form[0]}</p>}
        </form>
    )
}
