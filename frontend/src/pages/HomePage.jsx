import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyzeOutfit } from '../api/outfit'
import ImageUpload from '../components/ImageUpload'
import OccasionInput from '../components/OccasionInput'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HomePage() {
  const [file, setFile]         = useState(null)
  const [preview, setPreview]   = useState(null)
  const [occasion, setOccasion] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const navigate                = useNavigate()

  function handleFileChange(selectedFile) {
    setFile(selectedFile)
    setPreview(selectedFile ? URL.createObjectURL(selectedFile) : null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) { setError('Please select an outfit photo.'); return }
    setError(null)
    setLoading(true)
    try {
      const result = await analyzeOutfit(file, occasion)
      navigate('/results', { state: { result, preview } })
    } catch (err) {
      setError(err.response?.data?.error ?? 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-center text-neutral-900 mb-2">
        AI Outfit Advisor
      </h1>
      <p className="text-center text-neutral-500 mb-10 text-lg">
        Upload your look and get instant styling advice.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8 space-y-6"
      >
        <OccasionInput value={occasion} onChange={setOccasion} />
        <ImageUpload preview={preview} onFileChange={handleFileChange} />

        {error && (
          <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze My Outfit'}
        </button>
      </form>

      {loading && <LoadingSpinner />}
    </div>
  )
}
