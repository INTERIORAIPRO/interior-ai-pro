const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Bază de date dinamică cu produse diferite pentru fiecare stil în parte
const bazaDateTheHome = {
  "Modern": [
    { id: "m1", name: "Canapea Velvet Lux", price: 3999, url: "https://www.thehome.ro/" },
    { id: "m2", name: "Măsuță cafea Glass Modern", price: 799, url: "https://www.thehome.ro/" },
    { id: "m3", name: "Fotoliu tapitat Velvet", price: 1499, url: "https://www.thehome.ro/" }
  ],
  "Scandinav": [
    { id: "s1", name: "Fotografie Nordică Minimalistă", price: 1299, url: "https://www.thehome.ro/" },
    { id: "s2", name: "Lampă de lemn natural", price: 450, url: "https://www.thehome.ro/" },
    { id: "s3", name: "Comodă lemn masiv scandinav", price: 1899, url: "https://www.thehome.ro/" }
  ],
  "Industrial": [
    { id: "i1", name: "Bibliotecă Metal & Lemn", price: 2100, url: "https://www.thehome.ro/" },
    { id: "i2", name: "Scaun bar metalic industrial", price: 350, url: "https://www.thehome.ro/" },
    { id: "i3", name: "Candelabru stil industrial", price: 890, url: "https://www.thehome.ro/" }
  ],
  "Minimalist": [
    { id: "min1", name: "Comodă TV Minimalistă", price: 1599, url: "https://www.thehome.ro/" },
    { id: "min2", name: "Covor geometric simplu", price: 899, url: "https://www.thehome.ro/" },
    { id: "min3", name: "Oglindă perete minimalistă", price: 650, url: "https://www.thehome.ro/" }
  ]
};

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: "Lipsește imaginea camerei." });
    }

    // Extragem produsele specifice stilului cerut de utilizator
    const produseRecomandate = bazaDateTheHome[selectedStyle] || bazaDateTheHome["Modern"];
    
    // Simulare procesare AI
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      success: true,
      // Trimitem înapoi exact poza pe care a încărcat-o utilizatorul (sau o randare bazată pe ea)
      uniqueAiRenderUrl: roomImageBase64, 
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
