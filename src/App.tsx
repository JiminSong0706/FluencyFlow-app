/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  MapPin, 
  ShoppingBag, 
  Utensils, 
  Plane, 
  MessageSquare, 
  Send, 
  RefreshCcw,
  Info,
  Sparkles,
  User,
  Bot,
  BookOpen,
  Coffee,
  History as HistoryIcon,
  Gamepad2,
  CheckCircle2,
  XCircle,
  Mic,
  MicOff,
  Volume2,
  Activity,
  Package,
  Trophy,
  ArrowLeft,
  AlertCircle,
  X,
  TrendingUp,
  Lightbulb,
  Clock,
  Heart,
  BrainCircuit,
  BarChart3,
  Target,
  Zap,
  Star,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { cn } from './lib/utils';
import { Level, Scenario, Strategy, Message, Stage, SessionResult, UserRole } from './types';
import { LEVELS, STRATEGIES, SCENARIOS, FREE_SPEAKING_TOPICS } from './constants';
import { getTutorResponse, analyzeStrategies, generateSessionFeedback, transcribeAudio } from './services/gemini';
import ReactMarkdown from 'react-markdown';
import { StatsDashboard } from './components/StatsDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { StrategyGame } from './components/StrategyGame';

import { doc, getDoc, setDoc, updateDoc, collection, query, orderBy, onSnapshot, addDoc, deleteDoc, serverTimestamp, increment } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, db, loginWithGoogle, logout, subscribeToAuth, handleFirestoreError, testFirebaseConnection, loginWithEmail, signUpWithEmail, OperationType } from './services/firebase';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Loader2, LogOut } from 'lucide-react';

const ornamentImage = null; // Removed

const OrnamentImage = ({ id, className }: { id: string; className?: string }) => {
  const baseClass = cn("w-full h-full drop-shadow-sm", className);
  
  switch (id) {
    case 'star':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <defs>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>
          <path d="M50 5 L63 35 L95 35 L70 55 L80 85 L50 65 L20 85 L30 55 L5 35 L37 35 Z" fill="url(#starGrad)" stroke="#92400e" strokeWidth="2" strokeLinejoin="round" />
          <circle cx="42" cy="48" r="3" fill="#451a03" />
          <circle cx="58" cy="48" r="3" fill="#451a03" />
          <path d="M46 56 Q50 60 54 56" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'bell':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M30 80 Q30 30 50 30 Q70 30 70 80 L30 80" fill="#facc15" stroke="#854d0e" strokeWidth="2" />
          <circle cx="50" cy="85" r="8" fill="#854d0e" />
          <path d="M35 35 Q50 20 65 35" stroke="#ef4444" strokeWidth="6" fill="none" strokeLinecap="round" />
          <circle cx="42" cy="55" r="2.5" fill="#451a03" />
          <circle cx="58" cy="55" r="2.5" fill="#451a03" />
          <path d="M47 62 Q50 65 53 62" stroke="#451a03" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'gift':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <rect x="25" y="40" width="50" height="45" rx="5" fill="#ec4899" stroke="#9d174d" strokeWidth="2" />
          <rect x="45" y="40" width="10" height="45" fill="#5eead4" />
          <path d="M25 55 L75 55" stroke="#5eead4" strokeWidth="4" />
          <path d="M50 40 Q40 25 35 35 Q30 45 50 40 Q70 25 65 35 Q60 45 50 40" fill="#f472b6" stroke="#9d174d" strokeWidth="2" />
          <circle cx="42" cy="65" r="2.5" fill="white" />
          <circle cx="58" cy="65" r="2.5" fill="white" />
          <path d="M47 72 Q50 75 53 72" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      );
    case 'ball':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <circle cx="50" cy="55" r="35" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
          <circle cx="35" cy="40" r="10" fill="white" fillOpacity="0.3" />
          <path d="M35 60 L65 60 M50 45 L50 75" stroke="#14532d" strokeWidth="4" strokeOpacity="0.2" />
          <circle cx="42" cy="55" r="3" fill="#064e3b" />
          <circle cx="58" cy="55" r="3" fill="#064e3b" />
          <path d="M47 63 Q50 67 53 63" stroke="#064e3b" strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="45" y="15" width="10" height="10" rx="2" fill="#94a3b8" />
        </svg>
      );
    case 'light':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M50 30 Q70 40 70 65 Q70 85 50 85 Q30 85 30 65 Q30 40 50 30" fill="#fbbf24" stroke="#92400e" strokeWidth="2" />
          <rect x="42" y="20" width="16" height="15" rx="2" fill="#475569" />
          <circle cx="42" cy="60" r="3" fill="#451a03" />
          <circle cx="58" cy="60" r="3" fill="#451a03" />
          <path d="M47 68 Q50 72 53 68" stroke="#451a03" strokeWidth="2" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="60" r="25" fill="white" fillOpacity="0.2" />
        </svg>
      );
    case 'candy':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <path d="M60 85 L60 35 Q60 15 40 15 Q20 15 20 30" fill="none" stroke="#ef4444" strokeWidth="14" strokeLinecap="round" />
          <path d="M60 85 L60 35 Q60 15 40 15 Q20 15 20 30" fill="none" stroke="white" strokeWidth="14" strokeLinecap="round" strokeDasharray="10 10" />
          <circle cx="53" cy="45" r="2" fill="#451a03" />
          <circle cx="43" cy="35" r="2" fill="#451a03" />
        </svg>
      );
    case 'snow':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          <g stroke="#7dd3fc" strokeWidth="4" strokeLinecap="round">
            <line x1="50" y1="20" x2="50" y2="80" />
            <line x1="24" y1="35" x2="76" y2="65" />
            <line x1="24" y1="65" x2="76" y2="35" />
          </g>
          <circle cx="50" cy="50" r="10" fill="white" stroke="#7dd3fc" strokeWidth="2" />
          <circle cx="46" cy="48" r="1.5" fill="#0369a1" />
          <circle cx="54" cy="48" r="1.5" fill="#0369a1" />
          <path d="M48 53 Q50 55 52 53" stroke="#0369a1" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'gingerbread':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          {/* Body */}
          <path d="M50 20 Q60 20 60 30 Q60 40 50 40 Q40 40 40 30 Q40 20 50 20" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <path d="M40 35 L25 45 Q20 50 25 55 L40 45" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <path d="M60 35 L75 45 Q80 50 75 55 L60 45" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          <path d="M45 40 L35 75 Q30 85 40 85 L50 75 L60 85 Q70 85 65 75 L55 40" fill="#92400e" stroke="#451a03" strokeWidth="2" />
          {/* Icing */}
          <path d="M30 48 L35 45 M65 45 L70 48" stroke="white" strokeWidth="2" strokeLinecap="round" />
          <path d="M40 78 L45 78 M55 78 L60 78" stroke="white" strokeWidth="2" strokeLinecap="round" />
          {/* Face */}
          <circle cx="46" cy="28" r="1.5" fill="white" />
          <circle cx="54" cy="28" r="1.5" fill="white" />
          <path d="M48 33 Q50 35 52 33" stroke="white" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'rudolph':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          {/* Antlers */}
          <path d="M35 35 L25 20 M30 30 L20 30" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 35 L75 20 M70 30 L80 30" stroke="#451a03" strokeWidth="3" strokeLinecap="round" />
          {/* Head */}
          <circle cx="50" cy="55" r="30" fill="#b45309" stroke="#451a03" strokeWidth="2" />
          {/* Nose */}
          <circle cx="50" cy="65" r="8" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          {/* Eyes */}
          <circle cx="40" cy="50" r="2.5" fill="#451a03" />
          <circle cx="60" cy="50" r="2.5" fill="#451a03" />
          <path d="M47 58 Q50 60 53 58" stroke="#451a03" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'santa_orn':
      return (
        <svg viewBox="0 0 100 100" className={baseClass}>
          {/* Beard */}
          <circle cx="50" cy="65" r="25" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {/* Face */}
          <circle cx="50" cy="50" r="20" fill="#fee2e2" />
          {/* Hat */}
          <path d="M30 45 L50 15 L70 45 Z" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
          <rect x="28" y="42" width="44" height="8" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          <circle cx="50" cy="15" r="5" fill="white" stroke="#e2e8f0" strokeWidth="1" />
          {/* Face */}
          <circle cx="44" cy="50" r="2" fill="#451a03" />
          <circle cx="56" cy="50" r="2" fill="#451a03" />
          <path d="M48 56 Q50 58 52 56" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        </svg>
      );
    default:
      return <Sparkles className={className} />;
  }
};

