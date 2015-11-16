# Flow

## 基本方針

- 原則全てのファイルにflowの型アノテーションを定義する
- 共通で使用する型は別途型定義ファイルを用意し、そこからimportして使用する
  - 例：Action等
- アノテーション記法にはコメント形式を使用しない
  - コメント形式は一部うまく動かない（要検証）
- 外部ライブラリについても極力定義する
  - 定義しないと使用箇所の型チェックが無効になってしまう
- 外部ライブラリを新規追加した場合はそいつをignore設定に追加する
  - 遅くなるような気がしているが未検証（要検証）
  - dependenciesはともかくdevDependenciesはガチで不要なので遅くなるならignoreすべき
- Flowがビルトインで対応しているReact内APIの型はESLintのglobalsに定義する
  - どこにも定義がないのでESLintのundefに抵触してしまう


## Flowとは

[Flow | Flow | A static type checker for JavaScript](http://flowtype.org/)


## 書き方

ファイルの先頭に `/* @flow */` を記述するとそのファイルは型チェックの対象となる。

- TODO: 基本的な記述方法
- TODO: ジェネリクス

迷ったり特殊な書き方が必要になったら以下のリンクを参考にするとよい。

- [Advanced features in Flow - sitr.us](http://sitr.us/2015/05/31/advanced-features-in-flow.html)
- [Type checking React with Flow v0.11 - sitr.us](http://sitr.us/2015/05/31/type-checking-react-with-flow.html)
- [splodingsocks/FlowTyped](https://github.com/splodingsocks/FlowTyped)
- [flow/react.js at master · facebook/flow](https://github.com/facebook/flow/blob/master/lib/react.js)


## Tips

### flow-bin

- `react-native init` で生成した .flowconfigにはflowのバージョンが指定されている
- brew installでもflowをインストールすることはできるが複数プロジェクトを扱うときにバージョンが異なると困る
  - `supress_command` オプションでflowのバージョン毎に無視するエラーを指定しているように見える
  - .flowconfigのバージョン指定を外してしまってもよいが、そのまま残して最新版に追従していくほうが幸せになれるはず
- [flow-bin](https://www.npmjs.com/package/flow-bin)をインストールすれば `node_modules/.bin/` に任意のバージョンのflowコマンドを追加できる
- 本家のアップデートに即日追従してるっぽいので問題なさそう

### ファイル変更時実行

- flowにはmochaやbabelなどにある `--watch` オプションのようなものがついていない
- chokidar-cliを使ってファイル変更をフックにflowを実行するようにすれば代替できる

例として以下のようにnpmスクリプトで実行できるようにしている。

- `npm run watch:flow`: flowサーバの起動、ファイル変更時にflow実行
- `npm run stop-flow`: flowサーバの停止
  - globalのflowを使用できないので停止用のコマンドを定義しておかないと不便

該当部分の`package.json`は以下。


```json
"scripts"{
  "stop-flow": "flow stop",
  "watch:flow": "flow & chokidar src -c flow"
}
```

参考：[koshian/package.json at master · tongariboyz/koshian](https://github.com/tongariboyz/koshian/blob/master/package.json)


## 未解決

- React.Component使用時にpropTypesのチェックをしてくれない（要検証）
  - 本家ReactについてはES6クラス方式もReact.createClassも両方ちゃんとチェックしてくれる
  - React NativeはReact.createClassはちゃんとチェックしてくれるがES6クラス方式は無視される
- export defaultに関数を指定しているライブラリの型を指定できない（要検証）
  - moduleまわりの型定義が怪しい（要検証）
- コメント式アノテーションが不完全（要検証）


## 参考

- [Flowtype Introduction](http://www.slideshare.net/teppeis/flowtype-introduction)
- [Our wish to Flowtype](http://www.slideshare.net/teppeis/our-wish-to-flowtype)
- [最近のFlowtype事情とReact+Flowtype連携](https://gist.github.com/teppeis/a48558a71a98d6bee6c9)
- [Writing Better JavaScript with Flow](http://www.sitepoint.com/writing-better-javascript-with-flow/)
