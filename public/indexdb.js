const indexedDB = window.indexedDB

let data;
const req = indexedDB.open('budget', 1)

req.onupgradeneeded = ({target}) =>{
  let data = target.result;
  data.createObjectStore('pending', {autoIncrement: true});
};

req.onsuccess = ({target})=>{
  let data = target.result;
  if(navigator.onLine){
    checkDb();
  }
};

req.onerror = ({target})=>{
console.log(target.errorCode);
}

function saveRecord(data){
  const trans = data.transaction(['pending'], 'readwrite');
  const save = trans.objectStore('pending');
  save.add(data)
}

function checkDb(){
  const trans = data.transaction(['pending'], 'readwrite');
  const save = trans.objectStore('pending');
  const getAllData = save.getAll();

  getAllData.onsuccess = ()=>{
    // create if statement that checks if the legnth of the getAllData.result >0 then fetch the api/transaction/bulk method post then json the response
    //then delete the record if it successully saves the records in the DB. by running clear()
  }
}

window.addEventListener('online', checkDb)