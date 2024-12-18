import { hasOwn } from "../shared"

const pubicPropertiesMap = {
  $el: (i) => i.vnode.el,
  // $slots
  $slots: (i) => i.slots,
  $props: (i) => i.props,
}

export const PublicInstanceProxyHandlers = {
    get({_:instance}, key){
        // setupState
        const { setupState, props } = instance
        if(key in setupState){
          return setupState[key]
        }
        if(hasOwn(setupState, key)){
          return setupState[key]
        } else if(hasOwn(props, key)){
          return props[key]
        }
  
        const publicGetter = pubicPropertiesMap[key]
        if(publicGetter){
          return publicGetter(instance)
        }

        // setup -> options data
        // $data
      }
}