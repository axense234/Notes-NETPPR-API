import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    info: {
      title: "Notes NETPPR API Docs",
      description:
        "Documentation for the Notes NETPPR API Project(NODE-EXPRESS-TYPESCRIPT-POSTGRESQL-PRISMA-REDIS) with Swagger(swagger-jsdoc and swagger-ui-express).Feel free to play around.",
      contact: {
        name: "axense234",
        url: "https://github.com/axense234",
        email: "andreicomanescuonline@gmail.com",
      },
      version: "1.0.0",
    },
    components: {
      schemas: {
        StyleOption: {
          properties: {
            note_uid: {
              type: "string",
            },
          },
        },
        Folder: {
          properties: {
            label: {
              type: "string",
            },
            author_uid: {
              type: "string",
            },
          },
        },
        Author: {
          properties: {
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
            email: {
              type: "string",
            },
          },
        },
        Category: {
          properties: {
            name: {
              type: "string",
            },
          },
        },
        Notes: {
          properties: {
            title: {
              type: "string",
            },
            content: {
              type: "string",
            },
            createdById: {
              type: "string",
            },
          },
        },
        Authorization: {
          properties: {
            username: {
              type: "string",
            },
            password: {
              type: "string",
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        scheme: "bearer",
        in: "header",
        name: "Authorization",
      },
    },
    // Servers for development/production
    servers: [
      { url: "http://localhost:4000" },
      { url: "https://notes-api-netppr-ca.onrender.com" },
    ],
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export { swaggerDocs };
