(function (global) {
  var ABOUT_CONTENT = {
    en: '<h1>About</h1><p><strong>Records — Secure Access</strong> is a controlled-access system for case files and related documentation. All material is classified and intended for authorised personnel only.</p><p>Use <strong>Case Files</strong> in the navigation to browse available dossiers. Open a folder to view its contents; select a case and choose <strong>Choose</strong> to open the dossier. Documents may contain cross-references to other cases. Handle all information in accordance with your clearance level.</p><p>If you encounter any discrepancy or need access to additional files, contact the archive administrator. Do not remove or alter physical or digital evidence.</p><p><em>Last updated: February 2026. This interface is for internal use only.</em></p>',
    cz: '<h1>O projektu</h1><p><strong>Spisy — Zabezpečený přístup</strong> je systém s řízeným přístupem ke spisům a související dokumentaci. Veškerý materiál je klasifikován a určen pouze oprávněným osobám.</p><p>V navigaci použijte <strong>Spisy</strong> pro prohlížení dostupných složek. Otevřete složku pro zobrazení obsahu; vyberte spis a zvolte <strong>Otevřít</strong> pro otevření spisu. Dokumenty mohou obsahovat křížové odkazy na jiné spisy. S informacemi nakládejte v souladu s úrovní vašeho prověření.</p><p>Při zjištění nesrovnalosti nebo při potřebě přístupu k dalším spisům kontaktujte správce archivu. Fyzické ani digitální důkazy neodstraňujte ani neměňte.</p><p><em>Poslední aktualizace: únor 2026. Rozhraní je určeno pouze pro vnitřní použití.</em></p>'
  };
  global.ABOUT_CONTENT = ABOUT_CONTENT;

  function injectAbout() {
    var sheet = document.querySelector('.content-sheet');
    if (!sheet || typeof window.getLang !== 'function') return;
    var lang = window.getLang();
    sheet.innerHTML = ABOUT_CONTENT[lang] || ABOUT_CONTENT.en;
    sheet.classList.add('about-content');
  }

  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function () {
      injectAbout();
    });
    document.addEventListener('langchange', function () {
      injectAbout();
    });
  }
})(typeof window !== 'undefined' ? window : this);
