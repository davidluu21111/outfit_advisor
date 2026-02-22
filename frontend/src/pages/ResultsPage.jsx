import { useLocation, useNavigate, Link } from 'react-router-dom'
import AnalysisCard from '../components/AnalysisCard'
import ShopGrid from '../components/ShopGrid'

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.result) {
    return (
      <div className="text-center py-24">
        <p className="text-neutral-500 mb-4">No analysis to display.</p>
        <Link to="/" className="text-brand-600 underline">Upload an outfit</Link>
      </div>
    )
  }

  const { html, shop_links } = state.result
  const { preview }          = state

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {preview && (
        <div className="flex justify-center">
          <img
            src={preview}
            alt="Your outfit"
            className="rounded-2xl shadow-md max-h-80 object-contain"
          />
        </div>
      )}

      <h2 className="font-display text-3xl text-neutral-900">Your Style Analysis</h2>
      <AnalysisCard html={html} />

      {shop_links?.length > 0 && (
        <>
          <h2 className="font-display text-2xl text-neutral-900">Shop the Look</h2>
          <ShopGrid items={shop_links} />
        </>
      )}

      <div className="flex gap-4 pt-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3 border border-neutral-300 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors font-medium"
        >
          Analyze Another Outfit
        </button>
        <Link
          to="/history"
          className="flex-1 py-3 text-center bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors"
        >
          View History
        </Link>
      </div>
    </div>
  )
}
