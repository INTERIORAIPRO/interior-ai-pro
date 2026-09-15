const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cron = require('node-cron');
const NodeCache = require('node-cache');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

const databaseTheHome = {
    'Modern': [
        { id: 'm1', name: 'Canapea Velvet Lux', price: 3999, url: 'https://event.2performant.com/events/click?ad_store_id=...&url=https://www.thehome.ro' },
        { id: 'm2', name: 'Măsuță cafea Glass', price: 799, url: 'https://event.2performant.com/events/click?ad_store_id=...&url=https://www.thehome.ro' }
    ]
};

app.post('/redecorate', upload.single('roomImage'), async (req, res) => {
    const { selectedStyle, budget } = req.body;
    if (!req.file) {
        return res.status(400).json({ error: 'Lipsă poză.' });
    }
    const aiRenderUrl = `https://picsum.photos/800/600?random=${Date.now()}`;
    let products = databaseTheHome[selectedStyle] || databaseTheHome['Modern'];
    const filteredProducts = products.filter(p => p.price <= parseInt(budget || 10000));

    res.json({
        uniqueAiRenderUrl: aiRenderUrl,
        theHomeProducts: filteredProducts.slice(0, 3)
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server rulează pe portul ${PORT}`);
});