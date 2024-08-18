export default async function handler(req, res) {
  const channelSlug = req.query.slug || 'anthonyvizoso';  // Replace with your default channel slug

  try {
    // Fetch channel data from the Kick API
    const response = await fetch(`https://kick.com/api/v2/channels/${channelSlug}`);
    const data = await response.json();

    // Extract relevant livestream information
    const livestream = data.livestream;
    const viewerCount = livestream.viewer_count;
    const category = livestream.categories[0]; // Assuming the first category is the primary one
    const percentageOfCategoryViewers = ((viewerCount / category.viewers) * 100).toFixed(2);
    const followersCount = data.followers_count;
    const startTime = new Date(livestream.start_time);
    const durationMinutes = Math.floor((Date.now() - startTime.getTime()) / (1000 * 60)); // Duration in minutes

    // Create the text response
    const textResponse = `${data.user.username} has ${viewerCount} viewers. It's ${percentageOfCategoryViewers}% of ${category.name} viewers. Followers: ${followersCount}. Stream started ${durationMinutes} minutes ago.`;

    // Send the response
    res.status(200).send(textResponse);
  } catch (error) {
    res.status(500).send('Failed to fetch data from Kick.com');
  }
}