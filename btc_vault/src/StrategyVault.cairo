mod istrategy;
use istrategy::IStrategy;
use starknet::ContractAddress;
use starknet::storage::Map;

#[starknet::contract]
mod strategy_vault {
    use core::felt252;
    use core::integer::u256;
    use core::integer::u64;
    use starknet::ContractAddress;
    use starknet::storage::Map;

    #[storage]
    struct Storage {
        // Strategies
        strategies: Map<u8, ContractAddress>, // id → contract address
        strategy_names: Map<u8, felt252>, // id → human-readable name
        active_strategy: u8,
        owner: ContractAddress,
        num_strategies: u8, // total strategies

        // Pragma Oracle Data (ALL FIELDS in main Storage)
        oracle_price: u256,
        oracle_volatility: u256,
        min_cdr: u256, // e.g. 150_00 = 150.00%
        last_oracle_update: u64,
    }

    #[event]
    struct StrategyRegistered {
        id: u8,
        name: felt252,
        addr: ContractAddress,
    }
    #[event]
    struct StrategySwitched {
        old_id: u8,
        new_id: u8,
    }

    #[constructor]
    fn constructor(ref self: Storage, ekubo_addr: ContractAddress, vesu_addr: ContractAddress) {
        self.strategies.write(1_u8, ekubo_addr);
        self.strategy_names.write(1_u8, 'Ekubo');
        self.strategies.write(2_u8, vesu_addr);
        self.strategy_names.write(2_u8, 'Vesu');
        self.active_strategy.write(1_u8);
        self.num_strategies.write(2_u8);
        self.owner.write(starknet::get_caller_address());
        self.oracle_price.write(0_u256);
        self.oracle_volatility.write(0_u256);
        self.min_cdr.write(150_00_u256); // Default 150%
        self.last_oracle_update.write(0_u64);
    }

    #[external(v0)]
    fn register_strategy(ref self: Storage, id: u8, name: felt252, addr: ContractAddress) {
        let caller = starknet::get_caller_address();
        assert(caller == self.owner.read(), 'Not authorized');
        self.strategies.write(id, addr);
        self.strategy_names.write(id, name);
        let count = self.num_strategies.read();
        self.num_strategies.write(if id > count { id } else { count });
        StrategyRegistered { id, name, addr }.emit();
    }

    #[external(v0)]
    fn switch_strategy(ref self: Storage, strategy_id: u8) {
        let caller = starknet::get_caller_address();
        assert(caller == self.owner.read(), 'Not authorized');
        let old_id = self.active_strategy.read();
        self.active_strategy.write(strategy_id);
        StrategySwitched { old_id, new_id: strategy_id }.emit();
    }

    #[external(v0)]
    fn deposit(ref self: Storage, amount: u256) {
        let user = starknet::get_caller_address();
        let active_id = self.active_strategy.read();
        let strategy = self.strategies.read(active_id);
        IStrategy::deposit(strategy, user, amount);
    }

    #[external(v0)]
    fn withdraw(ref self: Storage, amount: u256) {
        let user = starknet::get_caller_address();
        let active_id = self.active_strategy.read();
        let strategy = self.strategies.read(active_id);
        IStrategy::withdraw(strategy, user, amount);
    }

    #[external(v0)]
    fn get_user_balance(self: @Storage, user: ContractAddress) -> u256 {
        let active_id = self.active_strategy.read();
        let strategy = self.strategies.read(active_id);
        IStrategy::get_user_balance(strategy, user)
    }

    #[external(v0)]
    fn get_total_deposits(self: @Storage) -> u256 {
        let active_id = self.active_strategy.read();
        let strategy = self.strategies.read(active_id);
        IStrategy::get_total_deposits(strategy)
    }

    #[external(v0)]
    fn get_all_strategies(
        self: @Storage,
    ) -> (u8, Array<u8>, Array<felt252>, Array<ContractAddress>) {
        let num = self.num_strategies.read();
        let mut ids = ArrayTrait::<u8>::new();
        let mut names = ArrayTrait::<felt252>::new();
        let mut addrs = ArrayTrait::<ContractAddress>::new();
        let mut i = 1_u8;
        while i <= num {
            ids.append(i);
            names.append(self.strategy_names.read(i));
            addrs.append(self.strategies.read(i));
            i += 1;
        }
        (num, ids, names, addrs)
    }

    #[external(v0)]
    fn get_strategy_apy(self: @Storage, strategy_id: u8) -> u256 {
        let strategy = self.strategies.read(strategy_id);
        IStrategy::get_simulated_apy(strategy)
    }

    #[external(v0)]
    fn get_active_strategy(self: @Storage) -> (u8, felt252, ContractAddress) {
        let id = self.active_strategy.read();
        (id, self.strategy_names.read(id), self.strategies.read(id))
    }

    // --------- Pragma Oracle Integration ---------
    #[external(v0)]
    fn update_oracle_data(ref self: Storage, price: u256, volatility: u256, timestamp: u64) {
        // Admin or oracle bot calls this to update feed
        let caller = starknet::get_caller_address();
        assert(caller == self.owner.read(), 'Not authorized');
        self.oracle_price.write(price);
        self.oracle_volatility.write(volatility);
        self.last_oracle_update.write(timestamp);
    }

    #[view]
    fn get_oracle_data(self: @Storage) -> (u256, u256, u64) {
        (
            self.oracle_price.read(),
            self.oracle_volatility.read(),
            self.last_oracle_update.read()
        )
    }

    #[external(v0)]
    fn set_min_cdr(ref self: Storage, min_cdr: u256) {
        let caller = starknet::get_caller_address();
        assert(caller == self.owner.read(), 'Not authorized');
        self.min_cdr.write(min_cdr);
    }

    #[view]
    fn get_min_cdr(self: @Storage) -> u256 {
        self.min_cdr.read()
    }

    // ============ ZK Proof Demo ===========
    #[external(v0)]
    fn verify_zk_proof(ref self: Storage, proof: Array<u8>) -> bool {
        // Demo: Accept any proof that ends with b"VALID"
        let n = proof.len();
        if n >= 5 && proof.slice(n - 5, n) == b"VALID" {
            return true;
        }
        false
    }
}
