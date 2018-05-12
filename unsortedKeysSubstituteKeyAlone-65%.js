var testData = require('./testDataUncompressed.json');

var keysDetected = {};
walkTree(testData, function(key){
	keysDetected[key] = (keysDetected[key] && keysDetected[key] + 1) || 1;
});
// console.log(keysDetected);
// console.log(sortObjPropsByValue(keysDetected));
//Determine highest rank
var keyRanking = sortObjPropsByValue(keysDetected);
var keyToIndex = {};
forEach(Object.keys(keysDetected), function(index, key){
	keyToIndex[key] = index;
});

var compressedKeys = {};
walkTree(testData, function(key, value, path, isLeaf) {
	if(!isLeaf) {
		return;
	}
	var currentPlace = compressedKeys;
	//Make sure path is populated
	forEach(path, function(_, key){
		var compressedKey = keyToIndex[key];
		if(currentPlace[compressedKey] === undefined) {
			currentPlace = currentPlace[compressedKey] = {};
		} else {
			currentPlace = currentPlace[compressedKey];
		}
	});

	currentPlace[keyToIndex[key]] = value;
});
console.log('Space usage: ');
var compressedLength = JSON.stringify(compressedKeys).length + JSON.stringify(keyToIndex).length;
var originalLength = JSON.stringify(testData).length;
console.log(((compressedLength/originalLength) * 100).toFixed(2) + '% of original!');
//Expects an object with props that have numeric values
function sortObjPropsByValue(obj) {
	var arrayToSort = [];
	forEach(obj, function(key, value) {
		arrayToSort.push([key, value]);
	});
	arrayToSort.sort(function(a, b){
		return b[1] - a[1];
	});
	var returnArray = [];
	forEach(arrayToSort, function(_, keyValuePair){
		returnArray.push(keyValuePair[0]);
	});
	return returnArray;
}

function walkTree(obj, callback) {
		if(!obj) return;
		var burrow = function(key, body, pathSoFar){
			var isLeaf = false;
			if(typeof body !== 'object' || !body) isLeaf = true;
			pathSoFar = pathSoFar || [];
			var pathSoFarClone = [].concat(pathSoFar);
			callback(key, body, pathSoFarClone, isLeaf);
			if (isLeaf) return;
			forEach(body, function(i,v) {
				pathSoFarClone = [].concat(pathSoFar);
				pathSoFarClone.push(key);
				burrow(i, v, pathSoFarClone);
			});
		};
		var topLevelKeys = Object.keys(obj);
		forEach(obj, burrow);
	}

function forEach(obj, callback) {
	if(obj && (typeof obj === 'object')) {
		var keys = getKeys(obj);
		for(var i = 0; i < keys.length; i++) {
			callback(keys[i], obj[keys[i]]);
		}	
	}
}

function getKeys(obj) {
	return Object.keys(obj);
}







