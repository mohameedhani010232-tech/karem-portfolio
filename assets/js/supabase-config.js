/**
 * Supabase Cloud Configuration
 * Free, open-source Firebase alternative
 * Website: https://supabase.com
 */

// ============================================================================
// ⚠️ ضع إعدادات مشروع Supabase الخاص بك هنا (من Settings > API في Supabase Dashboard)
// ============================================================================
export const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";

// فحص ما إذا تم إدخال البيانات الحقيقية
export const isSupabaseConfigured = () => {
    return SUPABASE_URL && 
           !SUPABASE_URL.includes("YOUR_PROJECT_ID") &&
           SUPABASE_ANON_KEY && 
           !SUPABASE_ANON_KEY.includes("YOUR_SUPABASE_ANON_KEY");
};

// إنشاء عميل Supabase
let supabaseInstance = null;

export const getSupabaseClient = () => {
    if (supabaseInstance) return supabaseInstance;

    if (window.supabase && isSupabaseConfigured()) {
        try {
            supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            return supabaseInstance;
        } catch (err) {
            console.error("Error creating Supabase client:", err);
        }
    }
    return null;
};
