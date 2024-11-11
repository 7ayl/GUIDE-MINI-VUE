import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender(options){

const { 
  createElement: hostCreateElement,
  patchProp: hostPatchProp,
  insert:hostInsert
} = options

function render(vnode, container) {
    // patch
    // 
    patch(vnode, container, null)
}

function patch(vnode, container, parentComponent){
  // ShapeFlags
  // vnode -> flag
  // element
  const { type, shapeFlag } = vnode 

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent)
        break;
    
      case Text:
        processText(vnode, container)
        break;
    
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          processElement(vnode, container, parentComponent)
          // STATEFYL_COMPONENT
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          processComponent(vnode, container, parentComponent)
        }
        break;
    }
}

function processText(vnode: any, container: any){
  const { children } = vnode
  const textNode = (vnode.el =document.createTextNode(children))
  container.append(textNode)
}

function processFragment(vnode: any, container: any, parentComponent){
  // Implement
  mountChildren(vnode, container, parentComponent)
}

function processElement(vnode: any, container: any, parentComponent) {
  // init -> update
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode: any, container: any, parentComponent) {
  // vnode -> element -> div
  const el = (vnode.el = hostCreateElement(vnode.type))
 
  // string array
  const { children, shapeFlag } = vnode

  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
    // array_children
    mountChildren(vnode, el, parentComponent)
  }
  //props
  const { props } = vnode
  for(const key in props){
    const val = props[key]
    hostPatchProp(el, key, val)
  }
  // container.append(el)
  hostInsert(el, container)
}

function mountChildren(vnode, container, parentComponent){
  vnode.children.forEach((v) => {
    patch(v, container, parentComponent)
  })
}

function processComponent(vnode: any, container: any, parentComponent) {
  mountComponent(vnode, container,parentComponent);
}

function mountComponent(initialVnode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVnode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}
function setupRenderEffect(instance: any, initialVnode, container) {
  const { proxy } = instance 
  const subTree = instance.render.call(proxy)
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container, instance)
  // element -> mount
  initialVnode.el = subTree.el
}
return {
  createApp:createAppAPI(render)
}
}
