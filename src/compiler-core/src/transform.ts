import { NodeTypes } from "./ast";

export function transform(root, options){
  const context = createTransformContext(root, options)
  // 遍历 - 深度优先搜索
  traverseNode(root,context)
  // 修改 text content
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms || []
  }
  return context
}

function traverseNode(node: any,context) {
  const nodeTransforms = context.nodeTransforms
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    transform(node)
  }
  console.log(node);

  traverseChildren(node, context)
  
}

function traverseChildren(node: any, context: any) {
  const children = node.children
  if(children){
    for (let i = 0; i < children.length; i++) {
        const node = children[i];
  
        traverseNode(node, context)
        
    }
  }
}

