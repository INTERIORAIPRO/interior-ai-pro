const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const bazaDateTheHome = {
  "Modern": [
    { id: "m1", name: "Canapea Velvet lux", pret: 3999, url: "https://www.thehome.ro/canapea-extensibila-velvet-lux" },
    { id: "m2", name: "Măsuță cafea Glass Modern", pret: 799, url: "https://www.thehome.ro/masuta-cafea-glass" }
  ],
  "Scandinav": [
    { id: "s1", name: "Fotografie Nordic Minimal", pret: 1299, url: "https://www.thehome.ro/fotoliu-nordic" },
    { id: "s2", name: "Lampă de lemn naturală", pret: 450, url: "https://www.thehome.ro/lampadar-lemn" }
  ],
  "Industrial": [
    { id: "i1", name: "Bibliotecă Metal & Lemn", pret: 2100, url: "https://www.thehome.ro/biblioteca-industrial" },
    { id: "i2", name: "Bară metalică Scaun", pret: 350, url: "https://www.thehome.ro/scaun-bar" }
  ],
  "Minimalist": [
    { id: "min1", name: "Comodă TV Minimalistă", pret: 1599, url: "https://www.thehome.ro/comoda-tv" },
    { id: "min2", name: "Covor geometric simplu", pret: 899, url: "https://www.thehome.ro/covor-minimalist" }
  ]
};

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, budget, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: 'Lipsește poza camerei.' });
    }

    const styleKey = selectedStyle || 'Modern';
    const products = bazaDateTheHome[styleKey] || bazaDateTheHome['Modern'];

    // Răspunsul trimis înapoi către aplicația ta React Native
    res.json({
      uniqueAiRenderUrl: roomImageBase64, // Poți pune aici link-ul imaginii generate de AI dacă ai integrare, sau imaginea primită
      theHomeProducts: products
    });

  } catch (error) {
    console.error("Erore in server:", error);
    res.status(500).json({ error: 'A apărut o eroare internă pe server.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serverul rulează cu succes pe portul ${PORT}`);
});
