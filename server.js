const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

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

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageBase64, selectedStyle, roomType } = req.body;

    if (!roomImageBase64) {
      return res.status(400).json({ error: "Lipsește imaginea camerei." });
    }

    const produseRecomandate = bazaDateTheHome[selectedStyle] || bazaDateTheHome["Modern"];
    const apiToken = process.env.REPLICATE_API_TOKEN;

    if (!apiToken) {
      return res.json({
        success: true,
        uniqueAiRenderUrl: roomImageBase64,
        theHomeProducts: produseRecomandate
      });
    }

    // Apel oficial către Replicate folosind modelul de design interior / img2img
    const responseReplicate = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "5c7d5dc6dd8bf75c1acaa8565735e7984bc5b8529f7960e6e06882997b7b1580", // Model Stable Diffusion dedicat pentru transformări
        input: {
          image: roomImageBase64,
          prompt: `A professional luxury interior design of a ${roomType}, ${selectedStyle} style, high-end furniture, photorealistic, architectural digest`,
          prompt_strength: 0.75,
          num_outputs: 1
        }
      })
    });

    const prediction = await responseReplicate.json();

    let outputImageUrl = roomImageBase64;
    if (prediction && prediction.urls && prediction.urls.get) {
      // Preluăm rezultatul generat de la Replicate
      let getUrl = prediction.urls.get;
      let status = prediction.status;
      let resultData = prediction;

      // Buclă scurtă de așteptare pentru finalizarea randării AI
      while (status !== "succeeded" && status !== "failed") {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const checkRes = await fetch(getUrl, {
          headers: { "Authorization": `Bearer ${apiToken}` }
        });
        resultData = await checkRes.json();
        status = resultData.status;
      }

      if (status === "succeeded" && resultData.output && resultData.output.length > 0) {
        outputImageUrl = resultData.output[0];
      }
    }

    res.json({
      success: true,
      uniqueAiRenderUrl: outputImageUrl,
      theHomeProducts: produseRecomandate
    });

  } catch (err) {
    console.error("Eroare server AI:", err);
    res.status(500).json({ error: "Eroare la generarea randării AI." });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
