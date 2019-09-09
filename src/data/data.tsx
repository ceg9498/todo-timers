import { TimerType } from './schema';
import { checkResets } from '../helpers/Reset'

const DB_VER = 1;

var initIDB = new Promise((resolve,reject)=> {
  // dbName will be the DB name, storeName will be the store name.
  if(!('indexedDB' in window)){
    console.log("This browser doesn't support IndexedDB");
    return;
  }
  // create or open IndexedDB
  var request = window.indexedDB.open('timers',DB_VER);

  // handle errors
  request.onerror = function(event:any){
    console.log("IndexedDB Error: ", request.error);
    reject(request.error);
  }

  // handle db upgrades
  request.onupgradeneeded = function(event:any) {
    console.log("Upgrading db...");
    // save the IDBDatabase interface
    var db = event.target.result;
    // Create an objectStore for the database
    var store = db.createObjectStore('timerData',{keyPath:'id',autoIncrement:true});
    store.onsuccess = () => {
      console.log("store created successfully")
    }
    store.onerror = () => {
      console.log("store not created, error: ",store.error)
    }
  }

  request.onsuccess = (event:any) => {
    resolve();
  }
});

function addOrUpdateMany(items:Array<TimerType>) {
  var request = window.indexedDB.open('timers',DB_VER);
  console.log("Attempting to add many...");
  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readwrite');

    var store = transaction.objectStore('timerData');
    var objStoreReq;
    items.forEach(item => 
      objStoreReq = store.put(item)
    );
    objStoreReq.onsuccess = function(event) {
      console.log('[Transaction] ALL DONE!');
    };
  }
  request.onerror = (event:any) => {
    console.log("Failed to save data: " + items + " due to error: " + request.error);
  }
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
    }
    transaction.onerror = (event:any) => {
      return false;
    }
  }
}

var loadData = new Promise((resolve, reject) => {
  var request = window.indexedDB.open('timers',DB_VER);
  request.onsuccess = (event:any) => {
    let db = request.result;
    var transaction = db.transaction('timerData', 'readwrite');

    var store = transaction.objectStore('timerData');
    let objStoreReq = store.getAll()
    objStoreReq.onsuccess = (event:any) => {
      console.log("Returning data...")
      resolve(event.target.result);
    }
    objStoreReq.onerror = (event:any) => {
      console.log("Error: ", event.target.error)
      reject(event.target.error);
    }
  }
  request.onerror = (event:any) => {
    console.log("Unable to retrieve data. Error: ", event.target.error)
    reject(event.target.error);
  }
});

function filterData(data:TimerType[]):TimerType[]{
  data.forEach(item=>{
    // fix date for the reset time
    item.resetTime = new Date(item.resetTime);

    // fix date for the array of completed times
    let tempSubItems = []
    item.completed.forEach(subItem=>{
      tempSubItems.push(new Date(subItem));
    });
    item.completed = [...tempSubItems];

    // check if the item needs to be reset
    if(item.isCompleted && checkResets(item.resetTime)){
      item.isCompleted = false;
      item.resetTime = null;
    }
  });
  return data;
}

export { initIDB, addOrUpdateMany, addOrUpdateOne, loadData, filterData }