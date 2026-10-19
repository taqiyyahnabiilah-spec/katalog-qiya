import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Membuat koneksi client Supabase dengan sesi admin menggunakan cookie dan SUPABASE_PUBLISHABLE_KEY.
 * Digunakan untuk autentikasi (login, logout, ganti password) serta aksi admin.
 */
export async function createSessionClient() {
  const cookieStore = await cookies();

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY belum diatur. Pastikan kedua variabel tersebut sudah diisi di file .env.local."
    );
  }

  return createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Dipanggil saat rendering Server Component, perubahan cookie diabaikan
        }
      },
    },
  });
}

export const buatKoneksiSesi = createSessionClient;
export default createSessionClient;

