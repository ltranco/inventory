import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState("")

  const apiBaseUrl = "http://127.0.0.1:8000/api/items/"
  const ledgerApiUrl = "http://127.0.0.1:8000/api/ledger/"

  useEffect(() =>{
    fetch(apiBaseUrl)
      .then(res => res.json())
      .then(data => {
        setItems(data)
      })
      .catch(err => console.log("Error fetching items: ", err))
  }, [])

  // Function to post ledger updates to the backend
  function postLedger(itemId, delta) {
    return fetch(ledgerApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body:JSON.stringify({
          item: itemId,
          delta: delta
        })
    })
    .then(res => {
      if (!res.ok) {
        return res.json().then(err => {
          throw new Error(JSON.stringify(err))
        })
      }
      return res.json()
    })
  }

  // Handle the update of the count when plus or minus buttons are clicked
  function handleUpdate(itemId, delta) {
    // Find the item in the current state
    const item = items.find(item => item.id === itemId)
    if (!item) {
      return
    }
    // Calculate the new count and prevent it from going negative
    const newCount = item.count + delta
    if (newCount < 0) {
      return
    }

    // Update the count in the backend and then update the state
    postLedger(itemId, delta).then(() => {
      setItems(previousItems => { 
        return previousItems.map(item => {
          if (item.id === itemId) {
            return {...item, count: newCount}
          } else {  
            return item
          }
        })
      })
    })
    .catch(err => console.log("Error Updating the count", err))
  }

  function handleAddItem() {

  }


  return (
    <>
      <h1>Inventory</h1>

      <input
        id="search"
        type="text"
        placeholder="Search items..."
      />

      <div className="grid-container">
        {items.map(item => (
          <div className="box" key={item.id}>
            <div className="title">{item.name}</div>
            <div className="middle">
              <button className="minus" onClick={() => handleUpdate(item.id, -1)}>-</button>
              <div className="count">{item.count}</div>
              <button className="plus" onClick={() => handleUpdate(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <input id="item" value={newItem} onChange={(e)=> handleAddItem} placeholder="Enter a new item name" />
        <button id="addItem">Add Item</button>
      </div>
    </>
  )
}

export default App