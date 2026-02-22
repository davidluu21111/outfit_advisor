const STORE_STYLES = {
  'Amazon': 'bg-amber-50  text-amber-800  hover:bg-amber-100  border-amber-200',
  'ASOS':   'bg-neutral-900 text-white    hover:bg-neutral-700 border-transparent',
  'H&M':    'bg-red-50    text-red-800    hover:bg-red-100    border-red-200',
  'Zara':   'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-neutral-200',
}

export default function ShopCard({ item, links }) {
  return (
    <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm p-5 flex flex-col gap-4">
      <p className="font-medium text-neutral-800 capitalize leading-snug">{item}</p>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(links).map(([store, url]) => (
          <a
            key={store}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs font-semibold px-3 py-2 rounded-lg text-center border transition-colors ${
              STORE_STYLES[store] ?? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-200'
            }`}
          >
            {store}
          </a>
        ))}
      </div>
    </div>
  )
}
