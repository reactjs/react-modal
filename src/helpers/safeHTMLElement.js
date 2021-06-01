import ExecutionEnvironment from "exenv";

const EE = ExecutionEnvironment;

const NodeTypeElement = 1;

const IHTMLElement = function(props, propName) {
  const element = props[propName];

  if (!element || element.nodeType !== NodeTypeElement) return;

  const isValid = Boolean(element.setAttribute && element.removeAttribute);

  if (!isValid) {
    return new Error(
      `Warning: Invalid prop \`${propName}\` supplied to \`Modal\``
    );
  }
};

export const SafeHTMLElement = EE.canUseDOM ? IHTMLElement : {};

export const SafeHTMLCollection = EE.canUseDOM ? window.HTMLCollection : {};

export const SafeNodeList = EE.canUseDOM ? window.NodeList : {};

export const canUseDOM = EE.canUseDOM;

export default SafeHTMLElement;
