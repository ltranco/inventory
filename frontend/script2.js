
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired");
    
    const countElement = document.getElementById('count');

    function updateCount(newCount) {
        countElement.textContent = newCount;
        

    }

    const addButton = document.getElementById('add');
    const addButtonHandler = () => {
        updateCount(parseInt(countElement.textContent) + 1);
    };
    
    addButton.addEventListener('click', addButtonHandler);

    // recreate with tyler
    // after that we can change the text boxes to fix any mislabels
    


});




