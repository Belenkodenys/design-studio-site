export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const response = await fetch('https://tg.i-c-a.su/rss/belenko_studio');
    const xml = await response.text();

    // Parse RSS XML
    const posts = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemContent = match[1];

      const getTagContent = (tag) => {
        const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`);
        const match = itemContent.match(regex);
        return match ? (match[1] || match[2] || '').trim() : '';
      };

      const title = getTagContent('title');
      const description = getTagContent('description');
      const link = getTagContent('link');
      const pubDate = getTagContent('pubDate');
      const guid = getTagContent('guid');

      // Extract images from description
      const imgRegex = /<img[^>]+src="([^"]+)"/g;
      const images = [];
      let imgMatch;
      while ((imgMatch = imgRegex.exec(description)) !== null) {
        images.push(imgMatch[1]);
      }

      // Clean description from HTML tags for text content
      const textContent = description
        // Convert line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Remove images (already extracted)
        .replace(/<img[^>]*>/gi, '')
        // Convert links to just text
        .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
        // Remove remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Decode HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
        .replace(/&apos;/g, "'")
        .replace(/&mdash;/g, '—')
        .replace(/&ndash;/g, '–')
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&hellip;/g, '...')
        // Clean up extra whitespace
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

      if (textContent || images.length > 0) {
        posts.push({
          id: guid || link,
          title: title || textContent.substring(0, 50) + (textContent.length > 50 ? '...' : ''),
          content: textContent,
          htmlContent: description,
          link,
          date: pubDate,
          images
        });
      }
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching Telegram RSS:', error);
    res.status(500).json({ error: 'Failed to fetch posts', message: error.message });
  }
}
