import PayLayer from "./PayLayer.vue";
const payLayerPlugin = {
  install(Vue, options) {
    Vue.component("pay-layer", PayLayer);
  }
};

export default payLayerPlugin;
