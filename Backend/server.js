const express = require("express");
const dotenv = require("dotenv").config();
const { specs, swaggerUi } = require("./swagger");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const cors = require("cors");

connectDb();
const app = express();

const port = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use("/api/recipes", require("./routes/recipeRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
