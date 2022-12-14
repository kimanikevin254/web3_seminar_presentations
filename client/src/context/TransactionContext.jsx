import React,{useEffect, useState} from "react";
import { ethers } from 'ethers';
import { contractABI,contractAddress } from '../utils/constants';

export const TransactionContext =React.createContext();
//accessing ethereum object
const {ethereum} = window; 

//function to fetch ethereum contract
const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress,contractABI,signer);

    return transactionContract;
}

export const TransactionProvider = ({children}) => {
    const [currentAccount, setCurentAccount]=useState('')

    const [formData,setFormData] = useState ({addressTo: '',amount:'',keyword:'',message:''});

    const [isLoading,setIsLoading] = useState (false);

    const [transactionCount,setTransactionCount] = useState(localStorage.getItem('transactionCount'));

    const [transactions, setTransactions] = useState([])

const handleChange = (e,name)=>{
    setFormData((prevState)=>({...prevState,[name]:e.target.value}));
}

const getAllTransactions = async () => {
    try {
        if(!ethereum) return alert("Please install metamask")
        const  transactionContract=getEthereumContract();
        const availableTransactions = await transactionContract.getAllTransactions()
        const structuredTransactions = availableTransactions.map(transaction => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
            message: transaction.message,
            keyword: transaction.keyword,
            amount: parseInt(transaction.amount._hex) / (10 ** 18)
        }))

        setTransactions(structuredTransactions)
    } catch (error) {
        console.log(error)
    }
}

const checkifWalletIsConnected = async ()=>{

    try {
        if(!ethereum) return alert ("PLease install metamask");

        const accounts = await ethereum.request({method:'eth_accounts'});

        if(accounts.length){
            setCurentAccount(accounts[0]);
            getAllTransactions();
        }else{
            console.log('No Accounts found');
        }
    } catch (error) {
        console.log(error);
        throw new Error("No ethereum object.")
    
    }
    

    
}

    const checkIfTransactionExist =async () =>{
        try {
            const  transactionContract=getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount(); 

            window.localStorage.setItem("transactionCount",transactionCount)

        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }
    const connectWallet = async()=>{
        try {
            if (!ethereum) return alert ("Please install metamask");

            const accounts = await ethereum.request({method:'eth_requestAccounts'});

            setCurentAccount(accounts[0])
        } catch (error) {
            console.log(error);
            throw new Error("No ethereum object.")
        }
    }
  //send transaction
  const sendTransaction =async ()=>{
    try {
        if (!ethereum) return alert ("Please install metamask");
        //get data from the form...
        const { addressTo, amount, keyword, message } = formData;
        const  transactionContract=getEthereumContract();

        const parsedAmount = ethers.utils.parseEther(amount);

        await ethereum.request({
            method: 'eth_sendTransaction',
            params:[{
                from: currentAccount,
                to:addressTo,
                gas:'0x5208', //21000 GWEI
                value: parsedAmount._hex, //0.00001
            }]
        });

    const transactionHash = await transactionContract.addToBlockchain(addressTo,parsedAmount,message,keyword);
     setIsLoading(true);
     await transactionHash.wait();
     setIsLoading(false);

     const transactionCount = await transactionContract.getTransactionCount(); 

     setTransactionCount(transactionCount.toNumber());
    } catch (error) {
        console.log(error);
            throw new Error("No ethereum object.")
    }
  }
    useEffect(()=>{
        checkifWalletIsConnected(); 
        checkIfTransactionExist();
    },[]);
    return(
        <TransactionContext.Provider value={{connectWallet,currentAccount,formData,handleChange,sendTransaction,transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}