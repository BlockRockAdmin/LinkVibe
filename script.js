import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4';

const supabase = createClient(
  'https://uplnnaiubixhjjhqzpxw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbG5uYWl1Yml4aGpqaHF6cHh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3NDU2MTUsImV4cCI6MjA2MTMyMTYxNX0.m6jrFgKHO9uDVbJnH0PjWVacgRaAYSb0SUIcwlGrJEQ'
);

console.log('Supabase client inizializzato:', supabase);

async function loadLinks() {
  try {
    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .order('order_number', { ascending: true });

    if (error) {
      console.error('Errore nel caricamento dei link:', error);
      return;
    }

    console.log('Dati ricevuti:', data);

    const linksContainer = document.getElementById('links');
    if (!linksContainer) {
      console.error('Elemento #links non trovato nel DOM');
      return;
    }

    data.forEach(link => {
      const linkElement = document.createElement('a');
      linkElement.href = link.url;
      linkElement.className = 'link-button';
      linkElement.target = '_blank';
      linkElement.innerHTML = `<i class="fab fa-${link.icon}"></i> ${link.title}`;
      linksContainer.appendChild(linkElement);
    });
  } catch (err) {
    console.error('Errore di rete:', err);
  }
}

loadLinks();
