document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".grid-container");
    const apiBaseUrl = "http://127.0.0.1:8000/api/items/"; 
    const ledgerApiUrl = "http://127.0.0.1:8000/api/ledger/";

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

        // PATCH Method - update count
        function postLedger(delta) {
            return fetch(ledgerApiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                item: id,
                delta: delta
                })
            })
            .then(res => {
                if (!res.ok) {
                    return res.json().then(err => {
                        throw new Error(JSON.stringify(err));
                    });
                }
                return res.json();
            });
        }

        plusButton.addEventListener("click", () => {
            postLedger(1)
                .then(() => {
                    count++;
                    countStr.textContent = count;
                })
                .catch(err => {
                    console.error("Error adding count", err);
                    alert("Error adding count: " + err.message);
                });
        });

        minusButton.addEventListener("click", () => {
        postLedger(-1)
            .then(() => {
                count--;
                countStr.textContent = count;
            })
            .catch(err => {
                console.error("Error removing count", err);
                alert("Error removing count: " + err.message);
            });
        });

        // DELETE Method
        deleteButton.addEventListener("click", () => {
            fetch(`${apiBaseUrl}${id}/`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: id })
            })
            .then(res => {
                if (!res.ok) throw new Error("Failed to delete item");
                box.remove();
            })
            .catch(err => console.error("Error deleting item:", err));
        });
    }

    // POST Method - add new item
    const itemInput = document.getElementById("item");
    const addItemButton = document.getElementById("addItem");

    addItemButton.addEventListener("click", () => {
        const itemName = itemInput.value.trim();
        if (!itemName) return;

        fetch(apiBaseUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: itemName })
        })
        .then(res => {
            if (res.status === 400) throw new Error("Item already exists");
            if (!res.ok) throw new Error("Error adding item");
            return res.json();
        })
        .then(item => {
            createBox(item.name, item.id, item.count);
            itemInput.value = "";
        })
        .catch(err => alert(err.message));
    });




    // GET Method - fetch all items on page load
    function loadItems(searchTerm = "") {
        container.innerHTML = "";

        let url = apiBaseUrl;
        if (searchTerm) {
            url = `${apiBaseUrl}?search=${encodeURIComponent(searchTerm)}`;
        }

        fetch(url)
            .then(res => res.json())
            .then(items => {
                items.forEach(item => {
                        createBox(item.name, item.id, item.count || 0);
                });
            })
            .catch(err => console.error("Error fetching items:", err));
    }

    // load items on page start
    loadItems();

    
    const searchInput = document.getElementById("search");
    
    // searchInput.addEventListener("keydown", (e) => {
    // if (e.key === "Enter") {
    //     loadItems(searchInput.value);
    // } else if (searchInput.value === "") {
    //     loadItems();
    // }
    // });

    // search while typing, makes the server work more, so I changed it to search on enter key press instead
    searchInput.addEventListener("input", () => {
        loadItems(searchInput.value);
    });
});
