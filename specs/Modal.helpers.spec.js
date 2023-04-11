/* eslint-env mocha */
import "should";
import "@webcomponents/custom-elements/src/native-shim";
import tabbable from "../src/helpers/tabbable";
import "sinon";

export default () => {
  describe("tabbable", () => {
    describe("without tabbable descendents", () => {
      it("returns an empty array", () => {
        const elem = document.createElement("div");
        tabbable(elem).should.deepEqual([]);
      });
    });

    describe("with tabbable descendents", () => {
      let elem;
      beforeEach(() => {
        elem = document.createElement("div");
        document.body.appendChild(elem);
      });

      afterEach(() => {
        document.body.removeChild(elem);
      });

      it("includes descendent tabbable inputs", () => {
        const input = document.createElement("input");
        elem.appendChild(input);
        tabbable(elem).should.containEql(input);
      });

      it("includes tabbable non-input elements", () => {
        const div = document.createElement("div");
        div.tabIndex = 1;
        elem.appendChild(div);
        tabbable(elem).should.containEql(div);
      });

      it("includes links with an href", () => {
        const a = document.createElement("a");
        a.href = "foobar";
        a.innerHTML = "link";
        elem.appendChild(a);
        tabbable(elem).should.containEql(a);
      });

      it("excludes links without an href or a tabindex", () => {
        const a = document.createElement("a");
        elem.appendChild(a);
        tabbable(elem).should.not.containEql(a);
      });

      it("excludes descendent inputs if they are not tabbable", () => {
        const input = document.createElement("input");
        input.tabIndex = -1;
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("excludes descendent inputs if they are disabled", () => {
        const input = document.createElement("input");
        input.disabled = true;
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("excludes descendent inputs if they are not displayed", () => {
        const input = document.createElement("input");
        input.style.display = "none";
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("excludes descendent inputs with 0 width and height", () => {
        const input = document.createElement("input");
        input.style.width = "0";
        input.style.height = "0";
        input.style.border = "0";
        input.style.padding = "0";
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("excludes descendents with hidden parents", () => {
        const input = document.createElement("input");
        elem.style.display = "none";
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("excludes inputs with parents that have zero width and height", () => {
        const input = document.createElement("input");
        elem.style.width = "0";
        elem.style.height = "0";
        elem.style.overflow = "hidden";
        elem.appendChild(input);
        tabbable(elem).should.not.containEql(input);
      });

      it("includes inputs visible because of overflow == visible", () => {
        const input = document.createElement("input");
        input.style.width = "0";
        input.style.height = "0";
        input.style.overflow = "visible";
        elem.appendChild(input);
        tabbable(elem).should.containEql(input);
      });

      it("excludes elements with overflow == visible if there is no visible content", () => {
        const button = document.createElement("button");
        button.innerHTML = "You can't see me!";
        button.style.display = "none";
        button.style.overflow = "visible";
        elem.appendChild(button);
        tabbable(elem).should.not.containEql(button);
      });

      it("excludes elements that contain reserved node names", () => {
        const button = document.createElement("button");
        button.innerHTML = "I am a good button";
        elem.appendChild(button);

        const badButton = document.createElement("bad-button");
        badButton.innerHTML = "I am a bad button";
        elem.appendChild(badButton);

        tabbable(elem).should.deepEqual([button]);
      });

      it("includes elements that contain reserved node names with tabindex", () => {
        const trickButton = document.createElement("trick-button");
        trickButton.innerHTML = "I am a good button";
        trickButton.tabIndex = '0';
        elem.appendChild(trickButton);

        tabbable(elem).should.deepEqual([trickButton]);
      });

      describe("inside Web Components with shadow dom", () => {
        let wc;
        let input;
        class TestWebComponent extends HTMLElement {
          constructor() {
            super();
          }

          connectedCallback() {
            this.attachShadow({
              mode: "open"
            });
            this.style.display = "block";
            this.style.width = "100px";
            this.style.height = "25px";
          }
        }

        const registerTestComponent = () => {
          if (window.customElements.get("test-web-component")) {
            return;
          }
          window.customElements.define("test-web-component", TestWebComponent);
        };

        beforeEach(() => {
          registerTestComponent();
          wc = document.createElement("test-web-component");

          input = document.createElement("input");
          elem.appendChild(input);

          document.body.appendChild(wc);
          wc.shadowRoot.appendChild(elem);
        });

        afterEach(() => {
          // re-add elem to body for the next afterEach
          document.body.appendChild(elem);

          // remove Web Component
          document.body.removeChild(wc);
        });

        it("includes elements when inside a Shadow DOM", () => {
          tabbable(elem).should.containEql(input);
        });

        it("excludes elements when hidden inside a Shadow DOM", () => {
          wc.style.display = "none";
          tabbable(elem).should.not.containEql(input);
        });
      });

      describe("inside Web Components with no shadow dom", () => {
        let wc;
        let button;
        class ButtonWebComponent extends HTMLElement {
          constructor() {
            super();
          }

          connectedCallback() {
            this.innerHTML = '<button>Normal button</button>';
            this.style.display = "block";
            this.style.width = "100px";
            this.style.height = "25px";
          }
        }

        const registerButtonComponent = () => {
          if (window.customElements.get("button-web-component")) {
            return;
          }
          window.customElements.define("button-web-component", ButtonWebComponent);
        };

        beforeEach(() => {
          registerButtonComponent();
          wc = document.createElement("button-web-component");

          elem.appendChild(wc);
        });

        afterEach(() => {
          // remove Web Component
          elem.removeChild(wc);
        });

        it("includes only focusable elements", () => {
          button = wc.querySelector('button');

          tabbable(elem).should.deepEqual([button]);
        });
      });
    });
  });
};
