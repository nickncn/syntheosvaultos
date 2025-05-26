#[starknet::contract]
mod btc_vault {
    use core::integer::u256;
    use starknet::ContractAddress;
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        btc_balances: Map<ContractAddress, u256>,
    }

    #[external(v0)]
    fn deposit_btc(ref self: ContractState, amount: u256) {
        let caller: ContractAddress = starknet::get_caller_address();
        let current = self.btc_balances.read(caller);
        self.btc_balances.write(caller, current + amount);
    }

    #[external(v0)]
    fn withdraw_btc(ref self: ContractState, amount: u256) {
        let caller: ContractAddress = starknet::get_caller_address();
        let current = self.btc_balances.read(caller);
        self.btc_balances.write(caller, current - amount);
    }

    #[external(v0)]
    fn get_btc_balance(self: @ContractState, user: ContractAddress) -> u256 {
        self.btc_balances.read(user)
    }
}
