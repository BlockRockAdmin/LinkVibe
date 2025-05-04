// Funzione per inizializzare IndexedDB
function initializeIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('myDatabase', 2);

    request.onupgradeneeded = (event) => {
      console.log('onupgradeneeded triggered, version:', event.target.result.version);
      const db = event.target.result;
      if (!db.objectStoreNames.contains('myStore')) {
        console.log('Creating object store: myStore');
        db.createObjectStore('myStore', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      console.log('Database opened successfully');
      const db = event.target.result;
      if (!db.objectStoreNames.contains('myStore')) {
        console.error('myStore does not exist after initialization');
        reject(new Error('myStore does not exist'));
        return;
      }
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Error opening database:', event.target.error);
      reject(event.target.error);
    };
  });
}

// Funzione per aggiungere dati di test
async function addTestData() {
  try {
    const db = await initializeIndexedDB();
    const transaction = db.transaction(['myStore'], 'readwrite');
    const store = transaction.objectStore('myStore');
    store.add({ value: "Test data from LinkVibe" });
    console.log('Dati di test aggiunti a IndexedDB');
  } catch (err) {
    console.error('Errore durante l\'aggiunta dei dati di test:', err);
  }
}

// Funzione per ottenere i dati da IndexedDB
async function getIndexedDBData() {
  try {
    const db = await initializeIndexedDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(['myStore'], 'readonly');
      const store = transaction.objectStore('myStore');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        console.log('Dati recuperati da IndexedDB:', getAllRequest.result);
        resolve(getAllRequest.result);
      };
      getAllRequest.onerror = () => {
        console.error('Errore nel recupero dei dati:', getAllRequest.error);
        resolve([]);
      };
    });
  } catch (err) {
    console.error('Errore durante l\'inizializzazione di IndexedDB:', err);
    return [];
  }
}

// Funzione per caricare i dati su Supabase
async function uploadIndexedDBToSupabase() {
  try {
    const dbData = await getIndexedDBData();
    if (!dbData || dbData.length === 0) {
      console.log('Nessun dato trovato in IndexedDB.');
      return;
    }

    const chunkSize = 100;
    for (let i = 0; i < dbData.length; i += chunkSize) {
      const chunk = dbData.slice(i, i + chunkSize);
      const response = await fetch('https://uplnnaiubixhjjhqzpxw.supabase.co/functions/v1/clever-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbG5uYWl1Yml4aGpqaHF6cHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDU2MTUsImV4cCI6MjA2MTMyMTYxNX0.m6jrFgKHO9uDVbJnH0PjWVacgRaAYSb0SUIcwlGrJEQ`,
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        throw new Error('Errore durante l\'upload:', response.statusText);
      }

      console.log(`Chunk ${i / chunkSize + 1} caricato con successo`);
    }

    console.log('Upload completato!');
  } catch (err) {
    console.error('Errore durante l\'upload:', err);
  }
}

// Aggiungi dati di test e poi esegui l'upload
addTestData().then(() => uploadIndexedDBToSupabase());
