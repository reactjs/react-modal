var modals = [];

module.exports = {
  add: function (element) {
    if (modals.indexOf(element) === -1) {
      modals.push(element);
    }
  },
  remove: function (element) {
    var index = modals.indexOf(element);
    if (index === -1) {
      return;
    }
    modals.splice(index, 1);
  },
  count: function () {
    return modals.length;
  }
};
