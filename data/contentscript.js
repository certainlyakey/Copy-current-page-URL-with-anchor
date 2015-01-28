// self.on("click", self.postMessage);
// self.on("context", function(node){
// 	if (node.href) return true;
// });
self.on("context", function (node,d) {
	var anchor = node;
	var ancestor = anchor.closest('[id]'); 
	var ancestorID = ancestor.id;
	ancestorID = ancestorID.replace(/_/g,' ');
	if (ancestorID.length > 20) {
		ancestorID = ancestorID.substr(0, 20) + "...";
	}
	return "Copy page URL with anchor #" + ancestorID;
});
self.on("click", function (node,d) {
	self.postMessage(node.getAttribute('id'));
});