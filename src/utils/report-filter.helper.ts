import {getValueFromLocalStorage} from "@/utils/actions/local-starage";
import {baseURL} from "@/utils/api";

export const createUrlWithFilters = (url: string, from: string) => {
    let filters = getValueFromLocalStorage('filters');

    if (!filters) return url;
    filters = JSON.parse(filters);

    if (filters.from !== from) return url;

    console.log('Original URL:', url);

    // Ensure the baseUrl is included
    const fullUrl = `${baseURL}${url.startsWith('/') ? url : '/' + url}`;

    const urlObj = new URL(fullUrl);

    filters.items?.forEach(item => {
        if (item.name && item.value) {
            urlObj.searchParams.append(item.name, item.value);
        }
    });

    let returnUrl = urlObj.toString();

    // Remove baseUrl from the returned path
    returnUrl = returnUrl.replace(baseURL, '');

    console.log('Final URL:', returnUrl);

    return returnUrl;
};


