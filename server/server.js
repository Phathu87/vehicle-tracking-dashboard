import express from 'express';
import cors from 'cors';
import { vehicles, seedHistory, tick } from './data.js';

const app = express();
app.use(cors());
app.use(express.json());

seedHistory();
setInterval(tick, 30_000);

app.get('/api/health', (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/api/vehicles', (req, res) => {
  const list = vehicles.map(({ history, ...rest }) => rest);
  res.json(list);
});
app.get('/api/vehicles/:id', (req, res) => {
  const v = vehicles.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  const { history, ...rest } = v;
  res.json(rest);
});
app.get('/api/vehicles/:id/history', (req, res) => {
  const v = vehicles.find(x => x.id === req.params.id);
  if (!v) return res.status(404).json({ error: 'Not found' });
  res.json({ id: v.id, history: v.history });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Mock API on http://localhost:${PORT}`));