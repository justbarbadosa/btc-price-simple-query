const puppeteer = require('puppeteer');

export default async function handler(req, res) {
  const channelSlug = 'anthonyvizoso';
  const apiUrl = `https://kick.com/api/v2/channels/${channelSlug}`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(apiUrl, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      return JSON.parse(document.body.innerText);
    });

    await browser.close();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send(`Failed to fetch data from Kick.com: ${error.message}`);
  }
}