module.exports = function() {
  injectStyle([
    '.ReactModal__Overlay {',
    '  background-color: rgba(255, 255, 255, 0.75);',
    '}',
    '.ReactModal__Content {',
    '  position: absolute;',
    '  top: 40px;',
    '  left: 40px;',
    '  right: 40px;',
    '  bottom: 40px;',
    '  border: 1px solid #ccc;',
    '  background: #fff;',
    '  overflow: auto;',
    '  -webkit-overflow-scrolling: touch;',
    '  border-radius: 4px;',
    '  outline: none;',
    '  padding: 20px;',
    '}',
    '@media (max-width: 768px) {',
    '  .ReactModal__Content {',
    '    top: 10px;',
    '    left: 10px;',
    '    right: 10px;',
    '    bottom: 10px;',
    '    padding: 10px;',
    '  }',
    '}'
  ].join('\n'));
};

function injectStyle(css) {
  var style = document.getElementById('rackt-style');
  if (!style) {
    style = document.createElement('style');
    style.setAttribute('id', 'rackt-style');
    style.setAttribute("type", "text/css");
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
    document.body.appendChild(style);
  } else {
    style.innerHTML = css;
    document.head.appendChild(style);
  }
}

