
"use server";

import { z } from "zod";
import { addEntry as addEntryToDb, deleteEntry as deleteEntryFromDb, updateEntry as updateEntryInDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  name: z.string({ invalid_type_error: "Please enter a name." }).min(1, { message: "Name is required." }),
  message: z.string().min(1, { message: "Message is required." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

const UpdateFormSchema = FormSchema.extend({
    id: z.coerce.number(),
});

export type State = {
  errors?: {
    name?: string[];
    message?: string[];
    website?: string[];
    id?: string[];
  };
  message: "error" | "success" | "";
};

export async function addEntry(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = FormSchema.safeParse({
    name: formData.get("name"),
    message: formData.get("message"),
    website: formData.get("website"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "error",
    };
  }
  
  const dataToInsert = {
    ...validatedFields.data,
    website: validatedFields.data.website || null,
  }

  try {
    await addEntryToDb(dataToInsert);
    revalidatePath("/");
    revalidatePath("/admin");
    return { message: "success", errors: {} };
  } catch (e) {
    console.error(e);
    return { 
        message: "error",
        errors: { _form: ['Database error: Failed to add entry.'] } as any,
    };
  }
}

export async function updateEntry(prevState: State, formData: FormData): Promise<State> {
    if (process.env.NEXT_PUBLIC_ADMIN_SECRET !== formData.get("adminSecret")) {
        return { message: "error", errors: { _form: ["Unauthorized."] } as any };
    }

    const validatedFields = UpdateFormSchema.safeParse({
        id: formData.get("id"),
        name: formData.get("name"),
        message: formData.get("message"),
        website: formData.get("website"),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "error",
        };
    }

    try {
        await updateEntryInDb(validatedFields.data);
        revalidatePath("/");
        revalidatePath("/admin");
        return { message: "success", errors: {} };
    } catch (e) {
        console.error(e);
        return {
            message: "error",
            errors: { _form: ["Database error: Failed to update entry."] } as any,
        };
    }
}


export async function deleteEntry(formData: FormData) {
    if (process.env.NEXT_PUBLIC_ADMIN_SECRET !== formData.get("adminSecret")) {
        // This should be a proper error object, but for simplicity we'll keep it as a console log.
        console.error("Unauthorized delete attempt");
        return;
    }

    const id = Number(formData.get("id"));
    if (isNaN(id)) {
        console.error("Invalid ID for deletion");
        return;
    }

    try {
        await deleteEntryFromDb(id);
        revalidatePath("/");
        revalidatePath("/admin");
    } catch (e) {
        console.error("Failed to delete entry:", e);
    }
}
