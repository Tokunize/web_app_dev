# import requests

# url = "https://api.circle.com/v1/w3s/config/entity/publicKey"

# apikey ="TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a"

# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}"
# }

# response = requests.get(url, headers=headers)

# print(response.text)

import requests
import json

# Your API key
apikey ="TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a"

# # Circle API endpoint
# url = "https://api.circle.com/v1/w3s/users"

# # Payload for the request
# payload = {
#     "userId": "user06"
# }

# # Headers for the request
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}"
# }


# # Sending the POST request with JSON data
# response = requests.post(url, json=payload, headers=headers)

# # Printing the response from the server
# print(response.text)



# {"data":{"id":"user06","status":"ENABLED","createDate":"2024-09-25T14:23:16Z","pinStatus":"UNSET","pinDetails":{"failedAttempts":0},"securityQuestionStatus":"UNSET","securityQuestionDetails":{"failedAttempts":0},"authMode":"PIN"}}

# # seesion token  second

# url = "https://api.circle.com/v1/w3s/users/token"

# payload = {
#     "userId": "user06"  
# }


# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}"
# }

# response = requests.post(url, json=payload, headers=headers)

# print(response.text)


# {"data":{"userToken":"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoTW9kZSI6IlBJTiIsImRldmVsb3BlckVudGl0eUVudmlyb25tZW50IjoiVEVTVCIsImVudGl0eUlkIjoiMmEwNTUxYWItMDA0YS00NzMzLWIxZmMtYTIwYWUxMTNlZWE1IiwiZXhwIjoxNzI3Mjc4MzM3LCJpYXQiOjE3MjcyNzQ3MzcsImludGVybmFsVXNlcklkIjoiN2MxNzdiMGUtOGFlOC01OTQ5LThkYjktYjIxODkwMWZlMWQ4IiwiaXNzIjoiaHR0cHM6Ly9wcm9ncmFtbWFibGUtd2FsbGV0LmNpcmNsZS5jb20iLCJqdGkiOiJlYzNhNzk5Ni0xMDI0LTQ0MGUtYTI3NS04ZjdlYjNjY2JhMDciLCJzdWIiOiJ1c2VyMDYifQ.NL9egLVMu1RJYINiJPC_64etH6CVchIcwM-uAp_wkPiUDFsJ-peVhr8z2TWmxX6S1fb1sYmyxpLZobfiHsmIcj1NN_3gi0h3j5YqbabDAKbMVmKA6US7L42KL1BWW0IAv16XWlQY1XR6oepT8FZ8tlfLfOC2EoGfRLo7Vig7UIfiiMpZriOvK0cLy1X6vvsJZNXtG9gEhzKoRsA6VYR4dVsWfCS4zPJ5l92PnqDY26Y2uTw47CZWrK9Q4Fa43mwGYK0xDclouP5IUZLjtbn5-0-l5ITTpcHxVHhUoUJkoM7o9jdDfNZMpb3w3nCwVF5QaBAjeDsdYSTp3l_alkB9hQ","encryptionKey":"mOPmQiP/UKzFjKjPmXBKJjdFjDcgVxnm47X1AwhEbNo="}}
# # inincializar user

# idempotency_key="3ced0c44-63e3-4c45-9830-f4486831f345"
# apikey ="TEST_API_KEY:1ab22a4b6d7bce416909d5a18a3c6600:d2317914305e75437353c243db46a89a"
# user_token="eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoTW9kZSI6IlBJTiIsImRldmVsb3BlckVudGl0eUVudmlyb25tZW50IjoiVEVTVCIsImVudGl0eUlkIjoiMmEwNTUxYWItMDA0YS00NzMzLWIxZmMtYTIwYWUxMTNlZWE1IiwiZXhwIjoxNzI3Mjc4MzM3LCJpYXQiOjE3MjcyNzQ3MzcsImludGVybmFsVXNlcklkIjoiN2MxNzdiMGUtOGFlOC01OTQ5LThkYjktYjIxODkwMWZlMWQ4IiwiaXNzIjoiaHR0cHM6Ly9wcm9ncmFtbWFibGUtd2FsbGV0LmNpcmNsZS5jb20iLCJqdGkiOiJlYzNhNzk5Ni0xMDI0LTQ0MGUtYTI3NS04ZjdlYjNjY2JhMDciLCJzdWIiOiJ1c2VyMDYifQ.NL9egLVMu1RJYINiJPC_64etH6CVchIcwM-uAp_wkPiUDFsJ-peVhr8z2TWmxX6S1fb1sYmyxpLZobfiHsmIcj1NN_3gi0h3j5YqbabDAKbMVmKA6US7L42KL1BWW0IAv16XWlQY1XR6oepT8FZ8tlfLfOC2EoGfRLo7Vig7UIfiiMpZriOvK0cLy1X6vvsJZNXtG9gEhzKoRsA6VYR4dVsWfCS4zPJ5l92PnqDY26Y2uTw47CZWrK9Q4Fa43mwGYK0xDclouP5IUZLjtbn5-0-l5ITTpcHxVHhUoUJkoM7o9jdDfNZMpb3w3nCwVF5QaBAjeDsdYSTp3l_alkB9hQ"
# blockchain ="ETH-SEPOLIA"

