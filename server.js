const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Baze de date extinse cu multiple variante de produse pentru fiecare stil
const bazaDateTheHome = {
  "Modern": [
    [
      { id: "m1", name: "Canapea Velvet Lux", price: 3999, url: "https://www.thehome.ro/" },
      { id: "m2", name: "Măsuță cafea Glass Modern", price: 799, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "m3", name: "Fotoliu Elegant boucle", price: 1899, url: "https://www.thehome.ro/" },
      { id: "m4", name: "Candelabru Auriu Modern", price: 1250, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "m5", name: "Colțar Spacious Living", price: 5499, url: "https://www.thehome.ro/" },
      { id: "m6", name: "Covor Pufos Abstract", price: 950, url: "https://www.thehome.ro/" }
    ]
  ],
  "Scandinav": [
    [
      { id: "s1", name: "Fotografie Nordică Minimalistă", price: 1299, url: "https://www.thehome.ro/" },
      { id: "s2", name: "Lampă de lemn natural", price: 450, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "s3", name: "Mască de pat scandinavă", price: 2300, url: "https://www.thehome.ro/" },
      { id: "s4", name: "Comodă albă cu picioare de lemn", price: 1100, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "s5", name: "Scaun dining Nordic alb", price: 390, url: "https://www.thehome.ro/" },
      { id: "s6", name: "Suport ghiveci lemn stratificat", price: 220, url: "https://www.thehome.ro/" }
    ]
  ],
  "Industrial": [
    [
      { id: "i1", name: "Bibliotecă Metal & Lemn", price: 2100, url: "https://www.thehome.ro/" },
      { id: "i2", name: "Scaun bar metalic industrial", price: 350, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "i3", name: "Masă extensibilă blat masiv", price: 3200, url: "https://www.thehome.ro/" },
      { id: "i4", name: "Lampadar tip reflectoare", price: 680, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "i5", name: "Canapea piele vintage maro", price: 4899, url: "https://www.thehome.ro/" },
      { id: "i6", name: "Raft perete țevi oțel", price: 550, url: "https://www.thehome.ro/" }
    ]
  ],
  "Minimalist": [
    [
      { id: "min1", name: "Comodă TV Minimalistă", price: 1599, url: "https://www.thehome.ro/" },
      { id: "min2", name: "Covor geometric simplu", price: 899, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "min3", name: "Măsuță cafea rotundă oțel alb", price: 650, url: "https://www.thehome.ro/" },
      { id: "min4", name: "Scaun minimalist fără brațe", price: 490, url: "https://www.thehome.ro/" }
    ],
    [
      { id: "min5", name: "Sistem modular perete alb", price: 2900, url: "https://www.thehome.ro/" },
      { id: "min6", name: "Corp iluminat LED încastrat", price: 310, url: "https://www.thehome.ro/" }
    ]
  ]
};

// Colecții multiple de imagini randate pentru fiecare stil (varietate maximă)
const randariAIStiluri = {
  "Modern": [
    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80"
  ],
  "Scandinav": [
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80"
  ],
  "Industrial": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1534349762230-10cadf05cf8d?auto=format&fit=crop&w=1000&q=80"
  ],
  "Minimalist": [
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80"
  ]
};

app.post('/redecorate', async (req, res) => {
  try {
    const { selectedStyle } = req.body;

    const listaImagini = randariAIStiluri[selectedStyle] || randariAIStiluri["Modern"];
    const listaProduse = bazaDateTheHome[selectedStyle] || bazaDateTheHome["Modern"];

    // Alegem aleatoriu o imagine și o listă de produse din colecții
    const imagineAleatorie = listaImagini[Math.floor(Math.random() * listaImagini.length)];
    const produseAleatorii = listaProduse[Math.floor(Math.random() * listaProduse.length)];
    
    // Simulare timp procesare AI
    await new Promise(resolve => setTimeout(resolve, 800));

    res.json({
      success: true,
      uniqueAiRenderUrl: imagineAleatorie,
      theHomeProducts: produseAleatorii
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
