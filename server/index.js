import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config({ path: './server/.env' });

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(express.json());

// Serveer de frontend
app.use(express.static(join(__dirname, '../client')));

const BASE_URL = 'https://mborijnland.osiris-student.nl/student/osiris';
const TOKEN = process.env.BEARER_TOKEN;

async function osirisGet(path, res) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Osiris API fout', status: response.status });
    }

    res.json(await response.json());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

app.get('/api/rooster/week', (req, res) => {
  const offset = req.query.offset || 0;
  osirisGet(`/student/rooster/per_week?limit=5&offset=${offset}`, res);
});
app.get('/api/rooster',       (_, res) => osirisGet('/student/rooster?limit=5&q=%7B%22actueel%22:%22J%22%7D', res));
app.get('/api/gebruiker',     (_, res) => osirisGet('/gebruiker', res));
app.get('/api/resultaten',    (_, res) => osirisGet('/student/resultaten?limit=25', res));
// app.get('/api/mededelingen',  (_, res) => osirisGet('/student/mededelingen?limit=25&q=%7B%22gelezen%22:%22N%22%7D', res));
app.get('/api/mededelingen',  (_, res) => osirisGet('/student/mededelingen?limit=25', res));
app.get('/api/afwezigheid',   (_, res) => osirisGet('/student/afwezigheid/overzicht/', res));
// Proxy endpoint for a single mededeling (details)
app.get('/api/mededelingen/:id', (req, res) => {
  const id = req.params.id;
  osirisGet(`/student/mededelingen/${encodeURIComponent(id)}`, res);
});

// Afwezigheid endpoints
app.get('/api/absentiemeldingen', (_, res) => osirisGet('/student/absentiemeldingen/?limit=25', res));
app.get('/api/afwezigheid/per_dag', (req, res) => {
  const limit = req.query.limit || 7;
  const offset = req.query.offset || 0;
  let path = `/student/afwezigheid/per_dag/?limit=${limit}&offset=${offset}`;
  if (req.query.typen_waarneming) {
    path += `&typen_waarneming=${encodeURIComponent(req.query.typen_waarneming)}`;
  }
  osirisGet(path, res);
});
app.get('/api/afwezigheid/overzicht', (_, res) => osirisGet('/student/afwezigheid/overzicht/', res));

app.listen(3000, () => console.log('✅ Draait op http://localhost:3000'));