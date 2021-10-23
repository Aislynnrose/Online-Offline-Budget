const indexedDB =
  window.indexedDB || 
  window.mozIndexedDB || 
  window.webkitIndexedDB || 
  window.msIndexedDB || 
  window.shimIndexedDB ;

let db;
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = ({ target }) => {
  db = target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = ({ target }) => {
  console.log(target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  store.add(record);
};

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  const getAll = store.getAll();

  getAll.onsuccess = function(){
    
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        },
      })
        .then((response) => {
          return response.json();
        })
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const save = transaction.objectStore("pending");
          save.clear();
        });
    }
    // // create if statement that checks if the legnth of the getAllData.result >0 then fetch the api/transaction/bulk method post then json the response
    //then delete the record if it successully saves the records in the DB. by running clear()
  };
}

window.addEventListener("online", checkDatabase);
