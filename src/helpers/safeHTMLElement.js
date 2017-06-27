import ExecutionEnvironment from 'exenv';

const EE = ExecutionEnvironment;

const SafeHTMLElement = EE.canUseDOM ? window.HTMLElement : {};

export default SafeHTMLElement;
