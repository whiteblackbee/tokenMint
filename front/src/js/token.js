import tokenContractJson from '../../../build/contracts/MyToken.json'
import Web3 from 'web3'
import { MessageBox } from 'element-ui'

const Token = {
  tokenContract: null,
  instance: null,
  web3: null,
  init: function (callback) {
    let self = this
    let web3 = window.web3

    return new Promise(function (resolve, reject) {
      if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        web3 = new Web3(web3.currentProvider)
        self.web3 = {
          web3: web3
        }
        console.log('Injected web3 detected.')
      } else {
        MessageBox({
          type: 'alert',
          title: '缺少浏览器插件',
          message: '缺少 MetaMask 浏览器插件，请到 https://metamask.io/ 安装并登入账号后，刷新本页面继续'
        })
        resolve(-2)
        return false
      }

      if (web3.eth.coinbase === null) {
        MessageBox({
          type: 'alert',
          message: '无法获取 MetaMask 默认账户地址，请点击插件并登入后再试'
        })
        resolve(1)
        return false
      }

      web3.eth.net.getId().then(res => {
        callback(res)
        console.log(res)
        resolve(self.web3)
      }).catch((err) => {
        MessageBox({
          type: 'alert',
          message: '无法获取 MetaMask 默认账户地址，请点击插件并登入后再试'
        })
        resolve(err)
      })
    })
  },
  // 部署的方法
  deploy: function (initialSupply, tokenName, tokenSymbol, decimals, tokenbuyPrice) {
    let self = this
    console.log(initialSupply, tokenName, tokenSymbol, decimals, tokenbuyPrice)
    // const getFirstAccount = async () => {
    //   const accounts = await web3.eth.getAccounts()
    //   return accounts[0]
    // }
    Promise.resolve().then(async () => {
      const accounts = await this.web3.eth.getAccounts()
      return accounts[0]
    }).then((account) => {
      return new Promise(function (resolve, reject) {
        console.log(account)
        const myContract = new self.web3.eth.Contract(tokenContractJson.abi)
        self.tokenContract = myContract.deploy({
          data: tokenContractJson.bytecode,
          arguments: [initialSupply,
            tokenName,
            tokenSymbol,
            decimals,
            tokenbuyPrice]
        })
          .send({
            from: account,
            gas: 2393103, // 要做成自动计算？
            gasPrice: '3000000000' // 3wei 要做成自动计算？
          }, function (error, transactionHash) { console.log(error, transactionHash) })
          .on('error', function (error) {
            console.log(error)
            reject(error)
          })
          .on('transactionHash', function (transactionHash) { console.log(transactionHash) })
          .on('receipt', function (receipt) {
            console.log(receipt.contractAddress) // contains the new contract address
          })
          .on('confirmation', function (confirmationNumber, receipt) { console.log(confirmationNumber, receipt) })
          .then(function (newContractInstance) {
            console.log(newContractInstance.options.address) // instance with the new contract address
            resolve()
          })
      })
    })
  },
  destroy: null
}

export default Token
