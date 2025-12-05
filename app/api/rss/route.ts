import { NextResponse } from "next/server";
import { XMLParser } from "fast-xml-parser";

export async function GET() {
    const RSS_URL = "https://brunch.co.kr/rss/@@hyDe";

    try {
        const response = await fetch(RSS_URL, {
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/rss+xml, text/xml, */*"
            }
        });

        let xml = await response.text();

        // XMLParser 인스턴스
        const parser = new XMLParser({
            ignoreDeclaration: true,
            ignoreAttributes: false,
            attributeNamePrefix: "",
            allowBooleanAttributes: true,
            parseTagValue: true,
            trimValues: true,
        });

        const json = parser.parse(xml);

        const items = json?.rss?.channel?.item ?? [];

        const articles = items.map((item: any) => ({
            title: decodeHtmlEntities(item.title ?? ""),
            link: item.link ?? "",
            date: item.pubDate ?? "",
            description: cleanDescription(item.description),
            thumbnail: extractThumbnail(item.description)
        }));

        return NextResponse.json({ articles });

    } catch (error) {
        return NextResponse.json(
            { error: "RSS fetch failed", details: String(error) },
            { status: 500 }
        );
    }
}

function extractThumbnail(desc?: string) {
    if (!desc) return "/placeholder.png";
    const match = desc.match(/img src=\s*\"([^\"]+)\"/);
    return match?.[1] ?? "/placeholder.png";
}

function cleanDescription(text: string) {
    // HTML 태그 제거
    const noHtml = text.replace(/<[^>]*>?/gm, "");

    // 너무 긴 텍스트는 자르기
    return noHtml.length > 90 ? noHtml.slice(0, 90) + "..." : noHtml;
}

function decodeHtmlEntities(str: string) {
    if (!str) return "";

    return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lsquo;/g, "‘")
        .replace(/&rsquo;/g, "’")
        .replace(/&ldquo;/g, "“")
        .replace(/&rdquo;/g, "”")
        .replace(/&#39;/g, "'")  // 브런치에서 자주 나오는 HTML 엔티티
        .replace(/&nbsp;/g, " ");
}