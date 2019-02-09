const StarNotary = artifacts.require('StarNotary')

contract('Claim StarNotary', accounts => {
    const user1 = accounts[1];

    beforeEach(async function () {
        this.contract = await StarNotary.new({from: accounts[0]})
    })


    describe('claim new star', () => {
        const createUser = accounts[1];
        const claimUser = accounts[2];
        const checkUser = accounts[3];
        const starId = 11;

        beforeEach(async function () {
            await this.contract.createStar("My Star Claim 1", "Star Wars", "44.0", "11.0", "3.0", starId, {from: createUser});
        })

        it('claim star', async function () {
            await this.contract.claimStar(starId, {from: claimUser});
            assert.equal(await this.contract.ownerOf(starId, {from: checkUser}), claimUser);
        })

        it('creator claime his own star', async function () {
            try {
                await this.contract.claimStar(starId, {from: createUser});
            } catch (error) {
                assert.exists(error);
                assert.equal(await this.contract.ownerOf(starId, {from: checkUser}), createUser);
                return;
            }
            assert.equal(await this.contract.ownerOf(starId, {from: checkUser}), createUser);
            assert.fail('expected owner can not claim his star!');
        })

        it('star is put up to sell', async function () {
           let starPrice = web3.toWei(.01, "ether");
           await this.contract.putStarUpForSale(starId, starPrice, {from: createUser});

            try {
                await this.contract.claimStar(starId, {from: claimUser});
            } catch (error) {
                assert.exists(error);
                assert.equal(await this.contract.ownerOf(starId, {from: checkUser}), createUser);
                return;
            }
            assert.equal(await this.contract.ownerOf(starId, {from: checkUser}), createUser);
            assert.fail('You can claim a star which are put up to sell!');
        })

    })
})