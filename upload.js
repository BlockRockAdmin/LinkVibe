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

    // Trasforma i dati nel formato atteso dalla tabella indexeddb_data
    const transformedData = dbData.map(item => ({
      data: item // Inserisci l'intero oggetto come valore del campo "data"
    }));

    // Usa le credenziali da window.SUPABASE_CONFIG
    if (typeof window.SUPABASE_CONFIG === 'undefined') {
      console.error('Errore: window.SUPABASE_CONFIG non è definito. Controlla config.js.');
      throw new Error('window.SUPABASE_CONFIG non è definito');
    }

    const chunkSize = 100;
    for (let i = 0; i < transformedData.length; i += chunkSize) {
      const chunk = transformedData.slice(i, i + chunkSize);
      console.log('Invio chunk:', chunk);
      const response = await fetch(`${window.SUPABASE_CONFIG.SUPABASE_URL}/functions/v1/clever-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.SUPABASE_CONFIG.SUPABASE_KEY}`,
        },
        body: JSON.stringify(chunk),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Errore durante l'upload: ${response.status} - ${errorText}`);
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
