const express = require('express')
const cors = require('cors')
const {Pool} = require('pg') // PostgreSQL

const app = express()
app.use(
  cors({
    origin: 'https://phanikumaryubylrjscpd56gk.drops.nxtwave.tech',
  }),
)

app.use(express.json())

// Railway PostgreSQL connection (you'll update this with actual Railway creds)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // safe for Railway
  ssl: {
    rejectUnauthorized: false, // only for Railway
  },
})

// POST endpoint (insert heading)
app.post('/api/heading/', async (req, res) => {
  const {heading} = req.body

  // Create table if not exists
  await pool.query(`
    CREATE TABLE IF NOT EXISTS dynamicheading (
      heading_id INTEGER PRIMARY KEY,
      heading TEXT
    )
  `)

  // Delete old row
  await pool.query(`DELETE FROM dynamicheading WHERE heading_id = 1`)

  // Insert new row
  await pool.query(
    `INSERT INTO dynamicheading (heading_id, heading) VALUES (1, $1)`,
    [heading],
  )

  res.send('success')
})

// GET endpoint
app.get('/api/heading/', async (req, res) => {
  const result = await pool.query('SELECT * FROM dynamicheading')
  res.send(result.rows)
})

// Start server
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`)
})
