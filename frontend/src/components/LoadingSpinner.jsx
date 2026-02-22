export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm">
      <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin" />
      <p className="mt-4 text-neutral-500 text-sm font-medium">Analyzing your outfit...</p>
    </div>
  )
}
