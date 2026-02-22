import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function analyzeOutfit(file, occasion) {
  const form = new FormData()
  form.append('file', file)
  form.append('user_query', occasion)

  const { data } = await axios.post(`${BASE}/advice`, form)
  return data  // { html, shop_links, id, timestamp }
}

export async function fetchHistory() {
  const { data } = await axios.get(`${BASE}/history`)
  return data  // array of history records
}
