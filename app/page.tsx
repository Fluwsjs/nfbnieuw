import fs from "node:fs/promises";
import path from "node:path";

type HomeContent = {
  title: string;
  subtitle: string;
  heroImage: string;
};

const defaultContent: HomeContent = {
  title: "NFB Salon",
  subtitle:
    "Welkom bij NFB Salon. Deze tekst en afbeelding zijn aanpasbaar via /admin.",
  heroImage:
    "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1280&q=80",
};

async function getHomeContent(): Promise<HomeContent> {
  const contentPath = path.join(process.cwd(), "content", "home.json");

  try {
    const rawContent = await fs.readFile(contentPath, "utf-8");
    const parsed = JSON.parse(rawContent) as Partial<HomeContent>;

    return {
      title: parsed.title || defaultContent.title,
      subtitle: parsed.subtitle || defaultContent.subtitle,
      heroImage: parsed.heroImage || defaultContent.heroImage,
    };
  } catch {
    return defaultContent;
  }
}

export default async function RootPage() {
  const content = await getHomeContent();

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>{content.title}</h1>
      <p style={{ fontSize: "1.1rem", lineHeight: 1.6 }}>{content.subtitle}</p>

      <img
        src={content.heroImage}
        alt="NFB Salon sfeerbeeld"
        style={{
          marginTop: "1.5rem",
          width: "100%",
          maxWidth: "640px",
          borderRadius: "12px",
          display: "block",
        }}
      />
    </main>
  );
}

