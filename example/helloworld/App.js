import { h, getCurrentInstance } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
export const App = {
  // 必须要写 render,
  name:"App",
  render(){
    return h(
      "div",
      {},
      [h("p", {}, "currentInstance demo", h(Foo))]
    )
  },
  setup() {
    const instance = getCurrentInstance();
    console.log("App:", instance);
  }
}