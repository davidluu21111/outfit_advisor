import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchHistory } from '../api/outfit'
import HistoryItem from '../components/HistoryItem'
import LoadingSpinner from '../components/LoadingSpinner'

export default function HistoryPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    fetchHistory()
      .then(setRecords)
      .catch(() => setError('Could not load history. Is Flask running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="font-display text-3xl text-neutral-900 mb-8">Analysis History</h1>

      {error && (
        <p className="text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-6">
          {error}
        </p>
      )}

      {records.length === 0 && !error && (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-lg mb-4">No analyses yet.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-medium transition-colors"
          >
            Upload your first outfit
          </Link>
        </div>
      )}

      <div className="space-y-4">
        {records.map(record => (
          <HistoryItem key={record.id} record={record} />
        ))}
      </div>
    </div>
  )
}
