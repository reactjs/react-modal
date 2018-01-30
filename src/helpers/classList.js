import * as refCount from "./refCount";

export function add(element, elementClass) {
  // Increment class(es) on refCount tracker and add class(es) to body
  elementClass
    .split(" ")
    .map(refCount.add)
    .forEach(className => element.classList.add(className));
}

export function remove(element, elementClass) {
  const classListMap = refCount.get();
  // Decrement class(es) from the refCount tracker
  // and remove unused class(es) from body
  elementClass
    .split(" ")
    .map(refCount.remove)
    .filter(className => classListMap[className] === 0)
    .forEach(className => element.classList.remove(className));
}
