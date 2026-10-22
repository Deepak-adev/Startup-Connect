import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Plugin to handle saving inquiry data to a local file
const saveInquiryPlugin = () => ({
  name: 'save-inquiry-plugin',
  configureServer(server) {
    server.middlewares.use('/api', (req, res, next) => {
      if (req.url === '/save-inquiry' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            // Ensure data directory exists
            const dataDir = path.resolve(__dirname, 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir);
            }
            fs.writeFileSync(path.resolve(dataDir, 'startup_data.json'), JSON.stringify(data, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save data' }));
          }
        });
      } else if (req.url === '/get-inquiry' && req.method === 'GET') {
        try {
          const dataDir = path.resolve(__dirname, 'data');
          const filePath = path.resolve(dataDir, 'startup_data.json');
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(content);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'No data found' }));
          }
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to read data' }));
        }
      } else if (req.url === '/save-investor' && req.method === 'POST') {
        // Investor data save endpoint
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const dataDir = path.resolve(__dirname, 'data');
            if (!fs.existsSync(dataDir)) {
              fs.mkdirSync(dataDir);
            }
            fs.writeFileSync(path.resolve(dataDir, 'investor_data.json'), JSON.stringify(data, null, 2));
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
          } catch (e) {
            console.error(e);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: 'Failed to save investor data' }));
          }
        });
      } else if (req.url === '/get-investor' && req.method === 'GET') {
        // Investor data get endpoint
        try {
          const dataDir = path.resolve(__dirname, 'data');
          const filePath = path.resolve(dataDir, 'investor_data.json');
          if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            res.setHeader('Content-Type', 'application/json');
            res.end(content);
          } else {
            res.statusCode = 404;
            res.end(JSON.stringify({ error: 'No investor data found' }));
          }
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to read investor data' }));
        }
      } else {
        next();
      }
    });
  }
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), saveInquiryPlugin()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.GROQ_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GROQ_API_KEY': JSON.stringify(env.GROQ_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
