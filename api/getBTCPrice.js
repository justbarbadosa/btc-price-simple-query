const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const response = await fetch('https://blockchain.info/frombtc?value=10000&currency=USD&textual=true&nosavecurrency=true');
    const data = await response.text();
    const formattedData = data.replace(/\.\d+Z/, 'Z'); // Remove decimal part from the timestamp
    res.status(200).send(formattedData);
};