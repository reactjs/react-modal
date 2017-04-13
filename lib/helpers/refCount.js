var modals = [];

module.exports = {
  add (element) {
    if (modals.indexOf(element) === -1) {
      modals.push(element);
    }
  },
  remove (element) {
    const index = modals.indexOf(element);
    if (index === -1) {
      return;
    }
    modals.splice(index, 1);
  },
  count () {
    return modals.length;
  }
};
