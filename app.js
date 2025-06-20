const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ————— Verifica se um telefone já existe —————
app.get('/api/check-phone', (req, res) => {
  const phone = req.query.phone;
  db.get(
    'SELECT COUNT(1) AS cnt FROM evaluations WHERE phone = ?',
    [phone],
    (err, row) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ exists: false });
      }
      res.json({ exists: row.cnt > 0 });
    }
  );
});

// ————— Submissão CSAT —————
app.post('/api/submit', (req, res) => {
  const { name, role, consent, phone, rating, comment } = req.body;

  // Inserção direta, sem duplicar a verificação (já feita no front)
  db.run(
    'INSERT INTO evaluations (name, role, consent, phone, rating, comment) VALUES (?, ?, ?, ?, ?, ?)',
    [name, role, consent, phone || null, rating, comment || null],
    function (err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Erro ao salvar avaliação.' });
      }
      res.json({ success: true });
    }
  );
});

// ————— Lista de avaliações —————
app.get('/api/evaluations', (req, res) => {
  db.all('SELECT * FROM evaluations ORDER BY timestamp DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
