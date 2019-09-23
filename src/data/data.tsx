import { TimerType } from './schema';
import { checkResets } from '../helpers/Reset';

const DB_VER = 1;

var initIDB = new Promise((resolve,reject)=> {
  // dbName will be the DB name, storeName will be the store name.
  if(!('indexedDB' in window)){
    console.warn("This browser doesn't support IndexedDB");
    return;
  }
  // create or open IndexedDB
  var request = window.indexedDB.open('timers',DB_VER);

  // handle errors
  request.onerror = function(event:any){
    console.error("IndexedDB Error: ", request.error);
    reject(request.error);
  };

  // handle db upgrades
  request.onupgradeneeded = function(event:any) {
    // save the IDBDatabase interface
    var db = event.target.result;
    // Create an objectStore for the database
    var store = db.createObjectStore(
      'timerData',
      {keyPath:'id',autoIncrement:true}
    );

    store.onsuccess = () => {
      console.log("store created successfully");
    };

    store.onerror = () => {
      console.error("store not created, error: ",store.error);
      reject(store.error);
    };
  };

  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readonly');
    var store = transaction.objectStore('timerData');
    let objStoreReq = store.getAll();
  
    objStoreReq.onsuccess = (event:any) => {
      resolve(cleanseData(event.target.result));
    };
  
    objStoreReq.onerror = (event:any) => {
      console.error("Error: ", event.target.error);
      reject(event.target.error);
    };
  };
});

function addOrUpdateMany(items:Array<TimerType>) {
  var request = window.indexedDB.open('timers',DB_VER);

  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readwrite');
    var store = transaction.objectStore('timerData');
    var objStoreReq;
    items.forEach(item => 
      objStoreReq = store.put(item)
    );

    transaction.oncomplete = function(event) {
      console.log('Item(s) successfully stored.');
    };

    objStoreReq.onerror = function(event) {
      console.error("Error storing items: ",event.target.error);
    };
  };

  request.onerror = (event:any) => {
    console.error("Failed to save data: "
      +items+" due to error: "+request.error
    );
  };
}

function addOrUpdateOne(item:TimerType){
  var request = window.indexedDB.open('timers',DB_VER);

  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readwrite');
    var store = transaction.objectStore('timerData');
    store.put(item);

    transaction.oncomplete = (event:any) => {
      return true;
    };

    transaction.onerror = (event:any) => {
      return false;
    };
  };
}

function deleteOne(id:any){
  var request = window.indexedDB.open('timers',DB_VER);

  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readwrite');
    let store = transaction.objectStore('timerData');
    let objStoreReq = store.delete(id);

    objStoreReq.onsuccess = (event:any) => {
      console.log("Item id " + id + " deleted successfully!", event);
    };

    objStoreReq.onerror = (event:any) => {
      console.error("Unable to delete entry. Error: ",event.target.error);
    };
  };

  request.onerror = (event:any) => {
    console.error("Unable to delete entry. Error: ", event.target.error);
  };
}

function cleanseData(data:TimerType[]):TimerType[]{
  data.forEach(item=>{
    // fix date for the reset time
    item.resetTime = new Date(item.resetTime);

    // fix date for the array of completed times
    let tempSubItems = [];
    item.completed.forEach(subItem=>{
      tempSubItems.push(new Date(subItem));
    });
    item.completed = [...tempSubItems];

    // check if the item needs to be reset
    if(item.isCompleted && checkResets(item.resetTime)){
      item.isCompleted = false;
      item.resetTime = null;
    }

    // TEMP: if 'description' doesn't exist:
    // add fields for description and category
    if(item.description === undefined || item.description === null){
      item.description = "";
      item.category = "";
    }
  });
  return data;
}

export { initIDB,
  addOrUpdateMany, addOrUpdateOne, deleteOne };