import * as refCount from './refCount';

export function add (bodyClass) {
  // Increment class(es) on refCount tracker and add class(es) to body
  bodyClass
    .split(' ')
    .map(refCount.add)
    .forEach(className => document.body.classList.add(className));
}

export function remove (bodyClass) {
  const classListMap = refCount.get();
  // Decrement class(es) from the refCount tracker
  // and remove unused class(es) from body
  bodyClass
    .split(' ')
    .map(refCount.remove)
    .filter(className => classListMap[className] === 0)
    .forEach(className => document.body.classList.remove(className));
}
