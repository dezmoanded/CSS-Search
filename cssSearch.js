var keepRules = [];
var sheet = 25;
var numRules = document.styleSheets[sheet].rules.length;

function keepCssRules(){
	keepRules = [];
	numRules = document.styleSheets[sheet].rules.length;
	for (var i=0; i < numRules; i++){
		keepRules.push(document.styleSheets[sheet].rules[i]);
	}
}

function removeRules(from, to){
	for(var i=to; i>=from; i--)
		document.styleSheets[sheet].deleteRule(i);
}

function restoreRules(from, to){
	for(var i=from; i<=to; i++)
		document.styleSheets[sheet].insertRule(keepRules[i].cssText, i);
}

function findRec(check, from, to){
	removeRules(from, to);
	if (!check()){
		restoreRules(from, to);
		return false;
	}
	if (to == from)
		return keepRules[to].cssText;
	
	restoreRules(from, to);
	console.log(from + ", " + to);
	split = Math.round((to - from) / 2) + from;	
	return findRec(check, from, split) || findRec(check, split+1, to);
}

function findCulprit(check){
	for (var i = 0; i < document.styleSheets.length; i++){
		var styleSheet = document.styleSheets[i];
		if (styleSheet.rules==null) continue;
		sheet = i;
		keepCssRules();
		removeRules(0, numRules-1);
		var c = check();
		restoreRules(0, numRules-1);
		if (c) return styleSheet.href + "\n" + findRec(check, 0, numRules-1);
	}
}

$("#signupDialog").modal("show"); $("#turn2").click();
setTimeout(function(){console.log(findCulprit(function(){
	return $(".Back fieldset").first().position().left == 20;
}));}, 1000);