OWNERS_FILE = "owners.csv"
SUBSCRIBERS_FILE = "subscribers.csv"
GUESTS_FILE = "guests.csv"
NUM_USERS = 10000

NUM_OWNERS = 1000
NUM_SUBSCRIBERS = 3000
NUM_GUESTS = 6000


def prepare_owners():
    file = open(OWNERS_FILE, "w")
    for i in range(0, NUM_OWNERS):
        #username, password, age, storename, productname, price, quantity
        file.write(f'owner_sli2_{i},sdyrcsdlk,25,store_sli2_{i},product_sli2_{i},1,10000000\n')
    file.close()

def prepare_subscribers():
    file = open(SUBSCRIBERS_FILE, "w")
    for i in range(0, NUM_SUBSCRIBERS):
        #username, password, age, storeId, productId,quantity, checkoutInfo,
        file.write(f'sub_sli2_{i},sdyrcsdlk,25,0,0,1,7\n',)
    file.close()

def prepare_guests():
    file = open(GUESTS_FILE, "w")
    for i in range(0, NUM_GUESTS):
        #productId, quantity, checkoutInfo
        file.write(f'{i%NUM_OWNERS},1,7\n',)
    file.close()

def prepare_files():
    prepare_owners()
    prepare_subscribers()
    prepare_guests()

prepare_files()



