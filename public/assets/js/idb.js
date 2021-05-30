//this is a index data base file that allows off line useage 

//BELOW CODE BLOCK ESTABLISHES CONNECTION 

// create variable to hold db connection 
// will store the conneted db object 
let db;
//establishing a connection to IndexedDB database called "pizza_hunt" and set it to version 
//actts as an event listener or the DB event listener is created when we open the connetion to the db using indexedDB.open()
// .open() takes in two parameters name of DB is not existing and version of data base 
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function(event) {
    //save a referance to the database
    const db = event.target.result; 
    // create an oject store (table) "container the keeps of line data"
    //set it to have an auto incrementing primary key of sorts 
    db.createObjectStore('new_pizza', { autoInccrement: true });
};

    //upon a successful 
    request.onsuccess = function(event) {
        //when db is successfully created with its object store 
        //(from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
        db = event.target.result;  
        // check if app is online if yes run uploadPizza() to send all local db data to api
        if(navigator.onLine) {
            //// uload the pizza from saved store function for upload pizza is below 
            uploadPizza();
        }
    }; 

    request.onerror = function(event) {
        // log error here 
        console.log(event.target.errorCode);
    };

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    // open a new transaction with the data base with read and write ermisson 
    const transaction = db.transaction(['new_pizza'], 'readwrite');
    //access the object store for `new_pizza`
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    // add record to your store with add method 
    pizzaObjectStore.add(record); 

}

// this will upload the saved recoreds to the app 
function uploadPizza() {
    // open a transaction on data base
    const transaction = db.transaction ([ 'new_pizza'], 'readwrite');
    // access your object store
    const pizzaObjectStore = transaction.objectStore('new_pizza');
    //get all records from store and set to a variable get all is asynchronus and has to be attached to a handler 
    const getAll = pizzaObjectStore.getAll();
    // upon a successful .getAll() execution, run this function 
    getAll.onsuccess = function() {
        // if there was  data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch(`/api/pizzas`, {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: { 
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            //this access the db a second time to recheck and them empty the store
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                //open one more transaction
                const transaction = db.transaction(['new_pizza'], 'readwrite');
                //access the new_pizza object store
                const pizzaObjectStore = transaction.objectStore('new_pizza');
                //clear all items in your store 
                pizzaObjectStore.clear();
                //this is not needed
                alert('All saved pizza has been submitted!'); 
            })
            .catch(err => {
                // set reference to redorect back here 
                console.log(err);
            });
        }
    };

}

// listen for app coming back online 
window.addEventListener('online', uploadPizza);

