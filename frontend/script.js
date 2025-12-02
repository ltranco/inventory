document.addEventListener("DOMContentLoaded", function () {

    // GET Method, fetching existing items from the backend
    const container = document.querySelector(".grid-container");
    function createBox(name, id, initialCount = 0) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.id = id;

        box.innerHTML = `
        <div class="title">${name}</div>
        <div class="middle">
            <button class="minus">-</button>
            <div class="count">${initialCount}</div>
            <button class="plus">+</button>
        </div>
        <button class="delete">DEL</button>
        `;

        container.appendChild(box);

        const plusButton = box.querySelector(".plus");
        const minusButton = box.querySelector(".minus");
        const countStr = box.querySelector(".count");
        const deleteButton = box.querySelector(".delete");

        let count = initialCount;



    // PATCH Method
        function patchCount(newCount) {
            fetch(`http://localhost:8000/items/`, {
                method: "PATCH",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({ id: id, count: newCount })
            });
        }


        plusButton.addEventListener("click", () => {
            count++;
            countStr.textContent = count;
            patchCount(count); // update backend
        });

        minusButton.addEventListener("click", () => {
            if (count > 0) { // making sure the count doesnt go negative
                count--;
                countStr.textContent = count;
                patchCount(count); // update backend
            }
        });

    // DELETE Method
        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:8000/items/`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: id})
            })
            .then(x => x.json())
            .then(() => {
                box.remove(); // remove from DOM
            });
        });
    }

    
    


    // get correct id for new item and then POST to backend
    const itemInput = document.getElementById("item");
    const addItemButton = document.getElementById("addItem");

    addItemButton.addEventListener("click", () => {
        const itemName = itemInput.value.trim();
        if (!itemName) return;

        // fetch current items to find any available ids
        fetch("http://localhost:8000/items/")
            .then(x => x.json())
            .then(items => {
            // get existing ids
                const existingIds = items.map(item => item.id);
            
            // find smallest unused id
                let newId = 1;
                while (existingIds.includes(newId)) {
                    newId++;
                }

                const newItem = { id: newId, name: itemName, count: 0 };
            // POST to backend
            fetch("http://localhost:8000/items/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newItem)
            })
            .then(x => x.json())
            .then(() => {
                createBox(newItem.name, newItem.id, newItem.count);
                itemInput.value = "";
            });
    });

    });

    // gets all existing items from backend and creates dom elements for each item
    fetch("http://localhost:8000/items/")
        .then(x => x.json())
        .then(items => {
            items.forEach(item => {
                createBox(item.name, item.id, item.count);
            });
        });



        // maybe enhance the coloring options by adding a new input section where they can also enter a new item name + color of choice and then add item
        // somehow save the colors in the backend as well

});