export default function OccasionInput({ value, onChange }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-neutral-700">
        What's the occasion?{' '}
        <span className="text-neutral-400 font-normal">(optional)</span>
      </label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="e.g. job interview, date night, casual weekend"
        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent text-sm placeholder:text-neutral-300 transition"
      />
    </div>
  )
}
