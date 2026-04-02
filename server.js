require("dotenv").config();
const app = require("./src/index")
const connectDb = require("./config/db")

const PORT = process.env.PORT

connectDb();

app.listen(PORT, () => {
    console.log(`Server is on in port:${PORT}`)
})


