let modals = [];

export function add(element) {
  if (modals.indexOf(element) === -1) {
    modals.push(element);
  }
}

export function remove(element) {
  const index = modals.indexOf(element);
  if (index === -1) {
    return;
  }
  modals.splice(index, 1);
}

export function count() {
  return modals.length;
}
