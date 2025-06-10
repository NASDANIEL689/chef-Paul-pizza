import { adminFunctions } from './supabase.js'

async function initializeDatabase() {
    console.log('Initializing database...')
    
    try {
        // Initialize tables
        const initResult = await adminFunctions.initializeDatabase()
        if (!initResult.success) {
            throw new Error('Failed to initialize database tables')
        }
        console.log('Database tables created successfully')
        
        // Add initial deals
        const dealsResult = await adminFunctions.addInitialDeals()
        if (!dealsResult.success) {
            throw new Error('Failed to add initial deals')
        }
        console.log('Initial deals added successfully')
        
        console.log('Database initialization completed successfully')
    } catch (error) {
        console.error('Database initialization failed:', error)
    }
}

// Run initialization
initializeDatabase() 