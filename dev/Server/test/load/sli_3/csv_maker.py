USER_FILE = "users.csv"
NUM_USERS = 100

def prepare_users():
    file = open(USER_FILE, "w")
    for i in range(0, NUM_USERS):
        file.write(f'user_sli3_{i},123,25,store_sli3_{i},product_sli3_{i}\n')
    file.close()



prepare_users()



