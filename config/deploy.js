async function main() {
	const Quest = await ethers.getContractFactory('Quest');
	console.log('Deploying Quest...');
	const box = await Quest.deploy();
	await box.waitForDeployment();
	console.log('Quest deployed to:', await box.getAddress());
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
