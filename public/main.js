document.querySelectorAll(".update-button").forEach((button) => {
    button.addEventListener("click", () => {
        const title = button.dataset.title;
        const year = button.dataset.year;
        const likes = parseInt(button.dataset.likes || "0", 10) + 1;

        fetch("/years", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, year, likes }),
        })
            .then((res) => {
                console.log("Resonse Status: ", res.status);
                if (!res.ok){
                    console.error("Response error: ", res.status, res.statusText);
                    return res.text().then((text) => {
                        console.error("Error details: ", text);
                        throw new Error(`Error: ${res.status} - ${res.statusText}`);
                    });
                } 
                return res.json();
            })
            .then((data) => {
                console.log("Server response data: ", data);

                const likesElement = button.parentElement.querySelector("span");
                if (likesElement) {
                    likesElement.textContent = `Likes: ${updatedLikes}`;
                }
                button.setAttribute("data-likes", updatedLikes);
            })
            .catch((error) => console.error("Update error:", error));
    });
});


document.querySelectorAll(".delete-button").forEach(button => {
    button.addEventListener("click", () => {
        const movieItem = button.parentElement;
        const title = movieItem.getAttribute("data-title");
        const year = movieItem.getAttribute("data-year");

        fetch("/years", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, year})
        })
        .then(res => {
            if(res.ok) return res.json()
        })
        .then(data => {
            console.log(data);
            window.location.reload()
        })
        .catch(error => {
            console.error(error);
        })
    });
})

