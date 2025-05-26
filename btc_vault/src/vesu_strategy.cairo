#[starknet::contract]
mod vesu_strategy {
    use core::integer::u256;
    use core::felt252;
    use starknet::ContractAddress;
    use starknet::storage::Map;
    use starknet::event::emit_event;

    #[storage]
    struct Storage {
        user_balances: Map<ContractAddress, u256>,
        total_deposit: u256,
        simulated_apy: u256, // scaled by 100 (e.g. 550 = 5.5%)
        owner: ContractAddress,
    }

    #[event]
    struct Deposit {
        user: ContractAddress,
        amount: u256,
    }

    #[event]
    struct Withdraw {
        user: ContractAddress,
        amount: u256,
    }

    #[event]
    struct APYUpdated {
        old_apy: u256,
        new_apy: u256,
    }

    #[constructor]
    fn constructor(ref self: Storage, initial_apy: u256) {
        self.simulated_apy.write(initial_apy);
        self.total_deposit.write(0_u256);
        self.owner.write(starknet::get_caller_address());
    }

    #[external(v0)]
    fn deposit(ref self: Storage, amount: u256) {
        let user = starknet::get_caller_address();
        let prev = self.user_balances.read(user);
        self.user_balances.write(user, prev + amount);

        let total = self.total_deposit.read();
        self.total_deposit.write(total + amount);

        emit_event Deposit { user, amount };
    }

    #[external(v0)]
    fn withdraw(ref self: Storage, amount: u256) {
        let user = starknet::get_caller_address();
        let prev = self.user_balances.read(user);
        assert(prev >= amount, 'Insufficient balance');
        self.user_balances.write(user, prev - amount);

        let total = self.total_deposit.read();
        self.total_deposit.write(total - amount);

        emit_event Withdraw { user, amount };
    }

    #[external(v0)]
    fn get_user_balance(self: @Storage, user: ContractAddress) -> u256 {
        self.user_balances.read(user)
    }

    #[external(v0)]
    fn get_total_deposits(self: @Storage) -> u256 {
        self.total_deposit.read()
    }

    #[external(v0)]
    fn get_simulated_apy(self: @Storage) -> u256 {
        self.simulated_apy.read()
    }

    #[external(v0)]
    fn set_apy(ref self: Storage, new_apy: u256) {
        let caller = starknet::get_caller_address();
        assert caller == self.owner.read(), 'Unauthorized';

        let old_apy = self.simulated_apy.read();
        self.simulated_apy.write(new_apy);

        emit_event APYUpdated { old_apy, new_apy };
    }

    /// Called by the vault or Pragma updater. Permissionless or can add owner check.
    #[external(v0)]
    fn update_strategy_params_from_oracle(ref self: Storage, volatility: felt252) {
        // If volatility is high, reduce APY
        let old_apy = self.simulated_apy.read();
        if volatility > 50 {
            self.simulated_apy.write(300); // 3.00%
        } else {
            self.simulated_apy.write(520); // 5.20%
        }
        let new_apy = self.simulated_apy.read();
        emit_event APYUpdated { old_apy, new_apy };
    }
}
