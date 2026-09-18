const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Baza de date cu produse și link-uri reale către The Home
const bazaDateTheHome = {
  "Modern": [
    { id: "m1", name: "Canapea Velvet lux", price: 3999, url: "https://www.thehome.ro/" },
    { id: "m2", name: "Măsuță cafea Glass Modern", price: 799, url: "https://www.thehome.ro/" }
  ],
  "Scandinav": [
    { id: "s1", name: "Fotografie Nordică Minimalistă", price: 1299, url: "https://www.thehome.ro/" },
    { id: "s2", name: "Lampă de lemn natural", price: 450, url: "https://www.thehome.ro/" }
  ],
  "Industrial": [
    { id: "i1", name: "Bibliotecă Metal & Lemn", price: 2100, url: "https://www.thehome.ro/" },
    { id: "i2", name: "Bară metalică Scaun", price: 350, url: "https://www.thehome.ro/" }
  ],
  "Minimalist": [
    { id: "min1", name: "Comodă TV Minimalistă", price: 1599, url: "https://www.thehome.ro/" },
    { id: "min2", name: "Covor geometric simplu", price: 899, url: "https://www.thehome.ro/" }
  ]
};

// Endpoint-ul pe care aplicația ta din Expo face POST
app.post('/redecorate', (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: "Lipsește imaginea camerei." });
    }

    // Selectăm produsele în funcție de stilul ales
    const produseRecomandate = bazaDateTheHome[selectedStyle] || bazaDateTheHome["Modern"];

    // Pentru moment, trimitem înapoi poza originală sau un link simulat de randare AI,
    // împreună cu produsele corespunzătoare stilului.
    res.json({
      success: true,
      uniqueAiRenderUrl: roomImageBase64, // Aici va fi randarea AI când legăm un API extern de imagini
      theHomeProducts: produseRecomandate
    });

  } catch (err) {
    console.error("Eroare server:", err);
    res.status(500).json({ error: "Eroare internă pe server." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
