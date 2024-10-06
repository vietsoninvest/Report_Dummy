import json
import random
import string
from datetime import datetime

with open('Json/2021/data_month_12.json') as f:
    data = json.load(f)
outlets = ["Outlet A", "Outlet B", "Outlet C", "Outlet D", "Outlet E"]

def random_string(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))

# dummy replacement
for record in data:
    record['Order_ID'] = random.randint(1000, 9999) 
    record['Date'] = datetime.now().strftime('%Y-%m-%d') 
    record['Time'] = datetime.now().strftime('%H:%M:%S')  
    record['Outlet'] = random.choice(outlets)  
    record['Model'] = random_string()  #
    record['ProductID'] = random.randint(100, 500)  #
    record['ProductName'] = random_string(12)  
    record['Price'] = round(random.uniform(50, 500), 2) 
    record['Revenue'] = round(random.uniform(15000, 100000), 2)  
    record['Profit'] = round(random.uniform(15000, 100000), 2)

# Save the dummy data back to JSON
with open('Json/2021/dummy_data_month_12.json', 'w') as f:
    json.dump(data, f, indent=4)
