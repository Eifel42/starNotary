/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a 
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() { 
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>') 
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

const HDWalletProvider = require("truffle-hdwallet-provider");
module.exports = {
    // See <http://truffleframework.com/docs/advanced/configuration>
    // to customize your Truffle configuration!
    networks: {
        development: {
            host: "localhost",
            port: 7545,
            network_id: "*" // Match any network id
        },
        rinkeby: {
            provider: function () {
                return new HDWalletProvider("glance keep slender file manual legal wish pear one capable correct mammal", "https://rinkeby.infura.io/v3/dc9856c3e4433d8743e5bc7c0008f50bbd65")
            },
            network_id: '4',
            gas: 4500000,
            gasPrice: 10000000000,
        }
    },
    solc: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      }
};
