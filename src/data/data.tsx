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
    reject("Failed to open database");
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

    store.onerror = () => {
      console.error("store not created, error: ",store.error);
      reject("Failed to open database");
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
      reject("Failed to load data");
    };
  };
});

function addOrUpdateMany(items:TimerType[]) {
  return new Promise((resolve,reject) => {
    var request = window.indexedDB.open('timers',DB_VER);

    request.onsuccess = (event:any) => {
      let db = request.result;
      var transaction = db.transaction('timerData', 'readwrite');
      var store = transaction.objectStore('timerData');
      var objStoreReq;
      items.forEach(item => {
        delete item.countdown;
        objStoreReq = store.put(item);
        
        objStoreReq.onerror = function(event) {
          reject("Error storing item "+item.title);
        };
      });

      transaction.oncomplete = function(event) {
        resolve("Data saved successfully");
      };

      transaction.onerror = (event:any) => {
        reject("Failed to save data");
      };
    };

    request.onerror = (event:any) => {
      reject("Failed to save data");
    };
  });
}

function addOrUpdateOne(item:TimerType){
  return new Promise((resolve,reject) => {
    var request = window.indexedDB.open('timers',DB_VER);

    request.onsuccess = (event:any) => {
      let db = request.result;
      var transaction = db.transaction('timerData', 'readwrite');
      var store = transaction.objectStore('timerData');
      delete item.countdown;
      store.put(item);

      transaction.oncomplete = (event:any) => {
        resolve("Data saved successfully");
      };

      transaction.onerror = (event:any) => {
        reject("Failed to save data");
      };
    };

    request.onerror = (event:any) => {
      reject("Failed to save data");
    };
  });
}

function deleteOne(id:any){
  return new Promise((resolve,reject)=>{
    var request = window.indexedDB.open('timers',DB_VER);

    request.onsuccess = (event:any) => {
      let db = request.result;
      var transaction = db.transaction('timerData', 'readwrite');
      let store = transaction.objectStore('timerData');
      let infoReq = store.get(id);
      let objStoreReq = store.delete(id);
      let title = "";

      infoReq.onsuccess = (event:any) => {
        title = event.target.result.title;
      };

      objStoreReq.onsuccess = (event:any) => {
        let message = "";
        if(title !== ""){
          message = title + " was deleted";
        } else {
          message = "Timer was deleted";
        }
        resolve(message);
      };

      objStoreReq.onerror = (event:any) => {
        reject("Unable to delete entry");
      };

      transaction.onerror = (event:any) => {
        reject("Unable to delete entry");
      };
    };

    request.onerror = (event:any) => {
      reject("Unable to delete entry");
    };
  });
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