<template>
  <transition name="fade"
              @after-leave="afterLeave">
    <div class="safe-keyboard-layer"
         v-if="showLayer"
         @touchmove.prevent=";">
      <div class="inner"
           @click.stop=";">
        <div class="title both-center">{{title}}</div>
        <div class="layer-close-btn both-center"
             flex-center
             @click.stop="handleClose">
          <img class="img-close"
               :src="imgClose">
        </div>
        <ul class="password-ul">
          <li class="password-li both-center"
              v-for="(item, index) in passwordLength"
              :key="index">
            <span v-show="password.length > index">
              <img class="img-point"
                   :src="imgPoint">
            </span>
          </li>
        </ul>
        <div class="both-center forget-btn-row"><span class="forget-btn"
                @click="forgetClickEvent">忘记密码？</span></div>
        <div class="keyboard-box">
          <ul class="key-ul">
            <li class="key-li both-center"
                @click="keyClickEvent(1)">1</li>
            <li class="key-li both-center"
                @click="keyClickEvent(2)">2</li>
            <li class="key-li both-center"
                @click="keyClickEvent(3)">3</li>
          </ul>
          <ul class="key-ul">
            <li class="key-li both-center"
                @click="keyClickEvent(4)">4</li>
            <li class="key-li both-center"
                @click="keyClickEvent(5)">5</li>
            <li class="key-li both-center"
                @click="keyClickEvent(6)">6</li>
          </ul>
          <ul class="key-ul">
            <li class="key-li both-center"
                @click="keyClickEvent(7)">7</li>
            <li class="key-li both-center"
                @click="keyClickEvent(8)">8</li>
            <li class="key-li both-center"
                @click="keyClickEvent(9)">9</li>
          </ul>
          <ul class="key-ul">
            <li class="key-li both-center gray"></li>
            <li class="key-li both-center"
                @click="keyClickEvent(0)">0</li>
            <li class="key-li both-center gray"
                @click="backspaceClickEvent">
              <img class="icon-backspace"
                   :src="imgBackspace">
            </li>
          </ul>
        </div>

        <!--加载中状态-->
        <div class="loading-wrap"
             v-if="payStatus">
          <div class="loading">
            <!--加载图标-->
            <div class="loading-icon"
                 v-if="payStatus === 'PAYING'">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <img class="success-icon"
                 v-if="payStatus === 'SUCCESS'"
                 :src="imgSuccess">
            <!--加载文字-->
            <p v-if="payStatus === 'PAYING'">{{loadingText}}</p>
            <p v-if="payStatus === 'SUCCESS'">{{successText}}</p>
          </div>
        </div>

        <!--支付失败提示框-->
        <div class="pay-fail"
             v-if="failDialogVisibility">
          <div class="pay-fail-lay">
            <h3 class="fail-title">{{failTip}}</h3>
            <div class="btns">
              <div @click="resetInput">重新输入</div>
              <div @click="forgetClickEvent">忘记密码</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import imgPoint from "./img/point.png";
import imgSuccess from "./img/success.png";
import imgClose from "./img/close.png";
import imgBackspace from "./img/backspace.png";
export default {
  name: "PayLayerComponent",
  props: {
    // 组件的显示/隐藏
    showLayer: {
      type: Boolean,
      require: true,
      default: false
    },
    // 密码位数
    passwordLength: {
      type: Number,
      default: 6
    },
    // 弹窗标题
    title: {
      type: String,
      default: "请输入支付密码"
    },
    // 正在支付文字提示
    loadingText: {
      type: String,
      default: "正在支付..."
    },
    // 支付成功文字提示
    successText: {
      type: String,
      default: "支付成功"
    },
    // 支付成功显示时间
    successDuration: {
      type: Number,
      default: 2000
    }
  },
  model: {
    prop: "showLayer",
    event: "visibilityChange"
  },
  data() {
    return {
      password: "",
      payStatus: "", // PAYING 正在支付， SUCCESS 支付成功
      failTip: "支付密码错误",
      failDialogVisibility: false,
      imgPoint,
      imgSuccess,
      imgClose,
      imgBackspace
    };
  },
  methods: {
    handleClose() {
      this.resetComponent();
      this.$emit("close");
    },
    afterLeave() {
      this.password = "";
    },
    /**重置组件 */
    resetComponent() {
      if (this.payStatus === "PAYING") return;
      this.payStatus = "";
      this.password = "";
      this.$emit("visibilityChange", false);
    },
    /**点击键盘 */
    keyClickEvent(key) {
      if (this.password.length >= this.passwordLength) {
        return;
      }
      this.password = `${this.password}${key}`;
      if (this.password.length === this.passwordLength) {
        this.payStatus = "PAYING";
        this.$emit("inputEnd", this.password);
      }
    },
    /**点击回删 */
    backspaceClickEvent() {
      if (this.password.length === 0) {
        return;
      }
      this.password = this.password.slice(0, this.password.length - 1);
    },
    /**忘记密码 */
    forgetClickEvent() {
      this.$emit("forgetPassword");
    },
    /**支付成功方法 */
    success() {
      return new Promise(resolve => {
        this.payStatus = "SUCCESS";
        let timer = setTimeout(() => {
          this.resetComponent();
          resolve();
          clearTimeout(timer);
        }, this.successDuration);
      });
    },
    /**支付失败方法 */
    fail(tip) {
      tip && typeof tip === "string" && (this.failTip = tip);
      this.payStatus = "";
      this.failDialogVisibility = true;
    },
    /**重置输入框 */
    resetInput() {
      this.password = "";
      this.failDialogVisibility = false;
    }
  }
};
</script>

