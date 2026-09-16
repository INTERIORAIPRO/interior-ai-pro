const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });

const databaseTheHome = {
    'Modern': [
        { id: 'm1', name: 'Canapea Velvet Lux', price: 3999, url: 'https://www.thehome.ro/canapea-extensabila-velvet-lux' },
        { id: 'm2', name: 'Măsuță cafea Glass Modern', price: 799, url: 'https://www.thehome.ro/masuta-cafea-glass' }
    ],
    'Scandinav': [
        { id: 's1', name: 'Fotoliu Nordic Minimal', price: 1299, url: 'https://www.thehome.ro/fotoliu-nordic' },
        { id: 's2', name: 'Lampadar lemn natural', price: 450, url: 'https://www.thehome.ro/lampadar-lemn' }
    ],
    'Industrial': [
        { id: 'i1', name: 'Bibliotecă Metal & Lemn', price: 2100, url: 'https://www.thehome.ro/biblioteca-industrial' },
        { id: 'i2', name: 'Scaun bar Metalic', price: 350, url: 'https://www.thehome.ro/scaun-bar' }
    ],
    'Minimalist': [
        { id: 'min1', name: 'Comodă TV Minimalistă', price: 1599, url: 'https://www.thehome.ro/comoda-tv' },
        { id: 'min2', name: 'Covor geometrice simple', price: 899, url: 'https://www.thehome.ro/covor-minimalist' }
    ]
};

app.post('/redecorate', upload.single('roomImage'), async (req, res) => {
    try {
        const { selectedStyle, budget } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ error: 'Lipsește poza camerei.' });
        }

        let aiRenderUrl = `https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80`;
        if (selectedStyle === 'Scandinav') {
            aiRenderUrl = `https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80`;
        } else if (selectedStyle === 'Industrial') {
            aiRenderUrl = `https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80`;
        } else if (selectedStyle === 'Minimalist') {
            aiRenderUrl = `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80`;
        }

        const products = databaseTheHome[selectedStyle] || databaseTheHome['Modern'];
        const maxBudgetInt = parseInt(budget || 10000);
        const filteredProducts = products.filter(p => p.price <= maxBudgetInt);

        res.json({
            uniqueAiRenderUrl: aiRenderUrl,
            theHomeProducts: filteredProducts.length > 0 ? filteredProducts.slice(0, 3) : products.slice(0, 2)
        });

    } catch (error) {
        console.error("Erore în server:", error);
        res.status(500).json({ error: 'A apărut o eroare internă pe server.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serverul rulează cu succes pe portul ${PORT}`);
});
