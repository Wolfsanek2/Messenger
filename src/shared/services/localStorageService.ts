export class LocalStorageService {
	has(key: string): boolean {
		return !!localStorage.getItem(key);
	}
}
