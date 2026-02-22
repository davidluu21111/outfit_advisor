import { useState } from 'react'
import AnalysisCard from './AnalysisCard'
import ShopGrid from './ShopGrid'

export default function HistoryItem({ record }) {
  const [open, setOpen] = useState(false)
  const date = new Date(record.timestamp).toLocaleString()

  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors text-left"
      >
        <div>
          <p className="font-medium text-neutral-800">
            {record.occasion || 'General outfit check'}
          </p>
          <p className="text-xs text-neutral-400 mt-0.5">{date}</p>
        </div>
        <span
          className={`text-neutral-400 text-lg transition-transform duration-200 ${
            open ? 'rotate-180' : ''
          }`}
        >
          ▾
        </span>
      </button>

      {open && (
        <div className="border-t border-neutral-100 px-6 py-5 space-y-6">
          <AnalysisCard html={record.html} />
          {record.shop_links?.length > 0 && <ShopGrid items={record.shop_links} />}
        </div>
      )}
    </div>
  )
}
