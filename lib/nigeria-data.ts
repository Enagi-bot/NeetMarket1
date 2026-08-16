// Hierarchical Nigeria location data: State -> LGA -> Locality/City.
// Not exhaustive — a representative subset to power onboarding + discovery.

export type LgaMap = Record<string, string[]>
export type StateMap = Record<string, LgaMap>

export const NIGERIA: StateMap = {
  Lagos: {
    Ikeja: ['Alausa', 'Oregun', 'GRA Ikeja', 'Opebi', 'Allen'],
    Eti-Osa: ['Lekki Phase 1', 'Victoria Island', 'Ajah', 'Ikoyi', 'Chevron'],
    Surulere: ['Aguda', 'Ojuelegba', 'Lawanson', 'Adeniran Ogunsanya'],
    Alimosho: ['Egbeda', 'Idimu', 'Ikotun', 'Igando', 'Akowonjo'],
    Kosofe: ['Ketu', 'Ogudu', 'Ojota', 'Magodo'],
  },
  'FCT Abuja': {
    'Abuja Municipal': ['Garki', 'Wuse', 'Maitama', 'Asokoro', 'Gwarinpa'],
    Bwari: ['Kubwa', 'Dutse', 'Bwari Central', 'Ushafa'],
    Gwagwalada: ['Gwagwalada Central', 'Zuba', 'Dobi'],
    Kuje: ['Kuje Central', 'Gwargwada', 'Chibiri'],
  },
  Rivers: {
    'Port Harcourt': ['Old GRA', 'D-Line', 'Diobu', 'Rumuola', 'Trans Amadi'],
    Obio-Akpor: ['Rumuokoro', 'Rumuodara', 'Choba', 'Woji'],
    Eleme: ['Onne', 'Aleto', 'Ebubu'],
  },
  Kano: {
    'Kano Municipal': ['Fagge', 'Sabon Gari', 'Gwale', 'Dala'],
    Nassarawa: ['Hotoro', 'Tarauni', 'Gwarzo Road'],
    Fagge: ['Fagge Central', 'Rijiyar Lemo'],
  },
  Oyo: {
    'Ibadan North': ['Bodija', 'Agbowo', 'Sango', 'UI Area'],
    'Ibadan South-West': ['Ring Road', 'Oluyole', 'Challenge'],
    Egbeda: ['Egbeda Central', 'Olodo', 'Alakia'],
  },
  Enugu: {
    'Enugu North': ['New Haven', 'Independence Layout', 'GRA'],
    'Enugu South': ['Uwani', 'Achara Layout', 'Maryland'],
    Nsukka: ['Nsukka Central', 'Odenigwe', 'University Area'],
  },
  Kaduna: {
    'Kaduna North': ['Ungwan Rimi', 'Kawo', 'Malali'],
    'Kaduna South': ['Barnawa', 'Sabon Tasha', 'Kakuri'],
    Zaria: ['Sabon Gari', 'Tudun Wada', 'Samaru'],
  },
  Anambra: {
    Onitsha: ['Fegge', 'Odoakpu', 'GRA Onitsha', 'Main Market'],
    Awka: ['Aroma', 'Ifite', 'Amawbia'],
    Nnewi: ['Nnewichi', 'Otolo', 'Uruagu'],
  },
}

export const STATES = Object.keys(NIGERIA)

export function getLgas(state: string): string[] {
  return state && NIGERIA[state] ? Object.keys(NIGERIA[state]) : []
}

export function getLocalities(state: string, lga: string): string[] {
  return state && lga && NIGERIA[state]?.[lga] ? NIGERIA[state][lga] : []
}

export const CATEGORIES = [
  { id: 'fashion', label: 'Fashion & Thrift', emoji: 'shirt' },
  { id: 'food', label: 'Food & Groceries', emoji: 'food' },
  { id: 'electronics', label: 'Phones & Electronics', emoji: 'phone' },
  { id: 'beauty', label: 'Beauty & Hair', emoji: 'beauty' },
  { id: 'home', label: 'Home & Furniture', emoji: 'home' },
  { id: 'auto', label: 'Auto & Spare Parts', emoji: 'car' },
  { id: 'services', label: 'Artisans & Services', emoji: 'tools' },
  { id: 'farm', label: 'Farm & Produce', emoji: 'leaf' },
  { id: 'building', label: 'Building Materials', emoji: 'brick' },
  { id: 'health', label: 'Health & Pharmacy', emoji: 'health' },
]
