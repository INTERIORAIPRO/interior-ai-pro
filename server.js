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
      console.log("Lipsește REPLICATE_API_TOKEN în mediul Render.");
      return res.json({
        success: true,
        uniqueAiRenderUrl: roomImageBase64,
        theHomeProducts: produseRecomandate
      });
    }

    const responseReplicate = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "7762fd07cf82c948538e41f63f7d068bf62fc1d8dd1d0fbe7ea694efb2ad1222",
        input: {
          image: roomImageBase64,
          prompt: `Interior design of a ${roomType}, ${selectedStyle} style, luxury furniture, professional interior photography, photorealistic, 4k`,
          prompt_strength: 0.8,
          num_inference_steps: 25
        }
      })
    });

    const prediction = await responseReplicate.json();
    
    if (prediction.detail) {
      console.error("Eroare returnată de Replicate:", prediction.detail);
      return res.status(500).json({ error: "Eroare de la API-ul Replicate: " + prediction.detail });
    }

    let outputImageUrl = roomImageBase64;
    let getUrl = prediction.urls ? prediction.urls.get : null;
    let status = prediction.status;
    let resultData = prediction;

    let attempts = 0;
    while (status !== "succeeded" && status !== "failed" && getUrl && attempts < 15) {
      await new Promise(resolve => setTimeout(resolve, 3000));
      attempts++;
      const checkRes = await fetch(getUrl, {
        headers: { "Authorization": `Bearer ${apiToken}` }
      });
      resultData = await checkRes.json();
      status = resultData.status;
    }

    if (status === "succeeded" && resultData.output) {
      outputImageUrl = Array.isArray(resultData.output) ? resultData.output[0] : resultData.output;
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
