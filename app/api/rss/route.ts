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
    if (!str) return str;

    // 브라우저 없이 Node 환경에서 DOMParser 대체
    const txt = globalThis.document
        ? document.createElement("textarea")
        : new (require("jsdom").JSDOM)().window.document.createElement("textarea");

    txt.innerHTML = str;
    return txt.value;
}