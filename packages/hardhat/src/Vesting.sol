// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "hardhat/console.sol";

contract Vesting is Ownable {
    uint256 public totalReleased;

    mapping(address => uint256) public shares;
    mapping(address => uint256) public released;

    IERC20 public immutable codeToken;

    uint256 public immutable start;
    uint256 public immutable duration = 2 * 365 days; // total 2 years vesting period
    uint256 public immutable releasePeriod = 30 days; // release every month
    uint256 public immutable totalEpochs = 24; // total release epochs will be 24 months
    // The Founding Team will retain 6%, current Advisors will retain 0.9% and only 50% will be vested
    // uint256 public immutable totalShares = (690_000 / 2) * 1e18;

    event PaymentReleased(address _payee, uint256 _amount);
    event PayeeAddedOrUpdated(address _payee, uint256 _shares);
    event Sweep20(address _token);
    event Sweep721(address _token, uint256 _tokenID);

    error AccountHasNoShare();
    error AccountHasNoDuePayment();
    error PayeesEmpty();
    error PayeesSharesMismatch();
    error TotalSharesMismatch();
    error Address0Error();
    error Shares0Error();
    error ReleaseNotEnded();

    constructor(address _codeToken, uint256 _startTimestamp) {
        codeToken = IERC20(_codeToken);
        start = _startTimestamp;
    }

    function release() external {
        address account = _msgSender();
        if (shares[account] <= 0) revert AccountHasNoShare();
        uint256 releasable = vestedAmount(account);
        if (releasable <= 0) revert AccountHasNoDuePayment();
        if (releasable > shares[account]) {
            releasable = shares[account];
        }

        released[account] += releasable;
        totalReleased += releasable;

        codeToken.transfer(account, releasable);
        emit PaymentReleased(account, releasable);
    }

    function vestedAmount(address _account) public view returns (uint256) {
        uint256 timestamp = block.timestamp;
        if (timestamp > start + duration) {
            return shares[_account] - released[_account];
        } else {
            uint256 _epoch = epoch(timestamp - start);
            return (shares[_account] * _epoch) / totalEpochs - released[_account];
        }
    }

    function addOrUpdatePayees(address[] calldata _payees, uint256[] calldata _shares) external onlyOwner {
        if (_payees.length == 0) revert PayeesEmpty();
        if (_payees.length != _shares.length) revert PayeesSharesMismatch();

        for (uint256 i = 0; i < _payees.length; i++) {
            addOrUpdatePayee(_payees[i], _shares[i]);
        }
    }

    function addOrUpdatePayee(address _account, uint256 _shares) public onlyOwner {
        if (_shares == 0) revert Shares0Error();
        if (_account == address(0)) revert Address0Error();

        shares[_account] = _shares;
        emit PayeeAddedOrUpdated(_account, _shares);
    }

    function epoch(uint256 _period) public pure returns (uint256) {
        return _period / releasePeriod;
    }

    function sweep20(address _tokenAddr) external onlyOwner {
        IERC20 token = IERC20(_tokenAddr);
        uint256 releasePeriodEnds = start + duration;
        if (_tokenAddr == address(codeToken) && block.timestamp <= releasePeriodEnds) revert ReleaseNotEnded();
        token.transfer(owner(), token.balanceOf(address(this)));
        emit Sweep20(_tokenAddr);
    }

    function sweep721(address _tokenAddr, uint256 _tokenID) external onlyOwner {
        IERC721 token = IERC721(_tokenAddr);
        token.transferFrom(address(this), owner(), _tokenID);
        emit Sweep721(_tokenAddr, _tokenID);
    }
}
