import React, { useMemo, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MessageSquare, Target, Activity, Award, AlertCircle, ArrowLeft, TrendingUp, X, Sparkles, ChevronRight, Info } from 'lucide-react';
import { SessionResult, Level } from '../types';
import { STRATEGIES } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface StatsDashboardProps {
  history: SessionResult[];
  onBack: () => void;
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

type CategoryKey = 'Vocabulary' | 'Grammar' | 'Naturalness' | 'Direct Translation' | 'Other';

const CATEGORY_INFO: Record<CategoryKey, { title: string; icon: string; description: string; advice: string }> = {
  Vocabulary: {
    title: '어휘력 (Vocabulary)',
    icon: '📖',
    description: '상황에 맞는 더 정확하고 구체적인 단어를 선택하는 능력입니다.',
    advice: '단어가 생각나지 않을 때는 무작정 멈추기보다, "A thing for..." 와 같이 아는 단어로 설명하는 보상 전략을 적극적으로 사용해보세요.'
  },
  Grammar: {
    title: '문법 (Grammar)',
    icon: '⚖️',
    description: '시제, 수 일치, 관사 등 문장의 구조적 정확도입니다.',
    advice: '말하기에서는 완벽한 문법보다 전달력이 중요하지만, 기본적인 시제(과거/미래)를 맞춰주는 것만으로도 훨씬 전문적으로 들립니다.'
  },
  Naturalness: {
    title: '자연스러운 표현 (Naturalness)',
    icon: '✨',
    description: '문법적으로 맞더라도 실제 현지인이 더 선호하는 표현을 쓰는 정도입니다.',
    advice: 'AI가 제안한 "Better Version"에 포함된 idioms나 collocations(함께 쓰이는 단어들)을 메모하고 실제 대화에 적용해보세요.'
  },
  'Direct Translation': {
    title: '직역 습관 (Direct Translation)',
    icon: '🚫',
    description: '한국어 어순이나 표현을 영어로 그대로 옮기는 습관입니다.',
    advice: '한국어 문장을 통째로 번역하려 하지 말고, 내가 말하고자 하는 "핵심 상황"을 가장 쉬운 핵심 동사(have, go, get)로 표현해보는 훈련을 하세요.'
  },
  Other: {
    title: '기타 개선점 (Other)',
    icon: '💡',
    description: '발음, 강세, 응답의 적절성 등 전반적인 학습 포인트입니다.',
    advice: '대화의 흐름을 놓치지 않으려는 노력이 돋보입니다. 꾸준히 다양한 시나리오에 도전하며 자신감을 키우세요!'
  }
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ history, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(null);

  const stats = useMemo(() => {
    if (history.length === 0) return null;

    // 1. Strategy usage distribution
    const strategyMap: Record<string, number> = {};
    history.forEach(session => {
      session.strategiesUsed.forEach(sId => {
        const name = STRATEGIES.find(s => s.id === sId)?.name.split(' (')[0] || sId;
        strategyMap[name] = (strategyMap[name] || 0) + 1;
      });
    });
    const strategyData = Object.entries(strategyMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 2. Average performance scores
    const avgScores = history.reduce((acc, sess) => ({
      flow: acc.flow + sess.overview.scores.flow,
      strategyUse: acc.strategyUse + sess.overview.scores.strategyUse,
      recovery: acc.recovery + sess.overview.scores.recovery
    }), { flow: 0, strategyUse: 0, recovery: 0 });

    const radarData = [
      { subject: 'Conversation Flow', A: avgScores.flow / history.length, fullMark: 100 },
      { subject: 'Strategy Usage', A: avgScores.strategyUse / history.length, fullMark: 100 },
      { subject: 'Recovery Success', A: avgScores.recovery / history.length, fullMark: 100 }
    ];

    // 3. Common Errors analysis
    const errorReasons: Record<string, number> = {};
    const categoryExamples: Record<CategoryKey, { original: string; better: string; reason: string }[]> = {
      Vocabulary: [], Grammar: [], Naturalness: [], 'Direct Translation': [], Other: []
    };

    history.forEach(session => {
      session.alternatives.forEach(alt => {
        const reason = alt.reason.toLowerCase();
        let cat: CategoryKey = 'Other';
        
        if (reason.includes('vocabulary') || reason.includes('word')) cat = 'Vocabulary';
        else if (reason.includes('grammar') || reason.includes('tense')) cat = 'Grammar';
        else if (reason.includes('natural') || reason.includes('native')) cat = 'Naturalness';
        else if (reason.includes('translation') || reason.includes('konglish')) cat = 'Direct Translation';
        
        errorReasons[cat] = (errorReasons[cat] || 0) + 1;
        if (categoryExamples[cat].length < 3) {
          categoryExamples[cat].push(alt);
        }
      });
    });
    const errorData = Object.entries(errorReasons)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    // 4. Session completion stats
    const levelMap: Record<string, number> = {};
    history.forEach(s => {
      levelMap[s.level] = (levelMap[s.level] || 0) + 1;
    });
    const levelData = Object.entries(levelMap).map(([name, value]) => ({ name, value }));

    return { strategyData, radarData, errorData, levelData, categoryExamples };
  }, [history]);

  if (!stats) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-sm text-center px-6">
      <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 text-slate-300">
        <TrendingUp className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">No Analytical Data Yet</h2>
      <p className="text-slate-500 max-w-sm mb-8 leading-relaxed">
        Complete your first English speaking session to unlock deep insights into your strategy use, common errors, and proficiency growth!
      </p>
      <button 
        onClick={onBack}
        className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:shadow-lg transition-all"
      >
        Go Practice Now
      </button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
        <div className="text-right">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Personal Analytics</h2>
          <p className="text-slate-500 text-sm">Visualizing your progress across {history.length} sessions</p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: history.length, icon: Activity, color: 'indigo' },
          { label: 'Mastery Level', value: Math.round(stats.radarData.reduce((a,b)=>a+b.A, 0) / 3) + '%', icon: Award, color: 'violet' },
          { label: 'Top Strategy', value: stats.strategyData[0]?.name || 'N/A', icon: Target, color: 'emerald' },
          { label: 'Total Corrections', value: history.reduce((a,b)=>a+b.alternatives.length, 0), icon: MessageSquare, color: 'amber' }
        ].map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 bg-${item.color}-50 rounded-2xl`}>
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-xl font-black text-slate-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
        <AnimatePresence>
          {selectedCategory && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-y-auto p-10 border-l border-slate-100"
            >
              <button 
                onClick={() => setSelectedCategory(null)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>

              <div className="mb-10">
                <span className="text-4xl mb-4 block">{CATEGORY_INFO[selectedCategory].icon}</span>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{CATEGORY_INFO[selectedCategory].title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{CATEGORY_INFO[selectedCategory].description}</p>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-widest mb-4">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Real Practice Examples
                  </h4>
                  <div className="space-y-4">
                    {stats.categoryExamples[selectedCategory].length > 0 ? (
                      stats.categoryExamples[selectedCategory].map((ex, i) => (
                        <div key={i} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden">
                          <div className="absolute top-0 right-0 px-3 py-1 bg-white/50 text-[9px] font-black uppercase text-slate-400 rounded-bl-xl border-l border-b border-slate-100">Example {i+1}</div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Your Speech</p>
                              <p className="text-slate-700 font-medium line-through decoration-red-300 opacity-70">{ex.original}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-4 h-4 text-slate-300" />
                              <div className="flex-1">
                                <p className="text-[10px] font-bold text-indigo-500 uppercase mb-1">Better Version</p>
                                <p className="text-indigo-900 font-bold">{ex.better}</p>
                              </div>
                            </div>
                            <div className="pt-2 mt-2 border-t border-slate-200/50">
                              <div className="flex gap-2 items-start text-xs text-slate-500">
                                <Info className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                                <span>{ex.reason}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                        <p className="text-sm text-slate-400 font-medium">아직 관련 교정 데이터가 없습니다.<br/>더 많은 대화에 도전해보세요!</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-6 bg-indigo-900 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                  <h4 className="text-indigo-300 text-[10px] font-black uppercase tracking-widest mb-2">AI Mastery Guide</h4>
                  <p className="text-sm leading-relaxed font-medium">
                    {CATEGORY_INFO[selectedCategory].advice}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Radar: Skill Balance */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col h-[400px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" /> Skill Balance
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Proficiency"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar: Strategy Usage */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col h-[400px]">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" /> Strategy Repertoire
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.strategyData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fontWeight: 500 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 10, 10, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie: Improvement Areas (Mistakes) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col md:col-span-2 lg:col-span-1 min-h-[500px]">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-pink-600" /> Focus Areas (Corrections)
          </h3>
          <p className="text-sm text-slate-500 mb-6 font-medium">실시간 AI 피드백을 통해 분석된 집중 교정 영역입니다.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
            <div className="h-[250px] md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.errorData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.errorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex flex-col justify-center space-y-4">
              <div className="p-5 bg-pink-50 rounded-3xl border border-pink-100">
                <p className="text-xs font-black text-pink-600 uppercase tracking-widest mb-1">Top Priority Area</p>
                <h4 className="text-lg font-black text-slate-900 mb-2">
                  {stats.errorData[0]?.name === 'Vocabulary' ? '📖 어휘력 보강' :
                   stats.errorData[0]?.name === 'Grammar' ? '⚖️ 문법 정확도' :
                   stats.errorData[0]?.name === 'Naturalness' ? '✨ 자연스러운 발화' :
                   stats.errorData[0]?.name === 'Direct Translation' ? '🚫 직역 습관 교정' :
                   '💡 다양한 표현 연습'}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                  {stats.errorData[0]?.name === 'Vocabulary' && '단어가 생각이 안 날 때는 "보상 전략"을 더 적극적으로 활용해보세요! 알고 있는 쉬운 단어로 풀어 설명하는 연습이 필요합니다.'}
                  {stats.errorData[0]?.name === 'Grammar' && '전달력은 좋지만, 시제(Tense)나 인칭 대명사 등 기초적인 문법 실수를 최소화하면 더욱 완벽한 문장이 됩니다.'}
                  {stats.errorData[0]?.name === 'Naturalness' && '상황에 맞는 관용구(Idiom)나 원어민이 자주 쓰는 패턴을 익혀보세요. AI가 추천해준 "Better Version"을 소리 내어 읽으면 큰 도움이 됩니다.'}
                  {stats.errorData[0]?.name === 'Direct Translation' && '한국어 사고방식을 영어로 그대로 옮기기보다, 상황 자체를 영어로 생각하는 훈련이 필요해요. 오늘의 모델 대화를 다시 복습해보세요!'}
                  {stats.errorData.length > 0 && !['Vocabulary', 'Grammar', 'Naturalness', 'Direct Translation'].includes(stats.errorData[0]?.name) && '다양한 상황에서 꾸준히 대화해보는 것이 중요합니다. 지금처럼 꾸준히 연습하세요!'}
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">Growth Tip</p>
                  <div className="flex gap-2 items-start p-3 bg-slate-50 rounded-2xl">
                    <div className="w-5 h-5 bg-indigo-100 rounded-full flex items-center justify-center shrink-0 text-indigo-600 mt-0.5">
                      <Target className="w-3 h-3" />
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      오늘 수집된 <strong>{history.reduce((a,b)=>a+b.alternatives.length, 0)}개</strong>의 교정 문구들은 AI가 당신의 발화 스타일을 분석한 결과입니다. 대시보드에 표시된 집중 영역을 의식하며 다음 세션을 시작해보세요!
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">Analysis Category Guide</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'Naturalness', name: '✨ Naturalness', desc: '자연스러운 표현' },
                      { key: 'Vocabulary', name: '📖 Vocabulary', desc: '상황별 어휘' },
                      { key: 'Grammar', name: '⚖️ Grammar', desc: '문법 정확도' },
                      { key: 'Direct Translation', name: '🚫 Translation', desc: '직역 습관 교정' },
                      { key: 'Other', name: '💡 Other', desc: '기타 개선 사항' }
                    ].map((item, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedCategory(item.key as CategoryKey)}
                        className="p-2 bg-slate-50/50 rounded-xl hover:bg-indigo-50 hover:border-indigo-100 border border-transparent transition-all text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-[10px] font-bold text-slate-800 mb-0.5 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{item.name}</p>
                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <p className="text-[9px] text-slate-500 font-medium leading-tight">{item.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bar/Progress: Level Distribution */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-lg flex flex-col h-[400px]">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600" /> Experience by Level
          </h3>
          <div className="space-y-6 mt-4 overflow-y-auto">
            {['Beginner', 'Intermediate', 'Advanced'].map((lvl, idx) => {
              const count = stats.levelData.find(d => d.name === lvl)?.value || 0;
              const percentage = (count / history.length) * 100;
              return (
                <div key={lvl} className="relative">
                  <div className="flex justify-between items-end mb-2">
                    <div>
                      <span className="text-lg font-black text-slate-800">{lvl}</span>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{count > 0 ? `${count} Sessions` : 'Locked'}</p>
                    </div>
                    <span className="text-sm font-black text-indigo-600">{Math.round(percentage)}%</span>
                  </div>
                  <div className="w-full h-4 bg-slate-50 rounded-full border border-slate-100 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      className={`h-full bg-gradient-to-r from-${idx === 0 ? 'indigo' : idx === 1 ? 'violet' : 'amber'}-500 to-${idx === 0 ? 'indigo' : idx === 1 ? 'violet' : 'amber'}-400`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-auto p-4 bg-amber-50 rounded-2xl border border-amber-100">
             <p className="text-xs text-amber-800 leading-relaxed font-medium">✨ Keep practicing across all levels to build a balanced linguistic foundation!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
