# Smart ComponentsとDumb Componentsについて

コンポーネントの再利用性を高める方法として、ReduxのContributorであるDan Abramovが[提唱](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.9jnqrkmey)するSmart / Dumbというコンポーネントの分割手法がある。

Reduxの[examples](https://github.com/rackt/redux/tree/master/examples)では、containersとcomponentsとしてSmart/Dumb Componentが分かれている。


## Smart Components

Smart ComponentsはStoreへのアクセスやActionの発行、Dumb Componentsへのデータ・メソッドの受け渡しを行い、1つ以上のSmart/Dumb Componentを内包する。Smart Components自体はスタイルを持たない。

- 1つ以上のSmart/Dumb Componentを内包する
- StoreからStateを取得し、子コンポーネントへ渡す
- Actionを呼び出して、子コンポーネントへ渡す
- 自身のスタイル（CSSなど）は持たない

### Smart Componentの例

[rackt/redux: examples/counter/containers/App.js](https://github.com/rackt/redux/blob/master/examples/counter/containers/App.js)

connectでstateとactionを該当の（Counter）コンポーネントへ渡している。コンポーネント側は、渡されたデータをpropsとして受け取れる。

```js
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter'
import * as CounterActions from '../actions/counter'

function mapStateToProps(state) {
  return {
    counter: state.counter
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(CounterActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Counter)
```


## Dumb Components

Dumb ComponentsはStoreへのアクセスやActionの発行はせず、propsで渡ってきたデータと関数を使うようにすることで、再利用可能なコンポーネントになるよう設計したもの。スタイルは全てDumb Componentが管理する。

- アプリケーション内の他の部分に依存しない（ActionやStoreへ直接アクセスしない）
- 多くの場合、子要素を内包できるかたちで定義される（this.props.children）
- propsでデータと関数を受け取る
- 自身のスタイルを持つ
- 自身で完結する場合はStateを持っても良い
- 他のDumb Componentを内包する場合がある

### Dumb Componentの例

[rackt/redux: examples/counter/components/Counter.js](https://github.com/rackt/redux/blob/master/examples/counter/components/Counter.js)

処理や値は全てpropsとして親（Smart Component）から受け取るようになっているのがわかる。

```js
import React, { Component, PropTypes } from 'react'

class Counter extends Component {
  render() {
    const { increment, incrementIfOdd, incrementAsync, decrement, counter } = this.props
    return (
      <p>
        Clicked: {counter} times
        {' '}
        <button onClick={increment}>+</button>
        {' '}
        <button onClick={decrement}>-</button>
        {' '}
        <button onClick={incrementIfOdd}>Increment if odd</button>
        {' '}
        <button onClick={() => incrementAsync()}>Increment async</button>
      </p>
    )
  }
}

Counter.propTypes = {
  increment: PropTypes.func.isRequired,
  incrementIfOdd: PropTypes.func.isRequired,
  incrementAsync: PropTypes.func.isRequired,
  decrement: PropTypes.func.isRequired,
  counter: PropTypes.number.isRequired
}

export default Counter
```


## 階層関係

Smart ComponentとDumb Componentの階層関係を示す。

- Smart Componentは、Smart/Dumb両コンポーネントを内包できる
- Dumb Componentは、Dumb Componentのみ内包できる

許可 | パターン
:---:|---
○ | Smart > Smart > Dumb
○ | Smart > Dumb > Dumb
× | Smart > Dumb > Smart > Dumb
○ | Dumb > Dumb
× | Dumb > Smart

## Ref.

[Smart and Dumb Components](https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0#.9jnqrkmey)
