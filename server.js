const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Baza de date cu produsele de la The Home pentru fiecare stil
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

// Randările AI simulate pentru fiecare stil în parte
const randariAI = {
  "Modern": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
  "Scandinav": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
  "Industrial": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  "Minimalist": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80"
};

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: "Lipsește imaginea camerei." });
    }

    const produseRecomandate = bazaDateTheHome[selectedStyle] || bazaDateTheHome["Modern"];
    
    // Luăm imaginea generată de AI corespunzătoare stilului ales de tine
    const imagineNouaAI = randariAI[selectedStyle] || randariAI["Modern"];
    
    // Simulare timp de procesare AI
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({
      success: true,
      uniqueAiRenderUrl: imagineNouaAI, // Aici trimitem noua poză generată!
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
