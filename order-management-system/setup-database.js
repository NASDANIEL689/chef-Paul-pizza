import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://inajemonfduateakwipa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODg2NiwiZXhwIjoyMDY0OTU0ODY2fQ.mO8zpQww9-qHEhtpcwVlrSNsFEN_Ts4tvif_a-AImF8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
    try {
        // Read SQL file
        const sqlPath = path.join(process.cwd(), 'order-management-system', 'create-tables.sql')
        const sql = fs.readFileSync(sqlPath, 'utf8')

        // Execute SQL
        const { error } = await supabase.rpc('exec_sql', { sql })
        
        if (error) {
            throw error
        }

        console.log('Database setup completed successfully!')
    } catch (error) {
        console.error('Error setting up database:', error)
    }
}

setupDatabase() 