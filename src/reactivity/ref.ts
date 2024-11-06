import { hasChanged, isObject } from "../shared"
import { isTracking, trackEffects, triggerEffects } from "./effect"
import { reactive } from "./reactive"

class RefImpl{
  private _value: any
  private _rawVal: any
  public __v_isRef = true
  public dep;
  constructor(value){
    this._rawVal = value
    this._value = convert(value)
    // value -> reactive
    // 1.看看 value 是不是 对象
    this.dep = new Set()
  }
  // 定义了一个名为value的 getter 方法
  get value(){
    trackRefVal(this)
    return this._value
  }
  set value(newVal){
    // 一定先去修改了val的值
    // newVal -> this._value
    // 对比的时候 object
    if(hasChanged(newVal, this._rawVal)) {
      this._rawVal = newVal
      this._value = convert(newVal)
      triggerEffects(this.dep)
    }
  }
}

function convert (value) {
  return isObject(value)? reactive(value) : value
}

function trackRefVal(ref){
  if(isTracking()){
    trackEffects(ref.dep)
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref.__v_isRef
}

export function unRef(ref) {
  // 看看是不是 ref对象 -> ref.value
  return isRef(ref)? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  // 看看是不是 ref对象 -> ref.value
  return new Proxy(objectWithRefs, {
    get(target, key){
      // get -> age (ref) 那么就给他返回 .value
      // not ref -> value
      return unRef(Reflect.get(target, key))
    },
    set(target, key, value){
      // set -> ref .value
      if(isRef(target[key]) && !isRef(value)){
        return target[key].value = value
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}