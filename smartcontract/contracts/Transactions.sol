// SPDX-License-Identifier: UNLICENSED
//specify solidity version
pragma solidity ^0.8.0;

contract Transactions{
    //variable to hold no of txns
    uint256 transactionCount;
  // function to transfer cyrptocurrency
    event Transfer(address from, address receiver,uint amount,string message,uint256 timestamp,string keyword);
 //structure
 struct TransferStruct{
    address sender;
    address reciver;
    uint amount;
    string message;
    uint256 timestamp;
    string keyword;

 }
 //array of different transactions
 TransferStruct[] transactions;
 function addToBlockchain(address payable receiver, uint amount , string memory message,string memory keyword) public{
   transactionCount +=1;
   //pushing txn ino the txn arrray/list of txns
   transactions.push(TransferStruct(msg.sender, receiver,amount,message,block.timestamp,keyword));

   //making the transfer by emititng the transfer event
   emit Transfer(msg.sender, receiver,amount,message,block.timestamp,keyword);

 }
 function getAllTransactions() public view returns(TransferStruct[] memory){
    return transactions;
 }
 function getTransactionCount() public view returns (uint256){
    return transactionCount;
 }
}