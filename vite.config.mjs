import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));

const getBlogPosts = () => {
  const blogDataPath = resolve(__dirname, "src/data/blog-posts.json");
  if (!fs.existsSync(blogDataPath)) return [];

  try {
    const data = fs.readFileSync(blogDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading blog posts:", error);
    return [];
  }
};

const getInputConfig = () => {
  const baseInputs = {
    main: resolve(__dirname, "src/index.html"),
    blog: resolve(__dirname, "src/blog.html"),
    privacy: resolve(__dirname, "src/politika-privatnosti.html"),
    400: resolve(__dirname, "src/400.html"),
    401: resolve(__dirname, "src/401.html"),
    403: resolve(__dirname, "src/403.html"),
    404: resolve(__dirname, "src/404.html"),
    500: resolve(__dirname, "src/500.html"),
    501: resolve(__dirname, "src/501.html"),
    502: resolve(__dirname, "src/502.html"),
  };

  const blogPosts = getBlogPosts();
  blogPosts.forEach((post) => {
    const slug = post.slug;
    const path = resolve(__dirname, `src/blog/${slug}.html`);
    if (fs.existsSync(path)) {
      baseInputs[`blog-${slug}`] = path;
    }
  });

  return baseInputs;
};

export default defineConfig({
  server: {
    open: "/index.html",
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: getInputConfig(),
    },
  },
  root: "src",
  plugins: [
    {
      name: "generate-blog-pages",
      buildStart: () => {
        console.log("Generating blog pages...");
        return new Promise((resolvePromise, reject) => {
          if (!fs.existsSync("scripts")) {
            fs.mkdirSync("scripts", { recursive: true });
          }

          const dataDir = resolve(__dirname, "src/data");
          if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
          }

          const templatePath = resolve(__dirname, "src/blog-template.html");
          if (!fs.existsSync(dirname(templatePath))) {
            fs.mkdirSync(dirname(templatePath), { recursive: true });
          }

          exec(
            "node scripts/generate-blog-pages.js",
            (error, stdout, stderr) => {
              if (error) {
                console.error(`Error generating blog pages: ${error.message}`);
                console.error(stderr);
                resolvePromise();
                return;
              }
              console.log(stdout);
              resolvePromise();
            },
          );
        });
      },
    },
    {
      name: "copy-php-files",
      closeBundle: async () => {
        console.log("Copying PHP files and other necessary files to dist...");

        fs.mkdirSync(resolve(__dirname, "dist/php"), { recursive: true });
        fs.mkdirSync(resolve(__dirname, "dist/vendor/PHPMailer/src"), {
          recursive: true,
        });
        fs.mkdirSync(resolve(__dirname, "dist/data"), { recursive: true });
        fs.mkdirSync(resolve(__dirname, "dist/blog"), { recursive: true });

        const blogDataPath = resolve(__dirname, "src/data/blog-posts.json");
        if (fs.existsSync(blogDataPath)) {
          fs.copyFileSync(
            blogDataPath,
            resolve(__dirname, "dist/data/blog-posts.json"),
          );
          console.log("Blog data copied to dist/data/");
        }

        const phpFiles = [
          { src: "src/php/mail.php", dest: "dist/php/mail.php" },
          { src: "src/php/config.php", dest: "dist/php/config.php" },
          {
            src: "src/php/user-email-template.html",
            dest: "dist/php/user-email-template.html",
          },
          {
            src: "src/php/admin-email-template.html",
            dest: "dist/php/admin-email-template.html",
          },
        ];

        phpFiles.forEach((file) => {
          if (fs.existsSync(resolve(__dirname, file.src))) {
            fs.copyFileSync(
              resolve(__dirname, file.src),
              resolve(__dirname, file.dest),
            );
            console.log(`Copied ${file.src} to ${file.dest}`);
          } else {
            console.warn(`Warning: ${file.src} does not exist.`);
          }
        });

        if (fs.existsSync(resolve(__dirname, ".htaccess"))) {
          fs.copyFileSync(
            resolve(__dirname, ".htaccess"),
            resolve(__dirname, "dist/.htaccess"),
          );
        }

        const phpMailerFiles = [
          {
            src: "src/vendor/PHPMailer/src/Exception.php",
            dest: "dist/vendor/PHPMailer/src/Exception.php",
          },
          {
            src: "src/vendor/PHPMailer/src/PHPMailer.php",
            dest: "dist/vendor/PHPMailer/src/PHPMailer.php",
          },
          {
            src: "src/vendor/PHPMailer/src/SMTP.php",
            dest: "dist/vendor/PHPMailer/src/SMTP.php",
          },
        ];

        phpMailerFiles.forEach((file) => {
          if (fs.existsSync(resolve(__dirname, file.src))) {
            fs.copyFileSync(
              resolve(__dirname, file.src),
              resolve(__dirname, file.dest),
            );
            console.log(`Copied ${file.src} to ${file.dest}`);
          } else {
            console.warn(
              `Warning: ${file.src} does not exist. You'll need to manually copy PHPMailer files.`,
            );
          }
        });

        console.log("Files copied successfully!");
      },
    },
  ],
});
