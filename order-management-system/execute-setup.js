import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

const supabaseUrl = 'https://inajemonfduateakwipa.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluYWplbW9uZmR1YXRlYWt3aXBhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0OTM3ODg2NiwiZXhwIjoyMDY0OTU0ODY2fQ.mO8zpQww9-qHEhtpcwVlrSNsFEN_Ts4tvif_a-AImF8'

const supabase = createClient(supabaseUrl, supabaseKey)

async function executeSetup() {
    try {
        // Read SQL file
        const sqlPath = path.join(process.cwd(), 'order-management-system', 'setup-database.sql')
        const sql = fs.readFileSync(sqlPath, 'utf8')

        // Split SQL into individual statements
        const statements = sql
            .split(';')
            .map(statement => statement.trim())
            .filter(statement => statement.length > 0)

        // Execute each statement
        for (const statement of statements) {
            console.log('Executing:', statement.substring(0, 50) + '...')
            const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' })
            
            if (error) {
                console.error('Error executing statement:', error)
                console.error('Statement:', statement)
                throw error
            }
        }

        console.log('Database setup completed successfully!')
    } catch (error) {
        console.error('Error setting up database:', error)
    }
}

executeSetup() 