document.querySelectorAll(".update-button").forEach((button) => {
    button.addEventListener("click", async () => {
        const { title, year, likes: currentLikes } = button.dataset;
        const likes = parseInt(currentLikes || "0", 10);

        try {
            const response = await fetch("/years", { 
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, year, likes }),
            });

            if(!response.ok) {
                const errorDetails = await response.text();
                console.error(`Error ${response.status}: ${response.statusText}`, errorDetails);
                throw new Error(`Failed to update likes: ${response.status}`);
            }
            const data = await response.json();

            const likesElement = button.closest(".movie-container").querySelector("span");
                if (likesElement) {
                    likesElement.textContent = `Likes: ${data.likes}`;
                }
                button.setAttribute("data-likes", data.likes);
        } catch (error) {
            console.error("Update error:", error);
        }
    });
});

document.querySelectorAll(".delete-button").forEach((button) => {
    button.addEventListener("click", () => {
        const title = button.getAttribute("data-title");
        const year = button.getAttribute("data-year");

        if(!title || !year){
            console.error("Missing title or year in data attributes");
            alert("could not find movie title or year.");
            return;
        }

        fetch("/years", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, year})
        })
        .then((res) => {
            if(!res.ok) {
                return res.text().then((text) => {
                    console.error("Error response:", res.status, res.statusText);
                    throw new Error(`Server Error: ${res.status} ${res.statusText}`);
                });
            } 
            return res.json()
        })
        .then((data) => {
            console.log("Delete success", data);
            button.closest(".movie-container").remove();
        })
        .catch(error => {
            console.error("Delete error:", error);
            alert("An error occured while trying to delete the movie");
        });
    });
});

