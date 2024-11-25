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
            movieYears.find().toArray()
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

        app.put("/years", async (req, res) => {
            try {
                const filter = {
                    title: req.body.title.trim(),
                    year: req.body.year.trim(),
                };
                const updatedResult = await movieYears.findOneAndUpdate(
                    filter,                               
                    { $inc: { likes: 1 } }, 
                    { returnDocument: "after" }           
                );
                if (!updatedResult) {
                    console.error("Update failed, no document returned");
                    return res.status(404).json({ error: "Movie not found" });
                }
                res.json(updatedResult);
            } catch (error) {
                console.error("Error during update operation:", error);
                res.status(500).json({ error: "An error occurred during the update" });
            }
        });
        
        app.delete("/years", async (req, res) => {
            try{
                const { title, year } = req.body;

                if(!title || !year) {
                    console.error("Missing title or year in the request body");
                    return res.status(400).json( {error: "Title and year are required"});
                }

                const result = movieYears.deleteOne({ title: title.trim(), year: year.trim() });

                if(result.deletedCount === 0) {
                    console.error(`No Movie found for title: ${title}, year: ${year}`);
                    return res.status(404).json({error: "Movie not found"});
                }

                console.log(`Deleted movie: ${title}, ${year}`);
                res.json({ message: `Deleted ${title} (${year})` });
            } catch (error) {
                console.error("Error while deleting movie: ", error);
                res.status(500).json({ error: "An error occured while deleting the movie" });
            }
        });    
    });

app.listen(port, () => {
    console.log(`The server is now running on port: ${port}`);
}); 