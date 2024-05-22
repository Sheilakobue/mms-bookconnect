//import React from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@supabase/supabase-js/dist/module";

// Create a Supabase client instance using URL and API key
export const supabase = createClient(
  "https://yjapdyafcvnatxzkqtcx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqYXBkeWFmY3ZuYXR4emtxdGN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTA4Mjk1ODUsImV4cCI6MjAwNjQwNTU4NX0._xTjlSZw-oNqVs9A-3G9IygOHsknxVCR3FUmeJ1gZGk" // Supabase API key
);

// Define the Base component
export default function Base() {
  return (
    <div>
      {/* Render the Auth component for Supabase authentication */}
      <Auth
        supabaseClient={supabase} // Pass the Supabase client instance
        appearance={{ theme: ThemeSupa }} 
        theme="dark" 
      />
    </div>
  );
}
