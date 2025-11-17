document.addEventListener("DOMContentLoaded", function () {
    const tiles = document.getElementsByClassName("tile")

    for(let i = 0; i < tiles.length; i++) {
        const tile = tiles[i];
        tile.addEventListener("click", function() {
            console.log(`tile ${i}`); // f"tile {i}"

            // research about a Promise is
            fetch("http://localhost:8000/items/").then(x => x.json()).then(x => console.log(x)) // GET

            // figure out how to do POST / PATCH / DELETE

        })
    }
});
