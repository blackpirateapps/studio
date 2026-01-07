"use server";

import { z } from "zod";
import { addEntry as addEntryToDb } from "@/lib/db";
import { revalidatePath } from "next/cache";

const FormSchema = z.object({
  name: z.string({ invalid_type_error: "Please enter a name." }).min(1, { message: "Name is required." }),
  message: z.string().min(1, { message: "Message is required." }),
  website: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

export type State = {
  errors?: {
    name?: string[];
    message?: string[];
    website?: string[];
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
    return { message: "success", errors: {} };
  } catch (e) {
    console.error(e);
    return { 
        message: "error",
        errors: { _form: ['Database error: Failed to add entry.'] } as any,
    };
  }
}
