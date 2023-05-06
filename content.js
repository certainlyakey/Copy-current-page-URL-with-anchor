document.body.addEventListener('mousedown', (event) => {
    if (event.button != 2)
        return;
    browser.runtime.sendMessage({cmd: "hide"});
}, false);

function install_right_click_handler(el, anchor) {
    el.addEventListener('mousedown', (event) => {
            if (event.button != 2)
                return;
            event.stopImmediatePropagation();
            browser.runtime.sendMessage({
                cmd: "show",
                anchor: anchor,
                url: window.location.href.split('#')[0] + '#' + anchor,
            });
        },
        // Use_capture=false so we process inner-most first
        false
    );
}

// Install contextMenu handler on elements with `id` attribute
for (const el of document.querySelectorAll(`
         h1[id], h2[id], h3[id], h4[id], h5[id], h6[id],
         p[id], span[id], blockquote[id], a[id], img[id],
         ul[id], ol[id], dl[id], li[id], dt[id],
         section[id], article[id], aside[id], figure[id], nav[id]`)) {
    install_right_click_handler(el, el.id);
}

// Install contextMenu handler on elements that follow an `<a name=...>` tag
for (const el of document.querySelectorAll('a[name] + *')) {
    var a = el.previousSibling;
    while (a && !a.name) a = a.previousSibling;  // skip empty/text nodes
    install_right_click_handler(el, a.name);
}
for (const el of document.querySelectorAll('a[id] + *')) {
    var a = el.previousSibling;
    while (a && !a.name) a = a.previousSibling;  // skip empty/text nodes
    install_right_click_handler(el, a.id);
}

// Install contextMenu handler on elements containing an `<a name=...>` tag
// Install handlers in reverse so the first one actually executes last
for (const el of Array.from(document.querySelectorAll('a[name]'))) {
    install_right_click_handler(el.parentNode, el.name);
}
for (const el of Array.from(document.querySelectorAll('a[id]'))) {
    install_right_click_handler(el.parentNode, el.id);
}
