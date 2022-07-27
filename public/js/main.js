const deleteBtn     = document.querySelectorAll('.fa-trash')
const item          = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')

//select all of these into an array

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem) //add the deleteBtns into an Event Listener 
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete) //add all items to an Event Listener               
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete) //add all complete items into an Event Listener
})

async function deleteItem(){  //function for deleting some stuffs
    const itemText = this.parentNode.childNodes[1].innerText //direct reference - grab parent, then child, second one, then text 
    //use classes instead or data tags or ID's
    try{
        const response = await fetch('deleteItem', {  // check if we can delete an Item 
            method: 'delete', 
            headers: {'Content-Type': 'application/json'}, //make sure is gonna be parse as json
            body: JSON.stringify({ //make it a string
              'itemFromJS': itemText //has to be equal in server.js
            })
          })

          
        const data = await response.json() //we waited, now we need to read it
        console.log(data) //we got it back
        location.reload() //refresh the 

        //let jsonResponse = await(await fetch()).json() ---> another way to do it


    }catch(err){ //something failed
        console.log(err) //here is what failed
    }
}

async function markComplete(){ // we updating some stuffs 
    const itemText = this.parentNode.childNodes[1].innerText //same note as above
    try{
        const response = await fetch('markComplete', { 
            method: 'put', //different method
            headers: {'Content-Type': 'application/json'}, //make sure its JSON
            body: JSON.stringify({ //make it a string
                'itemFromJS': itemText //links us to the server.js
            })
          })
        const data = await response.json() //we waited now we reading it 
        console.log(data) // this is it, the response
        location.reload() //refresh

    }catch(err){ //something went wrong
        console.log(err) //somthing went wrong :( here's what to fix 
    }
}

async function markUnComplete(){ //same as above but complete to uncomplete 
    const itemText = this.parentNode.childNodes[1].innerText //direct reference - grab parent, then child, second one, then text 
    //use classes instead or data tags or ID's
    try{
        const response = await fetch('markUnComplete', {  //same as previous block
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){ //is there an error
        console.log(err) //this is the error
    }
}