const express = require("express");
const dotenv = require("dotenv").config();
const { specs, swaggerUi } = require("./swagger");
const app = express();

const port = process.env.PORT || 5000;

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/api/recipes", require("./routes/recipeRoutes"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
