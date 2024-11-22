const updateButtons = document.querySelectorAll(".update-button");
const deleteButtons = document.querySelectorAll(".delete-button");

updateButtons.forEach(button => {
    button.addEventListener("click", () => {
        const title = button.getAttribute("data-title");
        const year = button.getAttribute("data-year");
        const likesValue = button.getAttribute("data-likes");
        const likes = likesValue ? parseInt(likesValue, 10) : 0;

        const updatedLikes = likes + 1;
        
        fetch("/years", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title,
                year: year,
                likes: updatedLikes,
            }),
        })
        .then(res => res.json())
        .then(data => {
            console.log("successful update:", data);
            const likesSpan = button.previousElementSibling;
            likesSpan.textContent = `Likes: ${updatedLikes}`;
        })
        .catch(error => {
            console.log("Error updating movies:", error);
        });
    });
});
deleteButtons.forEach(button => {
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

