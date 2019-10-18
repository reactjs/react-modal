function compare(v1, v2) {
  if (!v1 || !v2) {
    if (v1) {
      return 1;
    } else if (v2) {
      return -1;
    }
    return 0;
  }

  v1 = String(v1)
    .split(".")
    .map(n => Number(n));
  v2 = String(v2)
    .split(".")
    .map(n => Number(n));

  var len = Math.min(v1.length, v2.length);
  for (var i = 0; i < len; i++) {
    if (v1[i] > v2[i]) {
      return 1;
    } else if (v1[i] < v2[i]) {
      return -1;
    }
  }

  return v1.length - v2.length;
}

export default function gteVersion(v1, v2) {
  return compare(v1, v2) >= 0;
}
