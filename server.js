import express from "express";
import {fileURLToPath} from "url";
import {dirname} from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

const movies = {
    1937: ["Snow White and the Seven Dwarfs"],
    1940: ["Pinocchio", "Fantasia"],
    1941: ["The Reluctant Dragon", "Dumbo"],
    1942: ["Bambi"],
    1943: ["Saludos Amigos", "Victory Through Air Power"],
    1945: ["The Three Caballeros"],
    1946: ["Make Mine Music", "Song of the South"],
    1947: ["Fun and Fancy Free"],
    1948: ["Melody Time", "So Dear to My Heart"],
    1949: ["The Adventures of Ichabod and Mr. Toad"],
    1950: ["Cinderella", "Treasure Island"],
    1951 :["Alice in Wonderland"],
    1952: ["The Story of Robin Hood"],
    1953: ["Peter Pan", "The Sword and the Rose","The Living Desert"],
    1954: ["Rob Roy: The Highland Rogue", "The Vanishing Prairie", "20,000 Leagues Under the Sea"],
    1955: ["Davy Crockett: King of the Wild Frontier", "Lady and the Tramp", "The African Lion", "The Littlest Outlaw"],
    1956: ["The Great Locomotive Chase", "Davy Crockett and the River Pirates", "Secrets of Life", "Westward Ho the Wagons!"],
    1957: ["Johnny Tremain", "Perri", "Old Yeller"],
    1958: ["The Light in the Forest", "White Wilderness", "Tonka"],
    1959: ["Sleeping Beauty", "The Shaggy Dog", "Darby O'Gill and the Little People", "Third Man on the Mountain"],
    1960: ["Toby Tyler or 10 Weeks with a Circus", "Kidnapped", "Pollyanna", "The Sign of Zorro", "Jungle Cat", "Ten Who Dared", "Swiss Family Robinson"],
    1961: ["One Hundred and One Dalmatians", "The Absent-Minded Professor", "The Parent Trap", "Nikki: Wild Dog of the North", "Greyfriars Bobby", "Babes in Toyland" ],
    1962: ["Moon Pilot", "Bon Voyage!", "Big Red", "Almost Angels", "The Legend of Lobo", "In Search of the Castaways"],
    1963: ["Son of Flubber", "Miracle of the White Stallions", "Savage Sam", "Summer Magic", "The Incredible Journey", "The Sword in the Stone"],
    1964: ["Emil and the Detectives", "A Tiger Walks", "The Misadventures of Merlin Jones", "The Three Lives of Thomasina", "The Moon-Spiner", "Mary Poppins", "Those Calloways"],
    1965: [""],
    1966: [],
    1967: [],
    1968: [],
    1969: [],
    1970: [],
    1971: [],
    1972: [],
    1973: [],
    1974: [],
    1975: [],
    1976: [],
    1977: [],
    1978: [],
    1979: [],
    1980: [],
    "other": ["unknown"],
}

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/api", (req, res) => {
    res.json(movies);
});

app.get("/api/:year", (req, res) => {
    const movieYear = req.params.year;
    if(movies[movieYear]){
        res.json(movies[movieYear]);
    } else {
        res.json(movies["other"]);
        console.log(`more movies will be added.  come back soon!`);
    }
});

app.listen(port, () => {
    console.log(`The server is now running on port: ${port}`);
}); 