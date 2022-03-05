const anchor = require('@project-serum/anchor');
const assert = require('assert');
const { SystemProgram } = anchor.web3;

describe('Testing Gif-Portal', () => {
  console.log("🚀 Starting test...")
  const provider = anchor.Provider.env();
  anchor.setProvider(anchor.Provider.env());
  const program = anchor.workspace.Gifportal;
  const baseAccount = anchor.web3.Keypair.generate();
  let account;

  it("Add gif UpVote Remove", async () => {

    await program.rpc.startStuffOff({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
  
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    let start = account.totalGifs;

    // You'll need to now pass a GIF link to the function! You'll also need to pass in the user submitting the GIF!
    await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    await program.rpc.addUpvote("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", provider.wallet.publicKey, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
    });
    
    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.totalGifs == start + 1);

    try {
      await program.rpc.addUpvote("wronggifdontexist", provider.wallet.publicKey, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      process.exit(1);
    } catch( e ) { }
  
    await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy2.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.totalGifs == start + 2);

    try {
      await program.rpc.addGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      process.exit(1);
    } catch( e ) { }
  
    await program.rpc.removeGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
      },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);
    assert.ok(account.totalGifs == start + 1);

    try {
      await program.rpc.removeGif("https://media.giphy.com/media/3ornjPteRwwUdSWifC/giphy.gif", {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      process.exit(1);
    } catch( e ) {}
  });
  
});