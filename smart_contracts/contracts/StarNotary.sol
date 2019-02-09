pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";

contract StarNotary is ERC721 {

    struct Star {
        string name;
        string story;
        string cent;
        string dec;
        string mag;
    }

    mapping(uint256 => Star) public starIdToStarInfo;
    mapping(uint256 => uint256) public starsForSale;
    mapping(uint256 => bool) _starExists;
    uint256 private _count = 0;

    event starClaimed(address owner);

    function createStar(string _name, string _story, string _cent, string _dec, string _mag, uint256 _tokenId)
    public {

        require(!checkIfStarExist(_cent, _dec, _mag), "Star exists!");
        uint256 starHash = _genHash(_cent, _dec, _mag);
        _starExists[starHash] = true;

        Star memory newStar = Star(_name, _story, _cent, _dec, _mag);
        starIdToStarInfo[_tokenId] = newStar;
        _count = _count + 1;

        _mint(msg.sender, _tokenId);
    }

    function _genHash(string _dec, string _mag, string _cent)
    private pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(_dec, _mag, _cent)));
    }

    function getCount()
    public view returns (uint256) {
        return _count;
    }


    function checkIfStarExist(string _dec, string _mag, string _cent)
    public view returns (bool) {
        uint256 starHash = _genHash(_dec, _mag, _cent);
        return (_starExists[starHash]);
    }

    function putStarUpForSale(uint256 _tokenId, uint256 _price) public {
        require(this.ownerOf(_tokenId) == msg.sender);
        starsForSale[_tokenId] = _price;
    }

    function buyStar(uint256 _tokenId) public payable {
        require(starsForSale[_tokenId] > 0);

        uint256 starCost = starsForSale[_tokenId];
        address starOwner = this.ownerOf(_tokenId);
        require(msg.value >= starCost);

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        starOwner.transfer(starCost);

        if (msg.value > starCost) {
            msg.sender.transfer(msg.value - starCost);
        }
    }

    function claimStar(uint256 _tokenId) public {
        address starOwner = this.ownerOf(_tokenId);

        require(starOwner != msg.sender, "You already own the Star!");
        require(!(starsForSale[_tokenId] > 0), "Star is put to sell! You can't claim it!");

        _removeTokenFrom(starOwner, _tokenId);
        _addTokenTo(msg.sender, _tokenId);

        emit starClaimed(msg.sender);
    }
}