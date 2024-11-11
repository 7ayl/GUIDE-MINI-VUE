import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'

export const App = {
  render(){
    return h("div", {}, [h("div", {}, "hi," + this.msg), h(Foo, {count: 1},)])
  },
  setup(){
    return {
      msg:"mini-vue-haha"
    }
  }
}
