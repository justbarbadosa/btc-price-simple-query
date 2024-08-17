const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 600, checkperiod: 120 });

module.exports = async (req, res) => {
  const walletAddress = 'bc1qne60cr0433tq9jmufrr0977c4av3ynwj20tej5'; // Replace with your actual wallet address

  const cachedPrice = myCache.get('btcPrice');
  if (cachedPrice) {
    return res.status(200).send(cachedPrice);
  }

  try {
    // Fetch the wallet balance in satoshis
    const balanceResponse = await fetch(`https://blockchain.info/q/addressbalance/${walletAddress}`);
    const balanceSatoshis = await balanceResponse.text();

    // Fetch the current BTC/USD price
    const priceResponse = await fetch('https://blockchain.info/ticker');
    const priceData = await priceResponse.json();
    const btcPriceUSD = priceData.USD.last;

    // Convert satoshis to BTC
    const balanceBTC = balanceSatoshis / 100000000;

    // Calculate the balance worth in USD
    const balanceUSD = balanceBTC * btcPriceUSD;

    // Fetching current BTC price for 1 BTC (100,000,000 satoshis)
    const btcPriceResponse = await fetch('https://blockchain.info/frombtc?value=100000000&currency=USD&textual=true&nosavecurrency=true', {
      timeout: 5000
    });
    const btcPriceData = await btcPriceResponse.text();

    // Extract and convert the timestamp
    const match = btcPriceData.match(/@(.*)T(.*)\..*Z/);
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
      const formattedBTCPriceData = btcPriceData.replace(/@(.*)T(.*)\..*Z/, `(${formattedDate})`);
      
      // Combine BTC price and wallet balance information
      const combinedData = `The balance for wallet ${walletAddress} is ${balanceBTC} BTC (approximately $${balanceUSD.toFixed(2)} USD)\nBTC Price: ${formattedBTCPriceData}`;
      
      myCache.set('btcPrice', combinedData);
      res.status(200).send(combinedData);
    } else {
      res.status(200).send(btcPriceData);
    }
  } catch (error) {
    console.error('Error fetching BTC price or wallet balance:', error);
    res.status(500).send('Error fetching BTC price or wallet balance');
  }
};
