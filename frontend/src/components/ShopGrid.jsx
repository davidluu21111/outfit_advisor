import ShopCard from './ShopCard'

export default function ShopGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((entry, idx) => (
        <ShopCard key={idx} item={entry.item} links={entry.links} />
      ))}
    </div>
  )
}
