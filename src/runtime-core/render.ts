import { effect } from "../reactivity/effect";
import { EMPTY_OBJ } from "../shared";
import { ShapeFlags } from "../shared/ShapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from "./createApp";
import { Fragment, Text } from "./vnode";

export function createRender(options){

const { 
  createElement: hostCreateElement,
  patchProp: hostPatchProp,
  insert: hostInsert,
  remove: hostRemove,
  setElementText: hostSetElementText,
} = options

function render(vnode, container) {
    // patch
    // 
    patch(null, vnode, container, null)
}

// n1 -> 老的
// n2 -> 新的
function patch(n1, n2, container, parentComponent){
  // ShapeFlags
  // vnode -> flag
  // element
  const { type, shapeFlag } = n2 

    // Fragment -> 只渲染 children
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
    
      case Text:
        processText(n1, n2, container)
        break;
    
      default:
        if(shapeFlag & ShapeFlags.ELEMENT){
          processElement(n1, n2, container, parentComponent)
          // STATEFYL_COMPONENT
        } else if(shapeFlag & ShapeFlags.STATEFUL_COMPONENT){
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
}

function processText(n1, n2: any, container: any){
  const { children } = n2
  const textNode = (n2.el = document.createTextNode(children))
  container.append(textNode)
}

function processFragment(n1, n2: any, container: any, parentComponent){
  // Implement
  mountChildren(n2.children, container, parentComponent)
}
 
function processElement(n1, n2: any, container: any, parentComponent) {
  // init -> update
  if(!n1){
    mountElement(n2, container, parentComponent)
  } else {
    patchElement(n1, n2, container, parentComponent )
  }
}

function patchElement(n1, n2, container, parentComponent){
  console.log("patchElement");
  console.log("n1", n1);
  console.log("n2", n2);

  const oldProps = n1.props || EMPTY_OBJ
  const newProps = n2.props || EMPTY_OBJ

  const el = (n2.el = n1.el)

  patchChildren(n1, n2, el, parentComponent)
  patchProps(el, oldProps, newProps)
  // props
  // children
}

function patchChildren(n1, n2, container, parentComponent){
  const prevShapeFlag = n1.shapeFlag
  const c1 = n1.children
  const { shapeFlag } = n2
  const c2 = n2.children
  if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
    if(prevShapeFlag & ShapeFlags.ARRAY_CHILDREN){
      // 1. 把老的 children 清空
      unmountChildren(n1.children)
    }
    // 2. 设置 text
    if(c1 !== c2){
      hostSetElementText(container, c2)
    }
  } else {
    if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
      hostSetElementText(container, "")
      mountChildren(c2, container, parentComponent)
    }
  }
}


function unmountChildren(children){
  for (let i = 0; i < children.length; i++) {
    const el = children[i].el;
    // remove
    hostRemove(el)
  }
}

function patchProps(el, oldProps, newProps){
  if(oldProps !== newProps){
    for (const key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]
  
      if(prevProp !== nextProp){
        hostPatchProp(el, key, prevProp, nextProp)
      }
    }

    if(oldProps !== EMPTY_OBJ){
      for(const key in oldProps){
        if(!(key in newProps)){
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }

  }
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
    mountChildren(vnode.children, el, parentComponent)
  }
  //props
  const { props } = vnode
  for(const key in props){
    const val = props[key]
    hostPatchProp(el, key, null, val)
  }
  // container.append(el)
  hostInsert(el, container)
}

function mountChildren(children, container, parentComponent){
  children.forEach((v) => {
    patch(null, v, container, parentComponent)
  })
}

function processComponent(n1, n2: any, container: any, parentComponent) {
  mountComponent(n2, container,parentComponent);
}

function mountComponent(initialVnode: any, container, parentComponent) {
  const instance = createComponentInstance(initialVnode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, initialVnode, container)
}

function setupRenderEffect(instance: any, initialVnode, container) {
  effect(() => {
    if(!instance.isMounted){
      console.log("init");
      
      const { proxy } = instance 
      const subTree = (instance.subTree = instance.render.call(proxy))
 
      patch(null, subTree, container, instance)

      initialVnode.el = subTree.el

      instance.isMounted = true
    } else { 
      console.log("update");
      const { proxy } = instance 
      const subTree = instance.render.call(proxy)
      const prevSubTree = instance.subTree

      instance.subTree = subTree

      // console.log("current", subTree);
      // console.log("prev", prevSubTree);
      
      patch(prevSubTree, subTree, container, instance)
      
    }
  })
}
return {
  createApp:createAppAPI(render)
}
}
