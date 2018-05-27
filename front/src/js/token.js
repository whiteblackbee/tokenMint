import tokenContractJson from '../../../build/contracts/MyToken.json'
import Web3 from 'web3'
import { MessageBox } from 'element-ui'

const Token = {
  tokenContract: null,
  instance: null,
  web3: null,
  init: function () {
    let self = this
    return new Promise(function (resolve, reject) {
      if (typeof window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        self.web3 = new Web3(window.web3.currentProvider)
        console.log('Injected web3 detected.')
      } else {
        console.log('window.web3 cat not be found')
        reject(new Error('缺少 MetaMask 浏览器插件，请到 https://metamask.io/ 安装并登入账号后，刷新本页面继续'))
      }
      self.web3.net.getListening(function (e, connected) {
        console.log('connected state:', e, connected)
        if (connected === false) {
          MessageBox({
            type: 'alert',
            title: '缺少浏览器插件',
            message: '缺少 MetaMask 浏览器插件，请到 https://metamask.io/ 安装并登入账号后，刷新本页面继续'
          })
          reject(new Error('MetaMask 未连接 ，请检查'))
        }
      })

      if (self.web3.eth.coinbase === null) {
        console.log('web3.eth.coinbase cat not be found')
        MessageBox({
          type: 'alert',
          message: '无法获取 MetaMask 默认账户地址，请点击插件并登入后再试'
        })
        reject(new Error('无法获取 MetaMask 默认账户地址，请点击插件并登入后再试'))
      }
      const networkID = self.web3.version.network
      resolve(networkID)
    })
  },
  // 部署的方法
  deploy: function (initialSupply, tokenName, tokenSymbol, decimals, tokenbuyPrice) {
    let self = this
    let timeOut = true
    console.log(initialSupply, tokenName, tokenSymbol, decimals, tokenbuyPrice)
    setTimeout(() => {
      if (timeOut === true) {
        MessageBox({
          type: 'alert',
          title: '超时',
          message: '部署合约超时，但这并不意味着您的合约没有部署成功，请打开MetaMask钱包，点击最新的交易记录来确认部署情况'
        })
      }
    }, 5 * 60 * 1000)
    return new Promise(function (resolve, reject) {
      console.log(self.web3)
      self.web3.eth.contract(tokenContractJson.abi).new(
        initialSupply,
        tokenName,
        tokenSymbol,
        decimals,
        tokenbuyPrice,
        {
          from: self.web3.eth.accounts[0],
          data: tokenContractJson.bytecode,
          gas: 1397698, // 要做成自动计算？
          gasPrice: '5000000000' // 3wei 要做成自动计算？
        }
        , function (err, contract) {
          if (err) {
            reject(err)
            timeOut = false
            console.error(err)
          // callback fires twice, we only want the second call when the contract is deployed
          } else if (contract.address) {
            MessageBox({
              type: 'alert',
              title: '合约创建完成',
              message: contract.address
            })
            timeOut = false
            resolve(self.web3.version.network)
            console.log('address: ' + contract.address)
          }
        })
    })
  },
  destroy: null
}

export default Token
