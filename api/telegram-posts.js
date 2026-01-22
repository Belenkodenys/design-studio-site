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
      let description = getTagContent('description');
      const link = getTagContent('link');
      const pubDate = getTagContent('pubDate');
      const guid = getTagContent('guid');

      // Decode HTML entities first
      description = description
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");

      // Extract full-size images from <a href="..."> tags (better quality)
      const images = [];
      const linkImgRegex = /<a[^>]+href="([^"]+\.(?:jpg|jpeg|png|gif|webp))"[^>]*>/gi;
      let imgMatch;
      while ((imgMatch = linkImgRegex.exec(description)) !== null) {
        images.push(imgMatch[1]);
      }

      // Fallback: extract from img src if no links found
      if (images.length === 0) {
        const imgRegex = /<img[^>]+src="([^"]+)"/gi;
        while ((imgMatch = imgRegex.exec(description)) !== null) {
          images.push(imgMatch[1]);
        }
      }

      // Clean description from HTML tags for text content
      const textContent = description
        // Convert line breaks
        .replace(/<br\s*\/?>/gi, '\n')
        // Remove images (already extracted)
        .replace(/<img[^>]*>/gi, '')
        // Remove image links (keep text links)
        .replace(/<a[^>]*href="[^"]*\.(?:jpg|jpeg|png|gif|webp)"[^>]*>.*?<\/a>/gi, '')
        // Convert text links to just text
        .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
        // Remove bold/italic tags but keep content
        .replace(/<\/?(?:b|strong|i|em)>/gi, '')
        // Remove remaining HTML tags
        .replace(/<[^>]+>/g, '')
        // Decode remaining HTML entities
        .replace(/&nbsp;/g, ' ')
        .replace(/&#(\d+);/g, (_, num) => String.fromCharCode(num))
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
