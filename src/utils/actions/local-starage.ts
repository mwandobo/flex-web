

export function getValueFromLocalStorage(
    key: string | null = null,
    defaultValue: any = null
) {
    // Check if localStorage is available (ensuring browser environment)
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available. Cannot access local storage.');
        return defaultValue; // Return default value or handle accordingly
    }

    return localStorage.getItem(key)
}

export function setValueLocalStorage(
    key: string | null = null,
    value: any = null
) {
    // Check if localStorage is available (ensuring browser environment)
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available. Cannot access local storage.');
        return 0; // Return default value or handle accordingly
    }

    localStorage.setItem(key, value);
    return 1
}


export function removeValueFromLocalStorage(
    key: string | null = null,
    defaultValue: any = null
) {
    // Check if localStorage is available (ensuring browser environment)
    if (typeof localStorage === 'undefined') {
        console.warn('localStorage is not available. Cannot access local storage.');
        return defaultValue; // Return default value or handle accordingly
    }

    const storeData = localStorage.removeItem(key)

    return storeData
}