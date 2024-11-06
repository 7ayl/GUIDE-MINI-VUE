import { h } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  // 必须要写 render,
  name:"App",
  render(){
    const app = h("div", {}, "App")
    const foo = h(Foo)
    // ui
    return h(
      "div",
      {},
      [app, foo]
      // this.$el -> get root element
      // "hi," + this.msg
      // [h("p", {class: "red"}, "hi"), h("p", {class:"blue"}, "mini-vue")]
    )
  },
  setup() {
    return {
      msg: "mini-vue-haha",
    }
  }
}