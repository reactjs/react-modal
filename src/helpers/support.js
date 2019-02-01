// so that our CSS is statically analyzable
const CLASS_NAMES = {
  overlay: "ReactModal__Overlay",
  content: "ReactModal__Content"
};

export const CLOSED = 0;
export const OPENING = 1;
export const OPEN = 2;
export const CLOSING = 3;

export const buildClassName = (state, which, additional) => {
  const classNames =
    typeof additional === "object"
      ? additional
      : {
          base: CLASS_NAMES[which],
          afterOpen: `${CLASS_NAMES[which]}--after-open`,
          beforeClose: `${CLASS_NAMES[which]}--before-close`
        };

  const open = state >= OPENING ? classNames.afterOpen : "";
  const close = state >= CLOSING ? classNames.beforeClose : "";
  const className = `${classNames.base} ${open} ${close}`;

  return typeof additional === "string" && additional
    ? `${className} ${additional}`
    : className;
};

export const attributesFromObject = (prefix, items) =>
  Object.keys(items).reduce((acc, name) => {
    acc[`${prefix}-${name}`] = items[name];
    return acc;
  }, {});
