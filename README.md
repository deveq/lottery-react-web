# crypto library 설치 시 추가로 해야할 설정

1. NodePolyfillPlugin과 react-app-rewired를 설치한다.
```
$ npm install react-app-rewired node-polyfill-webpack-plugin 
// 혹은
$ yarn add react-app-rewired node-polyfill-webpack-plugin
```

2. package.json의 script > start를 변경한다
- "start": "react-scripts start"
+ "start": "react-app-rewired start"

3. config-overrides.js 파일 추가 후 아래 내용을 추가한다.
```js
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
module.exports = function override(config, _env) {
  config.plugins.push(
    new NodePolyfillPlugin({
      excludeAliases: ["console"],
    })
  );
  return config;
};
```

4. 그리고 npm start 혹은 yarn start