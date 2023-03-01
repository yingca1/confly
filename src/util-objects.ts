interface AnyObject {
  [key: string]: any;
}

function deepMerge(obj1: AnyObject, obj2: AnyObject): AnyObject {
  const mergedObject: AnyObject = {};

  for (const key of Object.keys(obj1)) {
    if (obj2[key] === undefined) {
      mergedObject[key] = obj1[key];
    } else if (obj1[key] instanceof Object && obj2[key] instanceof Object) {
      if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
        mergedObject[key] = obj1[key].concat(obj2[key]);
      } else {
        mergedObject[key] = deepMerge(obj1[key], obj2[key]);
      }
    } else {
      mergedObject[key] = obj2[key];
    }
  }

  for (const key of Object.keys(obj2)) {
    if (obj1[key] === undefined) {
      mergedObject[key] = obj2[key];
    }
  }

  return mergedObject;
}

function updateObjectValue(object: any, key: string, value: any) {
  const keys = key.split("/");
  let currentObject = object;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!currentObject.hasOwnProperty(keys[i])) {
      currentObject[keys[i]] = {};
    }
    currentObject = currentObject[keys[i]];
  }
  currentObject[keys[keys.length - 1]] = value;
  return object;
}

export { deepMerge, updateObjectValue };
