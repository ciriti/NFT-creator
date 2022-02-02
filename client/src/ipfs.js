import { create } from 'ipfs-http-client'

const ipfs = create({ 
    host: 'ipfs.infura.io', 
    port: '5001', 
    protocol: 'https',
    headers: {
      authorization: 'Bearer ' + "13ac5c203e204f1bbd367ab09b88e530"
    } })

export default ipfs;
