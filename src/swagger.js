import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API Documentation",
    description: "API documentation for the Banking System.",
  },
  host: "localhost:3000",
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

// const generateSwagger = async () => {
//   await swaggerAutogen(outputFile, routes, doc);
//   await import("./index.js");
// };

// generateSwagger();
