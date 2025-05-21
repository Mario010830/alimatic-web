import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import 'zone.js/node';
import { enableProdMode } from '@angular/core';

// Habilitar modo producción
enableProdMode();

// Definiciones globales necesarias para Angular SSR
if (typeof globalThis.Request === 'undefined') {
  const { Request, Response, Headers, fetch } = require('node-fetch');
  globalThis.Request = Request;
  globalThis.Response = Response;
  globalThis.Headers = Headers;
  globalThis.fetch = fetch;
}

const app = express();

// Configurar Express para que confíe en el proxy
app.set('trust proxy', true);

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

// Configurar el motor de Angular SSR
const angularApp = new AngularNodeAppEngine();

// Middleware para logging
app.use((req, res, next) => {
  console.log('=== Detalles de la petición ===');
  console.log('Protocol:', req.protocol);
  console.log('Secure:', req.secure);
  console.log('Host:', req.get('host'));
  console.log('Original URL:', req.originalUrl);
  console.log('Headers:', req.headers);
  console.log('Query Params:', req.query);
  console.log('Body:', req.body);
  console.log('Method:', req.method);
  console.log('IP:', req.ip);
  console.log('=============================');
  next();
});

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Handle all other requests by rendering the Angular application
app.use('/**', (req, res, next) => {
  // Asegurarnos de que la URL sea válida
  const protocol = req.secure ? 'https' : 'http';
  const host = req.get('host') || 'localhost:4000';
  const baseUrl = `${protocol}://${host}`;
  
  // Configurar headers necesarios para Angular SSR
  req.headers['x-forwarded-proto'] = protocol;
  req.headers['x-forwarded-host'] = host;
  
  console.log('URL base para Angular SSR:', baseUrl);
  console.log('Headers configurados:', req.headers);

  // Usar Zone.js para manejar la promesa
  const zone = (global as any).Zone.current.fork({
    name: 'angular-ssr-zone',
    properties: {
      request: req,
      response: res,
      next: next
    }
  });

  zone.run(() => {
    angularApp.handle(req)
      .then(response => {
        if (response) {
          writeResponseToNodeResponse(response, res);
        } else {
          next();
        }
      })
      .catch((error: any) => {
        console.error('Error en Angular SSR:', error);
        console.error('Detalles del error:', {
          message: error.message,
          code: error.code,
          stack: error.stack
        });
        next(error);
      });
  });
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
