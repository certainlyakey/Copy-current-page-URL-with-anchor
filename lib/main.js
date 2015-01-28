var clipboard = require("sdk/clipboard");
var tabs = require("sdk/tabs");
var cm = require("sdk/context-menu");
var data = require("sdk/self").data;
cm.Item({
	label: "Copy page URL with anchor",
	context:  require("sdk/context-menu").SelectorContext("[id]"), 
	contentScriptFile: [data.url("contentscript.js")],
	onMessage: function(elId) {
		var pageurl = tabs.activeTab.url;
		clipboard.set(pageurl + '#' + elId);
		// console.log('URL of current page with anchor copied into clipboard');

	},

});