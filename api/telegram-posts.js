export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');

  try {
    const response = await fetch('https://tg.i-c-a.su/rss/belenko_studio');

    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xml = await response.text();

    // Simple XML parsing
    const posts = [];

    // Split by <item> tags
    const items = xml.split('<item>').slice(1);

    for (const item of items) {
      const endIndex = item.indexOf('</item>');
      if (endIndex === -1) continue;

      const itemContent = item.substring(0, endIndex);

      // Extract tag content
      const getTag = (tag) => {
        const startTag = `<${tag}>`;
        const endTag = `</${tag}>`;
        const start = itemContent.indexOf(startTag);
        if (start === -1) return '';
        const end = itemContent.indexOf(endTag, start);
        if (end === -1) return '';
        return itemContent.substring(start + startTag.length, end).trim();
      };

      const title = getTag('title');
      const link = getTag('link');
      const pubDate = getTag('pubDate');
      const guid = getTag('guid');
      let description = getTag('description');

      // Decode HTML entities
      description = description
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");

      // Extract images
      const images = [];
      const imgMatches = description.matchAll(/<a[^>]+href="([^"]+\.(?:jpg|jpeg|png|gif|webp))"[^>]*>/gi);
      for (const m of imgMatches) {
        images.push(m[1]);
      }

      // Clean text content
      const textContent = description
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<img[^>]*>/gi, '')
        .replace(/<a[^>]*href="[^"]*\.(?:jpg|jpeg|png|gif|webp)"[^>]*>.*?<\/a>/gi, '')
        .replace(/<a[^>]*>([^<]*)<\/a>/gi, '$1')
        .replace(/<\/?(?:b|strong|i|em|u|tg-emoji)[^>]*>/gi, '')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

      if (textContent || images.length > 0) {
        posts.push({
          id: guid || link,
          title: title.replace(/\[Photo\]\s*/gi, '').substring(0, 100),
          content: textContent,
          link,
          date: pubDate,
          images
        });
      }
    }

    res.status(200).json({ posts, count: posts.length });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch posts', message: error.message });
  }
}
