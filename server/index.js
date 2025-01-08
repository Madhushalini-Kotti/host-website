import express from "express"
import cors from "cors"
import pg from "pg"
import env from "dotenv"

env.config();

const app = express()
const port = process.env.PORT;


app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port:process.env.DB_PORT
})

db.connect();

app.get('/', (req, res) => {
    res.send("<h1>Server running</h1>");
}) 

app.get('/users', async (req, res) => {

    try {
        const result = await db.query("SELECT * from users");
        if (result.rows) {
            console.log("Users data fetched ", result.rows);
            res.json(result.rows);
        } else {
            console.error("Couldn't fetch the users data");
            res.json({error : "someerror occured"})
        }

    } catch (error) {
        console.error("Error occured while trying to fetch the users list", error);
        res.status(500).json({ error: error.message });
    }
})

app.post('/newUser', async (req, res) => {
    const { username, age } = req.body;
    try {

        const result = await db.query("INSERT INTO users (username, age) values ($1,$2 ) returning *", [username, age]);

        if (result.rows) {
            console.log("Successfully added new user ", result.rows[0]);
            res.json(result.rows);
        } else {
            console.error("Couldn't add new user");
            res.json({ error: "someerror occured" })
        }

    } catch (error) {
        console.error("Error occured, couldn't add new user", error);
        res.status(500).json({ error: error.message })
    }
})

app.post("/deleteUser", async (req, res) => {
    const { id } = req.body;

    console.log(id);

    try {

        const result = await db.query("Delete from users where id = $1 returning *", [id]);

        if (!result.ok) {
            console.error("Couldn't delete the user");
        } 

        const resultData = result.json();

        console.log("User deleted successfully", resultData.rows);
        res.status(500).json(resultData.rows);


    } catch (error) {
        res.json({error : error})
    }

})

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})