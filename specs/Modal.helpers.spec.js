/* eslint-env mocha */
import "should";
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
        elem.style.width = "0";
        elem.style.height = "0";
        elem.style.overflow = "visible";
        elem.appendChild(input);
        tabbable(elem).should.containEql(input);
      });
    });
  });
};
