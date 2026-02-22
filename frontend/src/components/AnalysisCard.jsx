export default function AnalysisCard({ html }) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm p-6">
      <div
        className="prose prose-neutral max-w-none text-neutral-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  )
}
