const indexedDB =
  window.indexedDB || 
  window.mozIndexedDB || 
  window.webkitIndexedDB || 
  window.msIndexedDB || 
  window.shimIndexedDB ;

let data;
const req = indexedDB.open("budget", 1);

req.onupgradeneeded = ({ target }) => {
  let data = target.result;
  data.createObjectStore("pending", { autoIncrement: true });
};

req.onsuccess = ({ target }) => {
  let data = target.result;
  if (navigator.onLine) {
    checkDb();
  }
};

req.onerror = ({ target }) => {
  console.log(target.errorCode);
};

function saveRecord(data) {
  const trans = data.transaction(["pending"], "readwrite");
  const save = trans.objectStore("pending");
  save.add(data);
}

function checkDb() {
  const trans = data.transaction(["pending"], "readwrite");
  const save = trans.objectStore("pending");
  const getAllData = save.getAll();

  getAllData.onsuccess = () => {
    console.log('working');
    // if (getAllData.result.length > 0) {
    //   fetch("/api/transaction/bulk", {
    //     method: "POST",
    //     body: JSON.stringify(getAllData.result),
    //     headers: {
    //       Accept: "application/json, text/plain, */*",
    //       "Content-Type": "application/json"
    //     },
    //   })
    //     .then((response) => {
    //       return response.json();
    //     })
    //     .then(() => {
    //       const transaction = data.transaction(["pending"], "readwrite");
    //       const save = transaction.objectStore("pending");
    //       save.clear();
    //     });
    // }
    // // create if statement that checks if the legnth of the getAllData.result >0 then fetch the api/transaction/bulk method post then json the response
    //then delete the record if it successully saves the records in the DB. by running clear()
  };
}

window.addEventListener("online", checkDb);
