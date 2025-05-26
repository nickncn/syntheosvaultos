#[starknet::contract]
mod pragma_integration {
    use core::integer::u256;
    use core::option::Option;

    // Import Pragma's BTC/USD price feed interface
    use pragma::feeds::btc_usd::{get};
    use starknet::ContractAddress;

    #[view]
    fn get_btc_price() -> u256 {
        // Read the price from Pragma's BTC/USD feed
        match get() {
            Option::Some(price) => price,
            Option::None => 0_u256 // fallback to 0 if no price is available
        }
    }
}
