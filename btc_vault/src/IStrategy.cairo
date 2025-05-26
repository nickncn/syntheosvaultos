// src/istrategy.cairo
#[starknet::interface]
trait IStrategy<TContractState> {
    fn deposit(ref self: TContractState, user: ContractAddress, amount: u256);
    fn withdraw(ref self: TContractState, user: ContractAddress, amount: u256);
    fn get_user_balance(self: @TContractState, user: ContractAddress) -> u256;
    fn get_total_deposits(self: @TContractState) -> u256;
    fn get_simulated_apy(self: @TContractState) -> u256;
}
