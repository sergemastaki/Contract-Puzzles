const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { assert } = require('chai');
const { ethers } = require('hardhat');

describe('Game5', function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory('Game5');
    const game = await Game.deploy();

    const signer = ethers.provider.getSigner(0);

    return { game, signer };
  }

  async function getAddress(){
    const threshold = 0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf;
    let address;
    while(true){
      const wallet = ethers.Wallet.createRandom().connect(ethers.provider);
      address = await wallet.getAddress();

      if(address < threshold){
        return {wallet, address};
      }
    }
  }

  it('should be a winner', async function () {
    const { game, signer } = await loadFixture(deployContractAndSetVariables);
    const { wallet, address } = await getAddress();
    console.log(`get random address ${address}`)

    await signer.sendTransaction({
      to: address,
      value: ethers.utils.parseEther('1')
    });

    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), 'You did not win the game');
  });
});
