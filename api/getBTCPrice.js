const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://blockchain.info/frombtc?value=100000000&currency=USD&textual=true&nosavecurrency=true');
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
      res.status(200).send(formattedData);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    console.error('Error fetching BTC price:', error);
    res.status(500).send('Error fetching BTC price');
  }
};
