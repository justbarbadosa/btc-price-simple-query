const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const response = await fetch('https://blockchain.info/frombtc?value=10000&currency=USD&textual=true&nosavecurrency=true');
    const data = await response.text();
    // Format the timestamp
    const formattedData = data.replace(/@(.*)T(.*)\..*Z/, '@$1 $2'); // Remove decimal part and reformat
    res.status(200).send(formattedData);
};
