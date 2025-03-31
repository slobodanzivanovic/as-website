import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BLOG_DATA_PATH = path.join(__dirname, "../src/data/blog-posts.json");
const BLOG_TEMPLATE_PATH = path.join(__dirname, "../src/blog-template.html");
const OUTPUT_DIR = path.join(__dirname, "../src/blog");

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const DATA_DIR = path.join(__dirname, "../src/data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let blogData;
try {
  blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, "utf8"));
} catch (error) {
  console.error("Error reading blog data:", error.message);
  console.log("Creating sample blog data...");

  blogData = [
    {
      id: 1,
      slug: "primer-blog-post",
      title: "Primer Blog Post",
      excerpt: "Ovo je primer blog posta koji će biti prikazan na sajtu.",
      content:
        "<p>Ovo je sadržaj blog posta. Možete dodati više sadržaja po potrebi.</p>",
      author: "AS Tim",
      date: new Date().toISOString().split("T")[0],
      image: "/img/v303_461.png",
      categories: ["saveti"],
      featured: true,
    },
  ];

  fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 2), "utf8");
}

let templateContent;
try {
  templateContent = fs.readFileSync(BLOG_TEMPLATE_PATH, "utf8");
} catch (error) {
  console.error("Error reading blog template:", error.message);
  console.error(
    "Please make sure blog-template.html exists in the src directory",
  );
  process.exit(1);
}

console.log(`Generating ${blogData.length} blog pages...`);

blogData.forEach((post) => {
  console.log(`  - Generating page for: ${post.title} (${post.slug})`);

  const blogPageContent = `<!doctype html>
<html lang="sr" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${post.title} | AS Traffic and Technical Consulting | Naknada Štete</title>
    <meta name="description" content="${post.excerpt}" />
    
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://asnaknadastete.rs/blog/${post.slug}" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:image" content="${post.image}" />
    
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://asnaknadastete.rs/blog/${post.slug}" />
    <meta property="twitter:title" content="${post.title}" />
    <meta property="twitter:description" content="${post.excerpt}" />
    <meta property="twitter:image" content="${post.image}" />

    <link rel="stylesheet" href="/style.css" />
  </head>

  <body>
    <div class="h-screen">
      <div class="flex h-full flex-col">
        <div class="h-full bg-[#51686e]">
          
          ${templateContent}
          
        </div>
      </div>
    </div>
    
    <script>
      window.currentBlogPost = ${JSON.stringify(post)};
      
      document.addEventListener('DOMContentLoaded', function() {
        if (window.currentBlogPost) {
          populateBlogPost(window.currentBlogPost);
          
          fetch('/data/blog-posts.json')
            .then(response => response.json())
            .then(posts => {
              const relatedPosts = posts.filter(post => 
                post.slug !== window.currentBlogPost.slug && 
                post.categories.some(cat => window.currentBlogPost.categories.includes(cat))
              ).slice(0, 3);
              
              populateRelatedPosts(relatedPosts);
            })
            .catch(error => {
              console.error('Error loading related blog posts:', error);
              document.getElementById('related-posts').innerHTML = '<div class="col-span-full text-center"><p class="text-primary-100">Trenutno nema povezanih članaka.</p></div>';
            });
        }
      });
    </script>
  </body>
</html>`;

  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
  fs.writeFileSync(outputPath, blogPageContent, "utf8");
});

console.log(
  `Successfully generated ${blogData.length} blog pages in ${OUTPUT_DIR}`,
);
