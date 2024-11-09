import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { Fragment, Text } from "./vnode";

export function render(vnode, container) {
    // patch
    // 
    patch(vnode, container)
}

function patch(vnode, container){
  // ShapeFlags
  // vnode -> flag
  // element
  const { type, shapeFlag } = vnode

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(vnode, container)
        break;
    
      case Text:
        processText(vnode, container)
        break;
    
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          processElement(vnode, container)
          // STATEFYL_COMPONENT
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          processComponent(vnode, container)
        }
        break;
    }
}

function processText(vnode: any, container: any){
  const { children } = vnode
  const textNode = (vnode.el =document.createTextNode(children))
  container.append(textNode)
}

function processFragment(vnode: any, container: any){
  // Implement
  mountChildren(vnode, container)
}

function processElement(vnode: any, container: any) {
  // init -> update
  mountElement(vnode, container)
}

function mountElement(vnode: any, container: any) {
  // vnode -> element -> div
  const el = (vnode.el = document.createElement(vnode.type))
 
  // string array
  const { children, shapeFlag } = vnode

  if(shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // text_children
    el.textContent = children;
  } else if(shapeFlag & ShapeFlags.ARRAY_CHILDREN){
    // array_children
    mountChildren(vnode, el)
  }
  //props
  const { props } = vnode
  for(const key in props){
    const val = props[key]
    console.log(key);
    // 具体的click -> 通用
    // on + Event name
    // onMousedown
    const isOn = (key:string) => /^on[A-Z]/.test(key)
    if(isOn(key)){
      const event = key.slice(2).toLowerCase()
      el.addEventListener(event,val)
    } else {
      el.setAttribute(key, val)
    }
  }
  container.append(el)
}

function  mountChildren(vnode, container){
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}
// function mountChildren(vnode, container) {
//   vnode.children
//       .filter(child => child) // 过滤掉 undefined 元素
//       .forEach((v) => {
//           patch(v, container);
//       });
// }

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container);
}

function mountComponent(initialVnode: any, container) {
  const instance = createComponentInstance(initialVnode)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}
function setupRenderEffect(instance: any, vnode, container) {
  const { proxy } = instance 
  const subTree = instance.render.call(proxy)
  // vnode -> patch
  // vnode -> element -> mountElement
  patch(subTree, container)
  // element -> mount
  vnode.el = subTree.el
}

