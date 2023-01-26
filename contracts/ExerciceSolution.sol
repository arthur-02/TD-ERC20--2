pragma solidity ^0.6.0;
import "./IExerciceSolution.sol";
import "./ERC20Claimable.sol";

contract ExerciceSolution is IExerciceSolution
{

	ERC20Claimable public erc20;
	mapping (address => uint256) public balances;

	constructor(ERC20Claimable _erc20) public
	{
		erc20 = _erc20;
	}

	function claimTokensOnBehalf() external override {
		balances[msg.sender] += erc20.claimTokens();
	}

	function tokensInCustody(address callerAddress) external override returns (uint256){
		return balances[callerAddress];
	}

	function withdrawTokens(uint256 amountToWithdraw) external override returns (uint256){
		require(balances[msg.sender] >= amountToWithdraw, "Not enough tokens in custody");
		balances[msg.sender] -= amountToWithdraw;
		erc20.transfer(msg.sender, amountToWithdraw);
		return amountToWithdraw;

	}

	function depositTokens(uint256 amountToWithdraw) external override returns (uint256){
		erc20.transferFrom(msg.sender, address(this), amountToWithdraw);
		balances[msg.sender] += amountToWithdraw;
		return amountToWithdraw;

	}

	function getERC20DepositAddress() external override returns (address){

	}
}