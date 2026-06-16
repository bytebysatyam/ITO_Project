const express = require('express');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/test', (req, res) => {
    res.json({ message: "India Trade Overseas System is Online!" });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running smoothly on port ${PORT}`);
});