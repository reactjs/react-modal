const modals = {};

export function add(bodyClass) {
  // Set variable and default if none
  if (!modals[bodyClass]) {
    modals[bodyClass] = 0;
  }
  modals[bodyClass] += 1;
}

export function remove(bodyClass) {
  if (modals[bodyClass]) {
    modals[bodyClass] -= 1;
  }
}

export function count(bodyClass) {
  return modals[bodyClass];
}

export function totalCount() {
  return Object.keys(modals).reduce((acc, curr) => acc + modals[curr], 0);
}
