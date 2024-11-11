import { createVnode } from "./vnode"

// render
export function createAppAPI(render){
  return function createApp(rootComponent){
    return {
      mount(rootContainer){
        const vnode = createVnode(rootComponent)
  
        render(vnode, rootContainer)
      }
    }
  }
  
}

