const StarNotary = artifacts.require('StarNotary')

contract('Boilerplate StarNotary', accounts => {
    const user1 = accounts[1];

    beforeEach(async function () {
        this.contract = await StarNotary.new({from: accounts[0]})
    })

    describe('can create two stars', () => {
        beforeEach(async function () {
            await this.contract.createStar("My Star 1", "Star Wars", "1.0", "2.0", "3.0", 1, {from: user1});
            await this.contract.createStar("My Star 2", "Star Treck", "1.1", "2.0", "3.0",  2, {from: user1});
        })

        it('Should have two stars already', async function () {
            let count = (await this.contract.getCount()).toNumber();
            assert.equal(count, 2);
        })

    })

    describe('check if star exist', () => {
        const userCheck = accounts[2];

        beforeEach(async function () {
            await this.contract.createStar("My Star Check 1", "Star Wars", "44.0", "11.0", "3.0", 3, {from: userCheck});
        })

        it('call method', async function () {
            const exist = await this.contract.checkIfStarExist("44.0", "11.0", "3.0",{from: userCheck});
            assert.ok(exist);
        })
    })


    describe('buying and selling stars', () => {
        let user1 = accounts[1]
        let user2 = accounts[2]
        let randomMaliciousUser = accounts[3]

        let starId = 1;
        let starPrice = web3.toWei(.01, "ether")

        beforeEach(async function () {
            await this.contract.createStar("My Star Buy", "Luke Sky Walker", "22.0", "10.2", "4.0",  starId, {from: user1});
        })

        it('user1 can put up their star for sale', async function () {
            assert.equal(await this.contract.ownerOf(starId), user1)
            await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            assert.equal(await this.contract.starsForSale(starId), starPrice)
        })

        describe('user2 can buy a star that was put up for sale', () => {
            beforeEach(async function () {
                await this.contract.putStarUpForSale(starId, starPrice, {from: user1})
            })

            it('user2 is the owner of the star after they buy it', async function () {
                await this.contract.buyStar(starId, {from: user2, value: starPrice, gasPrice: 0})
                assert.equal(await this.contract.ownerOf(starId), user2)
            })

            it('user2 ether balance changed correctly', async function () {
                let overpaidAmount = web3.toWei(.05, 'ether')
                const balanceBeforeTransaction = web3.eth.getBalance(user2)
                await this.contract.buyStar(starId, {from: user2, value: overpaidAmount, gasPrice: 0})
                const balanceAfterTransaction = web3.eth.getBalance(user2)

                assert.equal(balanceBeforeTransaction.sub(balanceAfterTransaction), starPrice)
            })
        })
    })

})