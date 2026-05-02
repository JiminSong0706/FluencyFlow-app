import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  Sparkles, 
  Gamepad2,
  Trophy,
  Star,
  ChevronRight
} from 'lucide-react';
import { STRATEGIES } from '../constants';
import { cn } from '../lib/utils';

interface StrategyGameProps {
  onWin: () => void;
  onBack: () => void;
}

const GAME_QUESTIONS = [
  {
    situation: "You didn't hear what the other person said clearly.",
    correctStrategyId: 'clarification',
    distractors: ['extension', 'filler']
  },
  {
    situation: "You need a second to think about your answer but don't want a long silence.",
    correctStrategyId: 'filler',
    distractors: ['clarification', 'extension']
  },
  {
    situation: "The other person gave a short answer and you want to keep the conversation going.",
    correctStrategyId: 'extension',
    distractors: ['clarification', 'filler']
  },
  {
    situation: "You want to confirm if you understood the point correctly.",
    correctStrategyId: 'clarification',
    distractors: ['filler', 'extension']
  }
];

export const StrategyGame: React.FC<StrategyGameProps> = ({ onWin, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [showWin, setShowWin] = useState(false);

  const currentQuestion = GAME_QUESTIONS[currentIndex];
  const allChoices = [
    currentQuestion.correctStrategyId,
    ...currentQuestion.distractors
  ].sort(() => Math.random() - 0.5);

  const handleChoice = (strategyId: string) => {
    if (feedback) return;

    const isCorrect = strategyId === currentQuestion.correctStrategyId;
    const strategy = STRATEGIES.find(s => s.id === strategyId);
    
    if (isCorrect) {
      setScore(prev => prev + 25);
      setFeedback({
        isCorrect: true,
        message: `Correct! ${strategy?.name} is the right strategy for this.`
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: `Not quite. ${strategy?.name} is usually for something else.`
      });
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < GAME_QUESTIONS.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setShowWin(true);
      }
    }, 2000);
  };

  if (showWin) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto py-20 px-6 text-center"
      >
        <div className="relative mb-12">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full" />
           <div className="w-32 h-32 bg-yellow-400 rounded-full flex items-center justify-center mx-auto relative shadow-2xl animate-bounce border-8 border-white">
             <Trophy className="w-16 h-16 text-white" />
           </div>
           {/* Victory Friends */}
           <div className="absolute -top-10 left-0 w-24 h-24 rotate-12">
              <img src="https://cdn-icons-png.flaticon.com/512/6988/6988831.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
           </div>
           <div className="absolute -bottom-10 right-0 w-24 h-24 -rotate-12">
              <img src="https://cdn-icons-png.flaticon.com/512/4775/4775505.png" alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
           </div>
        </div>

        <h2 className="text-6xl font-cute font-black text-white mb-6 tracking-tighter">MISSION COMPLETE!</h2>
        <p className="text-xl text-indigo-100 font-bold mb-12 leading-relaxed">
          Amazing work! You've mastered the boosters! <br />
          You earned a precious ornament for your growth forest! 🎄✨
        </p>
        <button 
          onClick={onWin}
          className="px-16 py-8 bg-white text-indigo-600 rounded-[2.5rem] font-black text-2xl shadow-[0_12px_0_0_#e0e7ff] hover:translate-y-[2px] hover:shadow-[0_10px_0_0_#e0e7ff] active:translate-y-[12px] active:shadow-none transition-all"
        >
          Collect Reward! 🎁
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto py-16 px-6 relative"
    >
      <button 
        onClick={onBack}
        className="absolute top-4 left-6 flex items-center px-6 py-3 bg-white/20 hover:bg-white rounded-2xl font-black text-white hover:text-slate-900 border-b-4 border-white/10 active:translate-y-1 active:border-b-0 transition-all group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-2 transition-transform" /> 
        <span>Cancel</span>
      </button>

      <div className="bg-white rounded-[4rem] p-12 shadow-3xl border-b-12 border-slate-100 relative overflow-hidden">
        {/* Playful background detail */}
        <div className="absolute top-0 right-0 w-64 h-64 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }} />

        {/* Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-4 bg-slate-100">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${(currentIndex / GAME_QUESTIONS.length) * 100}%` }}
             className="h-full bg-indigo-500 rounded-r-full"
           />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg rotate-3 group">
              <Gamepad2 className="w-10 h-10 text-white group-hover:rotate-12 transition-transform" />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1 leading-none">Question {currentIndex + 1} of {GAME_QUESTIONS.length}</p>
              <h3 className="text-3xl font-cute font-black text-slate-800 tracking-tight leading-tight">Strategy Power Match</h3>
            </div>
          </div>
          <div className="px-8 py-4 bg-amber-50 rounded-[2rem] border-b-6 border-amber-100 flex items-center gap-3">
            <Star className="w-6 h-6 text-amber-500 fill-amber-500 animate-pulse" />
            <span className="text-2xl font-black text-amber-600">{score} pts</span>
          </div>
        </div>

        <div className="mb-12 bg-slate-50 p-10 rounded-[3rem] border-2 border-slate-100 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
             <Sparkles className="w-6 h-6 text-indigo-300" />
          </div>
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-4 text-center">MISSION SITUATION</p>
          <h2 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight text-center">
            "{currentQuestion.situation}"
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {allChoices.map((sId) => {
            const strategy = STRATEGIES.find(s => s.id === sId);
            return (
              <motion.button
                key={sId}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                disabled={!!feedback}
                onClick={() => handleChoice(sId)}
                className={cn(
                  "p-8 rounded-[2.5rem] border-b-8 transition-all text-left flex items-center justify-between group",
                  feedback?.isCorrect && sId === currentQuestion.correctStrategyId ? "bg-emerald-50 border-emerald-500 shadow-emerald-100 shadow-xl" :
                  feedback && !feedback.isCorrect && sId === currentQuestion.correctStrategyId ? "bg-emerald-50/50 border-emerald-200" :
                  feedback && !feedback.isCorrect && sId !== currentQuestion.correctStrategyId ? "bg-red-50 border-red-500 opacity-50" :
                  "bg-white border-slate-100 hover:border-indigo-500 hover:shadow-2xl"
                )}
              >
                <div>
                  <h4 className="text-2xl font-black text-slate-800 mb-1 leading-none">{strategy?.name}</h4>
                  <p className="text-slate-400 font-bold italic">{strategy?.koreanName}</p>
                </div>
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {feedback?.isCorrect && sId === currentQuestion.correctStrategyId ? <CheckCircle2 className="w-8 h-8 text-emerald-500" /> :
                   feedback && !feedback.isCorrect && sId !== currentQuestion.correctStrategyId ? <XCircle className="w-8 h-8 text-red-500" /> :
                   <ChevronRight className="w-6 h-6" />}
                </div>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className={cn(
                "mt-10 p-8 rounded-[2.5rem] text-center font-black text-xl border-b-8",
                feedback.isCorrect ? "bg-emerald-500 border-emerald-700 text-white shadow-xl shadow-emerald-200" : "bg-red-500 border-red-700 text-white shadow-xl shadow-red-200"
              )}
            >
              <div className="flex items-center justify-center gap-4">
                 {feedback.isCorrect ? <Sparkles className="w-6 h-6 animate-pulse" /> : <XCircle className="w-6 h-6" />}
                 {feedback.message}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
