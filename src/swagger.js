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

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./index.js");
});
