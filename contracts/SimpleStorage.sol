// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleStorage is ERC721PresetMinterPauserAutoId  {

  uint ipfsHash;

  mapping(bytes32 => address) nftOwner;

  event TokenIPFSHash(bytes32 ifpsHash, address ownerAddress);

  constructor() ERC721PresetMinterPauserAutoId("Ciriti", "CRT-1", "https://raw.githubusercontent.com/ciriti/test/main/metadata") {
  }

  function set(uint x) public {
    ipfsHash = x;
  }

  function get() public view returns (uint) {
    return ipfsHash;
  }

  function getOwner(bytes32 ifpsHash) public view returns (address) {
    return nftOwner[ifpsHash];
  }

  function save(bytes32 ifpsHash) public{
    nftOwner[ifpsHash] = msg.sender;
    emit TokenIPFSHash(ifpsHash, msg.sender);
  }

  // function mint(address to, uint lockedFromTimestamp, bytes32 unlockHash) public {
  //       tokenLockedFromTimestamp[_tokenIds.current()] = lockedFromTimestamp;
  //       tokenUnlockCodeHashes[_tokenIds.current()] = unlockHash;
  //       _tokenIds.increment();
  //       super.mint(to);
  //   }
}
