module.exports = (string) => {
  let str = string.toLowerCase();
	let map = {
		'a' : /[\xE0-\xE6]/g,
		'e' : /[\xE8-\xEB]/g,
		'i' : /[\xEC-\xEF]/g,
		'o' : /[\xF2-\xF6]/g,
		'u' : /[\xF9-\xFC]/g,
		'c' : /\xE7/g,
		'n' : /\xF1/g,
    '-' : /\s/g
	};

	for (let key in map) {
		let pattern = map[key];
		str = str.replace(pattern, key);
	}

	return str;
}
