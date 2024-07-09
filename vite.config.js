import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({  mode}) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        // Vite
        plugins: [react()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src")
            }
        },

        server: {
            host: true,
            proxy: {
                "/gunsan-bms-api": {
                    // target: 'http://211.41.186.152:13333',
                    target: env.VITE_PROXY_URL,
                    changeOrigin: true,
                    secure: false,
                    // rewrite: (path) => path.replace(new RegExp(`/api`), ''),
                    configure: (proxy, _options) => {
                        proxy.on('error', (err, _req, _res) => {
                            console.log('proxy error', err);
                        });
                        proxy.on('proxyReq', (proxyReq, req, _res) => {
                            console.log('Sending Request to the Target:', req.method, req.url);
                        });
                        proxy.on('proxyRes', (proxyRes, req, _res) => {
                            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                        });
                    },
                }
            }
        }
    }
})