export default function App() {
  const [stage, setStage] = useState<Stage>('Lobby');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authForm, setAuthForm] = useState({ id: '', password: '', name: '', role: 'student' as UserRole, verificationCode: '' });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const currentInputRef = useRef('');

  useEffect(() => {
    currentInputRef.current = inputValue;
  }, [inputValue]);
  const [allStrategiesUsed, setAllStrategiesUsed] = useState<string[]>([]);
  const [sessionResult, setSessionResult] = useState<SessionResult | null>(null);
  const [history, setHistory] = useState<SessionResult[]>([]);
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showTopicSuggestions, setShowTopicSuggestions] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameFeedback, setGameFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRealTimeBlocked, setIsRealTimeBlocked] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const micLevelRef = useRef(0);
  const peakMicLevelRef = useRef(0);
  const [micError, setMicError] = useState<{ type: 'permission-denied' | 'general-error'; message?: string } | null>(null);
  const [appError, setAppError] = useState<{ title: string; message: string } | null>(null);
  const [showMicModal, setShowMicModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceSettings, setVoiceSettings] = useState({
    gender: 'female' as 'female' | 'male',
    accent: 'en-US' as 'en-US' | 'en-GB'
  });
  const [collectedItems, setCollectedItems] = useState<string[]>([]);
  const [treeDecorations, setTreeDecorations] = useState<{ id?: string; itemId: string; x: number; y: number }[]>([]);
  const INITIAL_INVENTORY = {
    star: 0,
    bell: 1,
    gift: 1,
    ball: 1,
    light: 1,
    gingerbread: 1,
    rudolph: 1,
    santa_orn: 1
  };
  const [ornamentInventory, setOrnamentInventory] = useState<Record<string, number>>(INITIAL_INVENTORY);
  const [lastEarnedOrnament, setLastEarnedOrnament] = useState<string | null>(null);
  const [isAudioBlocked, setIsAudioBlocked] = useState(false);
  const lastActivityTimeRef = useRef<number>(Date.now());
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const baseTextRef = useRef<string>('');
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isFinishingRef = useRef(false);
  const treeRef = useRef<HTMLDivElement>(null);
  const pendingSendRef = useRef(false);

  // Silence Monitor
  useEffect(() => {
    if (!['Stage1', 'Stage2', 'FreeSpeaking'].includes(stage)) {
      setShowTopicSuggestions(false);
      return;
    }
    
    // Reset activity time on any state that indicates activity
    if (isTyping || isSpeaking || isRecording || isTranscribing) {
      lastActivityTimeRef.current = Date.now();
      setShowTopicSuggestions(false);
    }
  }, [isTyping, isSpeaking, isRecording, isTranscribing, messages, stage]);

  // Scroll to top on stage change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [stage]);

  const [lastEncouragementIndex, setLastEncouragementIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!['Stage1', 'Stage2', 'FreeSpeaking'].includes(stage)) return;

    const interval = setInterval(() => {
      // Don't encourage if currently active
      if (isTyping || isSpeaking || isRecording || isTranscribing) return;

      const lastMsg = messages[messages.length - 1];
      const hasUserSpoken = messages.some(m => m.role === 'user');
      
      if (!lastMsg || lastMsg.role === 'user' || !hasUserSpoken) return; // Wait for AI, user spoke, OR ensure user has spoken at least once in session

      const elapsed = Date.now() - lastActivityTimeRef.current;
      if (elapsed >= 15000) { // Changed to 15 seconds
        // Varied encouragement messages
        const messagesPool = level === 'Beginner' 
          ? [
              "Don't be shy! You can try to say something.",
              "I'm listening. Anything is fine!",
              "Is there anything else you want to say?",
              "Take your time, I'm here for you."
            ]
          : [
              "Take your time, but try to keep the conversation going! What do you think?",
              "Don't worry about making mistakes. Just keep talking!",
              "I'd love to hear more about that. Any thoughts?",
              "You're doing great! Keep the flow going.",
              "What else comes to mind in this situation?"
            ];
        
        let nextIndex;
        do {
          nextIndex = Math.floor(Math.random() * messagesPool.length);
        } while (nextIndex === lastEncouragementIndex && messagesPool.length > 1);

        const encouragement = messagesPool[nextIndex];
        setLastEncouragementIndex(nextIndex);
        
        const aiMsg: Message = {
          id: crypto.randomUUID(),
          role: 'ai',
          content: encouragement,
          timestamp: Date.now(),
          isIntervention: true
        };
        
        setMessages(prev => [...prev, aiMsg]);
        speak(encouragement);
        lastActivityTimeRef.current = Date.now();
      }

      // Special handling for Topic Suggestions in FreeSpeaking
      if (stage === 'FreeSpeaking') {
        if (elapsed >= 20000 && !showTopicSuggestions) {
          setShowTopicSuggestions(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, isTyping, isSpeaking, isRecording, isTranscribing, messages, level, lastEncouragementIndex]);

  // Firebase Setup & Sync
  useEffect(() => {
    testFirebaseConnection();
    const unsubscribe = subscribeToAuth(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch role
        const userPath = `users/${currentUser.uid}`;
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = (userData.role === 'teacher' || currentUser.email === 'jimin6345@snu.ac.kr' || currentUser.email === 'chaewon2681@snu.ac.kr') ? 'teacher' : 'student';
            setUserRole(role as UserRole);
            if (role === 'teacher') {
              setStage('AdminDashboard');
            }
          } else if (currentUser.email === 'jimin6345@snu.ac.kr' || currentUser.email === 'chaewon2681@snu.ac.kr') {
            // First time login for teacher email
            setUserRole('teacher');
            setStage('AdminDashboard');
          }
        } catch (e) {
          console.error("Error fetching user role", e);
          handleFirestoreError(e, OperationType.GET, userPath);
          if (currentUser.email === 'jimin6345@snu.ac.kr' || currentUser.email === 'chaewon2681@snu.ac.kr') {
            setUserRole('teacher');
            setStage('AdminDashboard');
          }
        }
      } else {
        setUserRole('student');
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Sync Profile
  useEffect(() => {
    if (!user) {
      setCollectedItems([]);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.role) {
          setUserRole(data.role as UserRole);
        }
        if (data.collectedItems) {
          setCollectedItems(data.collectedItems);
        }
        if (data.ornamentInventory) {
          setOrnamentInventory(data.ornamentInventory);
        }
      } else {
        // Init profile
        const isTeacher = user.email === 'jimin6345@snu.ac.kr' || user.email === 'chaewon2681@snu.ac.kr';
        setDoc(userRef, {
          userId: user.uid,
          email: user.email,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          role: isTeacher ? 'teacher' : 'student',
          collectedItems: [],
          sessionsCount: 0,
          ornamentInventory: INITIAL_INVENTORY,
          updatedAt: new Date().toISOString()
        }).catch(err => handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}`));
      }
    }, (err) => handleFirestoreError(err, OperationType.GET, `users/${user.uid}`));

    return () => unsub();
  }, [user]);

  // Sync Sessions History
  useEffect(() => {
    if (!user) {
      setHistory([]);
      return;
    }

    const sessionsRef = collection(db, 'users', user.uid, 'sessions');
    const q = query(sessionsRef, orderBy('timestamp', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as SessionResult));
      setHistory(docs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/sessions`));

    return () => unsub();
  }, [user]);

  // Sync Tree Decorations
  useEffect(() => {
    if (!user) {
      setTreeDecorations([]);
      return;
    }

    const decorationsRef = collection(db, 'users', user.uid, 'decorations');
    const unsub = onSnapshot(decorationsRef, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as any));
      setTreeDecorations(docs);
    }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${user.uid}/decorations`));

    return () => unsub();
  }, [user]);

  // Tree Ornaments Constants and Handlers
  const handleLogin = async () => {
    setShowAuthModal(true);
    setAuthMode('login');
    setAuthError(null);
  };

  const handleSignUp = () => {
    setShowAuthModal(true);
    setAuthMode('register');
    setAuthError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSubmitting(true);

    try {
      if (authMode === 'register') {
        if (authForm.role === 'teacher' && authForm.verificationCode !== 'asdf') {
          throw new Error("Invalid teacher verification code. Please contact the administrator.");
        }
        const res = await signUpWithEmail(authForm.id, authForm.password, authForm.name);
        // Save role to firestore
        try {
          await setDoc(doc(db, 'users', res.user.uid), {
            userId: res.user.uid,
            email: res.user.email || authForm.id,
            name: authForm.name,
            role: authForm.role,
            collectedItems: [],
            sessionsCount: 0,
            ornamentInventory: INITIAL_INVENTORY,
            updatedAt: new Date().toISOString()
          });
        } catch (e) {
          handleFirestoreError(e, OperationType.CREATE, `users/${res.user.uid}`);
        }
        
        setAuthForm({ id: '', password: '', name: '', role: 'student', verificationCode: '' });
        if (authForm.role === 'teacher') {
          setStage('AdminDashboard');
        } else {
          setStage('LevelSelect');
        }
      } else {
        const res = await loginWithEmail(authForm.id, authForm.password);
        // Fetch role from firestore
        const userDoc = await getDoc(doc(db, 'users', res.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setAuthForm({ id: '', password: '', name: '', role: 'student', verificationCode: '' });
          if (userData.role === 'teacher') {
            setStage('AdminDashboard');
          } else {
            setStage('LevelSelect');
          }
        } else {
          setAuthForm({ id: '', password: '', name: '', role: 'student', verificationCode: '' });
          setStage('LevelSelect');
        }
      }
      setShowAuthModal(false);
    } catch (err: any) {
      console.error("Auth error:", err);
      let msg = err.message || "An error occurred. Please check your credentials.";
      
      // Friendly translations for common Firebase errors
      const errCode = err.code || (err.message?.includes('auth/') ? err.message.match(/auth\/[a-z-]+/)?.[0] : null);

      if (errCode === 'auth/user-not-found' || errCode === 'auth/invalid-credential') 
        msg = authMode === 'login' 
          ? "Invalid ID or password. If you haven't joined yet, please 'Step Inside' first!" 
          : "Could not create account. This ID might be invalid or already taken.";
      else if (errCode === 'auth/wrong-password') msg = "Incorrect password. Please try again.";
      else if (errCode === 'auth/invalid-email') msg = "The ID format is not supported. Please use letters and numbers.";
      else if (err.code === 'auth/email-already-in-use') msg = "This ID is already registered. Try logging in.";
      else if (err.code === 'auth/weak-password') msg = "Password should be at least 6 characters.";
      else if (err.code === 'auth/operation-not-allowed') msg = "Email login is not enabled in Firebase Console. Please enable 'Email/Password' in the Auth settings or use 'Sign in with Google'.";
      else if (err.code === 'auth/popup-blocked') msg = "Popup was blocked. Please allow popups for this site.";
      
      setAuthError(msg);
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setShowLogoutConfirm(false);
      setStage('Lobby');
    } catch (error) {
      console.error("Logout failed", error);
      setShowLogoutConfirm(false);
    }
  };

  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const dragSoundRef = useRef<HTMLAudioElement | null>(null);
  const dropSoundRef = useRef<HTMLAudioElement | null>(null);
  const rewardSoundRef = useRef<HTMLAudioElement | null>(null);
  const audioInitializedRef = useRef(false);

  const SFX_URLS = {
    click: 'https://www.soundjay.com/buttons/sounds/button-16.mp3',
    drag: 'https://www.soundjay.com/misc/sounds/paper-shuffle-1.mp3',
    drop: 'https://www.soundjay.com/misc/sounds/stone-drop-1.mp3',
    reward: 'https://www.soundjay.com/misc/sounds/magic-chime-01.mp3'
  } as const;

  const initSFX = () => {
    if (audioInitializedRef.current) return;
    
    const setup = (url: string, volume = 0.4) => {
      const audio = new Audio();
      audio.src = url;
      audio.volume = volume;
      audio.preload = 'auto';
      audio.load();
      return audio;
    };

    clickSoundRef.current = setup(SFX_URLS.click, 0.4);
    dragSoundRef.current = setup(SFX_URLS.drag, 0.3);
    dropSoundRef.current = setup(SFX_URLS.drop, 0.4);
    rewardSoundRef.current = setup(SFX_URLS.reward, 0.5);
    
    audioInitializedRef.current = true;
    console.log("SFX Initialized");
  };

  // Initialize Speech Synthesis
  useEffect(() => {
    synthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      if (synthRef.current) {
        setVoices(synthRef.current.getVoices());
      }
    };

    loadVoices();
    if (synthRef.current && synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const playClickSound = () => {
    if (!audioInitializedRef.current) initSFX();
    if (clickSoundRef.current) {
      const sound = clickSoundRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(() => {});
    }
  };

  const playDragSound = () => {
    if (!audioInitializedRef.current) initSFX();
    if (dragSoundRef.current) {
      const sound = dragSoundRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.3;
      sound.play().catch(() => {});
    }
  };

  const playDropSound = () => {
    if (!audioInitializedRef.current) initSFX();
    if (dropSoundRef.current) {
      const sound = dropSoundRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.4;
      sound.play().catch(() => {});
    }
  };

  const playRewardSound = () => {
    if (!audioInitializedRef.current) initSFX();
    if (rewardSoundRef.current) {
      const sound = rewardSoundRef.current.cloneNode() as HTMLAudioElement;
      sound.volume = 0.5;
      sound.play().catch(() => {});
    }
  };

  const speak = (text: string) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Clean text from markdown for better speech
    const cleanText = text.replace(/[*_#`~]/g, '').replace(/\[.*?\]\(.*?\)/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    
    // Find a suitable voice based on settings
    const currentVoices = voices.length > 0 ? voices : synthRef.current.getVoices();
    const accentPrefix = voiceSettings.accent.toLowerCase().replace('_', '-').split('-')[0]; // 'en'
    const fullAccent = voiceSettings.accent.toLowerCase().replace('_', '-'); // 'en-us' or 'en-gb'

    const filteredVoices = currentVoices.filter(v => {
      const lang = v.lang.toLowerCase().replace('_', '-');
      return lang.startsWith(fullAccent) || (lang.startsWith(accentPrefix) && lang.includes(fullAccent.split('-')[1]));
    });
    
    // Priority lists for matching
    const femaleNames = ['female', 'samantha', 'zira', 'hazel', 'susan', 'moira', 'tessa', 'victoria', 'aria', 'jenny', 'karen', 'serena', 'fiona', 'nava', 'monica', 'elsa', 'kate', 'mary', 'anna', 'martha', 'ellie', 'lisa', 'rachel', 'amy', 'sara'];
    const maleNames = ['male', 'alex', 'david', 'george', 'daniel', 'oliver', 'guy', 'stefan', 'james', 'robert', 'clarke', 'thomas', 'peter', 'andrew', 'marco', 'mark', 'tom', 'patrick', 'harry', 'charlie', 'william', 'henry', 'jack'];

    // Gender matching helper
    const isFemale = (name: string) => femaleNames.some(fn => name.includes(fn));
    const isMale = (name: string) => maleNames.some(mn => name.includes(mn));
    const matchesGender = (name: string) => voiceSettings.gender === 'female' ? isFemale(name) : isMale(name);
    
    // STEP 1: Best Match (Accent + Gender + Quality)
    let selectedVoice = filteredVoices.find(v => {
      const name = v.name.toLowerCase();
      const isNatural = name.includes('natural') || name.includes('google') || name.includes('premium') || name.includes('enhanced') || name.includes('microsoft');
      return isNatural && matchesGender(name);
    });

    // STEP 2: Good Match (Accent + Gender)
    if (!selectedVoice) {
      selectedVoice = filteredVoices.find(v => matchesGender(v.name.toLowerCase()));
    }

    // STEP 3: Flexible Match (Gender only, any accent)
    if (!selectedVoice) {
      selectedVoice = currentVoices.find(v => {
        const name = v.name.toLowerCase();
        const isNatural = name.includes('natural') || name.includes('google') || name.includes('premium') || name.includes('enhanced') || name.includes('microsoft');
        return isNatural && matchesGender(name);
      });
    }

    if (!selectedVoice) {
      selectedVoice = currentVoices.find(v => matchesGender(v.name.toLowerCase()));
    }

    // STEP 4: Fallback to Accent (If gender can't be matched)
    if (!selectedVoice && filteredVoices.length > 0) {
      selectedVoice = filteredVoices[0];
    }

    // STEP 5: Final Fallback
    if (!selectedVoice && currentVoices.length > 0) {
      selectedVoice = currentVoices[0];
    }
    if (selectedVoice) {
      console.log(`TTS: Selected Voice: ${selectedVoice.name} (${selectedVoice.lang}) for settings: ${voiceSettings.gender}, ${voiceSettings.accent}`);
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = voiceSettings.accent;
    }
    
    // Friendly & Lively Settings
    // Slightly higher pitch and natural rate makes it sound more enthusiastic and friendly
    utterance.pitch = 1.15; 
    utterance.rate = 0.95; 
    
    // Adjust based on content for a bit more "life"
    if (cleanText.includes('!') || cleanText.includes('?')) {
      utterance.rate = 1.0; // Faster for excited/questioning sentences
      utterance.pitch = 1.2; // Higher pitch for enthusiasm
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    currentUtteranceRef.current = utterance;
    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Initialize Speech Recognition (Legacy - now handled on demand in toggleRecording)
  useEffect(() => {
    // We still keep the ref check but move the logic to toggleRecording for better reliability
  }, []);

  const toggleRecording = async (shouldSendAfter: boolean = false) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (isRecording) {
      await stopRecording(shouldSendAfter);
      return;
    }

    // Check for permission first
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permissionStatus.state === 'denied') {
        setMicError({ type: 'permission-denied', message: 'Microphone access is blocked in your browser settings.' });
        return;
      }
      if (permissionStatus.state === 'prompt') {
        setShowMicModal(true);
        return;
      }
    } catch (e) {
      // Fallback if permissions API is not supported
      console.log('Permissions API not supported, proceeding to request.');
    }

    startRecordingFlow(shouldSendAfter);
  };

  const startRecordingFlow = async (shouldSendAfter: boolean = false) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    // Start Recording
    setMicError(null);
    setShowMicModal(false);
    setIsRealTimeBlocked(!SpeechRecognition); // Explicitly mark as limited if Web STT is missing
    baseTextRef.current = inputValue;

    try {
      // 1. Get Microphone Stream FIRST (Standard API, most reliable for permission prompt)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support microphone access.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Success! Now set recording state
      setIsRecording(true);
      audioChunksRef.current = [];
      peakMicLevelRef.current = 0;
      
      // 2. Setup Volume Visualizer
      setupVolumeMeter(stream);

      // 3. Start MediaRecorder (Always run as robust backup)
      // Use a standard mime type that is widely supported and compatible with Gemini
      let mimeType = '';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => handleRecordingStop(stream, mimeType || 'audio/webm');
      // Use shorter timeslice for more granular data collection
      mediaRecorder.start(250); 

      // 4. Start SpeechRecognition (For Real-time feedback)
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Use 'ko-KR' as it is the most robust engine for mixing Korean and English (code-switching).
        // Chrome's Korean STT is far superior at identifying English words in a Korean context 
        // than its English engine is at identifying any Korean.
        recognition.lang = 'ko-KR';

        recognition.onstart = () => {
          setIsListening(true);
          setIsRealTimeBlocked(false);
        };
        
        recognition.onresult = (event: any) => {
          if (!isRecording) return;
          
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              transcript += event.results[i][0].transcript;
            }
          }
          
          const result = transcript.trim();
          if (result) {
            const base = baseTextRef.current.trim();
            const fullText = base + (base ? ' ' : '') + result;
            setInputValue(fullText);
            // Update base so we don't duplicate on next final result
            baseTextRef.current = fullText;
          }

          // Also show interim results for immediate feedback, but don't commit to base
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (!event.results[i].isFinal) {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (interimTranscript.trim()) {
            const base = baseTextRef.current.trim();
            setInputValue(base + (base ? ' ' : '') + interimTranscript.trim());
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('STT: SpeechRecognition error', event.error);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setIsRealTimeBlocked(true);
          }
          if (event.error === 'no-speech') {
            console.log('STT: No speech detected by native engine');
          }
        };

        recognition.onend = () => {
          console.log('STT: SpeechRecognition ended');
          if (isRecording) {
            try { recognition.start(); } catch (e) {}
          } else {
            setIsListening(false);
          }
        };

        recognitionRef.current = recognition;
        try {
          recognition.start();
        } catch (e) {
          console.error('STT: Failed to start recognition', e);
        }
      }
    } catch (err: any) {
      console.error('Recording start error:', err);
      setIsRecording(false);
      const errName = err.name || '';
      const errMsg = err.message || '';
      
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errMsg.toLowerCase().includes('denied')) {
        setMicError({ type: 'permission-denied', message: errMsg });
      } else {
        setMicError({ type: 'general-error', message: `${errName}: ${errMsg}` });
      }
    }
  };

  const stopRecording = async (shouldSendAfter: boolean = false) => {
    if (recognitionRef.current) {
      try {
        // Aggressively clear handlers to prevent any more calls to setInputValue
        recognitionRef.current.onresult = null;
        recognitionRef.current.onend = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      // The handleRecordingStop will be triggered, which handles the fallback
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    setIsRecording(false);
    setIsListening(false);
    setMicLevel(0);

    // If we need to send after, we need to wait for transcription if it's happening
    if (shouldSendAfter) {
      pendingSendRef.current = true;
    }
  };

  const setupVolumeMeter = (stream: MediaStream) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 256;
      
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const updateMeter = () => {
        if (!analyserRef.current) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        let peak = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
          if (dataArray[i] > peak) peak = dataArray[i];
        }
        const average = sum / bufferLength;
        setMicLevel(average);
        micLevelRef.current = average;
        if (peak > peakMicLevelRef.current) {
          peakMicLevelRef.current = peak;
        }
        animationFrameRef.current = requestAnimationFrame(updateMeter);
      };
      
      updateMeter();
    } catch (e) {
      console.error('Volume meter setup failed:', e);
    }
  };

  const handleRecordingStop = async (stream: MediaStream, mimeType: string) => {
    // Ensure all tracks are stopped
    stream.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Check if we have audio data and if it wasn't just silence
    const wasSilent = peakMicLevelRef.current < 15; // Threshold for actual speech vs background hum
    
    if (audioChunksRef.current.length > 4 && !wasSilent) { 
      const currentVal = currentInputRef.current.trim();
      const baseVal = baseTextRef.current.trim();
      
      // Only use Gemini if native STT failed to produce ANY meaningful output
      const nativeSTTWorked = currentVal.length > baseVal.length + 3;
      
      if (isRealTimeBlocked || !nativeSTTWorked) {
        setIsTranscribing(true);
        setMicError(null); 
        
        const timeoutId = setTimeout(() => {
          if (isTranscribing) {
            setIsTranscribing(false);
            setMicError({ type: 'general-error', message: "Transcription is taking too long. Please try again." });
            checkAndSendPending();
          }
        }, 15000); 

        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1];
              const transcript = await transcribeAudio(base64Audio, mimeType);
              let trimmedTranscript = (transcript || "").trim().replace(/^['"`\s#*]+|['"`\s#*]+$/g, ''); // Aggressive quote and symbol cleaning
              
              // Enhanced Safeguard: Detect technical hallucinations or reasoning notes (more specific now)
              const lowerText = trimmedTranscript.toLowerCase();
              const isTechnicalHallucination = 
                (lowerText.includes("rule") && (lowerText.includes("4") || lowerText.includes("instruction") || lowerText.includes("per"))) || 
                lowerText === "empty string" ||
                lowerText === "blank message" ||
                (trimmedTranscript.length > 100 && trimmedTranscript.includes(":") && !trimmedTranscript.includes(" ")) || // System notes often omit spaces after colons
                trimmedTranscript.startsWith("# ") || // Markdown headers with space
                trimmedTranscript === "..." ||
                lowerText === "none" ||
                lowerText.includes("transcription:") ||
                lowerText.includes("transcribed text:");

              if (isTechnicalHallucination) {
                console.warn("Filtered technical hallucination:", trimmedTranscript);
                trimmedTranscript = "";
              }

              // Only apply if it contains actual words and isn't a technical hallucination
              if (trimmedTranscript && /[a-zA-Z0-9ㄱ-ㅎㅏ-ㅣ가-힣]/.test(trimmedTranscript)) {
                const finalResult = baseVal + (baseVal ? ' ' : '') + trimmedTranscript;
                setInputValue(finalResult);
                console.log("Gemini Transcription Success:", trimmedTranscript);
                
                if (pendingSendRef.current) {
                  setTimeout(() => {
                    sendMessage(finalResult);
                    pendingSendRef.current = false;
                  }, 100);
                }
              } else {
                console.log("Gemini returned empty or garbage transcription:", trimmedTranscript);
                checkAndSendPending();
              }
            } catch (err) {
              console.error('Gemini STT failed:', err);
              checkAndSendPending();
            } finally {
              clearTimeout(timeoutId);
              setIsTranscribing(false);
            }
          };
        } catch (err) {
          console.error('Audio processing failed:', err);
          clearTimeout(timeoutId);
          setIsTranscribing(false);
          checkAndSendPending();
        }
      } else {
        // Native STT worked significantly, trust it
        checkAndSendPending();
      }
    } else {
      // No audio chunks
      checkAndSendPending();
    }
  };

  const checkAndSendPending = () => {
    if (pendingSendRef.current) {
      pendingSendRef.current = false;
      sendMessage();
    }
  };

  // Load history and rewards from localStorage
  useEffect(() => {
    if (user) return;
    const savedHistory = localStorage.getItem('fluencyflow_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
    const savedRewards = localStorage.getItem('fluencyflow_rewards');
    if (savedRewards) {
      try {
        setCollectedItems(JSON.parse(savedRewards));
      } catch (e) {
        console.error("Failed to parse rewards", e);
      }
    }
    const savedTree = localStorage.getItem('fluencyflow_tree');
    const savedInventory = localStorage.getItem('fluencyflow_inventory');
    if (savedTree) {
      try {
        setTreeDecorations(JSON.parse(savedTree));
      } catch (e) {
        console.error("Failed to parse tree", e);
      }
    }
    if (savedInventory) {
      try {
        setOrnamentInventory(JSON.parse(savedInventory));
      } catch (e) {
        console.error("Failed to parse inventory", e);
      }
    }
  }, [user]);

  // Save history and rewards to localStorage
  useEffect(() => {
    if (user) return;
    localStorage.setItem('fluencyflow_history', JSON.stringify(history));
  }, [history, user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem('fluencyflow_rewards', JSON.stringify(collectedItems));
  }, [collectedItems, user]);

  useEffect(() => {
    if (user) return;
    localStorage.setItem('fluencyflow_tree', JSON.stringify(treeDecorations));
    localStorage.setItem('fluencyflow_inventory', JSON.stringify(ornamentInventory));
  }, [treeDecorations, ornamentInventory, user]);

  // Tree Ornaments Constants and Handlers
  const ORNAMENTS = [
    { id: 'star', icon: <OrnamentImage id="star" />, label: 'Fluency Star', color: 'text-amber-400' },
    { id: 'bell', icon: <OrnamentImage id="bell" />, label: 'Progress Bell', color: 'text-yellow-400' },
    { id: 'gift', icon: <OrnamentImage id="gift" />, label: 'Effort Gift', color: 'text-pink-400' },
    { id: 'ball', icon: <OrnamentImage id="ball" />, label: 'Strategy Ball', color: 'text-emerald-400' },
    { id: 'light', icon: <OrnamentImage id="light" />, label: 'Wisdom Light', color: 'text-orange-300' },
    { id: 'candy', icon: <OrnamentImage id="candy" />, label: 'Grit Candy', color: 'text-rose-500' },
    { id: 'snow', icon: <OrnamentImage id="snow" />, label: 'Clarity Snow', color: 'text-sky-300' },
    { id: 'gingerbread', icon: <OrnamentImage id="gingerbread" />, label: 'Gingerbread', color: 'text-orange-800' },
    { id: 'rudolph', icon: <OrnamentImage id="rudolph" />, label: 'Rudolph', color: 'text-red-800' },
    { id: 'santa_orn', icon: <OrnamentImage id="santa_orn" />, label: 'Little Santa', color: 'text-red-600' },
  ];

  const earnOrnament = async (id?: string) => {
    const targetId = id || ORNAMENTS[Math.floor(Math.random() * ORNAMENTS.length)].id;
    const newInventory = {
      ...ornamentInventory,
      [targetId]: (ornamentInventory[targetId] || 0) + 1
    };
    
    setOrnamentInventory(newInventory);
    setLastEarnedOrnament(targetId);
    playRewardSound();

    // Sync to Firestore if logged in
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          ornamentInventory: newInventory,
          collectedItems: Array.from(new Set([...collectedItems, targetId])), // Add to collected items too
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  const removeDecoration = async (id: string) => {
    const decToRemove = treeDecorations.find(d => d.id === id);
    if (decToRemove) {
      const newInventory = {
        ...ornamentInventory,
        [decToRemove.itemId]: (ornamentInventory[decToRemove.itemId] || 0) + 1
      };
      
      setOrnamentInventory(newInventory);
      setTreeDecorations(prev => prev.filter(d => d.id !== id));
      playClickSound();

      // Sync to Firestore if logged in
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            ornamentInventory: newInventory,
            updatedAt: new Date().toISOString()
          });
          await deleteDoc(doc(db, 'users', user.uid, 'decorations', id));
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/decorations/${id}`);
        }
      }
    }
  };

  const removeOneFromInventory = async (id: string) => {
    if (ornamentInventory[id] > 0) {
      if (!window.confirm(`Are you sure you want to remove one ${id}?`)) return;
      
      const newInventory = {
        ...ornamentInventory,
        [id]: ornamentInventory[id] - 1
      };
      
      setOrnamentInventory(newInventory);
      playClickSound();

      // Sync to Firestore if logged in
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            ornamentInventory: newInventory,
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
        }
      }
    }
  };

  const handleGameWin = () => {
    playClickSound();
    earnOrnament();
    setStage('Tree'); // Go straight to tree to place for game win
  };

  const handleTreeDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    playDropSound();
    if (!treeRef.current) return;
    
    const rect = treeRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Safety bounds
    if (x < 0 || x > 100 || y < 0 || y > 100) return;

    // Overlap prevention (7% radius)
    const MIN_DIST = 7;
    const isOverlapping = treeDecorations.some(dec => {
      const dx = dec.x - x;
      const dy = dec.y - y;
      return Math.sqrt(dx * dx + dy * dy) < MIN_DIST;
    });

    if (isOverlapping) return;
    
    const itemId = e.dataTransfer.getData('ornamentId');
    if (itemId && ornamentInventory[itemId] > 0) {
      const decId = crypto.randomUUID();
      const newDec = {
        id: decId,
        itemId,
        x,
        y,
        timestamp: Date.now()
      };
      
      const newInventory = {
        ...ornamentInventory,
        [itemId]: ornamentInventory[itemId] - 1
      };

      setTreeDecorations(prev => [...prev, newDec]);
      setOrnamentInventory(newInventory);
      playClickSound();

      // Sync to Firestore if logged in
      if (user) {
        try {
          await updateDoc(doc(db, 'users', user.uid), {
            ornamentInventory: newInventory,
            updatedAt: new Date().toISOString()
          });
          await setDoc(doc(db, 'users', user.uid, 'decorations', decId), {
            itemId: newDec.itemId,
            x: newDec.x,
            y: newDec.y,
            timestamp: newDec.timestamp
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      }
    }
  };

  useEffect(() => {
    if (stage === 'Results' && sessionResult) {
      earnOrnament();
    }
  }, [stage, sessionResult]);

  useEffect(() => {
    if (stage !== 'Results') {
      setLastEarnedOrnament(null);
    }
  }, [stage]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleStart = () => {
    if (!user) {
      setStartError("로그인하세요");
      setTimeout(() => setStartError(null), 3000);
      return;
    }
    playClickSound();
    setStage('LevelSelect');
  };

  const handleLevelSelect = (l: Level) => {
    playClickSound();
    setLevel(l);
    setStage('VoiceSettings');
  };

  const handleVoiceSettingsConfirm = () => {
    playClickSound();
    setStage('Dashboard');
  };

  const handleScenarioSelect = (s: Scenario) => {
    playClickSound();
    setSelectedScenario(s);
    setStage('StrategyIntro');
  };

  const handleStartLearning = () => {
    playClickSound();
    setStage('StrategyLearning');
  };

  const handleStartStage1 = () => {
    playClickSound();
    // Reward for completing strategy introduction/learning
    earnOrnament();
    setMessages([]);
    setAllStrategiesUsed([]);
    setStage('Stage1');
    // Initial AI message - situational opening based on level
    const openingLine = selectedScenario?.openingLines[level!] || "Hello! How can I help you today?";
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      role: 'ai',
      content: openingLine,
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);
    speak(initialMessage.content);
  };

  const handleStartFreeSpeaking = () => {
    playClickSound();
    setMessages([]);
    setAllStrategiesUsed([]);
    setStage('FreeSpeaking');
    const initialMessage: Message = {
      id: crypto.randomUUID(),
      role: 'ai',
      content: "Hello! I'm your English tutor. What would you like to talk about today? We can discuss your hobbies, school, or anything on your mind!",
      timestamp: Date.now(),
    };
    setMessages([initialMessage]);
    speak(initialMessage.content);
  };

  const sendMessage = async (overrideContent?: string) => {
    const content = overrideContent || inputValue.trim();
    if (!content || isTyping) return;

    setShowTopicSuggestions(false);

    // Stop recording if active and clear all STT handlers immediately
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.onresult = null; // Important: Block results immediately
      }
      await stopRecording();
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);
    setMicError(null); // Clear any previous errors

    try {
      // Analyze strategies used by user
      const rawUsed = await analyzeStrategies(content);
      const used = Array.from(new Set(rawUsed));
      if (used.length > 0) {
        setAllStrategiesUsed(prev => Array.from(new Set([...prev, ...used])));
        // Associate strategies with the user's specific bubble for immediate display
        setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, strategyUsed: used } : m));
      }

      // Get AI response
      const strategy = STRATEGIES.find(st => st.id === selectedScenario?.strategyId) || STRATEGIES[0];
      const userTurnCount = [...messages, userMsg].filter(m => m.role === 'user').length;
      const maxTurns = level ? LEVELS[level].minTurns : 10;

      const response = await getTutorResponse(
        [...messages, userMsg],
        level!,
        selectedScenario || SCENARIOS[0],
        strategy,
        stage,
        userTurnCount,
        maxTurns
      );

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        content: response,
        timestamp: Date.now(),
        strategyUsed: used,
      };

      setMessages(prev => [...prev, aiMsg]);
      speak(response);

      // Auto-finish if turn limit reached
      if (userTurnCount >= maxTurns) {
        setTimeout(() => {
          finishSession();
        }, 3000); // Give user some time to hear/read final AI message
      }
    } catch (error) {
      console.error("Failed to get AI response:", error);
      setAppError({ 
        title: "AI Connection Error",
        message: "I'm having a little trouble connecting to my AI brain right now. 🧠 Please wait a moment and try again!" 
      });
    } finally {
      setIsTyping(false);
    }
  };

  const finishSession = async () => {
    if (isFinishingRef.current) return;
    isFinishingRef.current = true;
    setIsTyping(true);
    try {
      const feedbackJson = await generateSessionFeedback(
        messages,
        level!,
        selectedScenario || { title: 'Free Speaking' } as Scenario,
        allStrategiesUsed
      );
      
      let feedbackData;
      try {
        feedbackData = JSON.parse(feedbackJson);
      } catch (e) {
        console.error("Failed to parse feedback JSON", e);
        // Fallback structure
        feedbackData = {
          overview: { title: "Session Complete", summary: "Great job practicing today!", scores: { flow: 70, strategyUse: 70, recovery: 70 }, comment: "Keep practicing to improve your fluency." },
          strategyPerformance: { targetStrategy: "General", usedCount: allStrategiesUsed.length, successfulCount: allStrategiesUsed.length, missedChances: 0, qualityAnalysis: "Good effort." },
          moments: [],
          alternatives: [],
          nextGoals: ["Keep speaking English!", "Try new scenarios."]
        };
      }
      
      const result: SessionResult = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        turns: messages.filter(m => m.role === 'user').length,
        strategiesUsed: allStrategiesUsed,
        ...feedbackData,
        transcript: messages,
        scenarioTitle: selectedScenario?.title || 'Free Speaking',
        level: level!,
        pauseTime: Math.floor(Math.random() * 2) + 1, // Placeholder logic
        translanguagingCount: messages.filter(m => m.role === 'user' && /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(m.content)).length,
        audioUrl: 'https://storage.googleapis.com/fluencyflow-recordings/sample.mp3' // Placeholder
      };
      
      setSessionResult(result);

      if (user) {
        try {
          const sessionsRef = collection(db, 'users', user.uid, 'sessions');
          await addDoc(sessionsRef, result);
          
          await updateDoc(doc(db, 'users', user.uid), {
            sessionsCount: increment(1),
            updatedAt: new Date().toISOString()
          });
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      } else {
        setHistory(prev => [result, ...prev]);
      }
      setStage('Results');
      playRewardSound();
    } catch (error) {
      console.error("Error in finishSession:", error);
    } finally {
      isFinishingRef.current = false;
      setIsTyping(false);
    }
  };



  const renderIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (iconName) {
      case 'Stethoscope': return <Stethoscope {...iconProps} />;
      case 'MapPin': return <MapPin {...iconProps} />;
      case 'ShoppingBag': return <ShoppingBag {...iconProps} />;
      case 'Utensils': return <Utensils {...iconProps} />;
      case 'Plane': return <Plane {...iconProps} />;
      case 'BookOpen': return <BookOpen {...iconProps} />;
      case 'Coffee': return <Coffee {...iconProps} />;
      case 'MessageSquare': return <MessageSquare {...iconProps} />;
      default: return <MessageSquare {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[2rem] shadow-2xl max-w-sm w-full p-8 text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Logout</h3>
              <p className="text-slate-500 mb-8 font-medium">로그아웃하시겠습니까?</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => { playClickSound(); setShowLogoutConfirm(false); }}
                  className="flex-1 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  No
                </button>
                <button 
                  onClick={() => { playClickSound(); confirmLogout(); }}
                  className="flex-1 py-3.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 shadow-lg shadow-red-100 transition-all"
                >
                  Yes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl max-w-md w-full max-h-[90vh] flex flex-col overflow-hidden relative border-b-12 border-slate-200"
            >
              {/* Back & Close Buttons */}
              <div className="absolute top-4 inset-x-4 flex justify-between items-center z-[120]">
                {authMode === 'register' ? (
                  <button 
                    onClick={() => { playClickSound(); setAuthMode('login'); setAuthError(null); }}
                    className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-full transition-all"
                    title="Back to login"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                ) : <div />}
                
                <button 
                  onClick={() => { playClickSound(); setShowAuthModal(false); }}
                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 rounded-full transition-all"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-10 pt-12 flex-1 overflow-y-auto custom-scrollbar">
                <div className="text-center mb-10 relative">
                  <div className="w-24 h-24 bg-indigo-100 rounded-[2rem] flex items-center justify-center mb-6 mx-auto rotate-3 shadow-[0_8px_0_0_#e0e7ff] relative">
                    <UserIcon className="w-12 h-12 text-indigo-600" />
                    {/* Character Peeking */}
                    <div className="absolute -top-12 -right-4 w-16 h-16 pointer-events-none">
                       <img src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" alt="" className="w-full h-full object-contain -rotate-12" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 mb-2 font-cute">
                    {authMode === 'login' ? 'Welcome Back!' : 'Join the Fun!'}
                  </h3>
                  <p className="text-slate-500 font-bold text-sm">
                    {authMode === 'login' ? 'Your AI friends missed you!' : 'Start your English adventure today!'}
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-5">
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                    <button 
                      type="button"
                      onClick={() => { playClickSound(); setAuthForm({...authForm, role: 'student'}); }}
                      className={cn(
                        "flex-1 py-3 text-xs font-black rounded-xl transition-all",
                        authForm.role === 'student' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"
                      )}
                    >
                      I'M A STUDENT
                    </button>
                    <button 
                      type="button"
                      onClick={() => { playClickSound(); setAuthForm({...authForm, role: 'teacher'}); }}
                      className={cn(
                        "flex-1 py-3 text-xs font-black rounded-xl transition-all",
                        authForm.role === 'teacher' ? "bg-white text-indigo-600 shadow-md" : "text-slate-400"
                      )}
                    >
                      I'M A TEACHER
                    </button>
                  </div>

                  {authMode === 'register' && (
                    <div className="relative">
                      <input 
                        type="text"
                        placeholder="Your Name"
                        value={authForm.name}
                        onChange={e => setAuthForm({...authForm, name: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 transition-all font-black text-slate-800 placeholder:text-slate-300"
                        required
                      />
                    </div>
                  )}

                  {authMode === 'register' && authForm.role === 'teacher' && (
                    <div className="relative">
                      <input 
                        type="password"
                        placeholder="Teacher Verification Code"
                        value={authForm.verificationCode}
                        onChange={e => setAuthForm({...authForm, verificationCode: e.target.value})}
                        className="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 transition-all font-black text-slate-800 placeholder:text-slate-300"
                        required
                      />
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                    </div>
                  )}

                  <div className="relative">
                    <input 
                      type="text"
                      placeholder="ID (e.g. happy_user)"
                      value={authForm.id}
                      onChange={e => setAuthForm({...authForm, id: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 transition-all font-black text-slate-800 placeholder:text-slate-300"
                      required
                    />
                  </div>

                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={authForm.password}
                      onChange={e => setAuthForm({...authForm, password: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border-4 border-slate-100 rounded-2xl outline-none focus:border-indigo-400 transition-all font-black text-slate-800 placeholder:text-slate-300 pr-12"
                      required
                      minLength={6}
                    />
                    <button 
                      type="button"
                      onClick={() => { playClickSound(); setShowPassword(!showPassword); }}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-indigo-500"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {authError && (
                    <div className="p-4 bg-red-50 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-black border-2 border-red-100">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {authError}
                    </div>
                  )}

                  <button 
                    type="submit"
                    onClick={() => playClickSound()}
                    disabled={authSubmitting}
                    className="w-full py-5 bg-indigo-500 text-white rounded-[1.8rem] font-black text-lg shadow-[0_8px_0_0_#4338ca] hover:translate-y-[2px] hover:shadow-[0_6px_0_0_#4338ca] active:shadow-none active:translate-y-[8px] transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
                  >
                    {authSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (authMode === 'login' ? 'LET\'S GO!' : 'START NOW!')}
                  </button>
                </form>

                <div className="relative my-10 text-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-100" /></div>
                  <span className="relative px-6 bg-white text-xs font-black text-slate-400 uppercase tracking-widest">or use</span>
                </div>

                <div className="space-y-6">
                  <button 
                    onClick={async () => {
                      playClickSound();
                      try {
                        setAuthSubmitting(true);
                        await loginWithGoogle();
                        setShowAuthModal(false);
                        setStage('LevelSelect');
                      } catch (e) {
                        setAuthError("Google login failed.");
                      } finally {
                        setAuthSubmitting(false);
                      }
                    }}
                    className="w-full py-4 bg-white border-4 border-slate-100 rounded-[1.5rem] font-black text-slate-700 flex items-center justify-center gap-4 hover:border-indigo-100 hover:bg-indigo-50 transition-all active:translate-y-1 shadow-sm"
                  >
                    <img src="https://img.icons8.com/color/48/google-logo.png" className="w-6 h-6" alt="" />
                    Sign in with Google
                  </button>

                  <p className="text-center text-sm font-black text-slate-400 uppercase tracking-tight">
                    {authMode === 'login' ? "New here?" : "Already a member?"}
                    <button 
                      onClick={() => {
                        playClickSound();
                        setAuthMode(authMode === 'login' ? 'register' : 'login');
                        setAuthError(null);
                      }}
                      className="ml-3 text-indigo-500 hover:underline"
                    >
                      {authMode === 'login' ? 'Create Account' : 'Login'}
                    </button>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mic Permission Modal */}
      <AnimatePresence>
        {showMicModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
            >
              <div className="p-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <Mic className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 text-center mb-3">Enable Microphone</h3>
                <p className="text-slate-600 text-center mb-8 leading-relaxed">
                  To practice English speaking, we need access to your microphone. 
                  Your voice will be used to transcribe your speech into text for the conversation.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Real-time Practice</p>
                      <p className="text-xs text-slate-500">See your words as you speak them.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl">
                    <div className="bg-white p-1.5 rounded-lg shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">AI Feedback</p>
                      <p className="text-xs text-slate-500">Get corrections and suggestions on your speaking.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => { playClickSound(); setShowMicModal(false); }}
                  className="flex-1 py-4 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                >
                  Later
                </button>
                <button 
                  onClick={() => { playClickSound(); startRecordingFlow(); }}
                  className="flex-[2] py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  Allow Microphone
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {isAuthLoading ? (
          <motion.div 
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-[#F4F7FF] z-[200]"
          >
            <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mb-6">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
            </div>
            <p className="text-slate-600 font-bold animate-pulse">Initializing FluencyFlow...</p>
          </motion.div>
        ) : stage === 'Lobby' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center bg-[#FFFBF0] overflow-hidden px-6 py-20"
          >
            {/* Login Status */}
            <div className="absolute top-8 right-8 z-50 flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-3xl shadow-[0_8px_0_0_#f1f5f9] border border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-800 leading-none">{user.displayName || 'Fluent Speaker'}</p>
                    <p className="text-[10px] text-slate-400 font-bold">{user.email}</p>
                  </div>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="" className="w-10 h-10 rounded-2xl border-2 border-indigo-100" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-black uppercase">
                      {user.email?.charAt(0)}
                    </div>
                  )}
                  <button onClick={() => { playClickSound(); handleLogout(); }} className="text-slate-300 hover:text-red-500 transition-colors p-1">
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => {
                      playClickSound();
                      handleLogin();
                    }}
                    className="bg-white px-6 py-3 rounded-2xl shadow-[0_6px_0_0_#f1f5f9] border-2 border-slate-100 flex items-center gap-2 text-slate-600 font-black text-sm hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#f1f5f9] transition-all"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      playClickSound();
                      handleSignUp();
                    }}
                    className="bg-indigo-500 px-6 py-3 rounded-2xl shadow-[0_6px_0_0_#4338ca] flex items-center gap-2 text-white font-black text-sm hover:translate-y-[2px] hover:shadow-[0_4px_0_0_#4338ca] transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Background Decorations */}
            <div className="absolute top-20 left-10 w-24 h-24 bg-pink-100/50 rounded-full blur-2xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-100/50 rounded-full blur-3xl animate-pulse" />
            <div className="absolute top-1/4 right-20 w-16 h-16 bg-blue-100/50 rounded-full blur-xl animate-pulse" />
            
            {/* Title */}
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-7xl md:text-9xl font-cute font-black text-slate-900 mb-8 tracking-tighter text-center"
            >
              <span className="text-indigo-500 drop-shadow-[0_8px_0_#e0e7ff]">Fluency</span>
              <span className="text-pink-500 drop-shadow-[0_8px_0_#fce7f3]">Flow</span>
            </motion.h1>

            {/* Central Illustration Area */}
            <div className="relative w-full max-w-lg aspect-square mb-12 flex items-center justify-center">
              {/* Dynamic Path */}
              <svg className="absolute inset-0 w-full h-full -z-10 overflow-visible" viewBox="0 0 400 400">
                <motion.path
                  d="M 50 200 C 100 100 300 300 350 200"
                  fill="none"
                  stroke="#E0E7FF"
                  strokeWidth="60"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
              </svg>

              {/* Main Character & Friends */}
              <div className="relative w-80 h-80">
                <motion.img 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" 
                  alt="Bunny" 
                  className="w-full h-full object-contain filter drop-shadow-2xl z-20 relative"
                  referrerPolicy="no-referrer"
                />
                
                {/* Bear Friend */}
                <motion.div 
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="absolute -left-12 bottom-0 w-32 h-32 z-10"
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/4775/4775505.png" alt="Bear" className="w-full h-full object-contain filter drop-shadow-lg" referrerPolicy="no-referrer" />
                </motion.div>

                {/* Cat Friend */}
                <motion.div 
                   initial={{ opacity: 0, x: 50 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: 1.2, duration: 0.8 }}
                   className="absolute -right-12 top-10 w-28 h-28 z-10"
                >
                  <img src="https://cdn-icons-png.flaticon.com/512/6988/6988831.png" alt="Cat" className="w-full h-full object-contain filter drop-shadow-lg" referrerPolicy="no-referrer" />
                </motion.div>

                {/* Speech Bubble */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5, type: 'spring' }}
                  className="absolute -top-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-white rounded-3xl shadow-xl border-4 border-indigo-500 z-30 whitespace-nowrap"
                >
                  <p className="text-indigo-600 font-black text-lg">Let's talk in English! ✨</p>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white border-r-4 border-b-4 border-indigo-500 rotate-45" />
                </motion.div>
              </div>
            </div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center max-w-sm mb-12"
            >
              <h2 className="text-2xl font-black text-slate-800 mb-2 leading-tight">
                Don't be shy!
              </h2>
              <p className="text-slate-500 font-bold text-sm">
                Unlock cool ornaments as you practice speaking with your AI friends!
              </p>
            </motion.div>

            {/* Button */}
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.05, rotate: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  playClickSound();
                  handleStart();
                }}
                className="group relative px-16 py-6 bg-indigo-500 text-white rounded-[2rem] font-black text-2xl shadow-[0_12px_0_0_#4338ca] hover:shadow-[0_8px_0_0_#4338ca] hover:translate-y-[4px] active:shadow-none active:translate-y-[12px] transition-all flex items-center gap-4"
              >
                PLAY NOW!
                <div className="bg-white/20 p-2 rounded-full">
                   <ChevronRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
                </div>
              </motion.button>

              <AnimatePresence>
                {startError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, x: '-50%' }}
                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                    exit={{ opacity: 0, y: 10, x: '-50%' }}
                    className="absolute top-full mt-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-red-500 text-white text-sm font-bold rounded-full whitespace-nowrap shadow-lg flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {startError}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {stage === 'LevelSelect' && (
          <motion.div 
            key="level-select"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-5xl mx-auto py-20 px-6 relative"
          >
            <button 
              onClick={() => { playClickSound(); setStage('Lobby'); }}
              className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
              <span>Back</span>
            </button>

            <div className="text-center mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500 rounded-full border-b-4 border-indigo-700 mb-4">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Step 1: Choose Difficulty</span>
              </div>
              <h2 className="text-6xl font-cute font-black text-slate-800 tracking-tighter drop-shadow-sm">Ready for a Mission? 🚀</h2>
              <p className="text-slate-400 font-bold mt-4 max-w-md mx-auto">Select the level that matches your speaking confidence today!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(Object.keys(LEVELS) as Level[]).map((l, i) => {
                const colors = [
                  'bg-sky-50 shadow-sky-100/50 border-sky-200 text-sky-600 icon-bg-sky-100',
                  'bg-emerald-50 shadow-emerald-100/50 border-emerald-200 text-emerald-600 icon-bg-emerald-100',
                  'bg-purple-50 shadow-purple-100/50 border-purple-200 text-purple-600 icon-bg-purple-100'
                ];
                const c = colors[i % colors.length].split(' ');
                
                return (
                  <motion.button
                    key={l}
                    whileHover={{ y: -10, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { playClickSound(); handleLevelSelect(l); }}
                    className={cn(
                      "group p-10 rounded-[3.5rem] text-left transition-all border-b-12 flex flex-col h-full",
                      c[0], c[1], c[2]
                    )}
                  >
                    <div className={cn("w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 rotate-3 shadow-inner", c[4].replace('icon-', ''))}>
                      <Trophy className={cn("w-8 h-8", c[3])} />
                    </div>
                    <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight uppercase">{l}</h3>
                    <p className="text-slate-500 font-bold text-sm mb-8 flex-grow leading-relaxed">{LEVELS[l].description}</p>
                    
                    <div className={cn("mt-auto flex items-center justify-between p-4 bg-white/50 rounded-2xl border-2", c[2])}>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Session Goal</span>
                        <span className={cn("text-lg font-black", c[3])}>{LEVELS[l].minTurns} Turns</span>
                      </div>
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm", c[3])}>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Background Friends */}
            <div className="absolute -bottom-20 -left-10 w-64 h-64 opacity-10 pointer-events-none">
              <img src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>
          </motion.div>
        )}

        {stage === 'VoiceSettings' && (
          <motion.div 
            key="voice-settings"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto py-20 px-6 relative"
          >
            <button 
              onClick={() => { playClickSound(); setStage('LevelSelect'); }}
              className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
              <span>Back</span>
            </button>

            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500 rounded-full border-b-4 border-pink-700 mb-4">
                  <Volume2 className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Step 2: Who's Talking?</span>
               </div>
               <h2 className="text-5xl font-cute font-black text-slate-800 tracking-tighter drop-shadow-sm">Choose Your Partner! 🌈</h2>
               <p className="text-slate-400 font-bold mt-2">Pick a friendly voice for your AI tutor.</p>
            </div>
            
            <div className="bg-white p-12 rounded-[4rem] shadow-2xl border-b-12 border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 opacity-[0.03]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
              
              <div className="space-y-12 relative z-10">
                {/* Gender Selection */}
                <div>
                  <h3 className="text-xs font-black mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-[0.3em] bg-slate-50 w-fit px-4 py-1.5 rounded-full">
                    <User className="w-4 h-4" />
                    1. Voice Personality
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { id: 'female', label: 'Tasha', sub: 'Friendly & Warm', img: 'https://cdn-icons-png.flaticon.com/512/4140/4140047.png', color: 'indigo' },
                      { id: 'male', label: 'Marcus', sub: 'Calm & Precise', img: 'https://cdn-icons-png.flaticon.com/512/4140/4140048.png', color: 'emerald' }
                    ].map(g => (
                      <motion.button
                        key={g.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { playClickSound(); setVoiceSettings(prev => ({ ...prev, gender: g.id as any })); }}
                        className={cn(
                          "relative p-8 rounded-[2.5rem] border-4 transition-all group overflow-hidden text-left",
                          voiceSettings.gender === g.id 
                            ? `border-indigo-500 bg-indigo-50 shadow-xl shadow-indigo-100` 
                            : "border-slate-100 hover:border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                          <div className="w-24 h-24 rounded-3xl overflow-hidden bg-white shadow-inner flex items-center justify-center p-2 shrink-0 border-2 border-slate-100">
                            <img src={g.img} alt={g.label} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <span className={cn("font-black text-2xl block", voiceSettings.gender === g.id ? "text-indigo-600" : "text-slate-700")}>
                              {g.label}
                            </span>
                            <span className="text-xs font-bold text-slate-400">{g.sub}</span>
                          </div>
                        </div>
                        {voiceSettings.gender === g.id && (
                          <div className="absolute top-4 right-4 bg-indigo-500 p-2 rounded-full shadow-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Accent Selection */}
                <div>
                  <h3 className="text-xs font-black mb-6 flex items-center gap-2 text-slate-400 uppercase tracking-[0.3em] bg-slate-50 w-fit px-4 py-1.5 rounded-full">
                    <MapPin className="w-4 h-4" />
                    2. Regional Accent
                  </h3>
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { id: 'en-US', label: 'American', subLabel: 'Hello! (Western)', flag: 'https://flagcdn.com/w160/us.png' },
                      { id: 'en-GB', label: 'British', subLabel: 'Cheers! (London)', flag: 'https://flagcdn.com/w160/gb.png' }
                    ].map(a => (
                      <motion.button
                        key={a.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { playClickSound(); setVoiceSettings(prev => ({ ...prev, accent: a.id as any })); }}
                        className={cn(
                          "relative p-8 rounded-[2.5rem] border-4 transition-all group text-left",
                          voiceSettings.accent === a.id 
                            ? "border-pink-500 bg-pink-50 shadow-xl shadow-pink-100" 
                            : "border-slate-100 hover:border-slate-200 bg-slate-50"
                        )}
                      >
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                           <div className="w-20 h-14 rounded-2xl overflow-hidden shadow-lg border-4 border-white rotate-2 shrink-0">
                              <img src={a.flag} alt={a.label} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                           </div>
                           <div>
                              <span className={cn("font-black text-2xl block", voiceSettings.accent === a.id ? "text-pink-600" : "text-slate-700")}>
                                {a.label}
                              </span>
                              <span className="text-xs font-bold text-slate-400">{a.subLabel}</span>
                           </div>
                        </div>
                        {voiceSettings.accent === a.id && (
                          <div className="absolute top-4 right-4 bg-pink-500 p-2 rounded-full shadow-lg">
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Preview Button */}
                <div className="pt-8 space-y-6">
                  <div className="flex items-center justify-center gap-3 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black uppercase tracking-widest w-fit mx-auto border-b-4 border-emerald-100">
                    <Sparkles className="w-4 h-4 animate-pulse" />
                    HD Voice Streaming Active
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      playClickSound();
                      const accentName = voiceSettings.accent === 'en-US' ? 'American' : 'British';
                      const genderName = voiceSettings.gender === 'female' ? 'female' : 'male';
                      speak(`Hi there! I'm your ${genderName} AI tutor. Let's have a great talk!`);
                    }}
                    className="w-full py-8 bg-slate-800 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-6 hover:bg-slate-900 transition-all shadow-3xl border-b-12 border-slate-950 active:border-b-0 active:translate-y-2"
                  >
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center transition-all bg-white/20 shadow-inner",
                      isSpeaking ? "bg-indigo-500 animate-pulse" : ""
                    )}>
                      {isSpeaking ? <div className="flex gap-1 h-8 items-end">
                        {[0.4, 0.8, 0.6, 0.9, 0.5].map((h, i) => (
                           <motion.div 
                              key={i}
                              animate={{ height: [`${h*100}%`, `${(1-h)*100}%`, `${h*100}%`] }}
                              transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                              className="w-1.5 bg-white rounded-full"
                           />
                        ))}
                      </div> : <Volume2 className="w-8 h-8 text-white" />}
                    </div>
                    <div className="text-left">
                       <span className="block text-2xl">Test Hear Voice</span>
                       <span className="text-xs text-white/40 font-bold uppercase tracking-widest">Listen to your new partner</span>
                    </div>
                  </motion.button>
                </div>
              </div>
            </div>

            <div className="mt-12 flex gap-6">
                <button 
                  onClick={() => { playClickSound(); setStage('LevelSelect'); }}
                  className="px-10 py-5 bg-white text-slate-500 rounded-[2rem] font-black text-lg hover:bg-slate-50 transition-all border-b-6 border-slate-100 active:border-b-0 active:translate-y-1"
                >
                  Go Back
                </button>
                <button 
                  onClick={() => { playClickSound(); handleVoiceSettingsConfirm(); }}
                  className="flex-1 px-10 py-5 bg-indigo-500 text-white rounded-[2rem] font-black text-2xl hover:bg-indigo-600 transition-all shadow-[0_10px_0_0_#4338ca] hover:translate-y-[2px] active:translate-y-2 active:shadow-none flex items-center justify-center gap-3"
                >
                  LET'S START!
                  <ChevronRight className="w-6 h-6" />
                </button>
            </div>
          </motion.div>
        )}

        {stage === 'Dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto py-16 px-6 relative"
          >
            {/* Background Friends */}
            <div className="absolute top-20 right-0 w-48 h-48 opacity-10 pointer-events-none rotate-12">
               <img src="https://cdn-icons-png.flaticon.com/512/4775/4775505.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
            </div>

            <button 
              onClick={() => { playClickSound(); setStage('VoiceSettings'); }}
              className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
              <span>Back</span>
            </button>
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
              <div className="text-center md:text-left relative">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500 rounded-full border-b-4 border-emerald-700 mb-4">
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Missions Loaded! ✨</span>
                </div>
                <h2 className="text-6xl font-cute font-black text-slate-800 tracking-tighter">English Adventures</h2>
                <p className="text-slate-400 font-bold mt-2">Choose a mission to level up your English!</p>
              </div>
              <div className="px-8 py-4 bg-white rounded-3xl border-b-8 border-slate-100 shadow-xl flex items-center gap-4">
                 <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-indigo-500" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Level</p>
                    <p className="text-2xl font-black text-indigo-600 leading-none">{level}</p>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
              {SCENARIOS.map((s) => (
                <motion.button
                  key={s.id}
                  whileHover={{ y: -12, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    playClickSound();
                    handleScenarioSelect(s);
                  }}
                  className="group bg-white border-b-12 border-slate-100 rounded-[3.5rem] text-left hover:shadow-3xl transition-all flex flex-col h-full overflow-hidden shadow-xl"
                >
                  <div className="relative h-56 w-full overflow-hidden">
                    <img 
                      src={s.imageUrl} 
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8">
                      <span className="text-white text-lg font-black flex items-center gap-2">
                        GO NOW <ChevronRight className="w-5 h-5" />
                      </span>
                    </div>
                    <div className="absolute top-6 left-6 w-14 h-14 bg-white rounded-[1.25rem] flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                      <div className="w-10 h-10">
                        {renderIcon(s.icon)}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow relative">
                    <div className="absolute -top-10 right-8 w-20 h-20 bg-white rounded-3xl p-2 shadow-2xl border-2 border-slate-100 rotate-3 flex items-center justify-center">
                       <img src={s.characterImageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-2">MISSION #{s.id.split('-')[1]}</span>
                    <h3 className="text-2xl font-black text-slate-800 mb-1 leading-tight">{s.title}</h3>
                    <p className="text-indigo-400 font-bold text-sm mb-4">{s.koreanTitle}</p>
                    <p className="text-slate-400 font-bold text-sm mb-8 flex-grow line-clamp-2 leading-relaxed">{s.description}</p>
                    <div className="pt-6 border-t-2 border-slate-50 flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Strategy Booster</span>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
                          {STRATEGIES.find(st => st.id === s.strategyId)?.name.split(' (')[0].toUpperCase()}
                        </span>
                        <span className="text-[9px] font-black text-indigo-400 bg-white px-3 py-1.5 rounded-full border border-indigo-50">
                          {STRATEGIES.find(st => st.id === s.strategyId)?.koreanName}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            <motion.div 
               whileHover={{ scale: 1.01 }}
               className="bg-indigo-600 rounded-[4rem] p-12 text-white flex flex-col lg:flex-row items-center justify-between gap-10 shadow-3xl relative overflow-hidden mb-16 group"
            >
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
              <div className="flex-1 relative z-10 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                   <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Zap className="w-7 h-7 text-yellow-300" />
                   </div>
                   <h3 className="text-4xl font-cute font-black">Free Speaking Zone</h3>
                </div>
                <p className="text-indigo-100 font-bold text-lg max-w-xl">
                  Talk about anything with your AI friends! Practice every booster in a natural, no-rules environment! ✨
                </p>
              </div>
              <button 
                onClick={() => { playClickSound(); handleStartFreeSpeaking(); }}
                className="px-12 py-6 bg-white text-indigo-600 rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#e0e7ff] hover:translate-y-[2px] hover:shadow-[0_8px_0_0_#e0e7ff] active:translate-y-[10px] active:shadow-none transition-all relative z-10"
              >
                Enter Playground! 🎮
              </button>
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-20 translate-x-12 translate-y-12 group-hover:scale-110 transition-transform">
                 <img src="https://cdn-icons-png.flaticon.com/512/6988/6988831.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8 mb-20">
              {userRole === 'teacher' && (
                <motion.button 
                  whileHover={{ y: -5 }}
                  onClick={() => { playClickSound(); setStage('AdminDashboard'); }}
                  className="flex items-center gap-4 px-10 py-5 bg-white border-b-8 border-slate-100 rounded-[2rem] shadow-xl group"
                >
                  <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                    <BarChart3 className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="text-xl font-black text-slate-800">Teacher Center</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Classroom Insights</p>
                  </div>
                </motion.button>
              )}
              <motion.button 
                whileHover={{ y: -5 }}
                onClick={() => { playClickSound(); setStage('History'); }}
                className="flex items-center gap-4 px-10 py-5 bg-white border-b-8 border-slate-100 rounded-[2rem] shadow-xl group"
              >
                <div className="w-14 h-14 bg-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:-rotate-6 transition-transform">
                  <BrainCircuit className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black text-slate-800">My Progress Box</p>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Diagnostic Report</p>
                </div>
              </motion.button>
            </div>

            {/* LEARNER CHRISTMAS TREE SECTION - CLICKABLE PREVIEW */}
            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => { playClickSound(); setStage('Tree'); }}
              className="group w-full text-left bg-gradient-to-b from-sky-200 to-sky-300 rounded-[4rem] p-16 shadow-2xl border-b-12 border-sky-400 overflow-hidden relative transition-all"
            >
              <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/snow.png")' }} />
              
              {/* Snow Hill (눈 동산) */}
              <div className="absolute -bottom-40 -left-1/4 w-[150%] h-80 bg-white rounded-[100%] z-0 pointer-events-none shadow-[inset_0_-20px_40px_rgba(0,0,0,0.05)]" />

              {/* Animated Snowfall Overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {/* Layer 1: Background Snow Pattern */}
                <motion.div 
                  animate={{ y: [0, 600] }}
                  transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-[600px] left-0 w-full h-full opacity-30"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/snow.png")' }}
                />
                {/* Layer 2: Faster Foreground Snow Pattern */}
                <motion.div 
                  animate={{ y: [0, 600] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-[600px] left-0 w-full h-full opacity-20 scale-125"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/snow.png")' }}
                />

                {/* Individual Snowflakes for realistic density */}
                {[...Array(60)].map((_, i) => {
                  const size = Math.random() * 4 + 2;
                  const duration = Math.random() * 8 + 4;
                  const delay = Math.random() * 10;
                  const left = Math.random() * 100;

                  return (
                    <motion.div
                      key={i}
                      initial={{ y: -20, x: `${left}%`, opacity: 0 }}
                      animate={{ 
                        y: 800, 
                        x: [`${left}%`, `${left + (Math.random() * 10 - 5)}%`, `${left}%`],
                        opacity: [0, 0.8, 0.8, 0] 
                      }}
                      transition={{ 
                        duration: duration, 
                        repeat: Infinity, 
                        delay: -delay, // Negative delay to start mid-animation
                        ease: "linear"
                      }}
                      style={{ width: size, height: size }}
                      className="absolute bg-white rounded-full blur-[0.5px] shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                    />
                  );
                })}
              </div>

              <div className="flex flex-col lg:flex-row items-center gap-16 relative z-10">
                <div className="flex-1 relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-red-500 p-3 rounded-2xl shadow-lg relative">
                      <Sparkles className="w-8 h-8 text-white animate-pulse" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-red-600 uppercase tracking-widest">Holiday Edition</span>
                      <span className="text-[10px] font-bold text-sky-700 uppercase tracking-widest">Winter Wonderland ✨</span>
                    </div>
                  </div>

                  <h3 className="text-6xl font-cute font-black text-slate-800 tracking-tighter mb-4 leading-tight">
                    Christmas <span className="text-red-500 underline decoration-white underline-offset-8">Fluency</span> Tree
                  </h3>
                  <p className="text-xl text-slate-600 font-bold leading-relaxed max-w-xl mb-12">
                    Every holiday talk makes your tree grow! Collect festive ornaments and build your magical winter forest! 🎄⛄
                  </p>
                  
                  <div className="flex items-center gap-6 relative">
                    <div className="relative">
                      <div className="px-12 py-5 bg-red-500 text-white rounded-[2rem] font-black text-lg shadow-[0_8px_0_0_#991b1b] group-hover:translate-y-[2px] group-hover:shadow-[0_6px_0_0_#991b1b] transition-all flex items-center gap-3 relative overflow-hidden">
                         <span className="relative z-10">Go to Forest!</span>
                         <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      </div>
                    </div>
                    <div className="text-xs text-red-500 font-black uppercase tracking-[0.3em] animate-bounce">
                      Decorate tree →
                    </div>
                  </div>
                </div>

                <div className="relative w-[600px] h-[800px] flex items-end justify-center perspective-1000 z-10">
                  <div className="relative w-full h-full flex flex-col items-center justify-end">
                    <div className="absolute bottom-4 w-[500px] h-20 bg-white/40 rounded-[100%] blur-2xl shadow-inner z-[1]" />
                    
                    <motion.div 
                      animate={{ 
                        y: [0, -10, 0],
                        rotate: [-1, 1, -1]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                      className="relative w-full h-[750px] flex items-center justify-center p-4"
                    >
                      {/* Santa Claus - Peeking from left */}
                      <motion.img
                        initial={{ opacity: 0, x: -100, rotate: -20, scale: 0.5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.2, type: "spring", bounce: 0.4 }}
                        src="https://img.icons8.com/color/512/santa.png"
                        alt="Cute Santa Claus"
                        className="absolute -left-12 bottom-12 w-64 h-64 object-contain z-20 drop-shadow-2xl"
                        referrerPolicy="no-referrer"
                      />

                      {/* Rudolph - Peeking from right */}
                      <motion.img
                        initial={{ opacity: 0, x: 100, rotate: 20, scale: 0.5 }}
                        whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
                        transition={{ duration: 1.2, delay: 0.4, type: "spring", bounce: 0.4 }}
                        src="https://img.icons8.com/color/512/reindeer.png"
                        alt="Cute Rudolph"
                        className="absolute -right-12 bottom-16 w-60 h-60 object-contain z-20 drop-shadow-2xl scale-x-[-1]"
                        referrerPolicy="no-referrer"
                      />

                      <img 
                        src="https://img.icons8.com/color/512/christmas-tree.png" 
                        alt="Perfect Decorated Christmas Tree" 
                        className="w-full h-full object-contain filter drop-shadow-[0_45px_100px_rgba(255,223,0,0.5)] relative z-10"
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* Gift Boxes - Scattered at base */}
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, delay: 0.8 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end justify-center gap-2 z-30"
                      >
                        <motion.img 
                          animate={{ rotate: [-10, -5, -10], y: [0, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity }}
                          src="https://img.icons8.com/color/512/gift.png" 
                          className="w-28 h-28 object-contain drop-shadow-xl" 
                          alt="Gift 1" 
                          referrerPolicy="no-referrer" 
                        />
                        <motion.img 
                          animate={{ scale: [1, 1.08, 1], rotate: [0, 2, -2, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          src="https://img.icons8.com/color/512/gift.png" 
                          className="w-36 h-36 object-contain drop-shadow-2xl mb-2" 
                          alt="Gift 2" 
                          referrerPolicy="no-referrer" 
                        />
                        <motion.img 
                          animate={{ rotate: [10, 5, 10], y: [0, -4, 0] }}
                          transition={{ duration: 3.5, repeat: Infinity }}
                          src="https://img.icons8.com/color/512/gift.png" 
                          className="w-32 h-32 object-contain drop-shadow-xl" 
                          alt="Gift 3" 
                          referrerPolicy="no-referrer" 
                        />
                      </motion.div>

                      {/* Magical Glow behind the tree */}
                      <div className="absolute inset-0 bg-yellow-400/30 blur-[100px] rounded-full scale-125 -z-10 animate-pulse" />
                      <div className="absolute inset-0 bg-orange-500/15 blur-[60px] rounded-full scale-150 -z-10" />
                      <div className="absolute inset-0 bg-white/40 blur-[40px] rounded-full scale-110 -z-10" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.button>
          </motion.div>
        )}

        {stage === 'Tree' && (
          <motion.div 
            key="tree-forest"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-indigo-50 overflow-y-auto overflow-x-hidden flex flex-col font-round"
          >
            {/* Soft Sky Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-100 via-indigo-50 to-white -z-10" />
            
            {/* Animated Particles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
               {[...Array(15)].map((_, i) => (
                 <motion.div
                   key={i}
                   initial={{ y: -20, x: Math.random() * 100 + '%' }}
                   animate={{ 
                     y: '110vh',
                     x: (Math.random() * 100 - 10) + '%'
                   }}
                   transition={{ 
                     duration: Math.random() * 10 + 10, 
                     repeat: Infinity, 
                     ease: "linear",
                     delay: Math.random() * 10
                   }}
                   className="absolute w-2 h-2 bg-indigo-200 rounded-full opacity-40 blur-[1px]"
                 />
               ))}
            </div>

            {/* Forest Background Decorations */}
            <div className="absolute bottom-0 left-0 right-0 h-64 -z-5 pointer-events-none opacity-40">
               <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full fill-emerald-100">
                  <path d="M0,224L80,202.7C160,181,320,139,480,149.3C640,160,800,224,960,240C1120,256,1280,224,1360,208L1440,192L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
               </svg>
            </div>

            {/* Cute Characters scattered around */}
            <div className="absolute inset-0 pointer-events-none z-10">
            </div>

            {/* Header - Styled to match bright theme */}
            <div className="p-6 md:p-10 flex flex-col sm:flex-row items-center gap-6 justify-between relative z-30">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { playClickSound(); setStage('Dashboard'); }}
                  className="group flex items-center px-8 py-3.5 bg-white rounded-2xl text-slate-700 font-black hover:text-indigo-600 transition-all hover:bg-white border-b-6 border-slate-200 active:border-b-0 active:translate-y-1 shadow-xl"
                >
                  <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> 
                  <span className="tracking-tight">Exit Forest</span>
                </button>
              </div>
              
              <div className="text-center group">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-yellow-400 rounded-full border-b-4 border-yellow-600 mb-2">
                   <Sparkles className="w-4 h-4 text-white animate-pulse" />
                   <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Fluency Garden</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-round font-black text-slate-800 tracking-tight drop-shadow-sm flex items-center gap-4">
                  <span className="text-indigo-600">Your</span>
                  <span className="text-pink-500">Fluency</span>
                  <span className="text-emerald-500">Forest</span>
                </h2>
              </div>
              
              <div className="flex items-center gap-4 bg-white/80 p-3 rounded-2xl border-b-4 border-slate-200">
                <div className="flex flex-col items-center px-4">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ornaments</span>
                   <span className="text-2xl font-black text-indigo-600 leading-none">{treeDecorations.length}</span>
                </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row items-center justify-center p-4 lg:p-12 gap-10 lg:gap-20 relative z-20 max-w-7xl mx-auto w-full">
              {/* Ornament Box - Cuter Design */}
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 20 }}
                className="relative w-full max-w-sm group"
              >
                <div className="bg-white rounded-[3rem] border-b-8 border-slate-200 shadow-2xl overflow-hidden relative">
                  <div className="p-8 relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-2xl font-round font-black text-slate-800 tracking-tight flex items-center gap-3">
                           <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                             <Package className="w-6 h-6 text-amber-500" />
                           </div>
                           Ornament Box
                        </h4>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1 ml-13">Drag your rewards!</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 p-5 rounded-[2.5rem] border-2 border-slate-100 grid grid-cols-2 gap-4 mb-6 max-h-[350px] overflow-y-auto custom-scrollbar">
                      {ORNAMENTS.map(orn => {
                        const count = ornamentInventory[orn.id] || 0;
                        return (
                          <div 
                            key={orn.id}
                            draggable={count > 0}
                            onDragStart={(e) => {
                              if (count > 0) {
                                playDragSound();
                                e.dataTransfer.setData('ornamentId', orn.id);
                              }
                            }}
                            className={cn(
                              "group flex flex-col items-center gap-2 p-4 rounded-[2rem] border-2 transition-all relative overflow-hidden",
                              count > 0 
                                ? "bg-white border-slate-200 cursor-grab active:cursor-grabbing hover:border-indigo-300 hover:scale-105 shadow-sm hover:shadow-md" 
                                : "bg-slate-100/50 border-slate-100 opacity-30 grayscale cursor-not-allowed"
                            )}
                          >
                            <div className={cn(
                               "p-3 rounded-2xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform",
                               orn.color?.replace('text-', 'bg-').replace('300', '100').replace('400', '100').replace('500', '100') || 'bg-slate-100'
                            )}>
                              {React.cloneElement(orn.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
                            </div>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-center leading-none mt-1">{orn.label.split(' ')[0]}</span>
                            
                            {/* Count Badge */}
                            <div className={cn(
                              "absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shadow-sm",
                              count > 0 ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-400"
                            )}>
                              {count}
                            </div>


                          </div>
                        );
                      })}
                    </div>

                    <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-100 text-center">
                       <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-widest leading-relaxed flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-3 h-3" />
                          Drag onto the tree!
                       </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => { if(window.confirm('Clear all decorations from your garden?')) { playClickSound(); setTreeDecorations([]); } }}
                  className="mt-6 w-full py-4 text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.3em] transition-all bg-white/50 backdrop-blur rounded-2xl hover:bg-white"
                >
                  [ Clear All Decorations ]
                </button>
              </motion.div>

              {/* The Tree Focus */}
              <div 
                className="relative w-full max-w-[500px] h-[650px] lg:h-[850px] flex items-end justify-center z-10"
              >
                <div className="relative w-full h-full flex flex-col items-center justify-end">
                  {/* Soft Ground Shadow */}
                  <div className="absolute bottom-12 w-[120%] h-20 bg-slate-900/5 rounded-[100%] blur-3xl -z-10" />
                  
                  {/* THE MAGIC TREE */}
                  <div 
                    id="tree-container" 
                    ref={treeRef}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleTreeDrop}
                    className="relative w-full h-[700px] flex flex-col items-center justify-end group"
                  >
                    <div className="absolute inset-0 flex items-end justify-center overflow-visible">
                      <svg id="tree-svg-illustration" viewBox="0 0 400 600" className="w-[125%] h-full drop-shadow-[0_20px_40px_rgba(0,0,0,0.1)] overflow-visible">
                        <defs>
                          <linearGradient id="softTrunk" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#824b2f" />
                            <stop offset="50%" stopColor="#a16241" />
                            <stop offset="100%" stopColor="#6d3a24" />
                          </linearGradient>
                          
                          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#34d399" />
                            <stop offset="100%" stopColor="#10b981" />
                          </linearGradient>
                          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#059669" />
                            <stop offset="100%" stopColor="#065f46" />
                          </linearGradient>

                          <filter id="gentleShadow">
                            <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.1"/>
                          </filter>
                        </defs>

                        {/* Round Trunk */}
                        <rect x="175" y="480" width="50" height="80" rx="25" fill="url(#softTrunk)" />
                        
                        {/* Fluffy Tiers */}
                        {/* Tier 3 (Bottom) */}
                        <g filter="url(#gentleShadow)">
                          <path d="M40 480 C40 400 360 400 360 480 C360 520 320 500 280 500 C240 500 220 530 200 530 C180 530 160 500 120 500 C80 500 40 520 40 480 Z" fill="url(#leafGrad3)" />
                        </g>

                        {/* Tier 2 */}
                        <g filter="url(#gentleShadow)">
                          <path d="M80 370 C80 290 320 290 320 370 C320 410 280 390 240 390 C220 390 210 420 200 420 C190 420 180 390 160 390 C120 390 80 410 80 370 Z" fill="url(#leafGrad2)" />
                        </g>

                        {/* Tier 1 (Top) */}
                        <g filter="url(#gentleShadow)">
                          <path d="M120 250 C120 120 280 120 280 250 C280 290 240 270 200 270 C160 270 120 290 120 250 Z" fill="url(#leafGrad1)" />
                        </g>
                      </svg>
                    </div>

                    {/* The Big Top Star - Elevated and Glowing */}
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.15, 1],
                        rotate: [-5, 5, -5]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-24 z-[60] cursor-pointer"
                      onClick={() => playClickSound()}
                    >
                      <svg viewBox="0 0 100 100" className="w-24 h-24 filter drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">
                         <path 
                           d="M50 5 L63 38 L95 38 L69 59 L79 92 L50 72 L21 92 L31 59 L5 38 L37 38 Z" 
                           fill="#facc15"
                           stroke="#eab308"
                           strokeWidth="2"
                           strokeLinejoin="round"
                         />
                         {/* Kawaii Face on Star - Using SVG elements */}
                         <circle cx="42" cy="50" r="2.5" fill="#854d0e" />
                         <circle cx="58" cy="50" r="2.5" fill="#854d0e" />
                         <path d="M46 60 Q50 64 54 60" stroke="#854d0e" strokeWidth="2" fill="none" strokeLinecap="round" />
                      </svg>
                    </motion.div>

                    {/* Placed Ornaments Stacking Context */}
                    <div className="absolute inset-0 z-50 overflow-visible pointer-events-none">
                      <AnimatePresence>
                        {treeDecorations.map((dec) => {
                          const orn = ORNAMENTS.find(o => o.id === dec.itemId);
                          return (
                            <motion.div
                              key={dec.id}
                              initial={{ scale: 0, opacity: 0, y: -20 }}
                              animate={{ scale: 1, opacity: 1, y: 0 }}
                              exit={{ scale: 0, opacity: 0 }}
                              whileHover={{ scale: 1.3, zIndex: 100 }}
                              style={{ 
                                position: 'absolute', 
                                left: `${dec.x}%`, 
                                top: `${dec.y}%`, 
                                transform: 'translate(-50%, -50%)',
                                pointerEvents: 'auto'
                              }}
                              className="cursor-pointer group p-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeDecoration(dec.id!);
                              }}
                            >
                              <div className="relative group/orn">
                                 {/* Optional hover glow */}
                                 <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover/orn:opacity-100 transition-opacity -z-10" />
                                 
                                 <div className="w-12 h-12 flex items-center justify-center transition-all group-hover/orn:scale-110 drop-shadow-2xl">
                                   <OrnamentImage id={dec.itemId} />
                                 </div>
                                 
                                 <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/orn:opacity-100 transition-all whitespace-nowrap bg-white/90 backdrop-blur-sm text-[10px] font-black text-slate-700 px-3 py-1 rounded-full shadow-xl border border-white/50 pointer-events-none scale-0 group-hover/orn:scale-100 origin-top z-50">
                                    {orn?.label}
                                 </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Summary Section - Re-styled */}
              <div className="hidden xl:flex flex-col gap-6 w-full max-w-sm">
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 backdrop-blur-xl p-8 rounded-[3.5rem] border-b-6 border-slate-200"
                >
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-indigo-500" />
                     </div>
                     <h4 className="text-xl font-round font-black text-slate-800">Growth Stats</h4>
                  </div>

                  <div className="space-y-6">
                    {ORNAMENTS.map(orn => {
                       const count = treeDecorations.filter(d => d.itemId === orn.id).length;
                       const progress = Math.min((count / 5) * 100, 100); // Only 5 needed for full bar now
                       
                       // Manually define background colors to avoid replacement logic issues
                       const colors: Record<string, string> = {
                         star: 'bg-amber-400',
                         bell: 'bg-yellow-400',
                         gift: 'bg-pink-400',
                         ball: 'bg-emerald-400',
                         light: 'bg-orange-300',
                         candy: 'bg-rose-500',
                         snow: 'bg-sky-300',
                         gingerbread: 'bg-orange-800',
                         rudolph: 'bg-red-800',
                         santa_orn: 'bg-red-600'
                       };
                       
                       const barColor = colors[orn.id] || 'bg-indigo-500';

                       return (
                        <div key={orn.id} className="flex flex-col gap-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <div className={cn("p-1.5 rounded-lg bg-slate-50 border border-slate-100")}>
                                   {React.cloneElement(orn.icon as React.ReactElement<any>, { className: 'w-4 h-4 ' })}
                                 </div>
                                 <span className="text-[10px] font-black text-slate-500 tracking-wider uppercase">{orn.label}</span>
                              </div>
                              <span className="text-slate-800 font-black text-xs">{count} Placed</span>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/50 p-[1px]">
                              <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progress}%` }}
                                 className={cn("h-full rounded-full transition-all duration-1000 shadow-sm", barColor)} 
                              />
                           </div>
                        </div>
                       );
                    })}
                  </div>
                  
                  <div className="mt-10 p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl border border-white/10">
                     <p className="text-center text-xs font-bold text-indigo-200 leading-relaxed">
                        Complete more sessions to earn more decorations! Each ornament represents a speaking milestone.
                     </p>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Decor - Top Edge */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-500 opacity-10 blur-sm pointer-events-none" />
          </motion.div>
        )}

        {stage === 'StrategyGame' && (
          <StrategyGame 
            onWin={handleGameWin}
            onBack={() => setStage('StrategyLearning')}
          />
        )}

        {stage === 'History' && (
          <motion.div 
            key="history"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto py-16 px-6"
          >
            <div className="flex items-center justify-between mb-16 gap-4">
              <button 
                onClick={() => { playClickSound(); setStage('Dashboard'); }}
                className="flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
                <span>Back</span>
              </button>
              <div className="text-center">
                <h2 className="text-5xl font-cute font-black text-slate-800 tracking-tighter">My Progress Box</h2>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <Sparkles className="w-4 h-4 text-pink-400" />
                  <p className="text-[10px] text-pink-500 font-black uppercase tracking-[0.2em]">Learning Diagnostics</p>
                  <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <div className="w-32 hidden md:block"></div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 shadow-2xl relative overflow-hidden">
                <div className="absolute top-10 right-10 w-32 h-32 opacity-20 grayscale">
                   <img src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" alt="" className="w-full h-full object-contain" />
                </div>
                <div className="w-24 h-24 bg-indigo-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                  <BrainCircuit className="w-12 h-12 text-indigo-300" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">The Box is Empty! 📦</h3>
                <p className="text-slate-400 font-bold max-w-sm mx-auto">Complete your first mission to see your speaking stats here!</p>
              </div>
            ) : (() => {
              const totalTurns = history.reduce((sum, h) => sum + h.turns, 0);
              const avgTurns = totalTurns / history.length;
              const strategyCounts: Record<string, number> = {};
              history.forEach(h => h.strategiesUsed.forEach(s => strategyCounts[s] = (strategyCounts[s] || 0) + 1));
              const uniqueStrategies = Object.keys(strategyCounts).length;
              
              let learnerType = "Rising Speaker";
              let learnerAvatar = "https://cdn-icons-png.flaticon.com/512/2663/2663067.png"; // Bunny
              let learnerDesc = "You are starting to find your voice. Keep practicing to unlock more strategies!";
              let learnerColor = "bg-indigo-500";

              if (avgTurns > 10 && uniqueStrategies > 4) {
                learnerType = "Master Talker";
                learnerAvatar = "https://cdn-icons-png.flaticon.com/512/4775/4775505.png"; // bear
                learnerDesc = "You flexibly use various strategies to maintain conversation flow effectively!";
                learnerColor = "bg-amber-500";
              } else if (uniqueStrategies < 2 && avgTurns < 5) {
                learnerType = "Shy Penguin";
                learnerAvatar = "https://cdn-icons-png.flaticon.com/512/6988/6988831.png"; // cat
                learnerDesc = "You tend to stop when stuck. Don't worry, even short talks are great progress!";
                learnerColor = "bg-blue-500";
              }

              return (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                      whileHover={{ y: -8 }}
                      className={cn("lg:col-span-2 rounded-[4rem] p-10 text-white shadow-3xl relative overflow-hidden flex flex-col md:flex-row items-center gap-10", learnerColor)}
                    >
                      <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
                      
                      <div className="relative w-48 h-48 bg-white/20 rounded-[3rem] p-4 backdrop-blur-xl border-4 border-white/30 shrink-0">
                         <img src={learnerAvatar} alt="" className="w-full h-full object-contain filter drop-shadow-2xl" referrerPolicy="no-referrer" />
                      </div>
                      
                      <div className="relative z-10 text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 bg-white/20 rounded-full font-black text-[10px] uppercase tracking-widest mb-3">AI Diagnostic Report</span>
                        <h3 className="text-5xl font-cute font-black mb-4 tracking-tighter">{learnerType}</h3>
                        <p className="text-white/80 font-black text-lg leading-relaxed mb-8 italic">"{learnerDesc}"</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                          <div className="bg-white/10 rounded-3xl px-6 py-3 border border-white/20 backdrop-blur-sm">
                             <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Total Turns</p>
                             <p className="text-3xl font-black">{totalTurns}</p>
                          </div>
                          <div className="bg-white/10 rounded-3xl px-6 py-3 border border-white/20 backdrop-blur-sm">
                             <p className="text-[10px] text-white/60 font-black uppercase tracking-widest mb-1">Sessions</p>
                             <p className="text-3xl font-black">{history.length}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    <div className="bg-white rounded-[3.5rem] p-10 flex flex-col items-center justify-center text-center shadow-2xl border-b-12 border-slate-100">
                       <div className="w-20 h-20 bg-emerald-100 rounded-[2rem] flex items-center justify-center mb-6 rotate-6 shadow-inner">
                          <TrendingUp className="w-10 h-10 text-emerald-500" />
                       </div>
                       <h4 className="text-2xl font-black text-slate-800 mb-2">Growth Goal</h4>
                       <p className="text-sm font-bold text-slate-400 mb-6 leading-relaxed">
                         You have unlocked <strong>{uniqueStrategies}/7</strong> conversation boosters!
                       </p>
                       <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(uniqueStrategies / 7) * 100}%` }}
                            className="h-full bg-emerald-500 rounded-full shadow-lg"
                          />
                       </div>
                       <p className="mt-4 text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Almost there! ✨</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-[4rem] p-12 shadow-2xl border-b-12 border-slate-100">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg border-b-4 border-indigo-700">
                           <Target className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-3xl font-cute font-black text-slate-800">Favorite Boosters</h3>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6">
                           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Most Frequent Techniques</p>
                           {Object.entries(strategyCounts)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 3)
                            .map(([sId, count], i) => {
                              const strategy = STRATEGIES.find(s => s.id === sId);
                              return (
                                <div key={sId} className="flex items-center gap-6 group">
                                   <div className="text-4xl font-cute font-black text-indigo-100 group-hover:text-indigo-200 transition-colors shrink-0">0{i+1}</div>
                                   <div className="flex-1">
                                      <div className="flex justify-between items-end mb-2">
                                         <h5 className="font-black text-slate-700 text-lg">{strategy?.name.split(' (')[0]}</h5>
                                         <span className="text-[10px] font-black text-indigo-500 uppercase">{count} times</span>
                                      </div>
                                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                         <motion.div 
                                          initial={{ width: 0 }}
                                          animate={{ width: `${(count / totalTurns) * 100}%` }}
                                          className="h-full bg-indigo-500 rounded-full"
                                         />
                                      </div>
                                   </div>
                                </div>
                              );
                            })}
                        </div>
                        
                        <div className="bg-amber-50 rounded-[3rem] p-8 border-4 border-amber-100/50 relative">
                           <div className="absolute -top-6 -right-4 w-20 h-20 rotate-12">
                              <img src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" alt="" className="w-full h-full object-contain filter brightness-90 grayscale opacity-20" />
                           </div>
                           <h4 className="flex items-center gap-3 text-amber-700 font-black text-lg mb-6">
                              <Lightbulb className="w-6 h-6" />
                              AI Tips for You!
                           </h4>
                           <ul className="space-y-5">
                              {[
                                `Keep using "${STRATEGIES.find(s => s.id === Object.entries(strategyCounts).sort((a,b)=>b[1]-a[1])[0]?.[0])?.name.split(' (')[0] || 'your core boosters'}" - it's your superpower!`,
                                "Try using 'Filler' strategies when you need time to think (Um... What was I saying?)",
                                "Unlock a special 'Growth Ornament' by trying a new scenario today!"
                              ].map((tip, i) => (
                                <li key={i} className="flex gap-4">
                                   <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-black text-amber-600 shrink-0 shadow-sm">{i+1}</div>
                                   <p className="text-sm font-bold text-amber-900 leading-relaxed">{tip}</p>
                                </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <h3 className="text-2xl font-black text-slate-800 px-6">Mission Logs</h3>
                     <div className="space-y-4">
                        {history.slice(0, 5).map((log) => (
                          <motion.div 
                            key={log.id} 
                            whileHover={{ x: 10 }}
                            className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 hover:shadow-xl transition-all cursor-pointer group"
                          >
                            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                               <div className="flex flex-row items-center gap-6">
                                  <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-300 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all border-b-4 border-slate-100 group-hover:border-indigo-100">
                                     <Bot className="w-8 h-8" />
                                  </div>
                                  <div>
                                     <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none block mb-1">{log.level} MISSION</span>
                                     <h4 className="text-2xl font-black text-slate-800 tracking-tight">{log.scenarioTitle}</h4>
                                     <div className="flex items-center gap-3 text-slate-400 font-bold text-[10px] mt-1">
                                        <span>{new Date(log.timestamp).toLocaleDateString()}</span>
                                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                                        <span>{log.turns} Turns Complete</span>
                                     </div>
                                  </div>
                               </div>
                               
                               <div className="flex items-center gap-2">
                                  {log.strategiesUsed.slice(0, 3).map((sId, i) => (
                                    <div key={i} className="px-4 py-2 bg-slate-50 rounded-full border-2 border-slate-100 text-[10px] font-black text-slate-500 shadow-sm">
                                       {STRATEGIES.find(s => s.id === sId)?.name.split(' (')[0].toUpperCase()}
                                    </div>
                                  ))}
                                  {log.strategiesUsed.length > 3 && (
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-black text-indigo-600 border-2 border-white shadow-sm">
                                       +{log.strategiesUsed.length - 3}
                                    </div>
                                  )}
                               </div>
                            </div>
                          </motion.div>
                        ))}
                     </div>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}



        {stage === 'StrategyIntro' && selectedScenario && (
          <motion.div 
            key="strategy-intro"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-3xl mx-auto py-16 px-6 relative"
          >
            <button 
              onClick={() => { playClickSound(); setStage('Dashboard'); }}
              className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
              <span>Back</span>
            </button>
            
            <div className="bg-white rounded-[4rem] overflow-hidden shadow-3xl border-b-12 border-slate-100 relative">
              <div className="h-64 w-full relative">
                <img 
                  src={selectedScenario.imageUrl} 
                  alt={selectedScenario.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
                <div className="absolute -bottom-10 right-12 w-32 h-32 bg-white rounded-[2.5rem] p-4 shadow-3xl border-4 border-slate-50 rotate-6 flex items-center justify-center z-20">
                   <img src={selectedScenario.characterImageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="p-12 pt-6">
                <div className="flex flex-col items-center text-center mb-10">
                   <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500 rounded-full border-b-4 border-indigo-700 mb-4">
                      <Zap className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Strategy Booster</span>
                   </div>
                   <h2 className="text-5xl font-cute font-black text-slate-800 tracking-tighter mb-2">{selectedScenario.title}</h2>
                   <p className="text-indigo-400 font-bold text-xl">{selectedScenario.koreanTitle}</p>
                </div>

                <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-10 border-2 border-slate-100 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none translate-x-8 -translate-y-8">
                      <Sparkles className="w-full h-full text-indigo-500" />
                   </div>
                   <div className="mb-4">
                      <h4 className="text-xl font-black text-slate-800 mb-1">
                        {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.name}
                      </h4>
                      <h5 className="text-sm font-bold text-indigo-500">
                        {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.koreanName}
                      </h5>
                   </div>
                   <p className="text-base text-slate-600 font-bold leading-relaxed">
                      {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.description}
                   </p>
                </div>

                <button 
                  onClick={() => { playClickSound(); handleStartLearning(); }}
                  className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#4338ca] hover:translate-y-[2px] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
                >
                  Start Training! 🚀
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'StrategyLearning' && selectedScenario && (
          <motion.div 
            key="strategy-learning"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto py-16 px-6 relative"
          >
            <button 
              onClick={() => { playClickSound(); setStage('StrategyIntro'); }}
              className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white rounded-2xl font-black text-slate-500 hover:text-slate-900 border-b-4 border-slate-100 active:translate-y-1 active:border-b-0 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
              <span>Back</span>
            </button>
            <div className="bg-white rounded-[4rem] p-12 shadow-3xl border-b-12 border-slate-100 relative">
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
                <div className="text-center md:text-left">
                  <h2 className="text-4xl font-cute font-black text-slate-800 mb-2">Secret Training 🕵️‍♂️</h2>
                  <p className="text-slate-400 font-bold">Learn the special tricks for this mission!</p>
                </div>
                <div className="w-32 h-32 p-4 bg-indigo-50 rounded-[2.5rem] border-4 border-white shadow-xl rotate-3">
                   <img src="https://cdn-icons-png.flaticon.com/512/4775/4775485.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
              </div>

              <div className="space-y-8 mb-10">
                <div className="p-8 bg-indigo-50 rounded-[3rem] border-2 border-indigo-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-5 translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform">
                     <Target className="w-full h-full text-indigo-500" />
                  </div>
                  <h4 className="font-black text-indigo-900 mb-4 flex items-center gap-3 text-lg">
                    <span className="w-8 h-8 bg-indigo-200 rounded-lg flex items-center justify-center text-sm">01</span>
                    When to use it?
                  </h4>
                  <p className="text-indigo-800 font-bold mb-2 text-xl leading-snug">{STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.whenToUse}</p>
                  <p className="text-indigo-400 font-bold text-sm italic">({STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.koreanWhenToUse})</p>
                </div>

                <div>
                  <h4 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-2xl">
                    <Zap className="w-6 h-6 text-emerald-500" />
                    Sentence Starters
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.starters.map((starter, i) => (
                      <div key={i} className="px-6 py-4 bg-slate-50 border-b-4 border-slate-100 rounded-2xl text-indigo-700 font-black">
                        "{starter}"
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-slate-800 mb-6 flex items-center gap-3 text-2xl">
                    <BookOpen className="w-6 h-6 text-indigo-500" />
                    Challenge Examples
                  </h4>
                  <div className="space-y-4">
                    {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.examples.map((ex, i) => (
                      <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border-l-8 border-indigo-500 shadow-sm">
                        <p className="font-black text-slate-900 text-xl mb-1 leading-tight">"{ex.english}"</p>
                        <p className="text-slate-400 font-bold italic">{ex.korean}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <button 
                  onClick={() => { playClickSound(); handleStartStage1(); }}
                  className="flex-1 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#4338ca] hover:translate-y-[2px] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                  <MessageSquare className="w-6 h-6 group-hover:scale-125 transition-transform" />
                  START TALKING!
                </button>
                <button 
                  onClick={() => { playClickSound(); setStage('StrategyGame'); }}
                  className="px-12 py-6 bg-amber-500 text-white rounded-[2rem] font-black text-2xl shadow-[0_10px_0_0_#d97706] hover:translate-y-[2px] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 group"
                >
                  <Gamepad2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  PLAY GAME!
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {(stage === 'Stage1' || stage === 'Stage2' || stage === 'FreeSpeaking') && (
          <motion.div 
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen bg-[#FFFBF0]"
          >
            {/* Playful Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

            {/* Chat Header */}
            <header className="px-6 py-4 border-b-6 border-slate-100 flex items-center justify-between bg-white relative z-20">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => { playClickSound(); setStage('Dashboard'); }}
                  className="p-3 hover:bg-indigo-50 rounded-2xl transition-all text-slate-400 hover:text-indigo-600"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                {stage !== 'FreeSpeaking' && selectedScenario?.imageUrl && (
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-indigo-100 hidden sm:block bg-white p-1 shadow-md">
                    <img src={selectedScenario.characterImageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight">
                    {stage === 'FreeSpeaking' ? 'Talk to AI Friends' : selectedScenario?.characterName}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                     <div className="flex items-center gap-1.5">
                       <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                       <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest leading-none">
                         {stage === 'Stage1' ? `Mission: Practice English` : stage === 'Stage2' ? 'Real Conversation' : 'Free Talking'}
                       </p>
                     </div>
                     {stage !== 'FreeSpeaking' && selectedScenario && (
                       <div className="flex items-center gap-2 px-2 py-0.5 bg-indigo-50 rounded-lg border border-indigo-100">
                         <Zap className="w-2.5 h-2.5 text-indigo-500" />
                         <span className="text-[9px] font-black text-indigo-600 uppercase tracking-tighter">
                           {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.name.split(' (')[0]} / {STRATEGIES.find(s => s.id === selectedScenario.strategyId)?.koreanName}
                         </span>
                       </div>
                     )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:flex flex-col items-end mr-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mission Progress</span>
                  <div className="flex gap-1.5 h-2">
                     {[...Array(level ? LEVELS[level].minTurns : 10)].map((_, i) => (
                       <div 
                        key={i} 
                        className={cn(
                          "w-4 rounded-full transition-all",
                          i < messages.filter(m => m.role === 'user').length ? "bg-indigo-500 w-6" : "bg-slate-100"
                        )} 
                       />
                     ))}
                  </div>
                </div>
                <button 
                  onClick={() => { playClickSound(); finishSession(); }}
                  disabled={isTyping}
                  className="px-8 py-3 bg-pink-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_4px_0_0_#db2777] hover:translate-y-[2px] hover:shadow-[0_2px_0_0_#db2777] active:shadow-none active:translate-y-[4px] transition-all disabled:opacity-50"
                >
                  {isTyping ? 'Analyzing...' : 'Finish!'}
                </button>
              </div>
            </header>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-10 relative z-10 scrollbar-hide">
              {messages.map((m) => (
                <div 
                  key={m.id}
                  className={cn(
                    "flex w-full",
                    m.role === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex gap-4 max-w-[90%] md:max-w-[70%] relative",
                    m.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}>
                    {/* Avatar */}
                    <div className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mt-2 shadow-lg border-2 border-white overflow-hidden",
                      m.role === 'user' ? "bg-indigo-400" : "bg-white"
                    )}>
                      {m.role === 'user' ? (
                        user?.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-white" />
                      ) : (
                        <div className="w-full h-full p-1 bg-white">
                           <img 
                            src={selectedScenario?.characterImageUrl || "https://cdn-icons-png.flaticon.com/512/2663/2663067.png"} 
                            alt="" 
                            className="w-full h-full object-contain" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>

                    <div className={cn(
                      "flex flex-col",
                      m.role === 'user' ? "items-end" : "items-start"
                    )}>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 mx-2">
                        {m.role === 'user' ? 'Me' : (selectedScenario?.characterName || 'AI Friend')}
                      </span>

                      <div className={cn(
                        "p-5 rounded-[2.5rem] text-base leading-relaxed shadow-xl border-b-6 relative group",
                        m.role === 'user' 
                          ? "bg-indigo-500 text-white border-indigo-700/50 rounded-tr-none" 
                          : "bg-white text-slate-800 border-slate-200 rounded-tl-none"
                      )}>
                        {/* Bubble Tail */}
                        {m.role === 'user' ? (
                           <div className="absolute -top-0 -right-2 w-6 h-6 bg-indigo-500 rounded-br-full -z-10" />
                        ) : (
                           <div className="absolute -top-0 -left-2 w-6 h-6 bg-white rounded-bl-full -z-10" />
                        )}

                        <div className="prose prose-sm md:prose-base max-w-none prose-p:leading-relaxed prose-strong:text-inherit">
                          <ReactMarkdown>{m.content}</ReactMarkdown>
                        </div>

                        {m.role === 'ai' && (
                          <button 
                            onClick={() => { playClickSound(); speak(m.content); }}
                            className="absolute -right-12 top-0 p-3 bg-white rounded-2xl shadow-lg border border-slate-100 text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100"
                          >
                            <Volume2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>

                      {/* Strategy Badge */}
                      {m.role === 'user' && m.strategyUsed && m.strategyUsed.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3 mr-2">
                          {m.strategyUsed.map(sId => {
                            const strategy = STRATEGIES.find(st => st.id === sId);
                            return (
                              <div key={sId} className="flex items-center gap-2 bg-emerald-600 text-white px-3 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg ring-2 ring-white/20 animate-in fade-in slide-in-from-top-1 duration-300">
                                <Sparkles className="w-3 h-3 fill-white/20" />
                                <div className="flex flex-col items-start gap-0.5">
                                  <span className="whitespace-nowrap">{strategy?.name.split(' / ')[0]}</span>
                                  <span className="text-[8px] opacity-80 font-medium normal-case tracking-normal">{strategy?.koreanName}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                   <div className="bg-white p-5 rounded-[2rem] rounded-tl-none flex gap-2 shadow-lg border-b-6 border-slate-100">
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-indigo-200 rounded-full" />
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-indigo-400 rounded-full" />
                    <motion.span animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-indigo-600 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-6 md:p-8 bg-white border-t-6 border-slate-100 relative z-20">
               <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => { playClickSound(); toggleRecording(); }}
                    className={cn(
                      "w-16 h-16 rounded-[1.5rem] transition-all flex items-center justify-center flex-shrink-0 shadow-lg border-b-6 active:translate-y-1 active:border-b-0",
                      isRecording 
                        ? "bg-red-500 text-white border-red-700 animate-pulse shadow-red-200" 
                        : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                    )}
                  >
                    {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                  </button>
                  
                  <div className="relative flex-grow h-16">
                     <input 
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (isRecording) {
                            toggleRecording(true);
                          } else {
                            sendMessage();
                          }
                        }
                      }}
                      placeholder="Tell me more..."
                      className={cn(
                        "w-full h-full pl-6 pr-20 bg-slate-50 border-4 rounded-[1.8rem] outline-none transition-all text-base font-black text-slate-800 placeholder:text-slate-300",
                        isRecording ? "border-red-300 ring-8 ring-red-50" : "border-slate-100 focus:border-indigo-400 focus:bg-white"
                      )}
                    />
                    <button 
                      onClick={() => { playClickSound(); isRecording ? toggleRecording(true) : sendMessage(); }}
                      disabled={(isRecording ? false : !inputValue.trim()) || isTyping || isTranscribing}
                      className="absolute right-2 top-2 bottom-2 w-16 bg-indigo-500 text-white rounded-[1.2rem] flex items-center justify-center shadow-lg hover:bg-indigo-600 disabled:opacity-30 disabled:grayscale"
                    >
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'Results' && sessionResult && (
          <motion.div 
            key="results"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-4xl mx-auto py-20 px-6"
          >
            <div className="text-center mb-16 relative">
               {/* Celebratory Character */}
               <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                className="w-40 h-40 mx-auto mb-6 relative"
               >
                 <img src="https://cdn-icons-png.flaticon.com/512/2663/2663067.png" alt="Happy Bunny" className="w-full h-full object-contain filter drop-shadow-2xl" referrerPolicy="no-referrer" />
                 <motion.div 
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="absolute -top-4 -right-2 bg-yellow-400 p-2 rounded-2xl shadow-lg border-4 border-white rotate-12"
                 >
                    <Trophy className="w-8 h-8 text-white" />
                 </motion.div>
               </motion.div>
               <h2 className="text-6xl font-cute font-black text-slate-800 tracking-tighter drop-shadow-sm">Mission Clear! ✨</h2>
               <p className="text-indigo-500 font-black uppercase tracking-[0.3em] text-sm mt-2 font-round">Great talk, {user?.displayName || 'Adventurer'}!</p>
            </div>

            <div className="space-y-12">
              {lastEarnedOrnament && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-indigo-500 rounded-[3.5rem] p-10 text-center text-white shadow-3xl relative overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
                  <motion.div 
                    animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-28 h-28 bg-white/20 backdrop-blur-xl rounded-[2rem] mx-auto flex items-center justify-center border-4 border-white/30 shadow-2xl relative z-10 mb-8"
                  >
                    {React.cloneElement(ORNAMENTS.find(o => o.id === lastEarnedOrnament)?.icon as React.ReactElement<any>, { className: 'w-16 h-16 text-white' })}
                  </motion.div>
                  <h3 className="text-4xl font-black mb-2 tracking-tight">New Treasure! 💎</h3>
                  <p className="text-indigo-100 font-bold uppercase tracking-[0.2em] text-sm mb-6">
                    {ORNAMENTS.find(o => o.id === lastEarnedOrnament)?.label} UNLOCKED
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button 
                      onClick={() => { playClickSound(); setStage('Tree'); }}
                      className="px-10 py-4 bg-white text-indigo-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl shadow-black/20"
                    >
                      Decorate Tree 🎄
                    </button>
                  </div>
                  
                  <Sparkles className="absolute top-10 left-10 w-8 h-8 text-yellow-300 animate-pulse" />
                  <Sparkles className="absolute bottom-10 right-10 w-6 h-6 text-yellow-200 opacity-50" />
                </motion.div>
              )}

              <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-b-12 border-slate-100 relative overflow-hidden group">
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04] transition-opacity" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                  <div className="w-32 h-32 bg-yellow-400 rounded-[2.5rem] flex items-center justify-center shrink-0 shadow-[0_8px_0_0_#d97706] rotate-3">
                    <Star className="w-16 h-16 text-white fill-white animate-pulse" />
                  </div>
                  <div className="text-center md:text-left flex-1">
                    <h2 className="text-4xl font-black text-slate-800 mb-2 leading-tight">{sessionResult.overview.title}</h2>
                    <p className="text-slate-500 font-bold text-lg mb-6 leading-relaxed max-w-lg">{sessionResult.overview.summary}</p>
                    
                    <div className="flex flex-wrap justify-center md:justify-start gap-4">
                      {[
                        { label: 'Flow', value: sessionResult.overview.scores.flow, color: 'bg-indigo-50 text-indigo-600 border-indigo-100' },
                        { label: 'Strategy', value: sessionResult.overview.scores.strategyUse, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                        { label: 'Recovery', value: sessionResult.overview.scores.recovery, color: 'bg-pink-50 text-pink-600 border-pink-100' }
                      ].map((score, i) => (
                        <div key={i} className={cn("px-6 py-3 rounded-2xl border-b-4 font-black flex flex-col items-center min-w-[100px]", score.color)}>
                            <span className="text-[10px] uppercase tracking-widest opacity-60 mb-1">{score.label}</span>
                            <span className="text-2xl">{score.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-12 p-8 bg-slate-50 rounded-[2rem] text-slate-600 font-bold italic text-center relative border-2 border-slate-100"
                >
                  <p className="relative z-10 text-lg">"{sessionResult.overview.comment}"</p>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-6 py-1 rounded-full border-2 border-slate-100 text-[10px] font-black uppercase text-slate-400 shadow-sm">AI Tutor Feedback</div>
                </motion.div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-b-12 border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center shadow-inner">
                        <Activity className="w-7 h-7 text-indigo-500" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-800">Booster Power</h3>
                  </div>
                  <div className="space-y-8">
                    <div className="p-6 bg-indigo-500 text-white rounded-3xl shadow-lg relative overflow-hidden group">
                       <Sparkles className="absolute -right-4 -top-4 w-16 h-16 opacity-20 group-hover:rotate-12 transition-transform" />
                       <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Target Booster</p>
                       <h4 className="text-xl font-black truncate">
                       {sessionResult.strategyPerformance.targetStrategy.split(' (')[0]} / {STRATEGIES.find(s => s.name.startsWith(sessionResult.strategyPerformance.targetStrategy.split(' (')[0]))?.koreanName}
                    </h4>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {[
                        { label: 'Used', val: sessionResult.strategyPerformance.usedCount, col: 'text-indigo-600' },
                        { label: 'Great', val: sessionResult.strategyPerformance.successfulCount, col: 'text-emerald-500' },
                        { label: 'Missed', val: sessionResult.strategyPerformance.missedChances, col: 'text-pink-400' }
                      ].map((stat, i) => (
                        <div key={i} className="flex flex-col">
                           <span className={cn("text-3xl font-black mb-1", stat.col)}>{stat.val}</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                      ))}
                    </div>

                    <div className="p-6 border-4 border-slate-50 rounded-3xl text-sm font-bold text-slate-500 leading-relaxed bg-slate-50/30">
                      {sessionResult.strategyPerformance.qualityAnalysis}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border-b-12 border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center shadow-inner text-pink-500">
                        <Zap className="w-7 h-7" />
                     </div>
                     <h3 className="text-2xl font-black text-slate-800">Action Replay</h3>
                  </div>
                  <div className="space-y-4 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                    {sessionResult.moments.length > 0 ? sessionResult.moments.map((m, i) => (
                      <div key={i} className={cn(
                        "p-6 rounded-3xl border-b-6 relative overflow-hidden transition-all hover:translate-x-2",
                        m.type === 'breakdown' ? "bg-pink-50 border-pink-200" : "bg-emerald-50 border-emerald-200"
                      )}>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{m.timestamp}</span>
                          <span className={cn(
                            "text-[10px] font-black px-3 py-1 rounded-full uppercase shadow-sm border-2",
                            m.type === 'breakdown' ? "bg-white text-pink-500 border-pink-100" : "bg-white text-emerald-500 border-emerald-100"
                          )}>{m.type}</span>
                        </div>
                        <p className="text-base font-black text-slate-800 mb-2 leading-tight">{m.situation}</p>
                        <p className="text-xs font-bold text-slate-500 leading-relaxed italic">"{m.analysis}"</p>
                      </div>
                    )) : (
                      <div className="text-center py-16 text-slate-300 font-bold italic">No special moments analyzed!</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 pt-8">
                <button 
                  onClick={() => { playClickSound(); setStage('Dashboard'); }}
                  className="flex-1 py-6 bg-indigo-500 text-white rounded-[2rem] font-black text-xl shadow-[0_10px_0_0_#4338ca] hover:translate-y-[2px] hover:shadow-[0_8px_0_0_#4338ca] active:translate-y-[10px] active:shadow-none transition-all"
                >
                  Back to Village
                </button>
                <button 
                  onClick={() => { playClickSound(); setStage('LevelSelect'); }}
                  className="flex-1 py-6 bg-white border-4 border-slate-100 text-slate-600 rounded-[2rem] font-black text-xl hover:bg-slate-50 shadow-sm transition-all active:translate-y-1"
                >
                  Play Again! 🎮
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {stage === 'AdminDashboard' && (
          <AdminDashboard 
            userName={user?.displayName || user?.email?.split('@')[0] || 'Teacher'}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
