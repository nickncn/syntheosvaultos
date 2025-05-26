#[starknet::contract]
mod ekubo_strategy {
    use core::integer::u256;
    use starknet::ContractAddress;
    use starknet::storage::Map;
    use starknet::event::emit_event;

    #[storage]
    struct Storage {
        user_balances: Map<ContractAddress, u256>,
        total_deposit: u256,
        simulated_apy: u256, // scaled by 100 (e.g. 520 = 5.2%)
        owner: ContractAddress
    }

    #[event]
    struct Deposit {
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
    fn set_apy_from_oracle(ref self: Storage, apy: u256) {
        let caller = starknet::get_caller_address();
        // Optionally restrict to owner, or make a check for a known Pragma address
        self.simulated_apy.write(apy);
        // Optionally emit APYUpdated event here
    }

    #[external(v0)]
    fn set_apy(ref self: Storage, new_apy: u256) {
        let caller = starknet::get_caller_address();
        assert caller == self.owner.read(), 'Unauthorized';

        let old_apy = self.simulated_apy.read();
        self.simulated_apy.write(new_apy);

        emit_event APYUpdated { old_apy, new_apy };
    }

    // Implement yield calculation if you want here, e.g. time-based
}
