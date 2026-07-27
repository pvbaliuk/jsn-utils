/**
 * @param {object} obj
 * @returns {boolean}
 */
export function isObjectEmpty(obj: object): boolean{
    if(Array.isArray(obj))
        return obj.length === 0;

    for(const key in obj){
        if(Object.prototype.hasOwnProperty.call(obj, key))
            return false;
    }

    return true;
}
