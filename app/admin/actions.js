"use server";

import { redirect } from "next/navigation";
import { createSessionClient } from "@/lib/supabase/session";

/**
 * Server Action untuk login admin menggunakan Supabase Auth.
 */
export async function login(prevState, formData) {
  const data = formData instanceof FormData ? formData : prevState;
  const email = data?.get?.("email")?.toString().trim();
  const password = data?.get?.("password")?.toString();

  if (!email || !password) {
    return { error: "Email dan password wajib diisi." };
  }

  let signInError = null;

  try {
    const supabase = await createSessionClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      signInError = error;
    }
  } catch (err) {
    return {
      error:
        err.message || "Terjadi kesalahan saat memproses login. Coba lagi.",
    };
  }

  if (signInError) {
    if (signInError.message.toLowerCase().includes("invalid login credentials")) {
      return { error: "Email atau password salah." };
    }
    return { error: signInError.message };
  }

  redirect("/admin");
}

/**
 * Server Action untuk logout admin (mengakhiri sesi).
 */
export async function logout() {
  try {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  } catch (err) {
    console.error("Gagal mengakhiri sesi:", err);
  }

  redirect("/admin/login");
}

export const keluar = logout;

