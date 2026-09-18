const express = require('express');
const cors = require('cors');
const Replicate = require('replicate');

const app = express();

// Mărim limita pentru a putea primi imagini de la telefon
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Verificăm dacă cheia Replicate este configurată
if (!process.env.REPLICATE_API_TOKEN) {
  console.error("ATENȚIE: Lipsește variabila de mediu REPLICATE_API_TOKEN!");
}

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Baza de date cu produse adaptate stilului
function getProductsForStyle(style) {
  if (style === 'Modern') {
    return [
      { id: '1', name: 'Canapea Modern Velvet', price: '2499', url: 'https://www.thehome.ro' },
      { id: '2', name: 'Măsuță de cafea Minimal', price: '699', url: 'https://www.thehome.ro' }
    ];
  } else if (style === 'Scandinav') {
    return [
      { id: '3', name: 'Fotoliu Nordic lemn de mesteacăn', price: '1299', url: 'https://www.thehome.ro' },
      { id: '4', name: 'Lampadar minimalist alb', price: '450', url: 'https://www.thehome.ro' }
    ];
  } else if (style === 'Industrial') {
    return [
      { id: '5', name: 'Canapea piele maro vintage', price: '3200', url: 'https://www.thehome.ro' },
      { id: '6', name: 'Raft metalic industrial', price: '1100', url: 'https://www.thehome.ro' }
    ];
  } else {
    return [
      { id: '7', name: 'Covor ecru minimalist', price: '899', url: 'https://www.thehome.ro' },
      { id: '8', name: 'Comodă albă simplă', price: '1050', url: 'https://www.thehome.ro' }
    ];
  }
}

app.post('/redecorate', async (req, res) => {
  try {
    const { roomImageUri, selectedStyle, roomType } = req.body;

    if (!roomImageUri) {
      return res.status(400).json({ success: false, error: "Lipsește imaginea camerei." });
    }

    console.log(`Primit cerere pentru: ${roomType}, Stil: ${selectedStyle}`);

    // Apelăm modelul de pe Replicate pentru redesign interior
    const output = await replicate.run(
      "adirik/interior-design:76604baddc85b1b461621c64d8fc5ef24cef36868297b45b09f42d2a45a30e8c",
      {
        input: {
          image: roomImageUri,
          prompt: `A professional interior design of a ${roomType}, ${selectedStyle} style, high quality, realistic architecture, 4k`,
          guidance_scale: 7.5,
          num_inference_steps: 30
        }
      }
    );

    console.log("Răspuns primit de la Replicate:", output);

    const uniqueAiRenderUrl = Array.isArray(output) ? output[0] : output;
    const theHomeProducts = getProductsForStyle(selectedStyle);

    res.json({
      success: true,
      uniqueAiRenderUrl: uniqueAiRenderUrl,
      theHomeProducts: theHomeProducts
    });

  } catch (error) {
    console.error("Eroare detaliată pe server:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Setarea corectă a portului pentru Render
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serverul rulează pe portul ${PORT}`);
});
