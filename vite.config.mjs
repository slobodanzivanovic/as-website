import { defineConfig } from "vite";
import { resolve } from "path";
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
          resolve(__dirname, "src/php/mail_template.html"),
          resolve(__dirname, "dist/php/mail_template.html"),
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
