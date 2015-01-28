var clipboard = require("sdk/clipboard");
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
var data = require("sdk/self").data;
cm.Item({
	label: "Copy page URL with anchor",
	context:  require("sdk/context-menu").SelectorContext("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id], p[id], section[id], article[id], blockquote[id], a[id], img[id], ul[id], ol[id], li[id], aside[id], header[id], footer[id], figure[id], span[id], nav[id]"), 
	contentScriptFile: [data.url("contentscript.js")],
	onMessage: function(elId) {
		var fullActiveUrl = tabs.activeTab.url;
		var pageurl_without_anchor = fullActiveUrl.substr(0, fullActiveUrl.indexOf('#'));
		if (pageurl_without_anchor == '') {pageurl_without_anchor = fullActiveUrl;}
		clipboard.set(pageurl_without_anchor + '#' + elId);
		// console.log('URL of current page with anchor copied into clipboard');

	},

});