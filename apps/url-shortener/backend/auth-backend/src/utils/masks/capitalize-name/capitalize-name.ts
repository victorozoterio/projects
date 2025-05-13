export const capitalizeNameMask = (name: string) => {
	if (!name) return;
	const lowercaseWords = ['de', 'da', 'do', 'das', 'dos', 'a', 'e', 'i', 'o', 'u'];
	const words = name.split(' ');

	const capitalizedWords = words.map((word, index) => {
		const lowerWord = word.toLowerCase();
		if (index !== 0 && lowercaseWords.includes(lowerWord)) return lowerWord;
		return lowerWord.charAt(0).toUpperCase() + lowerWord.slice(1);
	});

	return capitalizedWords.join(' ');
};
