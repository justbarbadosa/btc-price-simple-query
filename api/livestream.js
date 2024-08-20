import fetch from 'node-fetch';
import { Readable } from 'stream';

export default async function handler(req, res) {
  const fileUrl = 'https://kick.com/api/v2/channels/anthonyvizoso';

  try {
    // Step 1: Fetch the file
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }

    // Step 2: Read the file content
    const fileBuffer = await response.buffer();

    // Step 3: Parse the file content
    // Assuming the file is JSON, otherwise, adapt as needed
    const fileContent = fileBuffer.toString('utf-8');
    const data = JSON.parse(fileContent);

    // Step 4: Process and extract the required information
    const { livestream, followers_count } = data;
    const viewerCount = livestream.viewer_count;
    const category = livestream.categories[0];
    const categoryViewerCount = category.viewers;
    const startTime = new Date(livestream.start_time).getTime();
    const currentTime = new Date().getTime();
    const duration = (currentTime - startTime) / 1000; // in seconds

    const percentage = ((viewerCount / categoryViewerCount) * 100).toFixed(2);

    // Step 5: Respond with the extracted information
    res.status(200).json({
      message: `Anthony has ${viewerCount} viewers. It's ${percentage}% of ${category.name} viewers. Followers: ${followers_count}. Stream started ${duration} seconds ago.`,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: `Failed to process file: ${error.message}` });
  }
}
