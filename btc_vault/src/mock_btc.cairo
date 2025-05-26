// Clean, final Cairo 1.x ERC20-compatible MockBTC contract

#[starknet::contract]
mod mock_btc {
    use core::bool;
    use core::integer::u256;
    use starknet::contract::ContractAddress;
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        total_supply: u256,
        balances: Map<ContractAddress, u256>,
        allowances: Map<(ContractAddress, ContractAddress), u256>,
    }

    #[constructor]
    fn constructor(ref self: Storage) {
        self.total_supply = 0_u256;
    }

    #[external(v0)]
    fn name(self: @Storage) -> felt252 {
        'MockBTC'
    }

    #[external(v0)]
    fn symbol(self: @Storage) -> felt252 {
        'MBTC'
    }

    #[external(v0)]
    fn decimals(self: @Storage) -> u8 {
        8
    }

    #[external(v0)]
    fn total_supply(self: @Storage) -> u256 {
        self.total_supply
    }

    #[external(v0)]
    fn balance_of(self: @Storage, owner: ContractAddress) -> u256 {
        self.balances.read(owner)
    }

    #[external(v0)]
    fn allowance(self: @Storage, owner: ContractAddress, spender: ContractAddress) -> u256 {
        self.allowances.read((owner, spender))
    }

    #[external(v0)]
    fn approve(ref self: Storage, spender: ContractAddress, amount: u256) -> bool {
        let owner = starknet::get_caller_address();
        self.allowances.write((owner, spender), amount);
        true
    }

    #[external(v0)]
    fn transfer(ref self: Storage, to: ContractAddress, amount: u256) -> bool {
        let sender = starknet::get_caller_address();
        let sender_balance = self.balances.read(sender);
        assert(sender_balance >= amount, 'Insufficient balance');

        self.balances.write(sender, sender_balance - amount);
        let to_balance = self.balances.read(to);
        self.balances.write(to, to_balance + amount);
        true
    }

    #[external(v0)]
    fn transfer_from(
        ref self: Storage, sender: ContractAddress, recipient: ContractAddress, amount: u256,
    ) -> bool {
        let caller = starknet::get_caller_address();
        let allowance = self.allowances.read((sender, caller));
        assert(allowance >= amount, 'Allowance exceeded');

        let sender_balance = self.balances.read(sender);
        assert(sender_balance >= amount, 'Insufficient balance');

        self.allowances.write((sender, caller), allowance - amount);
        self.balances.write(sender, sender_balance - amount);

        let recipient_balance = self.balances.read(recipient);
        self.balances.write(recipient, recipient_balance + amount);

        true
    }

    #[external(v0)]
    fn mint(ref self: Storage, recipient: ContractAddress, amount: u256) {
        let current = self.balances.read(recipient);
        self.balances.write(recipient, current + amount);
        self.total_supply += amount;
    }
}
