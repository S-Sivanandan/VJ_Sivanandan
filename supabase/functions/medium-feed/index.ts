import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
}

interface Article {
  id: string
  title: string
  subtitle: string
  excerpt: string
  publishedAt: string
  readTime: number
  url: string
}

function extractText(xml: string, tag: string): string {
  const cdataMatch = xml.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`, "i"))
  if (cdataMatch) return cdataMatch[1].trim()
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`, "i"))
  if (match) return match[1].trim()
  return ""
}

function extractAttr(xml: string, tag: string, attr: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`, "i"))
  return match ? match[1] : ""
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim()
}

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

function parseRss(xml: string): Article[] {
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g)
  if (!itemMatches) return []

  return itemMatches.slice(0, 10).map((item, i) => {
    const title = stripHtml(extractText(item, "title"))
    const link = extractText(item, "link") || extractAttr(item, "link", "href") || extractText(item, "guid")
    const pubDate = extractText(item, "pubDate")
    const contentEncoded = extractText(item, "content:encoded") || extractText(item, "description")
    const cleanContent = stripHtml(contentEncoded)

    // Grab the first 280 chars as excerpt
    const excerpt = cleanContent.slice(0, 280).replace(/\s+$/, "")

    // Use the subtitle separator pattern (first sentence before em dash or colon)
    const subtitleMatch = cleanContent.match(/^(.{20,100}?[.!?])\s/)
    const subtitle = subtitleMatch ? subtitleMatch[1] : ""

    const publishedAt = pubDate ? new Date(pubDate).toISOString().split("T")[0] : ""

    return {
      id: `medium-${i}`,
      title,
      subtitle,
      excerpt: excerpt || title,
      publishedAt,
      readTime: estimateReadTime(cleanContent),
      url: link,
    }
  }).filter((a) => a.title)
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const response = await fetch("https://medium.com/feed/@vj_sivanandan", {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; VisionaryJournal/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml",
      },
    })

    if (!response.ok) {
      throw new Error(`Medium feed returned ${response.status}`)
    }

    const xml = await response.text()
    const articles = parseRss(xml)

    return new Response(JSON.stringify({ articles }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    return new Response(JSON.stringify({ error: message, articles: [] }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
