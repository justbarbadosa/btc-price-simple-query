export default async function handler(req, res) {
  const channelSlug = 'anthonyvizoso';
  const apiUrl = `https://kick.com/api/v2/channels/${channelSlug}`;

  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Content-Type': 'application/json',
        // Add a user-agent header to mimic a browser request
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();

    // Process the data as needed and return it
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send(`Failed to fetch data from Kick.com: ${error.message}`);
  }
}
