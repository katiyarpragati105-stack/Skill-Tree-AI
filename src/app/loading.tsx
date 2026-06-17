export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center animate-pulse">
          <span className="text-2xl">✨</span>
        </div>
        <p className="text-slate-400">Loading...</p>
      </div>
    </div>
  )
}
