import { createVnode } from "./vnode"
import { render } from "./render"

export function createApp(rootComponent){
  return {
    mount(rootContainer){
      // 先 vnode
      // component -> vnode
      // 所有的逻辑操作 都会基于 vnode 做处理
      const vnode = createVnode(rootComponent)

      render(vnode, rootContainer)
    }
  }
}
