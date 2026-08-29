const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Test Shop API',
      version: '1.0.0',
      description: 'API Documentation สำหรับระบบร้านค้าออนไลน์',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Local server' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

// Users paste the JWT returned by /api/auth/login into Swagger's Authorize
// dialog themselves. Swagger only enters the authorized state after /api/auth/me
// accepts that pasted token.
const swaggerUiOptions = {
  swaggerOptions: {
    persistAuthorization: true,
  },
  // Swagger UI toggles these classes on inline SVG icons. Reverse only the
  // visual icon: .unlocked (no token) becomes a closed lock; .locked (token)
  // becomes an open lock.
  customCss: `
    .swagger-ui .btn.authorize > svg,
    .swagger-ui .authorization__btn > svg,
    .swagger-ui .authorization__btn svg {
      display: none !important;
    }

    .swagger-ui .btn.authorize.unlocked::after,
    .swagger-ui .btn.authorize:has(svg.unlocked)::after,
    .swagger-ui .authorization__btn.unlocked::after,
    .swagger-ui .authorization__btn:has(svg.unlocked)::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 8px;
      vertical-align: middle;
      background: center / contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23b7bcbf' d='M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8zM12 8H8V5.199C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8z'/%3E%3C/svg%3E");
    }

    .swagger-ui .btn.authorize.locked::after,
    .swagger-ui .btn.authorize:has(svg.locked)::after,
    .swagger-ui .authorization__btn.locked::after,
    .swagger-ui .authorization__btn:has(svg.locked)::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      margin-left: 8px;
      vertical-align: middle;
      background: center / contain no-repeat url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath fill='%23b7bcbf' d='M15.8 8H14V5.6C14 2.703 12.665 1 10 1 7.334 1 6 2.703 6 5.6V6h2v-.801C8 3.754 8.797 3 10 3c1.203 0 2 .754 2 2.199V8H4c-.553 0-1 .646-1 1.199V17c0 .549.428 1.139.951 1.307l1.197.387C5.672 18.861 6.55 19 7.1 19h5.8c.549 0 1.428-.139 1.951-.307l1.196-.387c.524-.167.953-.757.953-1.306V9.199C17 8.646 16.352 8 15.8 8z'/%3E%3C/svg%3E");
    }
  `,
  customJsStr: `
    (() => {
      const originalAuthorize = window.ui.authActions.authorize;

      window.ui.authActions.authorize = async (payload) => {
        const plainPayload = payload?.toJS?.() || payload;
        const bearerAuth = plainPayload?.bearerAuth;
        const token = typeof bearerAuth === 'string' ? bearerAuth : bearerAuth?.value;

        // Leave any non-bearer authorization scheme to Swagger UI itself.
        if (!token) return originalAuthorize(payload);

        try {
          const verification = await fetch('/api/auth/me', {
            method: 'GET',
            headers: { Authorization: 'Bearer ' + token },
          });

          if (verification.ok) {
            return originalAuthorize(payload);
          }
        } catch {
          // A failed network request must not authorize Swagger UI.
        }

        window.ui.authActions.logout(['bearerAuth']);
        window.alert('Token is invalid or expired. Swagger UI remains locked.');
        return undefined;
      };
    })();
  `,
};

module.exports = { swaggerSpec, swaggerUiOptions };
