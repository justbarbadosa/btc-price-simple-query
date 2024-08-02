const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = async (req, res) => {
  const cachedPrice = myCache.get('btcPrice10k');
  if (cachedPrice) {
    return res.status(200).send(cachedPrice);
  }

  try {
    const response = await fetch('https://blockchain.info/frombtc?value=10000&currency=USD&textual=true&nosavecurrency=true', {
      timeout: 5000
    });
    const data = await response.text();

    // Extract and convert the timestamp
    const match = data.match(/@(.*)T(.*)\..*Z/);
    if (match) {
      const datePart = match[1];
      const timePart = match[2];
      const dateTimeString = `${datePart}T${timePart}Z`;

      // Convert to Date object
      const date = new Date(dateTimeString);

      // Adjust time to GMT-4
      date.setHours(date.getHours() - 4);

      // Format the new date and time
      const month = date.toLocaleString('default', { month: 'long' });
      const day = date.getUTCDate();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');

      // Create a more readable date format
      const formattedDate = `${month} ${day}, ${hours}:${minutes}, GMT-4`;

      // Replace the original timestamp with the new formatted one
      const formattedData = data.replace(/@(.*)T(.*)\..*Z/, `(${formattedDate})`);
      myCache.set('btcPrice10k', formattedData);
      res.status(200).send(formattedData);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    res.status(500).send('Error fetching BTC price');
  }
};
