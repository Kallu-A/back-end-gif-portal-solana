const anchor = require('@project-serum/anchor');

const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("🚀 Starting test...")

  const provider = anchor.Provider.env();
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Gifportal;

  // Create an account keypair for our program to use.
  const baseAccount = anchor.web3.Keypair.generate();

  // Call start_stuff_off, pass it the params it needs!
  let tx = await program.rpc.startStuffOff({
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    },
    signers: [baseAccount],
  });

  console.log("📝 Your transaction signature", tx);

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
  await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  
  // Call the account.
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF Count', account.totalGifs.toString())

  // Access gif_list on the account!
  console.log('👀 GIF List', account.gifList)

  console.log("Add up Vote");

  await program.rpc.addUpvote("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", provider.wallet.publicKey, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
  });
  
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF List', account.gifList)

  try {
    await program.rpc.addUpvote("wronggifdontexist", provider.wallet.publicKey, {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("Oops. error throw not as expected ! ")
    process.exit(1);
  } catch( e ) {
    console.log("Error throw as expected ");
  }

  await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy2.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  try {
    await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("Oops. error throw not as expected ! ")
    process.exit(1);
  } catch( e ) {
    console.log("Error throw as expected ");
  }

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF List', account.gifList)

  await program.rpc.removeGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
    accounts: {
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });
  console.log("remove gif");
  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log('👀 GIF List', account.gifList)

  try {
    await program.rpc.removeGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });
    console.log("Oops. error throw not as expected ! ")
    process.exit(1);
  } catch( e ) {
    console.log("Error throw as expected ");
  }




  console.log("\n\n🚀 Test working ! ")
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();