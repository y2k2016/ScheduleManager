import requests

# res = requests.get("http://127.0.0.1:3000/wsdl?wsdl")
# print(res.content.decode())


# res = requests.get("http://127.0.0.1:3000/users/find_user/y2k")
# print(res.content.decode())

import threading



res = requests.get("http://127.0.0.1:3000/schedule/find_schedules")
print(res.content.decode())

