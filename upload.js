async function getIndexedDBData() {
  return new Promise((resolve) => {
    const request = indexedDB.open('myDatabase');
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['myStore'], 'readonly');
      const store = transaction.objectStore('myStore');
      const getAllRequest = store.getAll();
      getAllRequest.onsuccess = () => {
        resolve(getAllRequest.result);
      };
    };
  });
}

async function uploadIndexedDBToSupabase() {
  try {
    const dbData = await getIndexedDBData();
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

uploadIndexedDBToSupabase();
