const express = require("express")
const cors = require("cors");
const path = require("path");

const indexRoutes = require("./routes/index.routes")
const userRoutes = require("./routes/user.routes")
const itemRoutes = require("./routes/item.routes")
const adminRoutes = require("./routes/admin.routes")
const cartRoutes = require("./routes/cart.routers")
const addressRoutes = require("./routes/address.router")
const orderRoutes = require("./routes/order.routes")

const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());

app.use(express.json())

app.use("/", indexRoutes)
app.use("/users", userRoutes)
app.use("/items", itemRoutes)
app.use("/admin-api", adminRoutes)
app.use("/cart", cartRoutes)
app.use("/address", addressRoutes)
app.use("/orders", orderRoutes)

app.use("/admin", express.static(path.join(__dirname, "admin-panel")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(errorHandler);

module.exports = app