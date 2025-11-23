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



/* 
add someway to add more div boxes and let them be more user friendly
let them customize the boxes (text color, box color)
backend separate count
(dont let inventory go negative)
*/

    const boxes = document.querySelectorAll(".box");

    boxes.forEach(box => {
        const plusButton = box.querySelector(".plus");
        const minusButton = box.querySelector(".minus");
        const countStr = box.querySelector(".count");

        let count = parseInt(countStr.textContent);

        plusButton.addEventListener("click", () => {
            count++;
            countStr.textContent = count;
        });

        minusButton.addEventListener("click", () => {
            if (count > 0) { // making sure the count doesnt go negative
                count--;
                countStr.textContent = count;
            }
        });
    });

});