# url = "https://api.circle.com/v1/w3s/user/initialize"

# payload = {
#     "idempotencyKey": idempotency_key,
#     "blockchains": [blockchain]
# }

# # Headers for the request
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}",
#     "X-User-Token": user_token
# }

# # Sending the POST request with JSON data
# response = requests.post(url, json=payload, headers=headers)

# # Printing the response from the server
# print(response.text)

# {"data":{"challengeId":"2f1fbd56-9088-5557-bc55-f572c47d0135"}}






# url = "https://api.circle.com/v1/faucet/drips"

# # Replace <YOUR_WALLET_ADDRESS> and <YOUR_API_KEY> with actual values
# payload = {
#     "address": "0x1fc48b11da71b44bf757acb2144402f4c456b2c5",
#     "blockchain": "ETH-SEPOLIA",
#     "native": False,
#     "usdc": True,
#     "eurc": False
# }

# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}"
# }

# # Use json=payload instead of data=payload to send JSON data
# response = requests.post(url, json=payload, headers=headers)

# # Print the response text
# print(response.text)




wallet_id = "a2bf023e-ed97-5219-aef7-d46e7ae15b38"  # Provide your actual wallet ID here
# url = f"https://api.circle.com/v1/w3s/wallets/{wallet_id}/balances"

# headers = {
#     "Content-Type": "application/json",
#     "Authorization": f"Bearer {apikey}"  # Replace with your actual API key
# }

# response = requests.get(url, headers=headers)

# # Check if the request was successful
# if response.status_code == 200:
#     print("Balances retrieved successfully:", response.json())  # Parse and print the JSON response
# else:
#     print("Error:", response.status_code, response.text)



user_id_from_payload="d3f4c782" 
url= f"https://api.circle.com/v1/w3s/wallets?userId={user_id_from_payload}"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {apikey}"
}

response = requests.get(url, headers=headers)

response_data = response.json()
wallets = response_data.get("data", {}).get("wallets", [])
print(f"Wallets: {wallets}")

wallet_details = wallets[0]
wallet_id = wallet_details.get("id")
wallet_address = wallet_details.get("address")

print(wallet_address)
# {"data":{"wallets":[{"id":"9e66e539-c98c-5560-8ca2-01fd8a871ada","state":"LIVE","walletSetId":"f3a7f831-9494-5bf3-9625-5d51f9e97fb4","custodyType":"ENDUSER","userId":"user08","address":"0x9e63432feab12d3ea68ac76b5ad108592df92d65","blockchain":"ETH-SEPOLIA","accountType":"SCA","updateDate":"2024-09-25T17:02:47Z","createDate":"2024-09-25T17:02:47Z","scaCore":"circle_6900_singleowner_v1"}]}}


# from .wallet.models import Wallet

# def saveWalletInBackend(circleId,userId):
    
#     get_wallet_url = f"https://api.circle.com/v1/w3s/wallets?userId=${userId}"
#     headers ={
#         "Content-Type": "Application/json",
#         "Authorization": f"Bearer {apikey}"
#     }
#     response = requests.get(get_wallet_url, headers=headers)

#     response_data = response.json()
#     wallet_addres = response_data.get("data",{}).get("address")
#     wallet_id = response_data.get("data",{}).get("id")
    
    

#     print(response.text)




