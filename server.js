const express = require('express') //add express
const app = express() //initiate
const MongoClient = require('mongodb').MongoClient //add mongo mpn package
const PORT = 2121 //assign a port number
require('dotenv').config() //call dotenv to use .env files and use your mongo IDs withoue loading


let db, //declare db
    dbConnectionStr = process.env.DB_STRING, //connection to mongo DB
    dbName = 'todo'  //declare database name 

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Connected to ${dbName} Database`)  //let us know we connected correctly
        db = client.db(dbName)  //assign the db variable for line 8
    })
    
app.set('view engine', 'ejs') //set the options for the express app we assigned earlier
app.use(express.static('public')) //middleware -look in the public folder for the routes we call up later; comes betewwn the request and response
app.use(express.urlencoded({ extended: true })) //settings
app.use(express.json()) //more settings


app.get('/',async (request, response)=>{ //client requests the 'route' page -> we send back these or errors
    const todoItems = await db.collection('todos').find().toArray() //wait for the database to reply; convert the documents fom database into arrays
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //wait for the database to reply; grab the specific documents that have a false status
    response.render('index.ejs', { items: todoItems, left: itemsLeft }) //show us the goods
    // db.collection('todos').find().toArray()  -> find the todos, put in array only one connection here
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})  -> find the number of not completed tasks
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))  -> of we hit an error let us know (second half of the try/catch)
})

app.post('/addTodo', (request, response) => { //update from CRUD or create
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false}) //add a new item/document to our todo list on database; insert in the body
    //of the todoItem and automatically set it to false for completed
    .then(result => {
        console.log('Todo Added') // let us know that we succesfully added a todo
        response.redirect('/')//go back to the route screen/homepage
    })
    .catch(error => console.error(error)) // uh oh we got an error here you go
})

app.put('/markComplete', (request, response) => { //update some parts of the documents on our database
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change the todo
        $set: {
            completed: true //mark it as complete
          }
    },{
        sort: {_id: -1}, //sort by id: descending biggest to smallest so it ends up last? 
        upsert: false //update + insert = upsert; updates the rendering so you dont double add stuff
    })
    .then(result => {
        console.log('Marked Complete') //let us know it worked
        response.json('Marked Complete') //let the client know it worked
    })
    .catch(error => console.error(error)) //if error shove it in console log

})

app.put('/markUnComplete', (request, response) => { //update our documents round 2: fight the man 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{ //change this one todo 
        $set: {
            completed: false //we didn't actually do this todo so it's undone
          }
    },{
        sort: {_id: -1}, //sort by id: this guy goes last
        upsert: false //don't add a double
    })
    .then(result => { //sets up result in case we eant to use it later
        console.log('Marked Incomplete') //let us know it worked
        response.json('Marked Incomplete')//let client know it worked
    })
    .catch(error => console.error(error)) //yo fam we got issues 

})

app.delete('/deleteItem', (request, response) => { //deletay some an item 
    db.collection('todos').deleteOne({thing: request.body.itemFromJS}) //delete that bad boy 
    .then(result => { //again, result in cas we want it later
        console.log('Todo Deleted') //it worked - to server
        response.json('Todo Deleted') //it worked - to client
    })
    .catch(error => console.error(error)) // oh noes some problems

})

app.listen(process.env.PORT || PORT, ()=>{ //this is where we listen to the port; firs one is for heroku's 
    //else use one we declared
    console.log(`Server running on port ${PORT}`) //let me know we are connected
})