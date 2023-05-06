var anchor_url = '';

if (typeof browser === "undefined") {
    var browser = chrome;
}

browser.contextMenus.create({
    "id": "copy-with-ref",
    "title": "Copy anchor link",
    "visible": false,
    "contexts": ["image", "link", "page"],
    "onclick": (info, tab) => {
        navigator.clipboard.writeText(anchor_url)
    }
});

browser.runtime.onMessage.addListener(async function (message) {
    if (message.cmd == "hide") {
        //~ console.log("Hiding menu");
        browser.contextMenus.update("copy-with-ref", {visible: false});
        browser.contextMenus.refresh();
    }
    else if (message.cmd == "show") {
        anchor_url = message.url;
        var fragment = message.anchor.substr(0, 20) + (message.anchor.length > 20 ? '…' : '');
        browser.contextMenus.update("copy-with-ref", {
            title: 'Copy anchor link #' + fragment,
            visible: true,
        });
        browser.contextMenus.refresh();
    }
});
