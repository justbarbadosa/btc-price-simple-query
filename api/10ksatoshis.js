const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const response = await fetch('https://blockchain.info/frombtc?value=10000&currency=USD&textual=true&nosavecurrency=true');
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
      const formattedDate = date.toISOString().replace('T', ' ').replace(/\..*Z/, ' GMT-4');
      
      // Replace the original timestamp with the new formatted one
      const formattedData = data.replace(/@(.*)T(.*)\..*Z/, `@${formattedDate}`);
      res.status(200).send(formattedData);
    } else {
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(500).send('Error fetching BTC price');
  }
};
