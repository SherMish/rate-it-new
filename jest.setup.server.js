const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

let mongod

// Setup in-memory MongoDB for testing
beforeAll(async () => {
  mongod = await MongoMemoryServer.create()
  const uri = mongod.getUri()
  process.env.MONGODB_URI = uri
  
  // Set test environment variables
  process.env.NODE_ENV = 'test'
  process.env.NEXTAUTH_SECRET = 'test-secret'
  process.env.NEXTAUTH_URL = 'http://localhost:3000'
})

beforeEach(async () => {
  // Clear all collections before each test
  if (mongoose.connection.readyState === 1) {
    const collections = mongoose.connection.collections
    for (let collection in collections) {
      await collections[collection].deleteMany({})
    }
  }
})

afterAll(async () => {
  // Close mongoose connection and stop MongoDB instance
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close()
  }
  if (mongod) {
    await mongod.stop()
  }
})

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

// Mock Next.js server functions that might be used in API routes
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({
      json: () => Promise.resolve(data),
      status: options?.status || 200,
    })),
  },
  NextRequest: jest.fn(),
}))

// Mock Next.js request/response objects
global.createMockRequest = (options = {}) => ({
  method: 'GET',
  url: '/',
  headers: {},
  query: {},
  body: {},
  json: jest.fn().mockResolvedValue(options.body || {}),
  ...options,
})

global.createMockResponse = () => {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    end: jest.fn().mockReturnThis(),
    setHeader: jest.fn().mockReturnThis(),
    statusCode: 200,
  }
  return res
}

// Mock NextAuth session
global.mockSession = (user = null) => {
  const session = user ? {
    user: {
      id: '507f1f77bcf86cd799439011',
      email: 'test@example.com',
      name: 'Test User',
      ...user,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  } : null

  return session
} 