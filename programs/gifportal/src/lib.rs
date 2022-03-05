use anchor_lang::prelude::*;

declare_id!("9YN2AnKro5ihCfWX6ShbWiopvrUhywUwqDNykzB3Zhn1");

#[program]
pub mod gifportal {
  use super::*;

  // Initialise the blockchain programm
  pub fn start_stuff_off(ctx: Context<StartStuffOff>) -> ProgramResult {
    let base_account = &mut ctx.accounts.base_account;
    base_account.total_gifs = 0;
    Ok(())
  }

  /// Add a gif to the blockchain
  pub fn add_gif(ctx: Context<UsePortal>, gif_link: String) -> ProgramResult {
    let base_account = &mut ctx.accounts.base_account;
    let user = &mut ctx.accounts.user;

      //look if gif doesn't already exist
      if base_account.gif_list.iter().find(|item| item.gif_link == gif_link).is_some() {
          return Err(ProgramError::InvalidArgument);
      }

    let item = ItemStruct {
      gif_link: gif_link.to_string(),
      user_address: *user.to_account_info().key,
      up_vote: 0
    };

    base_account.gif_list.push(item);
    base_account.total_gifs += 1;
    Ok(())
  }

  /// Allow to add upvote to a gif 
  pub fn add_upvote(ctx: Context<UsePortal>, gif_link: String, owner: Pubkey) -> ProgramResult {
      let base_account = &mut ctx.accounts.base_account;

      if let Some(mut gif) = base_account.gif_list.iter_mut().find(
        | item | item.gif_link == gif_link && owner == item.user_address
      ) {
        gif.up_vote += 1;
        Ok(())
      } else {
        Err(ProgramError::InvalidArgument)
      }
  }

  /// Remove the gif of the blockchain only if your are the one who post it
  pub fn remove_gif(ctx: Context<UsePortal>, gif_link: String) -> ProgramResult {
    let base_account = &mut ctx.accounts.base_account; 

    if let Some(pos) = base_account.gif_list.iter().position(|item| *item.gif_link == gif_link) {
      if base_account.gif_list.get(pos).unwrap().user_address == ctx.accounts.user.key() {
        base_account.gif_list.remove(pos);
        base_account.total_gifs -= 1;
        return Ok(());
      }
      Err(ProgramError::IllegalOwner)
  } else {
    Err(ProgramError::InvalidArgument)
  }

    
  }
}

// Attach certain variables to the StartStuffOff context.
#[derive(Accounts)]
pub struct StartStuffOff<'info> {
    #[account(init, payer = user, space = 9000)]
    pub base_account: Account<'info, BaseAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program <'info, System>,
}

// Tell Solana what we want to store on this account.
#[account]
pub struct BaseAccount {
    pub total_gifs: u64,
    pub gif_list: Vec<ItemStruct>,
}

#[derive(Accounts)]
pub struct UsePortal<'info> {
  #[account(mut)]
  pub base_account: Account<'info, BaseAccount>,
  #[account(mut)]
  pub user: Signer<'info>,
}

// Create a custom struct for us to work with.
#[derive(Debug, Clone, AnchorSerialize, AnchorDeserialize)]
pub struct ItemStruct {
    pub gif_link: String,
    pub user_address: Pubkey,
    pub up_vote: i32
}
