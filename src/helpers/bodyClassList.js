const classListMap = {};

const addClassToMap = className => {
  // Set variable and default if none
  if (!classListMap[className]) {
    classListMap[className] = 0;
  }
  classListMap[className] += 1;
  return className;
};

const removeClassFromMap = className => {
  if (classListMap[className]) {
    classListMap[className] -= 1;
  }
  return className;
};

const add = bodyClass => {
  bodyClass
    .split(" ")
    .map(addClassToMap)
    .forEach(className => document.body.classList.add(className));
};

const remove = bodyClass => {
  // Remove unused class(es) from body
  bodyClass
    .split(" ")
    .map(removeClassFromMap)
    .filter(className => classListMap[className] === 0)
    .forEach(className => document.body.classList.remove(className));
};

export { add, remove };
