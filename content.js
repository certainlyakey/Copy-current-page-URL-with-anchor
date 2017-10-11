
// Appends a global <menu> to <body>, and sets body.contextmenu to its id.
// This type of context menu only works in Firefox.
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu#Browser_compatibility
// But at least it's a normal, scriptable menu and not the useless
// WebExtensions abomination!
const menuitem = document.createElement('menuitem');

(function buildContextMenu() {
    const menu = document.createElement('menu');
    menu.id = '__copy_menu__';
    menu.type = 'context';
    menu.appendChild(menuitem);
    document.body.appendChild(menu);
})();

// When our menuitem selected, copy anchored link by constructing a hidden,
// selected <input> element and temporarily inserting it into the DOM.
menuitem.addEventListener('click', function copyLocation(event) {
    var doc = document.createDocumentFragment(),
        input = document.createElement('input');
    input.style.zIndex = '-999 !important';
    input.value += window.location.href.split('#')[0] + '#' + menuitem.dataset.anchor;
    doc.appendChild(input);
    document.body.appendChild(doc);

    input.select();
    document.execCommand('copy');

    document.body.removeChild(input);
    event.preventDefault();
});

var prev_element;

function _updateContextMenu(element, anchor) {
    prev_element && prev_element.removeAttribute('contextmenu');
    (prev_element = element).setAttribute('contextmenu', '__copy_menu__');
    menuitem.dataset.anchor = anchor;
    menuitem.label = 'Copy anchor link #' + anchor.substr(0, 20) + (anchor.length > 20 ? '…' : '');
}

// Makes browser handle the inner-most event target last, setting
// the menuitems' attributes to its values, not to the values of
// some outer DOM node.
var USE_CAPTURE = true;

// Install contextMenu handler on elements that follow an `<a name=...>` tag
for (const el of document.querySelectorAll('a[name] + *')) {
    el.addEventListener('contextmenu', function aNameSiblingContextMenu(event) {
        var a = event.currentTarget.previousSibling;
        while (a && !a.name) a = a.previousSibling;  // skip empty/text nodes
        _updateContextMenu(event.currentTarget, a.name);
    }, USE_CAPTURE);
}

// Install contextMenu handler on elements containing an `<a name=...>` tag
// Install handlers in reverse so the first one actually executes last
for (const el of Array.from(document.querySelectorAll('a[name]')).reverse()) {
    el.parentNode.addEventListener('contextmenu', (function(anchor) {
        return function aNameBlockContextMenu(event) {
            _updateContextMenu(event.currentTarget, anchor);
        }
    })(el.name), USE_CAPTURE);
}

// Install contextMenu handler on elements with `id` attribute
for (const el of document.querySelectorAll(`
         h1[id], h2[id], h3[id], h4[id], h5[id], h6[id], 
         p[id], span[id], blockquote[id], a[id], img[id],
         ul[id], ol[id], dl[id], li[id], dt[id],
         section[id], article[id], aside[id], figure[id], nav[id]`)) {
    el.addEventListener('contextmenu', function idContextMenu(event) {
        _updateContextMenu(event.currentTarget, event.currentTarget.id);
    }, USE_CAPTURE);
}