<style lang="less" scoped>
.safe-keyboard-layer {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  display: flex;
  align-items: flex-end;
  background-color: rgba(37, 47, 61, 0.6);
  .inner {
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 450px;
    background-color: #fff;
    transform: translateY(0px);
    .both-center {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .layer-close-btn {
      position: absolute;
      top: 18px;
      left: 12px;
      width: 14px;
      height: 14px;
      color: #97a4b3;
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .title {
      float: none;
      height: 50px;
      color: #4b5259;
      font-size: 18px;
      border-bottom: 1px solid rgba(185, 185, 185, 0.24);
    }
    .password-ul {
      float: none;
      padding: 20px 12px;
      display: flex;
      .password-li {
        flex: 1;
        height: 45px;
        border-top: 1px solid rgba(185, 185, 185, 0.5);
        border-bottom: 1px solid rgba(185, 185, 185, 0.5);
        border-left: 1px solid rgba(185, 185, 185, 0.5);
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:last-child {
          border-right: 1px solid rgba(185, 185, 185, 0.5);
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
        .img-point {
          width: 12px;
          height: 12px;
        }
      }
    }
    .forget-btn-row {
      float: none;
      .forget-btn {
        font-size: 14px;
        color: #23a1ef;
      }
    }
    .keyboard-box {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .key-ul {
      display: flex;
      height: 50px;
      padding: 0;
      margin: 0;
      border-top: 1px solid rgba(185, 185, 185, 0.24);
      .key-li {
        flex: 1;
        font-size: 20px;
        color: #4b5259;
        border-left: 1px solid rgba(185, 185, 185, 0.24);
        &:first-child {
          border-left: none;
        }
        &.gray {
          background-color: rgba(226, 232, 234, 1);
        }
        .icon-backspace {
          width: 20px;
        }
      }
    }
  }
  [w-60-60] {
    width: 30px;
    height: 30px;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s;
  .inner {
    transition: all 0.3s;
  }
}
.fade-enter,
.fade-leave-to {
  background-color: rgba(37, 47, 61, 0);
  .inner {
    transform: translateY(450px);
  }
}
/* 加载中 */
.loading-wrap {
  position: absolute;
  left: 0;
  top: 40px;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background: #fff;
}
.loading-wrap .loading {
  text-align: center;
}
.loading-icon {
  width: 40px;
  height: 20px;
  margin: 0 auto;
  font-size: 14px;
  & > span {
    display: inline-block;
    width: 4px;
    height: 100%;
    border-radius: 2px;
    background: lightgreen;
    -webkit-animation: load 1s ease infinite;
    &:nth-child(2) {
      -webkit-animation-delay: 0.2s;
    }
    &:nth-child(3) {
      -webkit-animation-delay: 0.4s;
    }
    &:nth-child(4) {
      -webkit-animation-delay: 0.6s;
    }
    &:nth-child(5) {
      -webkit-animation-delay: 0.8s;
    }
  }
}
@-webkit-keyframes load {
  0%,
  100% {
    height: 20px;
    background: lightgreen;
  }
  50% {
    height: 35px;
    margin: -7.5px 0;
    background: lightblue;
  }
}
.loading-wrap .loading p {
  margin-top: 10px;
  padding: 0;
}
.success-icon {
  width: 48px;
  height: 48px;
}
/* 支付失败弹窗 */
.pay-fail {
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 750px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
}
.pay-fail-lay {
  width: 60%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  color: #4b5259;
}
.pay-fail-lay .fail-title {
  line-height: 50px;
  text-align: center;
  font-size: 16px;
  padding: 10px;
  margin: 0;
}
.pay-fail-lay .btns {
  display: flex;
  border-top: 1px solid #f1f1f1;
}
.pay-fail-lay .btns div {
  flex: 1;
  height: 40px;
  line-height: 40px;
  text-align: center;
}
.pay-fail-lay .btns div:active {
  background: #f3f3f3;
}
.pay-fail-lay .btns div:last-child {
  border-left: 1px solid #f1f1f1;
}
</style>