import React, { useState, useEffect } from 'react';
import { Sparkles, Plus, Check, Trash2, Trophy, Zap, BookOpen, Flame } from 'lucide-react';

export default function App() {
  // ローカルストレージからの読み込みと初期化
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('study_quest_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '数学の問題集を3ページ解く', exp: 50, completed: false },
      { id: 2, text: '英語の単語帳を15分暗記', exp: 30, completed: false }
    ];
  });

  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('study_quest_stats');
    return saved ? JSON.parse(saved) : { level: 1, exp: 0, streak: 1 };
  });

  const [inputTask, setInputTask] = useState('');
  const [inputExp, setInputExp] = useState(30);

  // データ自動保存
  useEffect(() => {
    localStorage.setItem('study_quest_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('study_quest_stats', JSON.stringify(stats));
  }, [stats]);

  // 次のレベルに必要な経験値（レベル × 100）
  const expNeeded = stats.level * 100;

  // タスク追加
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputTask.trim()) return;
    const newTask = {
      id: Date.now(),
      text: inputTask,
      exp: Number(inputExp) || 20,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setInputTask('');
  };

  // タスク完了切り替え ＆ EXP獲得処理
  const handleToggleTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const nextCompleted = !task.completed;
        if (nextCompleted) {
          addExp(task.exp);
        }
        return { ...task, completed: nextCompleted };
      }
      return task;
    }));
  };

  // タスク削除
  const handleDeleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  // EXP加算 ＆ レベルアップ処理
  const addExp = (gainedExp) => {
    setStats((prev) => {
      let newExp = prev.exp + gainedExp;
      let newLevel = prev.level;
      let currentExpNeeded = newLevel * 100;

      while (newExp >= currentExpNeeded) {
        newExp -= currentExpNeeded;
        newLevel += 1;
        currentExpNeeded = newLevel * 100;
      }

      return { ...prev, level: newLevel, exp: newExp };
    });
  };

  const progressPercent = Math.min(100, Math.floor((stats.exp / expNeeded) * 100));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 font-sans">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* ステータスヘッダー */}
        <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-xl backdrop-blur">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2.5 rounded-xl text-amber-400 border border-amber-500/30">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">ステータス</p>
                <h1 className="text-xl font-bold text-amber-300">Lv. {stats.level} 冒険者</h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/30 px-3 py-1.5 rounded-full text-orange-400 text-xs font-bold">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{stats.streak}日連続</span>
            </div>
          </div>

          {/* 経験値（EXP）ゲージ */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1 text-amber-400"><Zap className="w-3.5 h-3.5 fill-amber-400" /> EXP</span>
              <span>{stats.exp} / {expNeeded} ({progressPercent}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-700/60 rounded-full overflow-hidden p-0.5 border border-slate-600/50">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-300 transition-all duration-300 rounded-full shadow-sm"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 新規クエスト入力エリア */}
        <form onSubmit={handleAddTask} className="bg-slate-800 border border-slate-700 rounded-2xl p-4 shadow-lg space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-400" /> 新しいクエストを作成
          </h2>
          <div className="space-y-2">
            <input
              type="text"
              placeholder="クエスト名を入力（例: 漢字テストの勉強）"
              value={inputTask}
              onChange={(e) => setInputTask(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            <div className="flex gap-2">
              <select
                value={inputExp}
                onChange={(e) => setInputExp(Number(e.target.value))}
                className="bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value={10}>10 EXP (簡単)</option>
                <option value={30}>30 EXP (普通)</option>
                <option value={50}>50 EXP (困難)</option>
                <option value={100}>100 EXP (ボス級)</option>
              </select>
              <button
                type="submit"
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white text-xs font-bold rounded-xl px-4 py-2 flex items-center justify-center gap-1.5 transition shadow-md"
              >
                <Plus className="w-4 h-4" /> 受注する
              </button>
            </div>
          </div>
        </form>

        {/* クエスト一覧 */}
        <div className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" /> 進行中のクエスト ({tasks.filter(t => !t.completed).length})
          </h2>

          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 bg-slate-800/40 border border-dashed border-slate-700 rounded-2xl">
                <p className="text-xs text-slate-500">現在受注しているクエストはありません。</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-center justify-between p-3.5 rounded-xl border transition ${
                    task.completed
                      ? 'bg-slate-800/30 border-slate-800/60 text-slate-500 line-through'
                      : 'bg-slate-800 border-slate-700 text-slate-100 shadow-sm hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0 mr-2">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition shrink-0 ${
                        task.completed
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'border-slate-600 hover:border-indigo-400 bg-slate-900/50'
                      }`}
                    >
                      {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                    </button>
                    <span className="text-sm truncate font-medium">{task.text}</span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold tracking-wide ${
                      task.completed 
                        ? 'bg-slate-800 text-slate-500' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      +{task.exp} EXP
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg transition hover:bg-slate-700/50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
