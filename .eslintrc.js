module.exports = {
  "env": {
    "es6": true,
    "browser": true
  },
  "extends": "airbnb",
  "parserOptions": {
    "ecmaVersion": 7,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "parser": "babel-eslint",
  rules: {
    "comma-dangle": [2, "only-multiline"],
    "max-len": [1, {"code": 140}],
    "no-continue": [0],
    "no-plusplus": [0],
    "space-before-function-paren": [2, "always"],
    "import/no-extraneous-dependencies": [2, {"devDependencies": true}],
    "react/jsx-filename-extension": ["error", {"extensions": [".js"]}]
  },
};
