export const cn = (...classNames: (string | undefined)[]): string => {
	return classNames.reduce<string>((result, className) => {
		if (!className) {
			return result;
		}
		return `${result} ${className}`;
	}, '');
};
