# IPFS
An IPFS address consists, in reverse order, of a hash of the data, the length of the said hash, and an identifier to tell you what algorithm is being used for the hashing. The algorithms in wide use produce hashes 32 bytes long. This is then encoded into a base58 string.

- install IPFS: `npm install --save ipfs-http-client `

# Truffle

- truffle develop: https://trufflesuite.com/docs/truffle/getting-started/using-truffle-develop-and-the-console

- install truffle: `npm install -g truffle`
- create the template: `truffle unbox react`
- install open zeppelin: `npm install --save @openzeppelin/contracts@v3.0.0`
- `truffle develop`
- force deploy contract: `truffle migrate --reset`
- run migration on the specified network: `truffle migrate --network ropsten_infura`


# Node
- run the website: `npm run start`