export const authDocs = {
  '/auth/register': {
    post: {
      summary: 'Register a new user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'email', 'password'],
              properties: {
                name:     { type: 'string', example: 'Gaurav Jha' },
                email:    { type: 'string', example: 'gaurav@epam.com' },
                password: { type: 'string', example: 'Password123@' },
              },
            },
          },
        },
      },
      responses: {
        201: { description: 'User created successfully' },
        409: { description: 'EMAIL_TAKEN' },
        422: { description: 'VALIDATION_ERROR' },
      },
    },
  },
  '/auth/login': {
    post: {
      summary: 'Login user',
      tags: ['Auth'],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email:    { type: 'string', example: 'gaurav@epam.com' },
                password: { type: 'string', example: 'Password123@' },
              },
            },
          },
        },
      },
      responses: {
        200: { description: 'Returns accessToken + sets httpOnly cookie' },
        401: { description: 'INVALID_CREDENTIALS' },
        422: { description: 'VALIDATION_ERROR' },
      },
    },
  },
  '/auth/refresh': {
    post: {
      summary: 'Refresh access token',
      tags: ['Auth'],
      responses: {
        200: { description: 'Returns new accessToken' },
        401: { description: 'NO_REFRESH_TOKEN or TOKEN_INVALID' },
      },
    },
  },
  '/auth/logout': {
    post: {
      summary: 'Logout user',
      tags: ['Auth'],
      responses: {
        200: { description: 'Logged out, cookie cleared' },
      },
    },
  },
  '/auth/me': {
    get: {
      summary: 'Get current user',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      responses: {
        200: { description: 'Returns user from token' },
        401: { description: 'NO_TOKEN or TOKEN_EXPIRED' },
        403: { description: 'TOKEN_INVALID' },
      },
    },
  },
};