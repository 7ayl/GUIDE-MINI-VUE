import { h, ref, getCurrentInstance } from "../../lib/guide-mini-vue.esm.js";

export default {
  name: "App",
  setup() {
    const count = ref(1)
    const instance =getCurrentInstance()

    function onClick(){
      for (let i = 0; i < 100; i++) {
        console.log("update");
        count.value = i
      }
      console.log(instance);
      nextTick(() => {
        console.log(instance);
      })

      // await nextTick()
    }

    return {
      onClick,
      count
    }
  },

  render() {
    // return h("div", { tId: 1 }, [h("p", {}, "主页"), h(NextTicker)]);
    const button = h("button", { onClick: this.onClick }, "update");
    const p = h("p", {}, "count:" + this.count);

    return h("div", {}, [button, p])
  },
};
