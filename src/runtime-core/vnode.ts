import { ShapeFlags } from "../shared/ShapeFlags"; 

export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")

export { createVnode as createElementVnode }

export function createVnode (type, props?, children?) {
  const vnode ={
    type,
    props,
    children,
    component: null,
    key: props && props.key,
    shapeFlag: getShapeFlag(type),
    el:null
  }

  // children
  if(typeof children === "string"){
    // vnode.ShapeFlag = vnode.ShapeFlag | ShapeFlags.TEXT_CHILDREN
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  } else if(Array.isArray(children)){
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  }

  // 组件 + children object
  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
    if(typeof children === "object"){
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }

  return vnode;
}

export function createTextVnode (text: string){
  return createVnode(Text, {}, text);
}

function getShapeFlag(type){
  return typeof type === "string" 
  ? ShapeFlags.ELEMENT 
  : ShapeFlags.STATEFUL_COMPONENT
}

