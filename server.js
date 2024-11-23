import express from "express";
import { MongoClient } from "mongodb";
import config from "./config.js";
import ejs from "ejs";

const app = express();
const port = 3000;

const connectionString = config.mongoUri;

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 

MongoClient.connect(connectionString)
    .then((client) => {
        console.log("Connected to database");
        const db = client.db("disney-movie-years");
        const movieYears = db.collection("years");
        
        app.get("/", (req, res) => {
            db.collection("years").find().toArray()
                .then(results => {
                    res.render("index.ejs", {movies: results});
                })
                .catch(error => {
                    console.log(error);
                    res.status(500).send("Error fetching movies")
                })
        });
        
        app.post("/new-movie", (req, res) => {
            const newMovie = {
                title: req.body.title,
                year: req.body.year,
                likes: req.body.likes ? parseInt(req.body.likes): 0,
            }
            movieYears.insertOne(newMovie)
                .then(result => {
                    res.redirect("/");
                })
                .catch(error => {
                    console.log(error);
                })
        });

        app.put("/years", (req, res) => {
            const { title, year, likes } = req.body;
            console.log("Received PUT request: ", {title, year, likes });
        
            movieYears
                .findOneAndUpdate(
                    { title: title, year: year },
                    { $set: { likes: likes } },
                    { returnDocument: "after" }
                )
                .then((result) => {
                    if (!result.value) {
                        console.log("Updated document", result.value);
                        return res.status(404).json({ error: "Movie not found" });
                    } else {
                        console.log("Updated document", result.value);
                        res.json(result.value);
                    }
                })
                .catch((error) => {
                    console.error("Error updating movie:", error);
                    res.status(500).send("Internal server error");
                });
        });
        

        app.delete("/years", (req, res) => {
            const { title, year } = req.body;
            movieYears.deleteOne({title: title, year: year})
                .then(res => {
                    res.json(`Deleted ${title}`)
                })
                .catch(error => console.error(error))
        });
    });

app.listen(port, () => {
    console.log(`The server is now running on port: ${port}`);
}); 