import ExecutionEnvironment from "exenv";

const EE = ExecutionEnvironment;

const SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

export const SafeHTMLCollection = EE.canUseDOM ? window.HTMLCollection : {};

export const SafeNodeList = EE.canUseDOM ? window.NodeList : {};

export const canUseDOM = EE.canUseDOM;

export default SafeHTMLElement;
