const classListMap = {};

export function get() {
  return classListMap;
}

export function add(bodyClass) {
  // Set variable and default if none
  if (!classListMap[bodyClass]) {
    classListMap[bodyClass] = 0;
  }
  classListMap[bodyClass] += 1;
  return bodyClass;
}

export function remove(bodyClass) {
  if (classListMap[bodyClass]) {
    classListMap[bodyClass] -= 1;
  }
  return bodyClass;
}

export function totalCount() {
  return Object.keys(classListMap)
    .reduce((acc, curr) => acc + classListMap[curr], 0);
}
