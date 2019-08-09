<template>
  <div class="home">
    <img class="logo"
         src="../assets/logo.png">
    <div class="tips">正确密码为：123456</div>
    <button @click="handlePay">显示支付弹窗</button>
    <pay-layer ref="payLayer"
               v-model="layerVisibility"
               @inputEnd="handleInputEnd"
               @close="handleClose"
               @forgetPassword="handleForget" />
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      layerVisibility: false,
      password: "123456"
    };
  },
  methods: {
    handlePay() {
      this.layerVisibility = true;
    },
    /**密码输入结束 */
    handleInputEnd(result) {
      let payLayer = this.$refs.payLayer;
      let timer = setTimeout(() => {
        if (result === this.password) {
          payLayer.success().then(() => {});
        } else {
          payLayer.fail();
        }
        clearTimeout(timer);
      }, 1500);
    },
    handleForget() {
      alert("点击了忘记密码");
    },
    handleClose() {
      console.log("关闭回调");
    }
  }
};
</script>

<style lang="less" scoped>
.logo {
  display: block;
  margin: auto;
}
.tips {
  padding: 24px;
  text-align: center;
  color: #666;
}
button {
  width: 200px;
  height: 40px;
  background-color: #23a1ef;
  color: #fff;
  font-size: 16px;
  display: block;
  margin: auto;
  outline: none;
  border: none;
  border-radius: 4px;
}
</style>

