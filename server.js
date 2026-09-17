const express = require('express');
const multer = require('multer');
const upload = multer(); // Pregătit pentru a prelua fișiere multipart trimise din Expo
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

// Folosim upload.any() pentru a putea prelua atât fișierele, cât și câmpurile text trimise din aplicație
app.post('/redecorate', upload.any(), async (req, res) => {
  try {
    // Preluăm datele indiferent dacă vin în body sau ca fișiere
    const bodyData = req.body || {};
    const selectedStyle = bodyData.selectedStyle || 'Modern';
    const roomType = bodyData.roomType || 'Sufragerie';
    
    // Dacă poza vine ca Base64 în body sau ca fișier atașat
    let roomImageBase64 = bodyData.roomImageBase64;
    if (!roomImageBase64 && req.files && req.files.length > 0) {
      roomImageBase64 = `data:image/jpeg;base64,${req.files[0].buffer.toString('base64')}`;
    }

    if (!roomImageBase64) {
      return res.status(400).json({ error: 'Lipsește poza camerei.' });
    }

    const rawProducts = bazaDateTheHome[selectedStyle] || bazaDateTheHome['Modern'];
    const theHomeProducts = rawProducts.map(p => ({
      id: p.id,
      name: p.name,
      price: p.pret,
      url: p.url
    }));

    let finalRenderUrl = roomImageBase64;

    if (process.env.REPLICATE_API_TOKEN) {
      try {
        const responseAI = await fetch('https://api.replicate.com/v1/predictions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            version: "7762fd07cf82c948538e41f63f7d068bf62fc1f6810ad1334bdc31d6f5170d2f",
            input: {
              image: roomImageBase64,
              prompt: `A professional interior design photo of a ${roomType}, ${selectedStyle} style, high-end furniture, luxury decor, photorealistic, 8k resolution`,
              prompt_strength: 0.75,
              num_outputs: 1
            }
          })
        });

        let prediction = await responseAI.json();

        if (prediction && prediction.id) {
          let getUrl = prediction.urls.get;
          let status = prediction.status;

          while (status !== "succeeded" && status !== "failed" && status !== "canceled") {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const checkRes = await fetch(getUrl, {
              headers: {
                'Authorization': `Bearer ${process.env.REPLICATE_API_TOKEN}`,
                'Content-Type': 'application/json',
              }
            });
            const checkData = await checkRes.json();
            status = checkData.status;
            if (status === "succeeded" && checkData.output) {
              finalRenderUrl = Array.isArray(checkData.output) ? checkData.output[0] : checkData.output;
            }
          }
        }
      } catch (aiError) {
        console.log("Erore în procesarea AI, s-a folosit imaginea inițială:", aiError.message);
      }
    }

    res.json({
      uniqueAiRenderUrl: finalRenderUrl,
      theHomeProducts: theHomeProducts
    });

  } catch (error) {
    console.error("Erore în server:", error);
    res.status(500).json({ error: 'A apărut o eroare internă pe server.' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
