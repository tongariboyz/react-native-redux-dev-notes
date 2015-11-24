# スタイルについて

React Nativeはウェブ（React）と同じ記述方法でスマホアプリを開発できる。ReactがDOMを[JSX](http://facebook.github.io/jsx/)で記述するように、React Nativeも定義されたコンポーネントをJSXで記述することで構造体の定義が可能だ。そのため、ウェブの技術であるCSSと対応したStyleSheetという装飾を管理する仕組みも存在する。React Nativeのスタイルについては[Learning React Native](https://www.safaribooksonline.com/library/view/learning-react-native/9781491929049/ch04.html)で詳しく解説されている。

CSSとStyleSheetにはいくつかの違いが存在するが、最も大きな違いは、CSSがグローバルに定義されるものであるのに対してStyleSheetはコンポーネントに閉じた状態で定義できる点だ。これにより、破壊的なコードを生み出すリスクが低減されるため、BEMなどの命名規則を厳密に定義する必要性が低下する。ただし、コンポーネント内での可読性やプロジェクト内での統一性など複雑な問題があるため、命名規則を全く考慮しなくて良いわけではない。

## プロジェクトにおけるスタイルの管理について

React NativeのStyleSheetではコンポーネントに閉じた状態でスタイルを定義できると書いたが、プロジェクト内で統一したスタイルを提供するためには、何かしらの仕組みを整える必要がある。基本的な規則と構成を本項で紹介する。

### 規則

基本的な規則を以下に示す。

- lowerCamelCaseで記述
- 共通スタイル（baseStyles.js）を定義
- 定数（constants.js）の上書きは禁止
- Dumb Componentと対になるようスタイルファイルを作成


### プロジェクト内スタイルのディレクトリ構成

基本的なプロジェクト内ディレクトリ構成を以下に示す。

```
styles ____ baseStyles.js   // 基本スタイルを定義
       |___ constants.js   // カラー等の定数を定義
       |___ components     // Dumb Componentに対応したスタイルを定義
            |____ header.js
            |____ footer.js
            |____ ...
```


### 共通スタイル定義

共通スタイルの定義と各コンポーネント用スタイル内での利用例を以下に示す。

**共通スタイルを定義**
```js
// styles/baseStyles.js
const baseStyles = {
  color: {
    gray100: '#eee',
    gray200: '#ccc'
  },
  typo: {
    fontSize: 16,
    color: '#000'
  }
};
export default baseStyles;
```

**共通スタイルをimportしてheader componentのスタイル定義に利用する**
```js
// styles/components/header.js
import baseStyles from '../baseStyles';

const styles = {
  title: baseStyles.typo,
  view: {
    backgroundColor: baseStyles.color.gray100
  }
};
export default styles;
```

### 共通スタイルを拡張する

先の例でもわかるように、StyleSheetはjsのObjectである。すなわち、共通スタイルを拡張して別のスタイルを作り出すためには、Objectを拡張すれば良い。

```js
// styles/components/header.js
import baseStyles from '../baseStyles';

const styles = {
  title: Object.assign(
    {},
    baseStyles.typo,
    {color: '#999'}
  ),
  view: {
    backgroundColor: baseStyles.color.gray100
  }
};
export default styles;
```

拡張が必要となるたびにObject.assignを記述するのは冗長なため、[node-extend](https://github.com/justmoon/node-extend)を利用しても良い。

### コンポーネント内でスタイルを拡張する

先の例では拡張したスタイルを外部ファイルに定義していたが、コンポーネント内でもスタイルを拡張することは可能である。これは、CSSのインラインスタイルに似ている。基本的には使用することはないが、次の項に示すような「条件に応じてスタイルを変更」する場合には使用することになる。

```js
// components/Header.js

import React, {Component} from 'react-native';
import styles from '../styles/components/header';

const {Text, View} = React;

export default class Header extends Component {
  render() {
    return (
      <View styles={styles.view}>
        <Text styles={[styles.title, {fontSize: 20}]}>TITLE</Text>
      </View>
    );
  }
}
```

### 条件に応じてスタイルを変更する

コンポーネントの状態に応じてスタイルを変更したい場合は必ず発生する。その場合、条件に応じてスタイルを上書きするために、インラインスタイルを利用することになる。以下に例を示す。

```js
// components/Header.js

import React, {Component, PropTypes} from 'react-native';
import styles from '../styles/components/header';

const {Text, View} = React;

export default class Header extends Component {
  static propTypes = {
    isActive: PropTypes.bool.isRequired
  }

  render() {
    return (
      <View styles={styles.view}>
        <Text styles={[styles.title, this.props.isActive && styles.titleIsActive]}>TITLE</Text>
      </View>
    );
  }
}
```

### デバイス情報を利用したい場合

React Nativeでは、DimensionsやPixelRatioなどを利用してデバイス情報を取得できる。
例えば以下のような記述でデバイスのサイズが取得できる。

```js
const {height, width} = Dimensions.get('window');
```

StyleSheetを定義したjsファイルはReact Nativeのコンポーネント内で利用されることを前提としているので、これらのユーティリティライブラリは直接importしてしまおう。

```js
// styles/components/header.js
import Dimensions from 'Dimensions';
import baseStyles from '../baseStyles';

const {width} = Dimensions.get('window');

const styles = {
  title: extend(baseStyles.typo, {color: '#999'}),
  view: {
    backgroundColor: baseStyles.color.gray100,
    width
  }
};
export default styles;
```

## StyleSheet.createについて

React NativeにはStyleSheet.createという関数が用意されている。オプションであるため、オブジェクトをstylesに渡すだけでスタイルは反映されるが、運営はStyleSheet.createの利用を推奨している模様。[Learning React Native](https://www.safaribooksonline.com/library/view/learning-react-native/9781491929049/ch04.html)には以下のような利点があると書かれている。

> It ensures that the values are immutable and opaque by transforming them into plain numbers that reference an internal table.

（いまいちよくわかっていないので、詳しい情報をお待ちしています）
