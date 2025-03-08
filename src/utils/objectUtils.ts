export const isObject = (value: Object) => typeof value === 'object' && value !== null && !Array.isArray(value);

export const pickObject = (object: any, keys: Array<any>) => {
    const newObject: any = {};

    if (object !== undefined && object !== null) {
        keys && keys.forEach(key => {
            newObject[key] = object[key];
        });
    }

    return newObject;
}

export const omitObject = (object: any, keys: Array<any>) => {
    const newObject: any = {};

    if (object !== undefined && object !== null) {
        const allKeys = Object.keys(object);

        allKeys && allKeys.forEach(key => {
            if (!keys.includes(key)) {
                newObject[key] = object[key];
            }
        });
    }

    return newObject;
}
