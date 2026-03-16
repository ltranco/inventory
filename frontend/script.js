document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".grid-container");
    const itemInput = document.getElementById("item");
    const addItemButton = document.getElementById("addItem");

    const openAddModalButton = document.getElementById("openAddModal");
    const closeModalButton = document.getElementById("closeModal");
    const addModal = document.getElementById("addModal");

    const searchInput = document.getElementById("searchInput");
    const historyButton = document.getElementById("historyBtn");

    function openModal() {
        addModal.classList.remove("hidden");
        itemInput.value = "";
        itemInput.focus();
    }

    function closeModal() {
        addModal.classList.add("hidden");
        itemInput.value = "";
    }

    function clearBoxes() {
        container.innerHTML = "";
    }

    function createBox(name, id, initialCount = 0) {
        const box = document.createElement("div");
        box.classList.add("box");
        box.dataset.id = id;
        box.dataset.name = name.toLowerCase();

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

        let qty = initialCount;

        function patchCount(newCount) {
            fetch(`http://localhost:8000/items/${id}/`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ qty: newCount })
            })
            .catch((err) => console.error("Error updating item:", err));
        }

        plusButton.addEventListener("click", () => {
            qty++;
            countStr.textContent = qty;
            patchCount(qty);
        });

        minusButton.addEventListener("click", () => {
            if (qty > 0) {
                qty--;
                countStr.textContent = qty;
                patchCount(qty);
            }
        });

        deleteButton.addEventListener("click", () => {
            fetch(`http://localhost:8000/items/${id}/`, {
                method: "DELETE"
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Delete failed: ${response.status}`);
                }
                box.remove();
            })
            .catch((err) => console.error("Error deleting item:", err));
        });
    }

    function renderItems(items) {
        clearBoxes();
        items.forEach((item) => {
            createBox(item.name, item.id, item.qty);
        });
    }

    function fetchItems(searchTerm = "") {
        const params = new URLSearchParams();

        if (searchTerm) {
            params.append("search", searchTerm);
        }

        fetch(`http://localhost:8000/items/?${params}`)
            .then(response => response.json())
            .then(items => {renderItems(items);
        })
        .catch(err => console.error(err));
    }

    function addNewItem() {
        const itemName = itemInput.value.trim();
        if (!itemName) return;

        fetch("http://localhost:8000/items/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: itemName, qty: 0 })
        })
        .then((response) => response.json())
        .then(() => {
            closeModal();
            fetchItems(searchInput.value.trim());
        })
        .catch((err) => console.error("Error adding item:", err));
    }

    if (openAddModalButton) {
        openAddModalButton.addEventListener("click", openModal);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModal);
    }

    if (addModal) {
        addModal.addEventListener("click", (e) => {
            if (e.target === addModal) {
                closeModal();
            }
        });
    }

    if (addItemButton) {
        addItemButton.addEventListener("click", addNewItem);
    }

    if (itemInput) {
        itemInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                addNewItem();
            }
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                const searchTerm = searchInput.value.trim();
                fetchItems(searchTerm);
            }
        });
    }

    // if (historyButton) {
    //     historyButton.addEventListener("click", () => {
    //         alert("");
    //     });
    // }

    fetchItems();
});