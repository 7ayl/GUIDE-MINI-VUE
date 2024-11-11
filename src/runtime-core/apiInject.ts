import { getCurrentInstance } from "./component";

export function provide(key, value) {
  // 存
  const currentInstance: any = getCurrentInstance()
  if(currentInstance){
    let { providers } = currentInstance
    const parentProviders = currentInstance.parent.providers

    // init
    if(providers === parentProviders){
      providers = currentInstance.providers = Object.create(parentProviders)
    }
    providers[key] = value
  }
}

export function inject(key, defaultVal){
  // 取
  const currentInstance: any = getCurrentInstance()
  if(currentInstance){
    const parentProviders = currentInstance.parent.providers

    if(key in parentProviders){
      return parentProviders[key]
    } else if(defaultVal){
      if(typeof defaultVal === "function"){
        return defaultVal()
      }
      return defaultVal
    }
  }
}
