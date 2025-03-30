import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const BLOG_DATA_PATH = path.join(__dirname, "../src/data/blog-posts.json");
const BLOG_TEMPLATE_PATH = path.join(__dirname, "../src/blog-template.html");
const OUTPUT_DIR = path.join(__dirname, "../src/blog");

// Ensure the blog directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure the data directory exists
const DATA_DIR = path.join(__dirname, "../src/data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Read blog data and template
let blogData;
try {
  blogData = JSON.parse(fs.readFileSync(BLOG_DATA_PATH, "utf8"));
} catch (error) {
  console.error("Error reading blog data:", error.message);
  console.log("Creating sample blog data...");

  // Sample blog data if file doesn't exist
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

  // Create the data directory if it doesn't exist
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  // Write the sample data to the file
  fs.writeFileSync(BLOG_DATA_PATH, JSON.stringify(blogData, null, 2), "utf8");
}

// Read the blog template
let templateContent;
try {
  templateContent = fs.readFileSync(BLOG_TEMPLATE_PATH, "utf8");
} catch (error) {
  console.error("Error reading blog template:", error.message);
  console.log("Using default template...");

  // Default template if file doesn't exist
  templateContent = `<!-- Default Blog Post Template -->
<div class="bg-background-light shape-bg relative min-h-screen w-full overflow-hidden pt-32 pb-16">
  <div class="absolute top-0 left-0 h-full w-full">
    <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0H1440V900H0V0Z" fill="#ffffff" />
      <path d="M-300 200C150 250 450 600 1800 400" stroke="#f5f5f5" stroke-width="300" stroke-linecap="round" />
    </svg>
  </div>
  <div class="relative z-10 container mx-auto px-4 py-8 sm:px-6 lg:px-8">
    <div class="mb-8">
      <a href="/blog.html" class="text-primary-600 hover:text-primary-800 inline-flex items-center transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Nazad na blogove
      </a>
    </div>
    <div class="card-effect border-primary-100 rounded-xl border bg-white p-6 shadow-md md:p-8 lg:p-10">
      <div class="mx-auto max-w-4xl">
        <div class="mb-8 text-center">
          <div class="flex justify-center space-x-2 mb-3">
            <div id="category-tags"></div>
          </div>
          <h1 id="blog-title" class="text-primary-800 mb-4 text-3xl font-light md:text-4xl lg:text-5xl"></h1>
          <div class="flex flex-col items-center justify-center space-y-2 text-sm text-primary-600 md:flex-row md:space-y-0 md:space-x-4">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span id="blog-date"></span>
            </div>
            <div class="hidden md:block">•</div>
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span id="blog-author"></span>
            </div>
          </div>
        </div>
        <div class="mb-10 overflow-hidden rounded-xl">
          <img id="blog-image" src="" alt="" class="h-auto w-full object-cover">
        </div>
        <div id="blog-content" class="text-primary-700 prose md:prose-lg lg:prose-xl max-w-none"></div>
        <div class="border-primary-100 mt-12 border-t pt-8">
          <div class="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <h3 class="text-primary-800 text-lg font-medium">Podelite ovaj članak</h3>
            <div class="flex space-x-4">
              <a href="#" class="bg-primary-800 hover:bg-primary-700 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                </svg>
              </a>
              <a href="#" class="bg-primary-800 hover:bg-primary-700 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" class="bg-primary-800 hover:bg-primary-700 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill-rule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clip-rule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-16">
      <h2 class="text-primary-800 mb-8 text-center text-3xl font-light">Povezani članci</h2>
      <div id="related-posts" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"></div>
    </div>
  </div>
</div>

<!-- Blog Post Script -->
<script>
  document.addEventListener('DOMContentLoaded', async function() {
    // Get the current blog post slug from the URL
    const path = window.location.pathname;
    const slug = path.substring(path.lastIndexOf('/') + 1).replace('.html', '');
    
    try {
      // Fetch all blog posts
      const response = await fetch('/data/blog-posts.json');
      if (!response.ok) {
        throw new Error('Failed to load blog posts');
      }
      
      const blogPosts = await response.json();
      
      // Find the current post
      const currentPost = blogPosts.find(post => post.slug === slug);
      
      if (!currentPost) {
        throw new Error('Blog post not found');
      }
      
      // Populate blog post content
      populateBlogPost(currentPost);
      
      // Find related posts (same category, excluding current post)
      const relatedPosts = blogPosts.filter(post => 
        post.slug !== slug && 
        post.categories.some(cat => currentPost.categories.includes(cat))
      ).slice(0, 3); // Limit to 3 related posts
      
      populateRelatedPosts(relatedPosts);
      
    } catch (error) {
      console.error('Error loading blog post:', error);
      document.querySelector('.card-effect').innerHTML = \`
        <div class="text-center py-10">
          <h2 class="text-primary-800 text-2xl mb-4">Članak nije pronađen</h2>
          <p class="text-primary-600 mb-6">Žao nam je, traženi blog članak nije dostupan.</p>
          <a href="/blog.html" class="bg-primary-800 hover:bg-primary-700 rounded-full px-6 py-2 text-white transition-colors">
            Nazad na blogove
          </a>
        </div>
      \`;
    }
  });

  function populateBlogPost(post) {
    // Set blog title
    document.getElementById('blog-title').textContent = post.title;
    
    // Set blog date
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('sr-RS', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    document.getElementById('blog-date').textContent = formattedDate;
    
    // Set author
    document.getElementById('blog-author').textContent = post.author || 'AS Tim';
    
    // Set featured image
    const featuredImage = document.getElementById('blog-image');
    featuredImage.src = post.image;
    featuredImage.alt = post.title;
    
    // Set categories
    const categoryTags = document.getElementById('category-tags');
    post.categories.forEach(category => {
      const tagElement = document.createElement('span');
      tagElement.className = 'bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm';
      tagElement.textContent = category;
      categoryTags.appendChild(tagElement);
    });
    
    // Set content
    document.getElementById('blog-content').innerHTML = post.content;
    
    // Update document title
    document.title = \`\${post.title} | AS Blog\`;
  }

  function populateRelatedPosts(posts) {
    const relatedPostsContainer = document.getElementById('related-posts');
    
    if (posts.length === 0) {
      relatedPostsContainer.innerHTML = \`
        <div class="col-span-full text-center">
          <p class="text-primary-600">Trenutno nema povezanih članaka.</p>
        </div>
      \`;
      return;
    }
    
    relatedPostsContainer.innerHTML = '';
    
    posts.forEach(post => {
      const postDate = new Date(post.date);
      const formattedDate = postDate.toLocaleDateString('sr-RS', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
      
      const postElement = document.createElement('div');
      postElement.className = 'card-effect border-primary-100 rounded-xl border bg-white shadow-md transition-all duration-300 hover:shadow-lg overflow-hidden';
      
      postElement.innerHTML = \`
        <div class="relative aspect-video overflow-hidden">
          <img src="\${post.image}" alt="\${post.title}" class="h-full w-full object-cover transition-transform duration-500 hover:scale-105">
          <div class="absolute top-4 left-4 bg-primary-800 text-white text-xs uppercase tracking-wider px-3 py-1 rounded-full">
            \${post.categories[0]}
          </div>
        </div>
        <div class="p-6">
          <div class="text-primary-500 mb-2 flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            \${formattedDate}
          </div>
          <h3 class="text-primary-800 mb-3 text-xl font-medium">\${post.title}</h3>
          <p class="text-primary-600 mb-4">\${post.excerpt}</p>
          <a href="/blog/\${post.slug}.html" class="text-primary-800 hover:text-primary-600 inline-flex items-center font-medium transition-colors">
            Pročitaj više
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      \`;
      
      relatedPostsContainer.appendChild(postElement);
    });
  }
</script>
`;
}

// Generate a blog page for each post
console.log(`Generating ${blogData.length} blog pages...`);

blogData.forEach((post) => {
  console.log(`  - Generating page for: ${post.title} (${post.slug})`);

  // The full HTML content for the blog page
  // Here we're combining the blog template with the specific blog post data
  const blogPageContent = `<!doctype html>
<html lang="sr" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/img/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${post.title} | AS</title>
    <meta name="description" content="${post.excerpt}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="https://www.astraffic.rs/blog/${post.slug}.html" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:image" content="${post.image}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://www.astraffic.rs/blog/${post.slug}.html" />
    <meta property="twitter:title" content="${post.title}" />
    <meta property="twitter:description" content="${post.excerpt}" />
    <meta property="twitter:image" content="${post.image}" />

    <!-- css -->
    <link rel="stylesheet" href="/style.css" />
  </head>

  <body>
    <div class="h-screen">
      <div class="flex h-full flex-col">
        <div class="h-full bg-[#222222]">
          <!-- Header will be included from your index.html -->
          
          ${templateContent}
          
          <!-- Footer will be included from your index.html -->
        </div>
      </div>
    </div>
    
    <!-- Preload blog data for performance -->
    <script>
      // Preload the current post data to avoid fetching the entire blog-posts.json
      window.currentBlogPost = ${JSON.stringify(post)};
      
      // Use the preloaded data once the DOM is loaded
      document.addEventListener('DOMContentLoaded', function() {
        if (window.currentBlogPost) {
          // Directly use the preloaded post data
          populateBlogPost(window.currentBlogPost);
          
          // For related posts we still need to fetch all posts
          fetch('/data/blog-posts.json')
            .then(response => response.json())
            .then(posts => {
              // Find related posts (same category, excluding current post)
              const relatedPosts = posts.filter(post => 
                post.slug !== window.currentBlogPost.slug && 
                post.categories.some(cat => window.currentBlogPost.categories.includes(cat))
              ).slice(0, 3); // Limit to 3 related posts
              
              populateRelatedPosts(relatedPosts);
            })
            .catch(error => {
              console.error('Error loading related blog posts:', error);
              document.getElementById('related-posts').innerHTML = '<div class="col-span-full text-center"><p class="text-primary-600">Trenutno nema povezanih članaka.</p></div>';
            });
        }
      });
    </script>
  </body>
</html>`;

  // Write the blog page to the output directory
  const outputPath = path.join(OUTPUT_DIR, `${post.slug}.html`);
  fs.writeFileSync(outputPath, blogPageContent, "utf8");
});

console.log(
  `Successfully generated ${blogData.length} blog pages in ${OUTPUT_DIR}`,
);
