import { createVnode, Fragment } from "../vnode";

export function renderSlots(slots, name, props){
  const slot = slots[name]
  if (slot) {
    // function
    if(typeof slot === "function"){
      // children 是不可以有 array
      // 只需要把children
      return createVnode(Fragment, {}, slot(props))
    }
  }
}