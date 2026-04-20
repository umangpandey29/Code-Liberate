/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged, 
  signOut, 
  User,
  browserPopupRedirectResolver 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  serverTimestamp,
  addDoc
} from 'firebase/firestore';
import { auth, db, googleProvider } from './lib/firebase';
import emailjs from '@emailjs/browser';
import { 
  LayoutDashboard, 
  LogOut, 
  Plus, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Upload,
  Send,
  X,
  FileText,
  Menu,
  User as UserIcon,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MarketingSite from './MarketingSite';

// --- Branding ---
const BRAND_LOGO = '/logo.png';
const BRAND_EMAIL = 'codeliberate2029@gmail.com';

// --- Types ---

interface Project {
  id: string;
  title: string;
  status: 'Active' | 'Completed' | 'In Review' | 'Planning';
  description: string;
  updatedAt: any;
}

interface RequestItem {
  id: string;
  projectName: string;
  type: string;
  message: string;
  status: string;
  createdAt: any;
}

// --- Components ---

const RequestModal = ({ 
  user, 
  onClose, 
  onSubmitSuccess 
}: { 
  user: User; 
  onClose: () => void;
  onSubmitSuccess: () => void;
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectName: '',
    type: 'Design Change',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Save to Firestore
      const requestData = {
        userId: user.uid,
        name: user.displayName || 'Client',
        email: user.email,
        projectName: formData.projectName,
        type: formData.type,
        message: formData.message,
        status: 'Pending',
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, 'requests'), requestData);

      // 2. Send via EmailJS (We use placeholders for Service/Template IDs)
      // The user will need to configure these in their EmailJS dashboard
      // Service ID: 'service_codeliberate'
      // Template ID: 'template_request'
      // Public Key: 'YOUR_PUBLIC_KEY'
      
      try {
        await emailjs.send(
          'service_codeliberate', // Suggest user to name it like this
          'template_request', 
          {
            from_name: user.displayName || 'Client',
            from_email: user.email,
            project_name: formData.projectName,
            request_type: formData.type,
            message: formData.message,
            to_email: 'codeliberate2029@gmail.com',
          },
          'YOUR_PUBLIC_KEY' // Suggest user to put their public key here
        );
      } catch (emailErr) {
        console.warn("EmailJS not configured yet, but data is saved in Firestore.", emailErr);
      }

      onSubmitSuccess();
      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-[#0f0f0f] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gold-500/20 p-2 rounded-xl">
              <MessageSquare className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Submit New Request</h2>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-medium">Professional Support</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Project Name</label>
              <input 
                required
                type="text"
                placeholder="e.g. ABC Clinic Website"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm"
                value={formData.projectName}
                onChange={(e) => setFormData({...formData, projectName: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Request Type</label>
              <select 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Design Change" className="bg-[#0f0f0f]">Design Change</option>
                <option value="Content Update" className="bg-[#0f0f0f]">Content Update</option>
                <option value="Bug Fix" className="bg-[#0f0f0f]">Bug Fix</option>
                <option value="General Question" className="bg-[#0f0f0f]">General Question</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Detailed Message</label>
              <textarea 
                required
                rows={4}
                placeholder="Describe your request in detail..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-gold-500/50 transition-all text-sm resize-none"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <div className="p-4 bg-gold-500/5 border border-gold-500/10 rounded-2xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-gold-200">Revision Policy</p>
                <p className="text-[10px] text-gray-400">We respond within 24 hours. Each request includes 2 rounds of revisions.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gold-500 hover:bg-gold-600 disabled:bg-gold-500/50 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all group"
          >
            {loading ? (
               <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
                <Sparkles className="w-5 h-5" />
               </motion.div>
            ) : (
              <>
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Submit Request
              </>
            )}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen bg-[#050505] luxury-gradient flex items-center justify-center">
    <motion.div 
      animate={{ 
        scale: [1, 1.08, 1],
        opacity: [0.85, 1, 0.85]
      }}
      transition={{ 
        scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
        opacity: { repeat: Infinity, duration: 2.2, ease: "easeInOut" }
      }}
      className="filter drop-shadow-[0_0_30px_rgba(212,175,55,0.35)]"
    >
      <img
        src={BRAND_LOGO}
        alt="Code Liberate"
        data-testid="loading-logo"
        className="w-28 h-28 object-contain"
      />
    </motion.div>
  </div>
);

const LoginView = ({ onLogin, authError, isAuthenticating }: { onLogin: () => void; authError?: string | null; isAuthenticating?: boolean; key?: string }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-gold-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-[440px] w-full z-10"
      >
        {/* Banner/Header */}
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block p-3 bg-gold-500/5 [border:1px_solid_rgba(212,175,55,0.2)] rounded-2xl mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]"
          >
            <img
              src={BRAND_LOGO}
              alt="Code Liberate"
              data-testid="login-brand-logo"
              className="w-16 h-16 object-contain"
            />
          </motion.div>
          <h1 className="text-4xl font-black text-white tracking-[0.05em] mb-3 uppercase">Code Liberate</h1>
          <p className="text-gold-500/80 text-[8px] sm:text-[9px] uppercase tracking-[0.3em] font-bold max-w-[280px] mx-auto leading-relaxed">
            We don't just build website. We build businesses
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0f0f0f]/60 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
          {/* Tabs */}
          <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
            <button 
              onClick={() => setMode('signin')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${mode === 'signin' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setMode('signup')}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-xl transition-all ${mode === 'signup' ? 'bg-white text-black shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h2>
              <p className="text-gray-500 text-xs">
                {mode === 'signin' ? 'Please authorize your account to continue.' : 'Create your secure account with Google.'}
              </p>
            </div>

            <button
              onClick={onLogin}
              disabled={isAuthenticating}
              data-testid="google-signin-button"
              className="w-full group relative flex items-center justify-center gap-3 bg-white hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed text-black font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform active:scale-[0.98] shadow-xl"
            >
              <img 
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
                alt="Google" 
                className="w-5 h-5"
                referrerPolicy="no-referrer"
              />
              <span>
                {isAuthenticating
                  ? 'Connecting to Google…'
                  : mode === 'signin' ? 'Continue with Google' : 'Sign up with Google'}
              </span>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-500/30 transition-all pointer-events-none" />
            </button>

            {authError && (
              <div
                data-testid="login-auth-error"
                role="alert"
                className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-2xl p-4 text-left"
              >
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-red-300 uppercase tracking-widest">Sign-in failed</p>
                  <p className="text-xs text-red-100/90 leading-relaxed">{authError}</p>
                </div>
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                <span className="bg-[#121212] px-4 text-gray-600">Secure Access</span>
              </div>
            </div>

            <p className="text-[11px] text-gray-500 text-center px-4 leading-relaxed">
              By continuing, you agree to our 
              <span className="text-white hover:underline cursor-pointer"> Terms of Service </span> 
              and 
              <span className="text-white hover:underline cursor-pointer"> Privacy Policy</span>.
            </p>
          </div>
        </div>

        {/* Footer badges */}
        <div className="mt-10 flex items-center justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Verified Portal</span>
          </div>
        </div>

        {/* Contact Email */}
        <div className="mt-6 flex items-center justify-center">
          <a
            href={`mailto:${BRAND_EMAIL}`}
            data-testid="login-footer-email"
            className="text-[10px] font-semibold text-gold-500/70 hover:text-gold-400 uppercase tracking-[0.25em] transition-colors"
          >
            {BRAND_EMAIL}
          </a>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project; key?: string }) => {
  const statusColors = {
    'Active': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Completed': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'In Review': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Planning': 'bg-gold-500/10 text-gold-400 border-gold-500/20',
  };

  const StatusIcon = {
    'Active': CheckCircle2,
    'Completed': CheckCircle2,
    'In Review': Clock,
    'Planning': AlertCircle,
  }[project.status];

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-[#0c0c0c] border border-gold-500/10 p-8 rounded-[32px] hover:border-gold-500/40 transition-all group gold-shadow"
    >
      <div className="flex justify-between items-start mb-6">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColors[project.status]} flex items-center gap-2`}>
          <StatusIcon className="w-3 h-3" />
          {project.status}
        </span>
        <button className="text-gray-600 hover:text-gold-400 transition-colors">
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>
      <h3 className="text-2xl font-serif font-bold text-white mb-3 group-hover:text-gold-400 transition-colors italic">
        {project.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-6">
        {project.description}
      </p>
      <div className="flex items-center justify-between text-xs text-gray-600 font-mono">
        <span>ID: {project.id.slice(0, 8)}</span>
        <span>MODIFIED: {project.updatedAt?.toDate?.()?.toLocaleDateString() || 'Just now'}</span>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const mapAuthError = (err: any): string => {
    const code = err?.code || '';
    switch (code) {
      case 'auth/unauthorized-domain':
        return `This domain (${window.location.hostname}) isn't on your Firebase "Authorized domains" list. Open Firebase Console → Authentication → Settings → Authorized domains → Add domain → paste the hostname → Save, then try again.`;
      case 'auth/operation-not-allowed':
        return 'Google Sign-In is not enabled on this Firebase project. Open Firebase Console → Authentication → Sign-in method → Google → toggle "Enable", set a support email, then Save.';
      case 'auth/popup-blocked':
        return 'Your browser blocked the Google popup. Allow popups for this site (click the popup-blocked icon in the URL bar) and click "Continue with Google" again, or we will automatically retry with a full-page redirect.';
      case 'auth/popup-closed-by-user':
        return 'The Google sign-in window was closed before finishing. Click "Continue with Google" again and complete the sign-in.';
      case 'auth/cancelled-popup-request':
        return 'Another sign-in attempt is already in progress. Please wait a moment and try once more.';
      case 'auth/network-request-failed':
        return 'Network error while contacting Google. Check your internet connection and try again.';
      case 'auth/internal-error':
        return 'Firebase returned an internal error. Please try again in a few seconds.';
      default:
        return `${err?.message || 'Unknown error'}${code ? ` (${code})` : ''}`;
    }
  };

  useEffect(() => {
    // Complete redirect-based sign-in if we came back from a redirect
    getRedirectResult(auth).catch((err) => {
      if (err?.code) {
        setAuthError(mapAuthError(err));
      }
    });

    // Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      try {
        if (u) {
          // Save user data to Firestore
          const userRef = doc(db, 'users', u.uid);
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            lastLogin: serverTimestamp(),
          }, { merge: true });

          setAuthError(null);
          setUser(u);
        } else {
          setUser(null);
          setProjects([]);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Project Subscription
    const q = query(collection(db, 'projects'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projs: Project[] = [];
      snapshot.forEach((doc) => {
        projs.push({ id: doc.id, ...doc.data() } as Project);
      });
      
      if (projs.length === 0 && !loading) {
        // Seed a welcome project if empty
        addDoc(collection(db, 'projects'), {
          userId: user.uid,
          title: "Welcome to Code Liberate",
          status: "Planning",
          description: "This is your personalized space where we'll track development, reviews, and launch milestones for your business.",
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      
      setProjects(projs);
    });

    return () => unsubscribe();
  }, [user, loading]);

  const handleLogin = async () => {
    if (isAuthenticating) return;
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (err: any) {
      console.error('Login Error:', err);
      const code = err?.code || '';
      // If popup was blocked, automatically fall back to full-page redirect (no popup needed)
      if (code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return; // browser is navigating away
        } catch (redirectErr: any) {
          setAuthError(mapAuthError(redirectErr));
        }
      } else {
        setAuthError(mapAuthError(err));
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => signOut(auth);

  if (loading) return <LoadingScreen />;

  // Allow public preview of the marketing site via ?preview=1 (or when signed out)
  const previewMode = typeof window !== 'undefined' && window.location.search.includes('preview=1');
  const showMarketing = !!user || previewMode;

  return (
    <div className="min-h-screen text-white font-sans selection:bg-gold-500/30">
      <AnimatePresence mode="wait">
        {!showMarketing ? (
          <LoginView key="login" onLogin={handleLogin} authError={authError} isAuthenticating={isAuthenticating} />
        ) : (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-black"
          >
            {/* Native Code Liberate Marketing Site (replaces external iframe) */}
            <MarketingSite
              onOpenMenu={() => setShowMenu(true)}
              onOpenPortal={() => {
                if (!user) {
                  // Preview mode: send to full login
                  window.location.href = window.location.pathname;
                } else {
                  setShowRequestModal(true);
                }
              }}
              onLeadSubmit={async (lead) => {
                await addDoc(collection(db, 'leads'), {
                  ...lead,
                  userId: user?.uid || 'anonymous-preview',
                  createdAt: serverTimestamp(),
                  status: 'New',
                });
              }}
            />

            {/* Elite Unified Hub Drawer - The 'Merged' Menu */}
            <AnimatePresence>
              {showMenu && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowMenu(false)}
                    className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[110]"
                  />
                  <motion.div 
                    initial={{ x: -100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -100, opacity: 0 }}
                    className="fixed inset-0 z-[120] flex flex-col items-center justify-center p-10"
                  >
                    <button 
                      onClick={() => setShowMenu(false)} 
                      data-testid="menu-close-btn"
                      className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-4"
                    >
                      <X className="w-10 h-10" />
                    </button>

                    {/* Unified Navigation List */}
                    <nav className="flex flex-col items-center gap-8 w-full max-w-md">
                      <div className="flex flex-col items-center mb-8">
                        <img
                          src={BRAND_LOGO}
                          alt="Code Liberate"
                          data-testid="menu-brand-logo"
                          className="w-20 h-20 object-contain mb-4 filter drop-shadow-[0_0_20px_rgba(212,175,55,0.35)]"
                        />
                        <p className="text-[16px] font-black tracking-[0.1em] text-white uppercase mb-2">Code Liberate</p>
                        <p className="text-gold-500/60 text-[7px] uppercase tracking-[0.4em] font-bold text-center leading-loose">
                          We don't just build website. We build businesses
                        </p>
                        <a
                          href={`mailto:${BRAND_EMAIL}`}
                          data-testid="menu-brand-email"
                          className="mt-3 text-[10px] font-semibold text-gold-400 hover:text-gold-300 uppercase tracking-[0.25em] transition-colors"
                        >
                          {BRAND_EMAIL}
                        </a>
                      </div>

                      <div className="flex flex-col items-center gap-4 w-full">
                        {[
                          { label: 'Home', href: '#top' },
                          { label: 'Work', href: '#work' },
                          { label: 'Pricing', href: '#pricing' },
                          { label: 'Contact', href: '#contact' },
                        ].map((link) => (
                          <button 
                            key={link.label}
                            onClick={() => {
                              document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' });
                              setShowMenu(false);
                            }}
                            className="text-4xl sm:text-6xl font-black text-white hover:text-gold-400 transition-all uppercase tracking-tighter font-serif italic"
                          >
                            {link.label}
                          </button>
                        ))}
                      </div>

                      <div className="w-24 h-[1px] bg-gold-500/20 my-8" />

                      {/* Portal Specific Hub Links */}
                      <div className="flex flex-col items-center gap-6 w-full">
                        <button 
                          onClick={() => {
                            setShowRequestModal(true);
                            setShowMenu(false);
                          }}
                          data-testid="menu-client-portal-btn"
                          className="bg-gold-400 text-black px-12 py-5 rounded-full font-black text-lg hover:bg-gold-300 transition-all shadow-[0_20px_40px_rgba(212,175,55,0.25)] active:scale-95 uppercase tracking-widest"
                        >
                          Client Portal
                        </button>

                        <button 
                          onClick={handleLogout}
                          data-testid="menu-signout-btn"
                          className="text-gray-500 hover:text-red-500 font-bold uppercase tracking-widest text-xs transition-colors p-4"
                        >
                          Sign Out Account
                        </button>
                      </div>
                    </nav>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showRequestModal && (
                <RequestModal 
                  user={user} 
                  onClose={() => setShowRequestModal(false)}
                  onSubmitSuccess={() => {
                    alert("Request submitted! We will respond within 24 hours.");
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

