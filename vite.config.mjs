import { defineConfig } from "vite";
import { dirname, resolve } from "path";
import fs from "fs";

export default defineConfig({
  server: {
    open: "/index.html",
  },
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        privacy: resolve(__dirname, "src/politika-privatnosti.html"),
        400: resolve(__dirname, "src/400.html"),
        401: resolve(__dirname, "src/401.html"),
        403: resolve(__dirname, "src/403.html"),
        404: resolve(__dirname, "src/404.html"),
        500: resolve(__dirname, "src/500.html"),
        501: resolve(__dirname, "src/501.html"),
        502: resolve(__dirname, "src/502.html"),
      },
    },
  },
  root: "src",
  plugins: [
    {
      name: "copy-php-files",
      closeBundle: async () => {
        console.log("Copying PHP files and other necessary files to dist...");

        fs.mkdirSync(resolve(__dirname, "dist/php"), { recursive: true });
        fs.mkdirSync(resolve(__dirname, "dist/vendor/PHPMailer/src"), {
          recursive: true,
        });

        fs.copyFileSync(
          resolve(__dirname, "src/php/mail.php"),
          resolve(__dirname, "dist/php/mail.php"),
        );
        fs.copyFileSync(
          resolve(__dirname, "src/php/config.php"),
          resolve(__dirname, "dist/php/config.php"),
        );
        fs.copyFileSync(
          resolve(__dirname, "src/php/user-email-template.html"),
          resolve(__dirname, "dist/php/user-email-template.html"),
        );
        fs.copyFileSync(
          resolve(__dirname, "src/php/admin-email-template.html"),
          resolve(__dirname, "dist/php/admin-email-template.html"),
        );

        fs.copyFileSync(
          resolve(__dirname, ".htaccess"),
          resolve(__dirname, "dist/.htaccess"),
        );

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
