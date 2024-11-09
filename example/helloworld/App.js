import { h, createTextVnode } from '../../lib/guide-mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null
export const App = {
  // 必须要写 render,
  name:"App",
  render(){
    const app = h("div", {}, "App")
    // object key
    const foo = h(
      Foo,
      {}, 
      {
        header: ({ age }) => [
          h("p", {}, "header" + age), 
          createTextVnode("你好呀")
        ],
        footer: () => h("p", {}, "footer")
      }
    );
    // 数组 vnode
    // const foo = h(Foo, {}, h("p", {}, "123")) 
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
    return {}
  }
}