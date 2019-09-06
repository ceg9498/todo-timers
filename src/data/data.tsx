const DB_VER = 1;

function initIDB(dbName:string, storeName: string) {
  // dbName will be the DB name, storeName will be the store name.
  if(!('indexedDB' in window)){
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  // create or open IndexedDB
  var request = window.indexedDB.open(dbName,DB_VER);

  // handle errors
  request.onerror = function(event:any){
    console.log("IndexedDB Error: ", request.error);
  }

  // handle db upgrades
  request.onupgradeneeded = function(event:any) {
    console.log("Upgrading db...");
    // save the IDBDatabase interface
    var db = event.target.result;
    // Create an objectStore for the database
    var store = db.createObjectStore(storeName,{keyPath:'id',autoIncrement:true});
    store.onsuccess = () => {
      console.log("store created successfully")
    }
    store.onerror = () => {
      console.log("store not created, error: ",store.error)
    }
  }

  request.onsuccess = (event:any) => {
    // return the DB result
    return request.result;
  }
}

function addMany(dbName:string, storeName:string, items:Array<any>) {
  var request = window.indexedDB.open(dbName,DB_VER);
  console.log("Attempting to add many...");
  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction(storeName, 'readwrite');

    var store = transaction.objectStore(storeName);
    var objStoreReq;
    items.forEach(item => 
      objStoreReq = store.add(item)
    );
    objStoreReq.onsuccess = function(event) {
      console.log('[Transaction] ALL DONE!');
    };
  }
  request.onerror = (event:any) => {
    console.log("Failed to save data: " + items + " due to error: " + request.error);
  }
}

function addOne(dbName:string, storeName:string, item:any){
  var request = window.indexedDB.open(dbName,DB_VER);
  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore('store');
    store.add(item);
    transaction.oncomplete = (event:any) => {
      return true;
    }
    transaction.onerror = (event:any) => {
      return false;
    }
  }
  /*
  request.then((db) => {
    var transaction = db.transaction(storeName, 'readwrite');
    var store = transaction.objectStore('store');
    store.add(item);
    return transaction.complete;
  }).then(() => {
    console.log("Added item to the data store!");
  });
  */
}

function loadData(dbName:string, storeName: string){
  var request = window.indexedDB.open(dbName,DB_VER);
  let db;
  request.onsuccess = (event:any) => {
    db = request.result;
    var transaction = db.transaction(storeName, 'readwrite');

    var store = transaction.objectStore(storeName);
    let objstoreReq = store.getAll()
    objstoreReq.onsuccess = (event:any) => {
      let data = event.target.result
      console.log("Returning data...")
      return data;
    }
    objstoreReq.onerror = (event:any) => {
      console.log("Error: ", event.target.error)
    }
  }
  request.onerror = (event:any) => {
    console.log("Unable to retrieve data. Error: ", event.target.error)
  }
}

export { initIDB, addMany, addOne, loadData }