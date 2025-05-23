import { blogSource, curationSource, docsSource } from "../src/lib/source";
import { generateFeed } from "../src/lib/rss";
import fs from "node:fs";
import path from "node:path";

async function generateRSSFeeds() {
  // 각 섹션별 피드 생성
  const feeds = {
    blog: generateFeed({
      title: "글또 블로그",
      description: "글또 블로그 RSS 피드",
      posts: blogSource
        .getPages()
        .filter((page) => page.slugs.length !== 0)
        .map((page) => ({
          title: page.data.title,
          description: page.data.description || "",
          date: new Date(page.data.createdAt || new Date("2025-01-01")),
          url: `https://geultto.github.io/blog/${page.slugs.join("/")}`,
        })),
    }),
    curation: generateFeed({
      title: "글또 큐레이션",
      description: "글또 큐레이션 RSS 피드",
      posts: curationSource
        .getPages()
        .filter((page) => page.slugs.length !== 0)
        .map((page) => ({
          title: page.data.title,
          description: page.data.description || "",
          date: new Date(page.data.createdAt || new Date("2025-01-01")),
          url: `https://geultto.github.io/curation/${page.slugs.join("/")}`,
        })),
    }),
    docs: generateFeed({
      title: "글또 문서",
      description: "글또 문서 RSS 피드",
      posts: docsSource
        .getPages()
        .filter((page) => page.slugs.length !== 0)
        .map((page) => ({
          title: page.data.title,
          description: page.data.description || "",
          date: new Date(page.data.createdAt || new Date("2025-01-01")),
          url: `https://geultto.github.io/docs/${page.slugs.join("/")}`,
        })),
    }),
  };

  // public 디렉토리에 RSS 파일 생성
  const publicDir = path.join(process.cwd(), "public");

  // public 디렉토리가 없다면 생성
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }

  // 각 피드 파일 작성
  for (const [type, feed] of Object.entries(feeds)) {
    const dir = path.join(publicDir, type);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    fs.writeFileSync(path.join(dir, "rss.xml"), feed.rss2());
  }
}

generateRSSFeeds();
