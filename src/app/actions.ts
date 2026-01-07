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

export type SeedState = {
  message: string;
}

export async function seedEntries(secret: string | null): Promise<SeedState> {
  if (secret !== process.env.ADMIN_SECRET) {
    return { message: "Unauthorized." };
  }

  const entriesEnv = process.env.SEED_ENTRIES;
  if (!entriesEnv) {
    return { message: "No seed data found in environment variables." };
  }

  try {
    const entries = JSON.parse(entriesEnv);
    if (!Array.isArray(entries)) {
        throw new Error("SEED_ENTRIES is not a JSON array.");
    }
    
    for (const entry of entries) {
      const { name, message, website } = entry;
      if (typeof name !== 'string' || typeof message !== 'string') {
        console.warn("Skipping invalid seed entry:", entry);
        continue;
      }
      await addEntryToDb({ name, message, website: website || null });
    }
    revalidatePath("/");
    return { message: "Seeding complete." };

  } catch (e) {
    console.error("Failed to seed entries:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred.";
    return { message: `Error seeding entries: ${errorMessage}` };
  }
}
