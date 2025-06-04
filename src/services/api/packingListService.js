import packingListData from '../mockData/packingLists.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let packingLists = [...packingListData]

export const packingListService = {
  async getAll() {
    await delay(250)
    return [...packingLists]
  },

  async getById(id) {
    await delay(200)
    const list = packingLists.find(l => l.id === id)
    return list ? { ...list } : null
  },

  async getByTripId(tripId) {
    await delay(250)
    const list = packingLists.find(l => l.tripId === tripId)
    return list ? { ...list } : null
  },

  async create(data) {
    await delay(350)
    const newList = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    }
    packingLists.unshift(newList)
    return { ...newList }
  },

  async update(id, data) {
    await delay(300)
    const index = packingLists.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Packing list not found')
    
    packingLists[index] = { 
      ...packingLists[index], 
      ...data, 
      lastModified: new Date().toISOString() 
    }
    return { ...packingLists[index] }
  },

  async delete(id) {
    await delay(250)
    const index = packingLists.findIndex(l => l.id === id)
    if (index === -1) throw new Error('Packing list not found')
    
    packingLists.splice(index, 1)
    return true
  }
}