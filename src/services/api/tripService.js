import tripData from '../mockData/trips.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let trips = [...tripData]

export const tripService = {
  async getAll() {
    await delay(300)
    return [...trips]
  },

  async getById(id) {
    await delay(200)
    const trip = trips.find(t => t.id === id)
    return trip ? { ...trip } : null
  },

  async create(data) {
    await delay(400)
    const newTrip = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString()
    }
    trips.unshift(newTrip)
    return { ...newTrip }
  },

  async update(id, data) {
    await delay(300)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    trips[index] = { ...trips[index], ...data, updatedAt: new Date().toISOString() }
    return { ...trips[index] }
  },

  async delete(id) {
    await delay(250)
    const index = trips.findIndex(t => t.id === id)
    if (index === -1) throw new Error('Trip not found')
    
    trips.splice(index, 1)
    return true
  }
}