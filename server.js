const express = require('express');
const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const bazaDateTheHome = {
  "Modern": [
    { id: "m1", name: "Canapea Velvet lux", pret: 3999, url: "https://www.thehome.ro/" },
    { id: "m2", name: "Măsuță cafea Glass Modern", pret: 799, url: "https://www.thehome.ro/" }
  ],
  "Scandinav": [
    { id: "s1", name: "Fotografie Nordic Minimal", pret: 1299, url: "https://www.thehome.ro/" },
    { id: "s2", name: "Lampă de lemn naturală", pret: 450, url: "https://www.thehome.ro/" }
  ],
  "Industrial": [
    { id: "i1", name: "Bibliotecă Metal & Lemn", pret: 2100, url: "https://www.thehome.ro/" },
    { id: "i2", name: "Bară metalică Scaun", pret: 350, url: "https://www.thehome.ro/" }
  ],
  "Minimalist": [
    { id: "min1", name: "Comodă TV Minimalistă", pret: 1599, url: "https://www.thehome.ro/" },
    { id: "min2", name: "Covor geometric simplu", pret: 899, url: "https://www.thehome.ro/" }
  ]
};

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, budget, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: 'Lipsește poza camerei.' });
    }

    const styleKey = selectedStyle || 'Modern';
    const rawProducts = bazaDateTheHome[styleKey] || bazaDateTheHome['Modern'];
    
    const theHomeProducts = rawProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.pret,
      url: p.url
    }));

    res.json({
      uniqueAiRenderUrl: roomImageBase64,
      theHomeProducts: theHomeProducts
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
