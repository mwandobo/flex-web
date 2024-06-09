export function insertAtIndexAndFillEmpty(arr: any[], index: any, value: any) {


    let foundValue = false;
    for (let i = index - 1; i >= 0; i--) {
        if (arr[i] !== undefined) {
            // Found a non-empty value, insert it at the specified index
            arr.splice(index, 0, arr[i]);
            foundValue = true;
            break;
        }
    }

    // If no non-empty value found, insert the provided value
    if (!foundValue) {
        arr.splice(index, 0, value);
    }

    return arr;
}