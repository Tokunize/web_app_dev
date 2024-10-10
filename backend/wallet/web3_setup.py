# mi_app/web3_setup.py
from web3 import Web3
import json

# Conectar a tu nodo Ethereum
# Cambia 'URL_DE_TU_NODO_ETHEREUM' por la URL de tu nodo (por ejemplo, Infura o Alchemy)
w3 = Web3(Web3.HTTPProvider('https://eth-sepolia.g.alchemy.com/v2/lSlhzHIy1ObjB-wLyHNm4SQVTNsqbQmN'))


# Verifica si la conexión fue exitosa
if not w3.is_connected():
    print("Error: No se pudo conectar a la blockchain.")
else:
    print("Conexión exitosa a la blockchain.")

adrress ="0xaC7fa2bD2994E7dD472514DA12B85fE10B9A493B" 
balance = w3.eth.get_balance(adrress)
print(f'Balance de {adrress}: {w3.from_wei(balance, "ether")} ETH')

abi_file_path = "../contracts/investment_abi.json"  # Sube un nivel al directorio

with open(abi_file_path,"r") as abi_file:
    abi = json.load(abi_file)

contract_address="0xBa48678232365764a541c46B7df36bf225634F76"

contract = w3.eth.contract(address=contract_address, abi=abi)

try:
    result = contract.functions.propertyOwner().call()  # Cambia getName por el nombre de la función que deseas llamar
    print(f'Resultado de la función: {result}')
except Exception as e:
    print(f'Error al llamar a la función: {e}')