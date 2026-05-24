console.log('Jus9 Verde carregada com segurança e cuidado.');

(function(){
  if (!document.querySelector('link[rel="manifest"]')) {
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = '/manifest.webmanifest';
    document.head.appendChild(manifest);
  }

  if (!document.querySelector('meta[name="theme-color"]')) {
    var theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#176b3a';
    document.head.appendChild(theme);
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/service-worker.js').catch(function(error){
        console.warn('Service worker Jus9 Verde não registrado:', error);
      });
    });
  }

  var installPromptEvent = null;
  var installButtons = document.querySelectorAll('[data-pwa-install]');

  function updateInstallButtons(enabled) {
    installButtons.forEach(function(button){
      button.disabled = !enabled;
      button.hidden = false;
      if (!enabled) button.setAttribute('aria-disabled', 'true');
      else button.removeAttribute('aria-disabled');
    });
  }

  window.addEventListener('beforeinstallprompt', function(event){
    event.preventDefault();
    installPromptEvent = event;
    updateInstallButtons(true);
  });

  installButtons.forEach(function(button){
    button.addEventListener('click', function(){
      if (!installPromptEvent) {
        var help = document.querySelector('[data-pwa-help]');
        if (help) help.hidden = false;
        return;
      }
      installPromptEvent.prompt();
      installPromptEvent.userChoice.finally(function(){
        installPromptEvent = null;
        updateInstallButtons(false);
      });
    });
  });
})();
