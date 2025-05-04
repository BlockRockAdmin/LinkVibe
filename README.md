# LinkVibe

LinkVibe è un'applicazione web full-stack per condividere link social in modo semplice e personalizzato.

## Funzionalità
- **Interfaccia Utente**: Design responsive con icone Font Awesome e un'immagine di profilo personalizzata.
- **Database**: Utilizza Supabase (PostgreSQL) per gestire i link social (`social_links`) e i dati di IndexedDB (`indexeddb_data`).
- **Sincronizzazione Dati**: Sincronizza i dati locali di IndexedDB con Supabase tramite una Edge Function (`clever-task`).
- **Serverless**: Funzione serverless su Netlify (`my-first-function`) per recuperare i dati da Supabase in modo sicuro.
- **Deploy**: Ospitato su Netlify con deploy continuo.

## Tecnologie Utilizzate
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase Edge Functions, Netlify Functions
- **Database**: Supabase (PostgreSQL)
- **Altro**: IndexedDB, Font Awesome, Netlify CLI

## Installazione
1. Clona il repository: `git clone https://github.com/Branca90/LinkVibe.git` (privato, disponibile su richiesta).
2. Configura le variabili d'ambiente per Supabase (`SUPABASE_URL`, `SUPABASE_KEY`).
3. Avvia il progetto in locale: `live-server --port=8080`.
4. Deploy su Netlify con il comando di build: `sed "s|\$SUPABASE_URL|${SUPABASE_URL}|g;s|\$SUPABASE_KEY|${SUPABASE_KEY}|g" config.js.template > config.js`.

## Link
- **Live Demo**: [https://linkvibes.netlify.app](https://linkvibes.netlify.app)
- **Repository**: Privato (disponibile su richiesta)

## Autore
- Branca90
