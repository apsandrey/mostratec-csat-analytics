const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const session = require('express-session')
const sqlite3 = require('sqlite3').verbose()
const db = require('./db')

const app = express()
const PORT = process.env.PORT || 3000

app.use(session({ secret: 'chave-secreta', resave: false, saveUninitialized: true }))
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

function requireAuth(req, res, next) {
  if (req.session.authenticated) return next()
  res.redirect('/admin/login')
}

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/login.html'))
})

app.post('/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username === 'admin' && password === 'admin') {
    req.session.authenticated = true
    return res.redirect('/admin/dashboard')
  }
  res.redirect('/admin/login')
})

const { exec } = require('child_process');

app.get('/admin/dashboard', (req, res) => {
  exec('python ../analysis/generate_reports.py', (err, stdout, stderr) => {
    if (err) {
      console.error('Erro ao gerar os relatórios:', stderr);
      return res.status(500).send('Erro ao gerar os relatórios.');
    }
    console.log('Relatórios atualizados com sucesso.');
    res.sendFile(__dirname + '/public/admin/dashboard.html');
  });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/admin/login'))
})

app.get('/admin/sorteio', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/sorteio.html'))
})

app.get('/admin/raffle', requireAuth, (req, res) => {
  db.get(
    'SELECT name, role, phone, consent, rating, comment FROM evaluations WHERE phone IS NOT NULL ORDER BY RANDOM() LIMIT 1',
    [],
    (err, row) => {
      if (err || !row) return res.status(500).json({ error: 'Erro no sorteio' })
      res.json(row)
    }
  )
})

app.get('/admin/evaluations', requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/evaluations.html'))
})

app.get('/api/check-phone', (req, res) => {
  const phone = req.query.phone
  db.get('SELECT COUNT(1) AS cnt FROM evaluations WHERE phone = ?', [phone], (err, row) => {
    if (err) return res.status(500).json({ exists: false })
    res.json({ exists: row.cnt > 0 })
  })
})

app.post('/api/submit', (req, res) => {
  const { name, role, consent, phone, rating, comment } = req.body
  db.run(
    'INSERT INTO evaluations (name, role, consent, phone, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
    [name, role, consent, phone || null, rating, comment || null],
    function (err) {
      if (err) return res.status(500).json({ success: false })
      res.json({ success: true })
    }
  )
})

app.get('/api/evaluations', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ success: false })
    res.json(rows)
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
