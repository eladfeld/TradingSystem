SUBSCRIBERS_FILE = "users.csv"
NUM_SUBSCRIBERS = 5000000

def prepare_subscribers():
    file = open(SUBSCRIBERS_FILE, "w")
    for i in range(0, NUM_SUBSCRIBERS):
        #username, password, age, storeId, productId,quantity, checkoutInfo,
        file.write(f'sub_stress_{i}\n',)
    file.close()

def prepare_files():
    prepare_subscribers()

prepare_files()



