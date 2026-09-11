import { useState } from 'react';
import { supabase } from '../../supabaseClient';

export default function SupabaseSetupHelper() {
  const [status, setStatus] = useState<string>('');
  const [credentials, setCredentials] = useState<{email: string, password: string} | null>(null);

  const createSuperAdmin = async () => {
    const email = 'superadmin@ilas.global';
    const password = 'SuperSecurePassword2026!'; // A secure password for the admin
    
    setStatus(`Creating Super Admin (${email})...`);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'Super Admin',
        }
      }
    });

    if (error) {
      setStatus(`Error creating Super Admin: ${error.message}`);
      setCredentials(null);
    } else {
      setStatus(`Successfully created Super Admin! Note: If email confirmation is enabled in Supabase, you must confirm the email before logging in.`);
      setCredentials({ email, password });
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm space-y-4 max-w-md mx-auto my-8">
      <h2 className="text-lg font-bold text-slate-800">Supabase Admin Setup</h2>
      <p className="text-sm text-slate-600">
        Use this button to quickly create the initial Super Admin account for your live deployment.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={createSuperAdmin}
          className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold hover:bg-slate-800 transition"
        >
          Create Super Admin Account
        </button>
      </div>

      {status && (
        <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 break-words">
          {status}
        </div>
      )}

      {credentials && (
        <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <h3 className="text-sm font-bold text-emerald-800 mb-2">Save these credentials:</h3>
          <div className="space-y-1 text-sm font-mono text-emerald-900">
            <p><strong>Email:</strong> {credentials.email}</p>
            <p><strong>Password:</strong> {credentials.password}</p>
          </div>
          <p className="text-xs text-emerald-700 mt-3 font-semibold">
            Please save this password securely. Once logged in, you should remove this setup component from the app for security.
          </p>
        </div>
      )}
    </div>
  );
}
