import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: "Publish seized item _ NT.GOV.AU.html",
    },
  },
  plugins: [
    {
      name: "saved-page-asset-aliases",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (!req.url) {
            next();
            return;
          }

          if (
            req.url === "/Publish%20seized%20item%20_%20NT.GOV.AU_files/css"
          ) {
            req.url = "/Publish%20seized%20item%20_%20NT.GOV.AU_files/css.css";
          } else if (
            req.url === "/Publish%20seized%20item%20_%20NT.GOV.AU_files/js"
          ) {
            req.url = "/Publish%20seized%20item%20_%20NT.GOV.AU_files/js.js";
          }

          next();
        });
      },
    },
  ],
  server: {
    open: "/Publish%20seized%20item%20_%20NT.GOV.AU.html",
  },
});
