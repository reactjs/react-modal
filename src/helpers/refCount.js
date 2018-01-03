const classListMap = {};

export function get() {
  return classListMap;
}

export function add(className) {
  // Set variable and default if none
  if (!classListMap[className]) {
    classListMap[className] = 0;
  }
  classListMap[className] += 1;
  return className;
}

export function remove(className) {
  if (classListMap[className]) {
    classListMap[className] -= 1;
  }
  return className;
}

export function totalCount() {
  return Object.keys(classListMap).reduce(
    (acc, curr) => acc + classListMap[curr],
    0
  );
}
