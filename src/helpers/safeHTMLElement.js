import ExecutionEnvironment from "exenv";

const EE = ExecutionEnvironment;

const SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

export const canUseDOM = EE.canUseDOM;

export default SafeHTMLElement;
