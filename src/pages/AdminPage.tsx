import { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Lock, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminPanel from '@/components/AdminPanel';
import { getApiUrl } from '@/lib/api';
import { getAssetUrl } from '@/lib/utils';

const ADMIN_AUTH_STORAGE_KEY = 'wawasan_admin_authenticated';
const ADMIN_PASSWORD_STORAGE_KEY = 'wawasan_admin_password';

export default function AdminPage() {
  const { t } = useLanguage();
  // Restore login state from localStorage so navigating away (e.g. the
  // Android back button) and returning doesn't force a re-login every time.
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true'
  );
  const [password, setPassword] = useState(
    () => localStorage.getItem(ADMIN_PASSWORD_STORAGE_KEY) || ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(getApiUrl('/api/admin/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsAuthenticated(true);
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
        localStorage.setItem(ADMIN_PASSWORD_STORAGE_KEY, password);
      } else {
        setError(t('wrong_password') || 'Invalid password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-charcoal flex flex-col">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 h-[72px] flex items-center justify-between px-6 md:px-12 bg-charcoal/95 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={getAssetUrl("/assets/wawasan_logo.jpg")}
              alt="Restoran Wawasan Logo"
              className="w-9 h-9 rounded-lg border border-white/10 shadow-md object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="font-display font-semibold text-xl text-deep-forest leading-none">
                Wawasan
              </span>
              <span className="block font-body text-xs text-deep-forest/60 leading-tight mt-0.5">
                Pak Usop
              </span>
            </div>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="text-deep-forest hover:text-warm-gold hover:bg-transparent">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('back')}
            </Button>
          </Link>
        </header>

        {/* Login Form */}
        <main className="flex-1 flex items-center justify-center px-4 pt-[72px]">
          <div className="w-full max-w-md">
            {/* Card */}
            <div className="bg-deep-brown rounded-2xl shadow-[0_8px_60px_rgba(0,0,0,0.4)] border border-warm-gold/10 overflow-hidden">
              {/* Decorative Top Bar */}
              <div className="h-1 bg-gradient-to-r from-warm-gold via-warm-gold/80 to-warm-gold/60" />
              
              <div className="p-8 md:p-10">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-warm-gold/10 flex items-center justify-center border border-warm-gold/20">
                    <Lock className="w-8 h-8 text-warm-gold" />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-3xl font-display font-bold text-deep-forest text-center mb-2">
                  {t('admin_login')}
                </h2>
                <p className="text-deep-forest/50 text-center text-sm mb-8">
                  Restricted Access • Staff Only
                </p>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-deep-forest/70 mb-2">
                      {t('password')}
                    </label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-charcoal/50 border-warm-gold/20 text-deep-forest placeholder:text-deep-forest/30 focus:border-warm-gold/50 focus:ring-warm-gold/20 h-12"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-warm-gold text-charcoal font-semibold hover:bg-[#E0BC74] transition-all duration-300 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('loading')}
                      </span>
                    ) : (
                      t('login')
                    )}
                  </Button>
                </form>

                {/* Security Note */}
                <p className="mt-6 text-center text-xs text-deep-forest/40">
                  This area is protected. Unauthorized access is prohibited.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Admin Dashboard
  return <AdminPanel adminPassword={password} />;
}
