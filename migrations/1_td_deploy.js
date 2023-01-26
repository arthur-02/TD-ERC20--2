var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC20Claimable = artifacts.require("ERC20Claimable.sol");
var evaluator = artifacts.require("Evaluator.sol");
var exercicesolution = artifacts.require("ExerciceSolution.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        //await deployTDToken(deployer, network, accounts); 
        //await deployEvaluator(deployer, network, accounts); 
        //await setPermissionsAndRandomValues(deployer, network, accounts); 
		await setStaticContracts(deployer, network, accounts);
        await deployRecap(deployer, network, accounts); 
        await testSolution(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	TDToken = await TDErc20.new("TD-ERC20-102-23","TD-ERC20-102-23",web3.utils.toBN("20000000000000000000000000000"))
	ClaimableToken = await ERC20Claimable.new("ClaimableToken23","CLTK-23",web3.utils.toBN("20000000000000000000000000000"))
}

async function deployEvaluator(deployer, network, accounts) {
	Evaluator = await evaluator.new(TDToken.address, ClaimableToken.address)
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
}

async function setStaticContracts(deployer,network,accounts) {
	TDToken = await TDErc20.at("0xb79a94500EE323f15d76fF963CcE27cA3C9e32DF")
	ClaimableToken = await ERC20Claimable.at("0xE70AE39bDaB3c3Df5225E03032D31301E2E71B6b")
	Evaluator = await evaluator.at("0x16F3F705825294A55d40D3D34BAF9F91722d6143")
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("ClaimableToken " + ClaimableToken.address)
	console.log("Evaluator " + Evaluator.address)
}

async function testSolution(deployer, network, accounts) {
	mySolution = await exercicesolution.new(ClaimableToken.address)
	console.log("mySolution " + mySolution.address)

	await Evaluator.submitExercice(mySolution.address)
	myBalance = await TDToken.balanceOf(accounts[0])
	console.log("my balance submit " + myBalance)

	await Evaluator.ex2_claimedFromContract()
	await Evaluator.ex3_withdrawFromContract()
	await Evaluator.ex6_depositTokens()
	//await Evaluator.ex7_createERC20()
	myBalance = await TDToken.balanceOf(accounts[0])
	console.log("my balance " + myBalance)
	
	console.log()
}
