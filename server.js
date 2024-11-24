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
        
                console.log("Filter for query:", filter);
        
                // Step 1: Check if the document exists
                const existingMovie = await movieYears.findOne(filter);
                if (!existingMovie) {
                    console.error("No matching document found in the database");
                    return res.status(404).json({ error: "Movie not found" });
                } else {
                    console.log("Matching document found:", existingMovie);
                }

                console.log("filter for update: ", filter);
                console.log("update for payload: ", {$set: {likes: Number(req.body.likes) + 1 } });
        
                // Step 2: Proceed with the update
                const updatedResult = await movieYears.findOneAndUpdate(
                    filter,                               // Filter to find the document
                    { $set: { likes: Number(req.body.likes) } }, // Update operation
                    { returnOriginal: false }           // Return updated document
                );
                console.log("updatedResult: ", {updatedResult});

        
                if (!updatedResult) {
                    console.error("Update failed, no document returned");
                    return res.status(404).json({ error: "Movie not found" });
                }
        
                console.log("Updated document:", updatedResult);
                res.json(updatedResult);
            } catch (error) {
                console.error("Error during update operation:", error);
                res.status(500).json({ error: "An error occurred during the update" });
            }
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