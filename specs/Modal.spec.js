require('./helper');
var Modal = require('../lib/components/Modal');

describe('Modal', function () {
  it('throws without an appElement');
  it('uses the global appElement');
  it('accepts appElement as a prop');
  it('opens');
  it('closes');
  it('renders into the body, not in context');
  it('renders children');
  it('has default props');
  it('removes the portal node');
  it('scopes tab navigation to the modal');
  it('ignores clicks outside of it');
  it('focuses the modal');
  it('focuses the last focused element when tabbing in from browser chrome');
  it('adds --after-open for animations');
  it('adds --before-close for animations');
});

