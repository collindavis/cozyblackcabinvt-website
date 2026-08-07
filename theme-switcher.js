// Cozy Black Cabin VT — live color theme preview overlay
// Swaps the --ember/--ember-deep/--moss/--on-accent custom properties defined in styles.css.
// Selection persists in localStorage; theme.js in <head> applies it before first paint.

(function () {
  var STORAGE_KEY = 'cbc-theme';

  var DEFAULT_THEME = 'sage';

  var THEMES = [
    { id: 'sage',  name: 'Sage & Barnwood',note: 'default',       swatch: '#6B834F' },
    { id: 'gold',  name: 'Golden Meadow',  note: 'mustard gold',  swatch: '#C6952A' },
    { id: 'clay',  name: 'Terracotta Clay',note: 'warm clay red', swatch: '#BE5B3C' },
    { id: 'berry', name: 'Berry Bramble',  note: 'deep wine',     swatch: '#8C3F4D' },
    { id: 'lake',  name: 'Lake Teal',      note: 'Champlain blue',swatch: '#3E7D82' },
    { id: 'amber', name: 'Hearth Amber',   note: 'original',      swatch: '#D9852F' }
  ];

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || DEFAULT_THEME;
  }

  function applyTheme(id) {
    if (id === DEFAULT_THEME) {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', id);
    }
    try { localStorage.setItem(STORAGE_KEY, id); } catch (e) {}
  }

  function buildUI() {
    var wrap = document.createElement('div');
    wrap.className = 'theme-switcher';
    wrap.innerHTML =
      '<button type="button" class="theme-switcher-btn" aria-haspopup="true" aria-expanded="false" aria-label="Preview color themes">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>' +
          '<circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>' +
          '<circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>' +
          '<circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>' +
          '<path d="M12 22a9.5 9.5 0 1 1 0-19 8 8 0 0 1 8 8c0 1.7-1.3 3-3 3h-2.2c-1 0-1.8.9-1.8 2 0 .5.2 1 .5 1.3.3.4.5.8.5 1.3 0 1.3-1.1 2.4-2 2.4Z"></path>' +
        '</svg>' +
      '</button>' +
      '<div class="theme-panel" role="dialog" aria-label="Color theme preview">' +
        '<div class="theme-panel-head">' +
          '<span>Preview a palette</span>' +
          '<button type="button" class="theme-panel-close" aria-label="Close theme preview">✕</button>' +
        '</div>' +
        '<ul class="theme-list"></ul>' +
      '</div>';

    var btn = wrap.querySelector('.theme-switcher-btn');
    var panel = wrap.querySelector('.theme-panel');
    var list = wrap.querySelector('.theme-list');
    var closeBtn = wrap.querySelector('.theme-panel-close');

    THEMES.forEach(function (theme) {
      var li = document.createElement('li');
      var optBtn = document.createElement('button');
      optBtn.type = 'button';
      optBtn.className = 'theme-option';
      optBtn.setAttribute('aria-pressed', currentTheme() === theme.id ? 'true' : 'false');
      optBtn.innerHTML =
        '<span class="theme-swatch" style="background:' + theme.swatch + '"></span>' +
        '<span>' + theme.name + '<br><span style="font-weight:400;color:var(--stone);font-size:.78rem">' + theme.note + '</span></span>' +
        '<span class="theme-option-check">✓</span>';
      optBtn.addEventListener('click', function () {
        applyTheme(theme.id);
        list.querySelectorAll('.theme-option').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        optBtn.setAttribute('aria-pressed', 'true');
      });
      li.appendChild(optBtn);
      list.appendChild(li);
    });

    function open() {
      wrap.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
    function close() {
      wrap.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function () {
      wrap.classList.contains('open') ? close() : open();
    });
    closeBtn.addEventListener('click', close);
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
