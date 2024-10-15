import axios from 'axios';
import React, { useState } from 'react';

// Import & Initialize
// import { initiateUserControlledWalletsClient } from '@circle-fin/user-controlled-wallets';

export const Test = () => {
    const API_KEY = "TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a";
    // const client = initiateUserControlledWalletsClient({
    //     apiKey: API_KEY,
    // });

    const [userId, setUserId] = useState('');
    const [amount, setAmount] = useState('');
    const [destinationAddress, setDestinationAddress] = useState('');
    const [tokenId, setTokenId] = useState('');
    const [walletId, setWalletId] = useState('');

    const getBalance = async () => {
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/contracts/query',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                accept: 'application/json',
                'content-type': 'application/json',
            },
            data: {
                abiFunctionSignature: 'balanceOf(address)',
                abiParameters: ['0x91e728ac04b75b0516fc9265607aa94144a28173'],
                address: '0x9c647515bf36cd00806bd0212bbf25925c92858b',
                blockchain: 'ETH-SEPOLIA',
                abiJson: '[{ /* your ABI goes here */ }]',
            },
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    const invest = async () => {
        const options = {
            method: 'POST',
            url: 'https://api.circle.com/v1/w3s/user/transactions/contractExecution',
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                accept: 'application/json',
                'content-type': 'application/json',
                'X-User-Token': "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoTW9kZSI6IlBJTiIsImRldmVsb3BlckVudGl0eUVudmlyb25tZW50IjoiVEVTVCIsImVudGl0eUlkIjoiMmEwNTUxYWItMDA0YS00NzMzLWIxZmMtYTIwYWUxMTNlZWE1IiwiZXhwIjoxNzI4NTg1MDY0LCJpYXQiOjE3Mjg1ODE0NjQsImludGVybmFsVXNlcklkIjoiZTAyNTBkMTUtNjg2Zi01N2UzLTkwZTEtODFiYjNkMzNmNTNjIiwiaXNzIjoiaHR0cHM6Ly9wcm9ncmFtbWFibGUtd2FsbGV0LmNpcmNsZS5jb20iLCJqdGkiOiJkMWFlOGY4OC00MmViLTQxOWQtOTQ4Mi05ZTFjMTRmMWY0NTciLCJzdWIiOiJ0ZXN0XzAxIn0.TArbBefEWUHzmLHD9vLkKxBjJG-5RqiZDG4n6QH9TNZrR1BzoL8N04tjDknx0viLsIupaQQcdtoeafuRGXB-7rjQzvz_iqwVkb_nTP3uBcP4BWTnREVUkSayMiILOujfyzpM43R3B9daWIkYcidaLVxZxedZXYi_neYD5cMsZ9ykNp5EAlczznjZ_1LViQsWopCjHZZ_QfLrwCLi34eKZRuJaBjSzBXHsJJl4d-919c1W7WGotLCwS3JbdP6BPW88M2pKbigY7Xv6ZMqTAk_KcJIgldMAoLyAmIY2K49zv5RqSlNy4Dj_wNgQ4DPd0sJWPQDFMy0DJFgWaRHQgTVNg", // Replace with actual user token
            },
            data: {
                abiFunctionSignature: 'invest(uint256)',
                abiParameters: [2],
                idempotencyKey: 'b99d5b95-dab0-4063-9789-18b86f43ea19',
                contractAddress: '0x183344fd9158d7ed67a738846f9e3b84b2f680a3',
                feeLevel: 'HIGH',
                walletId: '4809b27d-129a-56dd-bed9-d2989809477d', // Replace with actual wallet ID
            },
        };

        try {
            const { data } = await axios.request(options);
            console.log(data);
        } catch (error) {
            console.error(error);
        }
    };

    // const createTransaction = async () => {
    //     try {
    //         const response = await client.createTransaction({
    //             userId: userId,
    //             amounts: [amount],
    //             destinationAddress: destinationAddress,
    //             tokenId: tokenId,
    //             walletId: walletId,
    //             fee: {
    //                 type: 'level',
    //                 config: {
    //                     feeLevel: 'MEDIUM',
    //                 },
    //             },
    //         });
    //         console.log(response);
    //     } catch (error) {
    //         console.error('Error creating transaction:', error);
    //     }
    // };

    return (
        <section>
            <button onClick={getBalance}>
                Balance
            </button>
            <button onClick={invest}>
                Invest
            </button>
            <section>
                <div>
                    <label>
                        User ID:
                        <input
                            type="text"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Enter User ID"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Amount:
                        <input
                            type="text"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter Amount"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Destination Address:
                        <input
                            type="text"
                            value={destinationAddress}
                            onChange={(e) => setDestinationAddress(e.target.value)}
                            placeholder="Enter Destination Wallet Address"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Token ID:
                        <input
                            type="text"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            placeholder="Enter Token ID"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Wallet ID:
                        <input
                            type="text"
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                            placeholder="Enter Wallet ID"
                        />
                    </label>
                </div>
                <div>
                    {/* <button onClick={createTransaction}>
                        Create Transaction
                    </button> */}
                </div>
            </section>
        </section>
    );
};
