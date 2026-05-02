import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  ChevronRight,
  TrendingUp,
  Target,
  History,
  Activity,
  Play,
  Pause,
  Languages,
  Clock,
  Sparkles,
  UserCircle,
  FileText,
  Calendar,
  LogOut,
  ArrowRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  getDocs,
  Timestamp,
  collectionGroup,
  orderBy,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { cn } from '../lib/utils';
import { SessionResult, UserRole } from '../types';

interface AdminDashboardProps {
  onLogout: () => void;
  userName: string;
}

type Tab = 'management' | 'analysis' | 'assessment';

interface StudentData {
  id: string;
  name: string;
  email: string;
  lastActive: string;
  sessionsCount: number;
  avgPause: string;
  translanguagingCount: number;
  totalScore: number;
  audioUrl?: string;
  // New fields for detailed list
  lastLevel?: string;
  lastScenario?: string;
  lastStrategies?: string[];
  lastTranscript?: { role: string; content: string }[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout, userName }) => {
  const [activeTab, setActiveTab] = useState<Tab>('analysis');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [strategyStats, setStrategyStats] = useState<any[]>([]);
  const [dauData, setDauData] = useState<any[]>([]);

  useEffect(() => {
    // 1. Fetch Students
    const usersQuery = query(collection(db, 'users'), where('role', '==', 'student'));
    const unsubUsers = onSnapshot(usersQuery, (snapshot) => {
      const studentList: StudentData[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        studentList.push({
          id: doc.id,
          name: data.name || 'Anonymous',
          email: data.email || '',
          lastActive: data.updatedAt ? new Date(data.updatedAt).toLocaleDateString() : 'N/A',
          sessionsCount: 0,
          avgPause: '0s',
          translanguagingCount: 0,
          totalScore: 0
        });
      });
      setStudents(studentList);
      setLoading(false);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'users'));

    // 2. Fetch Sessions using collectionGroup for aggregate analysis
    const sessionsQuery = query(collectionGroup(db, 'sessions'), orderBy('timestamp', 'desc'), limit(300));
    const unsubSessions = onSnapshot(sessionsQuery, (snapshot) => {
      const studentMap: Record<string, { 
        count: number; 
        pauses: number[]; 
        tl: number; 
        scores: number[];
        latestSession?: any;
      }> = {};
      const strategies: Record<string, number> = {};
      const dateMap: Record<string, Set<string>> = {};

      snapshot.forEach((doc) => {
        const data = doc.data() as SessionResult;
        const userId = doc.ref.parent.parent?.id;
        if (!userId) return;

        // Aggregate per student
        if (!studentMap[userId]) {
          studentMap[userId] = { count: 0, pauses: [], tl: 0, scores: [] };
        }
        
        // Since sessions are ordered by desc, the first one encountered for a user is their latest
        if (!studentMap[userId].latestSession) {
          studentMap[userId].latestSession = data;
        }

        studentMap[userId].count++;
        if (data.pauseTime) studentMap[userId].pauses.push(data.pauseTime);
        if (data.translanguagingCount) studentMap[userId].tl += data.translanguagingCount;
        
        if (data.overview && data.overview.scores) {
          const avgScore = (data.overview.scores.flow + data.overview.scores.strategyUse + data.overview.scores.recovery) / 3;
          studentMap[userId].scores.push(avgScore);
        }

        // Aggregate strategies
        if (data.strategiesUsed) {
          data.strategiesUsed.forEach(s => {
            strategies[s] = (strategies[s] || 0) + 1;
          });
        }

        // DAU tracking
        const dateKey = new Date(data.timestamp).toLocaleDateString();
        if (!dateMap[dateKey]) dateMap[dateKey] = new Set();
        dateMap[dateKey].add(userId);
      });

      // Update student list with stats
      setStudents(prev => prev.map(s => {
        const stats = studentMap[s.id];
        if (!stats) return s;
        const avgPause = stats.pauses.length > 0 
          ? (stats.pauses.reduce((a, b) => a + b, 0) / stats.pauses.length).toFixed(1) + 's'
          : '0s';
        
        return {
          ...s,
          sessionsCount: stats.count,
          avgPause,
          translanguagingCount: stats.tl,
          totalScore: stats.scores.length > 0 
            ? stats.scores.reduce((a, b) => a + b, 0) / stats.scores.length
            : 0,
          // Add detailed last session data
          lastLevel: stats.latestSession?.level,
          lastScenario: stats.latestSession?.scenarioTitle,
          lastStrategies: stats.latestSession?.strategiesUsed,
          lastTranscript: stats.latestSession?.transcript
        };
      }));

      // Update Strategy Usage
      const strategyArray = Object.entries(strategies).map(([name, count]) => ({ name, count }));
      setStrategyStats(strategyArray.sort((a, b) => b.count - a.count).slice(0, 5));

      // Update DAU data (last 7 days)
      const dauArray = Object.entries(dateMap)
        .map(([date, users]) => ({ date: date.split('/').slice(1, 3).join('/'), dau: users.size }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-7);
      setDauData(dauArray);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'collectionGroup:sessions'));

    return () => {
      unsubUsers();
      unsubSessions();
    };
  }, []);

  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [studentSessions, setStudentSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    if (selectedStudent) {
      const q = query(
        collection(db, 'users', selectedStudent.id, 'sessions'),
        orderBy('timestamp', 'desc')
      );
      const unsub = onSnapshot(q, (snapshot) => {
        setStudentSessions(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as SessionResult)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, `users/${selectedStudent.id}/sessions`));
      return () => unsub();
    }
  }, [selectedStudent]);

  const calculateMAU = () => {
    // Basic logic for MAU from current student data (needs larger dataset in real app)
    return students.length; 
  };

  return (
    <div className="flex h-screen bg-[#F1F5F9]">
      <AnimatePresence>
        {selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-end p-4 lg:p-10 pointer-events-none">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl h-full bg-white shadow-2xl rounded-[3rem] pointer-events-auto flex flex-col overflow-hidden border border-slate-100"
            >
              <div className="p-8 bg-indigo-600 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">{selectedStudent.name}</h3>
                  <p className="text-indigo-100 text-sm">{selectedStudent.email}</p>
                </div>
                <button 
                  onClick={() => setSelectedStudent(null)}
                  className="p-3 bg-white/20 hover:bg-white/30 rounded-2xl transition-all"
                >
                  <ArrowRight className="w-6 h-6 rotate-180" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Avg. Pause Time</p>
                    <p className="text-2xl font-black text-slate-800">{selectedStudent.avgPause}</p>
                  </div>
                  <div className="p-6 bg-slate-50 rounded-3xl">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Translanguaging</p>
                    <p className="text-2xl font-black text-slate-800">{selectedStudent.translanguagingCount} times</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-indigo-600" />
                    Learning History
                  </h4>
                  <div className="space-y-4">
                    {studentSessions.length > 0 ? studentSessions.map(session => (
                      <div key={session.id} className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-bold text-slate-400">{new Date(session.timestamp).toLocaleString()}</span>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase">{session.level}</span>
                        </div>
                        <h5 className="font-bold text-slate-800 mb-2">{session.scenarioTitle}</h5>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                            <Target size={12} />
                            Score: {Math.round((session.overview?.scores?.flow + session.overview?.scores?.strategyUse + session.overview?.scores?.recovery) / 3)}
                          </div>
                          {session.audioUrl && (
                            <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                              <Play size={12} fill="currentColor" />
                              Listen Recording
                            </button>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-2 italic mb-4">
                          {session.overview?.summary}
                        </div>

                        {session.transcript && (
                          <div className="mt-4 pt-4 border-t border-slate-50">
                            <details className="group">
                              <summary className="text-[10px] font-black text-indigo-500 cursor-pointer list-none flex items-center gap-1 uppercase tracking-widest hover:text-indigo-700 transition-colors">
                                <FileText size={12} />
                                View Full Transcript
                              </summary>
                              <div className="mt-3 p-4 bg-slate-50 rounded-2xl space-y-3 max-h-64 overflow-y-auto scrollbar-hide border border-slate-100">
                                {session.transcript.map((m, i) => (
                                  <div key={i} className={cn(
                                    "text-[11px] p-2 rounded-xl",
                                    m.role === 'user' ? "bg-indigo-100/50 text-indigo-900 ml-4" : "bg-white text-slate-600 mr-4 border border-slate-100"
                                  )}>
                                    <span className="font-bold uppercase text-[9px] block mb-1 opacity-50">{m.role}</span>
                                    {m.content}
                                  </div>
                                ))}
                              </div>
                            </details>
                          </div>
                        )}
                      </div>
                    )) : (
                      <div className="text-center py-10 text-slate-400 italic text-sm">No speaking records found.</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">FocusFlow <span className="text-indigo-600">Admin</span></h1>
          </div>
          
          <nav className="space-y-2">
            <SidebarItem 
              icon={<BarChart3 size={20} />} 
              label="학습 분석" 
              active={activeTab === 'analysis'} 
              onClick={() => setActiveTab('analysis')}
            />
            <SidebarItem 
              icon={<Users size={20} />} 
              label="학습 관리" 
              active={activeTab === 'management'} 
              onClick={() => setActiveTab('management')}
            />
            <SidebarItem 
              icon={<Target size={20} />} 
              label="평가 분석" 
              active={activeTab === 'assessment'} 
              onClick={() => setActiveTab('assessment')}
            />
          </nav>
        </div>
        
        <div className="mt-auto p-6 space-y-4">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
          <div className="italic text-[10px] text-slate-400 text-center">
            System v2.5.0 • Teacher Node
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search students, metrics..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-black text-slate-800">{userName}</p>
              <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">Lead Instructor</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
              <UserCircle className="w-8 h-8 text-indigo-400" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'analysis' && (
              <motion.div 
                key="analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">학습 분석 리포트</h2>
                    <p className="text-slate-500 font-medium">실시간 학습 지표 및 사용자 통계</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="활성 학습자 (DAU)" value={students.filter(s => s.lastActive === new Date().toLocaleDateString()).length.toString()} trend="+5%" icon={<Users className="text-indigo-600" />} color="indigo" />
                  <StatCard label="전체 학생 수" value={students.length.toString()} trend="+2" icon={<Calendar className="text-green-600" />} color="green" />
                  <StatCard label="평균 발화 정지" value={(students.reduce((a, b) => a + parseFloat(b.avgPause), 0) / (students.length || 1)).toFixed(1) + 's'} trend="-0.1s" icon={<Clock className="text-orange-600" />} color="orange" />
                  <StatCard label="평균 전이 빈도" value={(students.reduce((a, b) => a + b.translanguagingCount, 0) / (students.length || 1)).toFixed(1) + '회'} trend="Stable" icon={<Languages className="text-purple-600" />} color="purple" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                       <TrendingUp className="text-indigo-600" size={20} />
                       일일 활성 학습자 추이 (7일)
                    </h3>
                    <div className="h-64">
                      {dauData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={dauData}>
                            <defs>
                              <linearGradient id="colorDau" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                            <YAxis hide />
                            <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            <Area type="monotone" dataKey="dau" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDau)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 font-bold italic">No activity data yet</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200">
                    <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                       <Sparkles className="text-purple-600" size={20} />
                       보상 전략별 사용 빈도 (Top 5)
                    </h3>
                    <div className="h-64">
                      {strategyStats.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={strategyStats} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }} width={100} />
                            <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                            <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                              {strategyStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 font-bold italic">No strategy data yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'management' && (
              <motion.div 
                key="management"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">전체 학습자 목록</h2>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Learner (Name/ID)</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Last Active</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Level</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Scenario</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Strategy Used</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Avg Score</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Utterance</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {students.filter(s => 
                          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.email.toLowerCase().includes(searchQuery.toLowerCase())
                        ).map((student) => (
                          <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase">
                                  {student.name.charAt(0)}
                                </div>
                                <div className="max-w-[150px]">
                                  <span className="font-bold text-slate-700 block truncate" title={student.name}>{student.name}</span>
                                  <span className="text-[10px] text-slate-400 block truncate" title={student.id}>{student.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{student.lastActive}</td>
                            <td className="px-6 py-4">
                              <span className={cn(
                                "px-2 py-1 rounded-lg text-[10px] font-black uppercase",
                                student.lastLevel === 'Beginner' ? "bg-green-50 text-green-600" :
                                student.lastLevel === 'Intermediate' ? "bg-blue-50 text-blue-600" :
                                "bg-purple-50 text-purple-600"
                              )}>
                                {student.lastLevel || 'N/A'}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-[180px]">
                              <span className="text-xs font-medium text-slate-600 line-clamp-1" title={student.lastScenario}>
                                {student.lastScenario || '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1">
                                {student.lastStrategies && student.lastStrategies.length > 0 ? (
                                  student.lastStrategies.slice(0, 2).map((st, i) => (
                                    <span key={i} className="text-[9px] bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-bold">
                                      {st.replace(/_/g, ' ')}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-400 italic">None</span>
                                )}
                                {student.lastStrategies && student.lastStrategies.length > 2 && (
                                  <span className="text-[9px] text-slate-400 font-bold">+{student.lastStrategies.length - 2}</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="inline-flex items-center gap-1 px-2 py-1 bg-slate-900 text-white rounded-lg text-xs font-black">
                                {Math.round(student.totalScore)}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              {student.lastTranscript ? (
                                <button 
                                  onClick={() => {
                                    const text = student.lastTranscript?.map(m => `[${m.role}] ${m.content}`).join('\n');
                                    if (text) {
                                      navigator.clipboard.writeText(text);
                                      alert('발화 내용이 클립보드에 복사되었습니다.');
                                    }
                                  }}
                                  className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-lg transition-all"
                                  title="Copy Transcript Text"
                                >
                                  <FileText size={18} />
                                </button>
                              ) : (
                                <span className="text-slate-300">-</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => setSelectedStudent(student)}
                                  className="p-2 text-indigo-600 hover:bg-white rounded-lg transition-all" 
                                  title="Analyze Sessions"
                                >
                                  <Activity size={18} />
                                </button>
                                <button 
                                  onClick={() => setSelectedStudent(student)}
                                  className="p-2 text-slate-300 hover:text-slate-600 transition-all font-black"
                                >
                                  <ArrowRight size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'assessment' && (
              <motion.div 
                key="assessment"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">평가 분석 센터</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-3xl p-8 border border-slate-200">
                    <h3 className="text-lg font-black text-slate-800 mb-6 underline decoration-indigo-200 decoration-4 underline-offset-4">영역별 핵심 지표</h3>
                    <div className="space-y-5">
                      <SkillProgress label="Fluency (Flow)" percentage={Math.round(students.reduce((a, b) => a + b.totalScore, 0) / (students.length || 1))} color="#6366f1" />
                      <SkillProgress label="Strategy Usage" percentage={Math.round(students.reduce((a, b) => a + b.totalScore * 0.9, 0) / (students.length || 1))} color="#818cf8" />
                      <SkillProgress label="Recovery Rate" percentage={Math.round(students.reduce((a, b) => a + b.totalScore * 0.95, 0) / (students.length || 1))} color="#4f46e5" />
                    </div>
                  </div>

                  <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                    <Sparkles className="absolute top-6 right-6 w-12 h-12 text-white/20" />
                    <h3 className="text-lg font-black mb-4 italic">Teacher AI Insight</h3>
                    <p className="text-indigo-100 text-sm leading-relaxed mb-6 font-medium">
                      데이터 분석 결과, 학생들의 평균 발화 정지 시간이 지난 주 대비 0.2초 단축되었습니다. 
                      하지만 **Translanguaging** 빈도가 증가한 것을 감안하여, 보상 전략 중 'Modeling' 비중을 높여 직관적인 어휘 학습을 지원하는 것을 추천합니다.
                    </p>
                    <div className="flex gap-4">
                      <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black">Focus: Fluency</div>
                      <div className="px-4 py-2 bg-white/20 rounded-xl text-xs font-black">Recommendation: Scaffolding</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-bold text-sm",
      active 
        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
        : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
    )}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon, color }: { label: string; value: string; trend: string; icon: React.ReactNode; color: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className={cn("p-2 rounded-xl", `bg-${color}-50`)}>
        {icon}
      </div>
      <span className={cn("text-[10px] font-black px-2 py-1 rounded-lg", 
        trend.includes('+') ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-400"
      )}>
        {trend}
      </span>
    </div>
    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <p className="text-3xl font-black text-slate-800 italic">{value}</p>
  </div>
);

const SkillProgress = ({ label, percentage, color }: { label: string; percentage: number; color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-xs font-black text-slate-600">
      <span className="uppercase tracking-widest">{label}</span>
      <span>{percentage}%</span>
    </div>
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  </div>
);

