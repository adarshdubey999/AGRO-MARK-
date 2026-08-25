// API Service for Agro Mark with FastAPI Integration & Local Storage Fallback
import axios from 'axios'
import { CROPS, MANDIS, DEMO_ORDERS, VERIFIED_BUYERS, TRANSPORTERS } from './mockData'

const API_BASE_URL = 'http://localhost:8000/api'

// Initialize local storage database
const STORAGE_KEYS = {
  ORDERS: 'agro_mark_orders',
  CUSTOM_CROPS: 'agro_mark_custom_crops',
  CUSTOM_MANDIS: 'agro_mark_custom_mandis',
  USER_PROFILE: 'agro_mark_user_profile',
  LANGUAGE: 'agro_mark_lang'
}

function getStored(key, fallback) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : fallback
  } catch (e) {
    return fallback
  }
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.error('Storage error:', e)
  }
}

// Initialise orders if empty
if (!getStored(STORAGE_KEYS.ORDERS, null)) {
  setStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
}

export const apiService = {
  // Get all crops
  async getCrops() {
    try {
      const res = await axios.get(`${API_BASE_URL}/crops`, { timeout: 1500 })
      return res.data
    } catch (err) {
      const custom = getStored(STORAGE_KEYS.CUSTOM_CROPS, [])
      return [...CROPS, ...custom]
    }
  },

  // Get all mandis
  async getMandis() {
    try {
      const res = await axios.get(`${API_BASE_URL}/mandis`, { timeout: 1500 })
      return res.data
    } catch (err) {
      const custom = getStored(STORAGE_KEYS.CUSTOM_MANDIS, [])
      return [...MANDIS, ...custom]
    }
  },

  // Get all orders
  async getOrders() {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders`, { timeout: 1500 })
      return res.data
    } catch (err) {
      return getStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
    }
  },

  // Get order by ID
  async getOrderById(orderId) {
    try {
      const res = await axios.get(`${API_BASE_URL}/orders/${orderId}`, { timeout: 1500 })
      return res.data
    } catch (err) {
      const orders = getStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
      return orders.find(o => o.id === orderId) || orders[0]
    }
  },

  // Create new order (Step 6: Online Selling)
  async createOrder(orderPayload) {
    try {
      const res = await axios.post(`${API_BASE_URL}/orders`, orderPayload, { timeout: 2000 })
      return res.data
    } catch (err) {
      const orders = getStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
      const orderId = `AGRO-ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString()

      const newOrder = {
        id: orderId,
        farmerName: orderPayload.farmerName || 'Adarsh Dubey',
        farmerPhone: orderPayload.farmerPhone || '+91 98765 43210',
        originLocation: orderPayload.originLocation || 'Chandwad Village, Nashik, Maharashtra',
        cropId: orderPayload.cropId,
        cropName: orderPayload.cropName,
        variety: orderPayload.variety || 'Standard Hybrid',
        quantityQtl: Number(orderPayload.quantityQtl),
        grade: orderPayload.grade || 'Grade A',
        mandiId: orderPayload.mandiId,
        mandiName: orderPayload.mandiName,
        agreedPricePerQtl: Number(orderPayload.agreedPricePerQtl),
        grossAmount: Number(orderPayload.grossAmount),
        transportCost: Number(orderPayload.transportCost),
        mandiFee: Number(orderPayload.mandiFee),
        handlingFee: Number(orderPayload.handlingFee),
        netFarmerPayout: Number(orderPayload.netFarmerPayout),
        status: 'ORDER_PLACED',
        orderDate: new Date().toISOString(),
        scheduledPickup: orderPayload.scheduledPickup || new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
        estimatedDelivery: new Date(Date.now() + 3600 * 1000 * 5).toISOString(),
        buyer: orderPayload.buyer || VERIFIED_BUYERS[0],
        transporter: orderPayload.transporter || TRANSPORTERS[0],
        otpCode: otpCode,
        escrowStatus: 'ESCROW_LOCKED_20%',
        milestones: [
          { step: 1, title: 'Order Placed & Deal Locked', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), completed: true, details: `Price locked at ₹${orderPayload.agreedPricePerQtl}/qtl. 20% advance escrow guaranteed.` },
          { step: 2, title: 'Transporter Assigned & Pickup Scheduled', timestamp: 'Pending Pickup', completed: false, details: `${orderPayload.transporter?.driverName || 'Rameshwar Patil'} assigned for pickup.` },
          { step: 3, title: 'In Transit (Live GPS Tracking)', timestamp: 'Upcoming', completed: false, details: 'Live vehicle telemetry will activate upon loading.' },
          { step: 4, title: 'Out for Delivery / Mandi Gate Inspection', timestamp: 'Upcoming', completed: false, details: 'Entering mandi for weighbridge verification.' },
          { step: 5, title: 'Delivered & Instant Payout Released', timestamp: `Pending OTP (${otpCode})`, completed: false, details: `Share OTP ${otpCode} upon arrival to release full ₹${Number(orderPayload.netFarmerPayout).toLocaleString('en-IN')}.` }
        ],
        liveGps: {
          latitude: 20.0100,
          longitude: 73.8000,
          speedKmH: 0,
          distanceRemainingKm: orderPayload.distanceKm || 35.0,
          etaMinutes: Math.round((orderPayload.distanceKm || 35.0) * 1.5)
        }
      }

      const updated = [newOrder, ...orders]
      setStored(STORAGE_KEYS.ORDERS, updated)
      return newOrder
    }
  },

  // Update order status (Live tracking progression & milestone triggers)
  async updateOrderStatus(orderId, updateData) {
    const orders = getStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
    const index = orders.findIndex(o => o.id === orderId)
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updateData }
      setStored(STORAGE_KEYS.ORDERS, orders)
      return orders[index]
    }
    return null
  },

  // Verify OTP & Release Escrow Payment (Step 7 milestone completion)
  async verifyDeliveryOtp(orderId, enteredOtp) {
    const orders = getStored(STORAGE_KEYS.ORDERS, DEMO_ORDERS)
    const index = orders.findIndex(o => o.id === orderId)
    if (index !== -1) {
      const order = orders[index]
      if (order.otpCode === enteredOtp.trim()) {
        order.status = 'DELIVERED'
        order.escrowStatus = 'PAYOUT_RELEASED_100%'
        order.milestones[3].completed = true
        order.milestones[4].completed = true
        order.milestones[4].timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        order.milestones[4].details = `OTP verified. ₹${order.netFarmerPayout.toLocaleString('en-IN')} instantly credited to Farmer Bank/UPI.`
        orders[index] = order
        setStored(STORAGE_KEYS.ORDERS, orders)
        return { success: true, order }
      } else {
        return { success: false, message: 'Invalid OTP code. Please enter the 4-digit code provided to the farmer.' }
      }
    }
    return { success: false, message: 'Order not found.' }
  },

  // Admin: Add or update crop
  async adminSaveCrop(crop) {
    const custom = getStored(STORAGE_KEYS.CUSTOM_CROPS, [])
    const index = custom.findIndex(c => c.id === crop.id)
    if (index >= 0) {
      custom[index] = crop
    } else {
      custom.push(crop)
    }
    setStored(STORAGE_KEYS.CUSTOM_CROPS, custom)
    return crop
  },

  // Admin: Add or update mandi
  async adminSaveMandi(mandi) {
    const custom = getStored(STORAGE_KEYS.CUSTOM_MANDIS, [])
    const index = custom.findIndex(m => m.id === mandi.id)
    if (index >= 0) {
      custom[index] = mandi
    } else {
      custom.push(mandi)
    }
    setStored(STORAGE_KEYS.CUSTOM_MANDIS, custom)
    return mandi
  }
}
