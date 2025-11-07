*** Begin Patch
*** Update File: lib/lib/supabaseClient.js
@@
-import { createClient } from '@supabase/supabase-js'
-
-const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
-const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
-
-export const supabase = createClient(supabaseUrl, supabaseAnonKey)
+import { createClient } from '@supabase/supabase-js'
+
+// These are expected to be injected by your environment (NEXT_PUBLIC_* so they are safe for client bundles)
+const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
+const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
+
+if (!supabaseUrl || !supabaseAnonKey) {
+  // Fail fast with a clear message so developers notice missing env vars during start/build
+  throw new Error(
+    'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables. ' +
+    'Make sure they are set in your environment, e.g. .env.local for local development.'
+  )
+}
+
+// Optional: pass additional options here (auth persistence, global headers, etc.)
+export const supabase = createClient(supabaseUrl, supabaseAnonKey)
*** End Patch
