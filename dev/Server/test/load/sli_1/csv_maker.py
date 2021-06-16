USER_FILE = "users.csv"
NUM_USERS = 100

def prepare_users():
    file = open(USER_FILE, "w")
    for i in range(0, NUM_USERS):
        file.write(f'user_sli1_{i},sdyrcsdlk,25,store_sli1_{i},product_sli1_{i}\n')
    file.close()



prepare_users()



