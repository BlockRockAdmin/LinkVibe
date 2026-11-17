// Consenso alle statistiche (Google Tag Manager / Analytics).
// Di serie tutto negato; la scelta resta nel browser del visitatore (localStorage).
(function () {
  var CHIAVE = 'lv-consenso';

  function leggi() { try { return localStorage.getItem(CHIAVE); } catch (e) { return null; } }
  function salva(v) { try { localStorage.setItem(CHIAVE, v); } catch (e) {} }

  function applica(accetta) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', { analytics_storage: accetta ? 'granted' : 'denied' });
    }
    if (window.dataLayer) window.dataLayer.push({ event: 'consenso_aggiornato', consenso: accetta ? 'si' : 'no' });
  }

  function mostra() {
    if (document.getElementById('consenso')) return;
    var box = document.createElement('div');
    box.id = 'consenso';
    box.className = 'consenso';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Cookie di statistica');
    box.innerHTML =
      '<p>Uso cookie di statistica di Google per sapere quante persone visitano la pagina. ' +
      'Niente pubblicità e niente profilazione. Li attivo solo se accetti.</p>' +
      '<div class="consenso-azioni">' +
      '<button type="button" class="btn ghost sm" data-scelta="no">Rifiuta</button>' +
      '<button type="button" class="btn primary sm" data-scelta="si">Accetta</button>' +
      '</div>';
    box.addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-scelta]');
      if (!b) return;
      var si = b.getAttribute('data-scelta') === 'si';
      salva(si ? 'si' : 'no');
      applica(si);
      box.remove();
    });
    document.body.appendChild(box);
  }

  var apri = document.getElementById('apri-consenso');
  if (apri) apri.addEventListener('click', mostra);
  if (!leggi()) mostra();
})();
