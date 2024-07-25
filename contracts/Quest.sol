// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Quest is ERC1155, Ownable {
    struct UserProfile {
        string name;
        string email;
        string bio;
        string avatarUrl;
        string coverUrl;
        string links;
    }

    struct NftData {
        address creator;
        string url;
        bool transferable;
    }

    mapping(address => UserProfile) private profiles;
    mapping(uint256 => NftData) private nftData;

    uint64 private lastId;

    event ProfileCreated(address indexed user, UserProfile profile);
    event AchievementCreated(uint256 indexed id, NftData nftData);
    event AchievementUpdated(uint256 indexed id, NftData nftData);

    constructor() ERC1155("") Ownable(msg.sender) {
        lastId = 0;
    }

    /**
     * @notice Sets the profile for the user.
     */
    function setProfile(
        string memory _name,
        string memory _email,
        string memory _bio,
        string memory _avatarUrl,
        string memory _coverUrl,
        string memory _links
    ) external {
        profiles[msg.sender] = UserProfile(
            _name,
            _email,
            _bio,
            _avatarUrl,
            _coverUrl,
            _links
        );
        emit ProfileCreated(msg.sender, profiles[msg.sender]);
    }

    /**
     * @notice Gets the profile of the specified user.
     */
    function getProfile(
        address user
    ) external view returns (UserProfile memory) {
        return profiles[user];
    }

    /**
     * @notice Gets the achievement data of the specified token ID.
     */
    function getAchievement(uint256 id) external view returns (NftData memory) {
        return nftData[id];
    }

    /**
     * @notice Returns the URI for a given token ID.
     */
    function uri(uint256 tokenId) public view override returns (string memory) {
        return nftData[tokenId].url;
    }

    /**
     * @notice Adds a new achievement.
     */
    function addAchievement(string memory url, bool transferable) public {
        nftData[lastId] = NftData(msg.sender, url, transferable);
        emit AchievementCreated(lastId, nftData[lastId]);
        lastId++;
    }

    /**
     * @notice Edits an existing achievement.
     */
    function editAchievement(
        uint256 id,
        string memory url,
        bool transferable
    ) public {
        require(
            nftData[id].creator == msg.sender,
            "Only the creator can edit the achievement"
        );

        nftData[id].url = url;
        nftData[id].transferable = transferable;

        emit AchievementUpdated(lastId, nftData[id]);
    }

    /**
     * @notice Sends an achievement to an account.
     */
    function sendAchievement(
        address account,
        uint256 achievementId,
        uint256 amount,
        bytes memory data
    ) public {
        require(
            nftData[achievementId].creator == msg.sender,
            "Only the creator can send the achievement"
        );
        _mint(account, achievementId, amount, data);
    }

    /**
     * @notice Sends a batch of achievements to an account.
     */
    function sendAchievementBatch(
        address to,
        uint256[] memory achievementIds,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        require(
            achievementIds.length == amounts.length,
            "IDs and amounts length mismatch"
        );
        for (uint256 i = 0; i < achievementIds.length; i++) {
            require(
                nftData[achievementIds[i]].creator == msg.sender,
                "Only the creator can send the achievement"
            );
        }
        _mintBatch(to, achievementIds, amounts, data);
    }

    /**
     * @notice Overrides the safeTransferFrom function to prevent transferring frozen tokens.
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        require(
            nftData[id].transferable,
            "Token is frozen and cannot be transferred"
        );
        super.safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @notice Overrides the safeBatchTransferFrom function to prevent transferring frozen tokens.
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        for (uint256 i = 0; i < ids.length; i++) {
            require(
                !nftData[ids[i]].transferable,
                "One or more tokens are frozen and cannot be transferred"
            );
        }
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /**
     * @notice Retrieves all NFTs created by a specified address.
     */
    function getNftsByCreator(
        address creator
    ) external view returns (NftData[] memory) {
        uint256 count = 0;

        for (uint256 i = 0; i < lastId; i++) {
            if (nftData[i].creator == creator) {
                count++;
            }
        }

        NftData[] memory result = new NftData[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < lastId; i++) {
            if (nftData[i].creator == creator) {
                result[index] = nftData[i];
                index++;
            }
        }

        return result;
    }
}
