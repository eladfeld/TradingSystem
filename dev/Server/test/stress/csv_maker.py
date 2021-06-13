USER_FILE = "users.csv"
NUM_USERS = 100

def prepare_users():
    file = open(USER_FILE, "w")
    for i in range(0, NUM_USERS):
        file.write(f'user_stress_{i},123,25,store_stress_{i},product_stress_{i}\n')
    file.close()



prepare_users()



