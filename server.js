import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import aiRouter from './routes/aiRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Controllo chiave API
console.log('API Key:', process.env.OPENAI_API_KEY);
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY non definita!');
  process.exit(1);
}

// Connessione MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/felinia';
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ Connesso a MongoDB con successo');
}).catch(err => {
  console.error('❌ Errore connessione MongoDB:', err.message);
});

// Rotte
app.use('/api/ai', aiRouter);

// Error handling
app.use((err, req, res, next) => {
  console.error('❌ Errore:', err);
  res.status(500).json({ errore: 'Errore interno server' });
});

// 404
app.use((req, res) => {
  res.status(404).json({ errore: 'Risorsa non trovata' });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server attivo su http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Connessione MongoDB chiusa. Server terminato.');
    process.exit(0);
  });
});

export default app;
