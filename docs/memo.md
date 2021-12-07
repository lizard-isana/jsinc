# JSInc

# Memo

ビルドツールをどうする？ → Rollupを使ってみよう


タスクランナーをどうする？ → gulp or npm script

% npm init


Rollupを入れる
```
% npm install --save-dev rollup

```
browser-syncを入れる
```
% npm install browser-sync --save-dev
```

Dart Sassを入れる
```
% npm install sass
```

```
"scripts": {
  "sass": "sass src/scss/:dist/css/ --no-source-map --watch"
},
```