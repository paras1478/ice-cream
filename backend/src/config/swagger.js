const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ice Cream E-commerce API',
      version: '1.0.0',
      description: 'Complete REST API for Ice Cream E-commerce application with authentication, products, orders, payments, and more.',
      contact: {
        name: 'Ice Cream Store API Support',
        email: 'support@icecreamstore.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: 'Development server',
      },
      {
        url: 'https://api.icecreamstore.com/api/v1',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT access token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
        PaginatedResponse: {
          allOf: [
            { $ref: '#/components/schemas/ApiResponse' },
            {
              type: 'object',
              properties: {
                pagination: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    limit: { type: 'integer' },
                    total: { type: 'integer' },
                    pages: { type: 'integer' },
                  },
                },
              },
            },
          ],
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: { type: 'array', items: { type: 'object' } },
          },
        },
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            email: { type: 'string' },
            role: { type: 'string', enum: ['customer', 'admin'] },
            avatar: { type: 'string' },
            phone: { type: 'string' },
            isEmailVerified: { type: 'boolean' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            comparePrice: { type: 'number' },
            category: { type: 'string' },
            flavor: { type: 'string' },
            images: { type: 'array', items: { type: 'string' } },
            stock: { type: 'integer' },
            rating: { type: 'number' },
            reviewCount: { type: 'integer' },
            isFeatured: { type: 'boolean' },
            isActive: { type: 'boolean' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            orderNumber: { type: 'string' },
            user: { type: 'string' },
            items: { type: 'array' },
            total: { type: 'number' },
            orderStatus: { type: 'string' },
            paymentStatus: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User management' },
      { name: 'Products', description: 'Product catalog' },
      { name: 'Categories', description: 'Product categories' },
      { name: 'Cart', description: 'Shopping cart' },
      { name: 'Orders', description: 'Order management' },
      { name: 'Payments', description: 'Payment processing' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Coupons', description: 'Discount coupons' },
      { name: 'Addresses', description: 'User addresses' },
      { name: 'Wishlist', description: 'Product wishlist' },
      { name: 'Upload', description: 'File uploads' },
      { name: 'Admin', description: 'Admin dashboard & analytics' },
    ],
  },
  apis: [path.join(__dirname, '../routes/*.js')],
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { background-color: #ff6b9d; }',
      customSiteTitle: 'Ice Cream API Docs',
    })
  );
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

module.exports = { setupSwagger, specs };
