import { createClient } from "@supabase/supabase-js";

/**
 * Membuat koneksi client Supabase di sisi server menggunakan SUPABASE_SECRET_KEY.
 * Digunakan untuk membaca data publik (seperti katalog produk dan detail produk)
 * yang melewati aturan Row Level Security (RLS) tanpa login pengunjung.
 */
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "SUPABASE_URL dan SUPABASE_SECRET_KEY belum diatur. Pastikan kedua variabel tersebut sudah diisi di file .env.local."
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export const buatKoneksiServer = createServerClient;
export default createServerClient;

