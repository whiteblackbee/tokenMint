<template>
    <div class="page" v-if="initPage">
        <h1>一键代币</h1>
        <h2>数字加密货币生成工具·免费版</h2>
        <div class="logo">
            <img src="../assets/logo.jpg">
        </div>
        <div class="notice">{{ notice }}</div>
        <el-form class="form" ref="form" :model="form" :rules="rules" label-width="110px">
          <el-form-item label="代币全称" prop="tokenName">
            <el-input v-model="form.tokenName" placeholder="支持英文、数字"></el-input>
          </el-form-item>
          <el-form-item label="缩写符号" prop="tokenSymbol">
            <el-input v-model="form.tokenSymbol" placeholder="支持英文、数字，一般为三到五位大写字母"></el-input>
          </el-form-item>
          <el-form-item label="发行总量" prop="initialSupply">
              <el-input v-model="form.initialSupply" placeholder="正整数，比特币发行总量为2100万枚"></el-input>
          </el-form-item>
          <el-form-item label="可分小数位数" prop="decimals">
              <el-input v-model="form.decimals" placeholder="正整数，最大20位，一般使用18位"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox label="开启自动发币功能（alpha版）" name="form.type" v-model="form.type"></el-checkbox>
          </el-form-item>
          <el-form-item label="兑换价格" v-if="form.type">
              <p class="input_p">为避免被滥用，仅支持创建免费代币</p>
          </el-form-item>
          <el-form-item label="赠送代币数量" v-if="form.type">
              <el-input v-model="form.tokenSend">
                <template slot="prepend">0 ETH =</template>
              </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')" :disabled="btnDisabled">生成代币</el-button>
            <el-button @click="toth()">电报群</el-button>
          </el-form-item>
        </el-form>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6">
            <img src="../assets/wx.jpeg">
          </el-col>
          <el-col :span="16" class="desc">
            <span>使用帮助<a href="https://zhuanlan.zhihu.com/p/34417437">《个人加密货币发行指南》</a></span>
            <p>✦ 请在严格遵守当地法律的前提下使用本工具。</p>
            <p>✦ 本工具是免费的，但在以太坊网络上部署合约需要消耗gas，您需要自行承担gas费用（ 通过 MetaMask 支付 ）。</p>
            <p>✦ 本工具仅供测试、娱乐和学习，请勿将其用于大额交易，由此引发的直接或间接的风险与损失，我们不承担任何责任。</p>
          </el-col>
        </el-row>
    </div>
</template>

<script>
import Token from '@/js/token'
export default {
  name: 'home',
  data () {
    return {
      notice: '请填写表单',
      btnDisabled: false,
      initPage: true,
      form: {
        tokenName: '',
        tokenSymbol: '',
        initialSupply: '',
        decimals: '',
        type: 0,
        tokenSend: 0
      },
      rules: {
        tokenName: [
          {required: true, message: '请输入代币全称', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '支持英文、数字', trigger: 'blur'}
        ],
        tokenSymbol: [
          {required: true, message: '请输入缩写符号', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '支持英文、数字，一般为三到五位大写字母', trigger: 'blur'}
        ],
        initialSupply: [
          {required: true, message: '请输入发行总量', trigger: 'blur'},
          {pattern: /^[1-9]\d*$/, message: '正整数，比特币发行总量为2100万枚', trigger: 'blur'}
        ],
        decimals: [
          {required: true, message: '请输入可分小数位数', trigger: 'blur'},
          {pattern: /^[1-9]\d{0,19}$/, message: '正整数，最大20位，一般使用18位', trigger: 'blur'}
        ]
      }
    }
  },
  created: function () {
    Token.init((networkID) => {
      this.notice = '正在使用网络' + {
        1: '主网络',
        3: 'Ropsten 测试网络',
        42: 'kovan 测试网络',
        4: 'Rinkeby 测试网络'
      }[networkID] || '私有网络'
    }).then(res => {
      console.log(res)
      if (res === -2) {
        this.initPage = false
      } else {
        this.initPage = true
      }
    })
  },
  methods: {
    onSubmit: function (formName) {
      this.notice = '正在使用网络'
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnDisabled = true
          Token.deploy(this.form.initialSupply, this.form.tokenName, this.form.tokenSymbol, this.form.decimals, this.form.tokenSend || 0).then(res => {
            this.btnDisabled = false
          })
          console.log('submit!!', this.form.initialSupply)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    toth: function () {
      window.location.href = 'http://www.baidu.com'
    }
  }
}
</script>

<style lang="scss">
    @import '../scss/common';
    $theme-color: #20a0ff;
    body{
        background: #fff;
        > section{
            background: #fff;
        }
    }
    .page{
        width: 720px;
        margin: 0 auto;
        font-family: sans-serif;
        h1,h2{ margin: 20px 0; font-weight: 400;}
        h1{ color: $theme-color; font-size: 32px;}
        h2{ color: #ccc; }
        .logo{
            margin: 20px auto;
            img{ width: 200px;}
        }
        .notice{ color: $theme-color;}
        .form{ width: 480px; margin: 20px auto; padding-bottom: 30px; }
        button.el-button--primary span{ color: #fff;}
        img{ width: 100%;}
        .input_p{ text-align: left;}
        .desc{ text-align: left; line-height: 1.7;
            p{ text-align: left; color: #ccc; }
            span{ text-align: left; }
        }
    }
</style>
