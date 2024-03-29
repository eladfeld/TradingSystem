import StateBuilder, {storeItemState, categoryState} from "./StateBuilder";

export const categories = {
    ELECTRONICS: "Electronics",
    FOOD: "Food",
    CLOTHING: "Clothing",
    ALCOHOL: "Alcohol",
    SMOKE: "Smoking"
}


/*
********************************* Electronics ****************************************
*/
export const electronicsCategories = {
    TVS: "TVs",
    COMPUTERS: "Computers",
    CELL_PHONES: "Cell Phones",
    PRINTERS: "Printers",
    VIDEO_GAMES: "Video Games",
    ACCESSORIES: "Accessories"
}

export const tvs = [
    'SAMSUNG 65" Class 4K Ultra HD (2160P) HDR Smart QLED TV QN65Q60T 2020',
    'Samsung QN50Q60TA 50" Ultra High Definition 4K Quantum HDR Smart QLED TV with a 1 Year Extended Warranty (2020)',
    'Sceptre 32" Class HD (720p) Android Smart LED TV with Google Assistant (A328BV-SR)',
    'LG 65" Class 4K UHD 2160P Smart TV 65UN6950ZUA 2020 Model',
    'TCL 32" Class 720P HD LED Roku Smart TV 3 Series 32S331',
    'onn. 70” Class 4K UHD (2160P) LED Roku Smart TV HDR (100012588)',
    'TCL 65" Class 4K UHD LED Roku Smart TV HDR 4 Series 65S421',
    'LG 43" Class 4K UHD 2160P Smart TV 43UN7300PUF (2020 Model)',
    'VIZIO 43" Class FHD LED Smart TV D-Series D43fx-F4',
    'Sceptre 43" Class FHD (1080p) Android Smart LED TV with Google Assistant (A438BV-F)',
    'Samsung QN75Q60TA 75" Ultra High Definition 4K Quantum HDR Smart QLED TV With a Samsung HW-T650 Bluetooth Soundbar with Dolby Audio Wireless Subwoofer (2020)',
    'SAMSUNG 75" Class 4K UHD (2160P) The Frame QLED Smart TV QN75LS03T 2020',
    'LG 50" Class 4K UHD 2160P Smart TV 50UN6950ZUF 2020 Mode',
    'Hisense 40" Class FHD (1080P) Roku Smart LED TV (40H4030F1)',
    'Hisense 32" Class 720P HD LED Roku Smart TV 32H4030F1',
    'Samsung QN75Q60TA 75" Ultra High Definition 4K Quantum HDR Smart QLED TV with a 1 Year Extended Warranty (2020)',
    'JVC 40" FHD HDR Roku TV, LT-40MAW305',
    'Sceptre 40" Class FHD (1080P) LED TV (X405BV-FSR)',
    'Samsung UN65TU8000 65" 8 Series Ultra High Definition Smart 4K Crystal TV with a Samsung HW-Q60T Wireless 5.1 Channel Soundbar and Bluetooth Subwoofer (2020)',
    'Seiki 39" 720p LED TV (SC-39HS950N)',
    'LG 65" Class 4K UHD 2160P Smart TV 65UN7300PUF 2020 Model',
    'LG 75" Class 4K UHD 2160P Smart TV with HDR - 75UN7070PUC 2020 Model'
]

export const computerCategories = {
    DESKTOPS: "Desktops",
    LAPTOPS: "Laptops"
}

export const desktops = [
    'HP Desktop PC System Windows 10 Dual Core Processor 4GB Ram 250GB Hard Drive with a 19" LCD Monitor-Refurbished Computer',
    'Dell Desktop Computer OptiPlex 990 SFF Intel Core i7 8GB RAM 512GB (New SSD) Wi-Fi DVD 19" LCD Monitor - Refurbished Windows 10 PC',
    `Dell OptiPlex Desktop Computer Intel Core i5 3.1GHz 8GB RAM 1TB HD DVDRW Windows 10 Dual 22" LCD's Wi-Fi Refurbished PC`,
    `AMD Ryzen 5 3600 6-Core, 12-Thread 4.2 GHz AM4 Processor`,
    `HP 7900 Desktop Computer Bundle Windows 10 Intel Core 2 Duo 2.8GHZ Processor 4GB Ram 250GB Hard Drive DVD Wifi with a 19" LCD-Refurbished Computer`,
    `Dell Optiplex 790 Windows 10 Pro Desktop PC Tower Core i5 3.1GHz Processor 8GB RAM 1TB Hard Drive with DVD-RW-Refurbished Computer`,
    `Lenovo ThinkCentre Desktop Computer Bundle With Intel Core i3 Processor 4GB RAM 250GB HD DVD Wifi Windows 10 with a 19" Monitor Keyboard and Mouse - Refurbished`,
    `HP Desktop Computer Bundle Windows 10 Intel 2.13GHz Processor 4GB Ram 250GB Hard Drive with a 17" LCD Monitor Wifi, Keyboard and Mouse - Refurbished`,
    `Dell OptiPlex 9020 USFF Desktop Computer Intel Core i7 Processor 8GB RAM 256GB SSD Wi-fi DVD with 19" LCD Monitor Windows 10 Pro - Refurbished PC`
]

const laptops = [
    `HP Pavilion 15.6" i5 8/512 Laptop - Lunar Gold`,
    `Acer Spin 3 Thin and Light Convertible 2-in-1, 14" HD Touch, AMD Ryzen 3 3250U Dual-Core Mobile Processor with Radeon Graphics, 4GB DDR4, 128GB NVMe SSD, Windows 10 in S mode, SP314-21-R56W`,
    `Acer 315 15.6" Celeron 4GB/32GB Chromebook, 15.6" HD Display, Intel Celeron N4000, 4GB LPDDR4, 32GB eMMC, Protective Sleeve, Chrome OS - CB315-3H-C2C3`,
    `Gateway 15.6" FHD Ultra Slim Notebook, Intel Core i5-1035G1, 16GB RAM, 256GB SSD, Webcam, HDMI, Fingerprint Scanner, Cortana, Windows 10 Home`,
    `HP Pavilion i5 GTX 1650 8GB/256GB Gaming Laptop`,
    `Lenovo IdeaPad Flex 5 14" FHD Convertible, AMD Ryzen 3 4300U, 4GB RAM, 128GB SSD, Graphite Grey, Windows 10S, 81X2000HUS`,
    `Lenovo L340 15 Gaming 15.6" FHD, Intel Core i5-9300HF, NVIDIA GeForce GTX 1650, 8GB RAM, 512GB SSD, Black, Windows 10, 81LK01MTUS`,
    `Dell Chromebook CB1C13 Laptop Computer Chromebook, 1.40 GHz Intel Celeron, 2GB DDR3 RAM, 16GB SSD Hard Drive, Chrome, 11" Screen (Refurbished)`,
    `ASUS ROG Gaming 17.3" FHD, Intel Core i7-10750H, NVIDIA GeForce RTX 2070 Super Graphics, 8GB RAM, 512GB SSD, Original Black, G712LWS-WB74`,
    `SAMSUNG Chromebook 4 11.6" Intel Celeron Processor N4000 4GB RAM 32GB eMMC Intel UHD Graphics 600 - XE310XBA-K01US (Google Classroom Ready)`,
    `Lenovo 81JW0001US Chromebook S330, 14" HD Display, Mediatek MT8173C CPU 4GB RAM, 32GB eMMC SSD, Chrome OS, Black`,
    `ASUS VivoBook 14" Ryzen 3 8/256 Laptop-Slate Grey, F412DA-WS33`,
    `Gateway 14.1" FHD Ultra Slim Notebook, Intel Core i5-1035G1, 16GB RAM, 256GB SSD, Tuned by THX™ Audio, Fingerprint Scanner, Webcam, HDMI, Cortana, Windows 10 Home`,
    `ASUS VivoBook 15.6"FHD, AMD Ryzen™ 3 3250U, 4GB DDR4 RAM, 128G SSD, Slate Gray, F512DA-WB31`,
    `HP PAVILION 15.6" i7 8/512 LAPTOP-LUNAR GOLD`,
    `Microsoft Surface Laptop Go, 12.4" Touchscreen, Intel Core i5-1035G1, 8GB Memory, 128GB SSD, Ice Blue, THH-00024`,
    `HP 14" Pentium 4GB/64GB Chromebook, 14" HD Display, Intel Pentium Silver N5000, 4GB RAM, 64GB eMMC, Intel UHD Graphics 605, 14a-na0031wm`,
    `Lenovo IdeaPad 1 14.0" Laptop, Intel Pentium Silver N5030 Quad-Core Processor, 4GB Memory, 128GB Solid State Drive, Windows 10S - Ice Blue - 81VU000JUS`,
    `Lenovo Thinkpad in Black T420 HD 14" Intel Core i5 2520M (2.5GHz-3.2GHz) 4GB Memory 320GB Hard Drive Webcam Bluetooth DVD-RW Windows 10 Professional Laptop (Refurbished)`,
    `Dell Chromebook - 11.6" - Celeron N2840 - 4 GB RAM - 16 GB SSD - English (Refurbished)`
]

export const cellphones = [
    "Samsung Galaxy S21 Ultra",
    "iPhone 12 Pro",
    "iPhone 12 Pro Max",
    "Samsung Galaxy S21",
    "Samsung Galaxy S21 Plus",
    "iPhone 12",
    "iPhone 12 mini",
    "OnePlus 9 Pro",
    "Samsung Galaxy Note 20 Ultra",
    "iPhone SE 2020",
    "Samsung Galaxy S20 Fan Edition",
    "OnePlus 9",
    "Samsung Galaxy S20",
    "Samsung Galaxy S20 Plus",
    "Google Pixel 5",
    "iPhone 11",
    "Google Pixel 4a",
    "iPhone XR",
    "Motorola One 5G"
]

export const printers = [
    "HP Business InkJet 1000",	
    "HP Business InkJet 1100",	
    "HP Business InkJet 1100d",	
    "HP Business InkJet 1100dtn",
    "HP Business InkJet 1200",	
    "HP Business InkJet 1200d",	
    "HP Business InkJet 1200dn",	
    "HP Business InkJet 1200dtn",
    "HP Business InkJet 1700c",	
    "HP Business InkJet 1700cp",	
    "HP Business InkJet 2000c",	
    "HP Business InkJet 2000cn",
    "HP Business InkJet 2200",	
    "HP Business InkJet 2200se",	
    "HP Business InkJet 2200xi",	
    "HP Business InkJet 2230",
    "HP Business InkJet 2250",	
    "HP Business InkJet 2250tn",	
    "HP Business InkJet 2280",	
    "HP Business InkJet 2280tn",
    "HP Business InkJet 2300",	
    "HP Business InkJet 2300dtn",	
    "HP Business InkJet 2300n",	
    "HP Business InkJet 2500c",
    "HP Business InkJet 2600",	
    "HP Business InkJet 2600dn",	
    "HP Business InkJet 2800",	
    "HP Business InkJet 2800dt",
    "HP Business InkJet 2800dtn",	
    "HP Business InkJet 3000",	
    "HP Business InkJet 3000dn",	
    "HP Business InkJet 3000dtn"
]

export const videoGames = {
    minecraft:"Minecraft", gta5:"Grand Theft Auto V", tetris:"tetris",
    wiiSports:"Wii Sports",siperMarioBros:"Super Mario Bros", pokemonRed:"Pokemon Red",
    pokemonBlue:"Pokemon Blue", marioCart:"Mario Cart",pacman:"Pac-Man",duckHunt:"Duck Hunt",
    callOfDuty:"Call of Duty",gta4:"Grand Theft Auto IV",fifa18:"FIFA 18",sonic:"Sonic the Hedgehog",
    zelda:"The Legend of Zelda", superSmashBros:"Super Smash Bros",sims4:"The Sims 4", spiderman:"Spiderman"
}

export const accessories = [
    `Logitech G733 Lightspeed Wireless PC Gaming Headset - Black`,
    `Logitech G305 LIGHTSPEED Wireless Gaming Mouse - Black`,
    `APC UPS, 1500VA UPS Battery Backup & Surge Protector with AVR, LCD Uninterruptible Power Supply, Back-UPS Pro Series (BX1500M)`,
    `Microsoft Surface Dock 2, Black, SVS-00001`,
    `Logitech G915 TKL Ten keyless Lightspeed Wireless RGB Mechanical Gaming Keyboard - White`,
    `Tzumi Wireless Charging Pad and Rechargeable Wireless Mouse - Built-in Wireless Charging Phone Stand for all Qi-Enabled Devices`,
    `GE-branded 6 Outlet Surge Protector Twin Pack – 14709`,
    `Razer Power Up Bundle – Cynosa Lite, Viper, and Kraken X Lite`,
    `Logitech 16" Laptop Sleeve with M185 Mouse`,
    `MOTILE™ Wireless Multi-Device Bluetooth® Keyboard, Nickel`,
    `GE Pro 7-Outlet 2-USB Power Strip Surge Protector, 3ft. Cord - 37054`,
    `SteelSeries Arctis 1 Wireless Headset Black`,
    `Webcam with Microphone, Necano 1080P HD Webcam`
]


/*
********************************* Food ****************************************
*/

export const foodCategories = {
    SNACKS:"Snacks",
    BEVERAGES:"Beverages",
    CEREAL:"Cereal",
    FRUIT:"Fruit",
    VEGETABLES:"vegetables"
}

export const snacks ={
    Slushie:"Slushie",
    Fun_Dip:"Fun Dip",
    Chips_Ahoy:"Chips Ahoy!",
    Caramel:"Caramel",
    Almond_Joy:"Almond Joy",
    Bananas:"Bananas",
    Smarties:"Smarties",
    Pudding:"Pudding",
    Frozen_Yogurt:"Frozen Yogurt",
    Milk_Chocolate_MMs:"Milk Chocolate M&Ms",
    Jujubes:"Jujubes",
    Cheese_Danish:"Cheese Danish",
    Pretzels:"Pretzels",
    Frosted_Animal_Cracker:"Frosted Animal Cracker",
    Whatchamacallit:"Whatchamacallit",
    Trail_Mix:"Trail Mix",
    Gummy_Bears:"Gummy Bears",
    Ritz_Bits_Cheese:"Ritz Bits Cheese",
    Mints:"Mints",
    Peanuts:"Peanuts",
    Combos:"Combos"
}

export const beverages = {
    Mountain_Dew_Code_Red:'Mountain Dew Code Red',
    Fresca:'Fresca',
    Stewarts_Black_Cherry_Wishniak_Soda:"Stewart'S Black Cherry Wishniak Soda",
    AW_Cream_Soda:'A&W Cream Soda',
    Wild_Cherry_Pepsi:'Wild Cherry Pepsi',
    Canada_Dry:'Canada Dry',
    Fanta:'Fanta',
    Mr_Pibb:'Mr. Pibb',
    Mug_Root_Beer:'Mug Root Beer',
    Jolt_Cola:'Jolt Cola',
    Moxie:'Moxie',
    Mist_Twist:'Mist Twist',
    sevenUp:'7Up',
    Mountain_Dew_Baja_Blast:'Mountain Dew Baja Blast',
    Ale_8:'Ale 8',
    Mountain_Dew_Livewire:'Mountain Dew Livewire',
    Coca_Cola:'Coca-Cola',
    Grape_Crush:'Grape Crush',
    Sioux_City:'Sioux City',
    Vanilla_Coke:'Vanilla Coke',
    Big_Red_Soda:'Big Red Soda'
}

export const cereals = {
    Frosted_Flakes:"Frosted Flakes",
    Cranberry_Almond_Crunch_Cereal:"Cranberry Almond Crunch Cereal",
    Coco_Pops:"Coco Pops",
    Chocolate_Cheerios:"Chocolate Cheerios",
    Chex:"Chex",
    Wheat_Chex:"Wheat Chex",
    General_Mills_Lucky_Charms_Cereal:"General Mills Lucky Charms Cereal",
    Apple_Cinnamon_Cheerios:"Apple Cinnamon Cheerios",
    Sugar_Puffs:"Sugar Puffs",
    General_Mills_Cinnamon_Chex:"General Mills Cinnamon Chex",
    Nestle_Golden_Grahams_Cereal:"Nestle Golden Grahams Cereal",
    Golden_Nuggets:"Golden Nuggets",
    Honey_Nut_Cheerios:"Honey Nut Cheerios",
    Captain_Crunch:'Cap"N Crunch',
    Frosted_Cheerios:"Frosted Cheerios",
    Christmas_Crunch:"Christmas Crunch",
    Frosted_Mini_Chex:"Frosted Mini Chex",
    Ready_Brek_Original_Flavour:"Ready Brek Original Flavour",
    Cinnamon_Toast_Crunch:"Cinnamon Toast Crunch",
    Cocoa_Puffs:"Cocoa Puffs",
    All_Bran_Bran_Flake:"All-Bran Bran Flakes"
}

export const fruit = {
    Abiu:"Abiu",
    Açaí:"Açaí",
    Acerola:"Acerola",
    Ackee:"Ackee",
    African_cucumber:"African cucumber",
    Apple:"Apple",
    Apricot:"Apricot",
    Avocado:"Avocado",
    Banana:"Banana",
    Bilberry:"Bilberry",
    Blackberry:"Blackberry",
    Blackcurrant:"Blackcurrant",
    Black_sapote:"Black sapote",
    Blueberry:"Blueberry",
    Boysenberry:"Boysenberry",
    Breadfruit:"Breadfruit",
    Buddhas_hand:"Buddha's hand (fingered citron)",
    Cactus_pear:"Cactus pear",
    Canistel:"Canistel",
    Cempedak:"Cempedak",
    Crab_apple:"Crab apple",
    Cherimoya:"Cherimoya (Custard Apple)",
    Cherry:"Cherry",
    Chico_fruit:"Chico fruit",
    Cloudberry:"Cloudberry",
    Coco_De_Mer:"Coco De Mer",
    Coconut:"Coconut",
    Cranberry:"Cranberry",
    Currant:"Currant",
    Damson:"Damson",
    Date:"Date",
    Dragonfruit:"Dragonfruit (or Pitaya)",
    Durian:"Durian",
    Egg_Fruit:"Egg Fruit",
    Elderberry:"Elderberry",
    Feijoa:"Feijoa",
    Fig:"Fig",
    Goji_berry:"Goji berry",
    Gooseberry:"Gooseberry",
    Grape:"Grape",
    Raisin:"Raisin",
    Grapefruit:"Grapefruit",
    Grewia_asiatica:"Grewia asiatica (phalsa or falsa)",
    Guava:"Guava",
    Hala_Fruit:"Hala Fruit",
    Honeyberry:"Honeyberry",
    Huckleberry:"Huckleberry",
    Jabuticaba:"Jabuticaba",
    Jackfruit:"Jackfruit",
    Jambul:"Jambul",
    Japanese_plum:"Japanese plum",
    Jostaberry:"Jostaberry",
    Jujube:"Jujube",
    Juniper_berry:"Juniper berry",
    Kaffir_Lime:"Kaffir Lime",
    Kiwan_:"Kiwano (horned melon)",
    Kiwifruit:"Kiwifruit",
    Kumquat:"Kumquat",
    Lemon:"Lemon",
    Lime:"Lime",
    Loganberry:"Loganberry",
    Longan:"Longan",
    Loquat:"Loquat",
    Lulo:"Lulo",
    Lychee:"Lychee",
    Magellan_Barberry:"Magellan Barberry",
    Mamey_Apple:"Mamey Apple",
    Mamey_Sapote:"Mamey Sapote",
    Mango:"Mango",
    Mangosteen:"Mangosteen",
    Marionberry:"Marionberry",
    Melon:"Melon",
    Cantaloupe:"Cantaloupe",
    Galia_melon:"Galia melon",
    Honeydew:"Honeydew",
    Mouse_Melon:"Mouse Melon",
    Watermelon:"Watermelon",
    Miracle_fruit:"Miracle fruit",
    Monstera_deliciosa:"Monstera deliciosa",
    Mulberry:"Mulberry",
    Nance:"Nance",
    Nectarine:"Nectarine",
    Orange:"Orange",
    Blood_orange:"Blood orange",
    Clementine:"Clementine",
    Mandarine:"Mandarine",
    Tangerine:"Tangerine",
    Papaya:"Papaya",
    Passionfruit:"Passionfruit",
    Peach:"Peach",
    Pear:"Pear",
    Persimmon:"Persimmon",
    Plantain:"Plantain",
    Plum:"Plum",
    Prune:"Prune (dried plum)",
    Pineapple:"Pineapple",
    Pineberry:"Pineberry",
    Plumcot:"Plumcot (or Pluot)",
    Pomegranate:"Pomegranate",
    Pomelo:"Pomelo",
    Purple_mangosteen:"Purple mangosteen",
    Quince:"Quince",
    Raspberry:"Raspberry",
    Salmonberry:"Salmonberry",
    Rambutan:"Rambutan (or Mamin Chino)",
    Redcurrant:"Redcurrant",
    Rose_apple:"Rose apple",
    Salal_berry:"Salal berry",
    Salak:"Salak",
    Satsuma:"Satsuma",
    Shine_Muscat_or_Viti_Vinifera:"Shine Muscat or Vitis Vinifera",
    Sloe_or_Hawthorn_Berry:"Sloe or Hawthorn Berry",
    Soursop:"Soursop",
    Star_apple:"Star apple",
    Star_fruit:"Star fruit",
    Strawberry:"Strawberry",
    Surinam_cherry:"Surinam cherry",
    Tamarillo:"Tamarillo",
    Tamarind:"Tamarind",
    Tangelo:"Tangelo",
    Tayberry:"Tayberry",
    Tomato:"Tomato",
    Ugli_fruit:"Ugli fruit",
    White_currant:"White currant",
    White_sapote:"White sapote",
    Yuz:"Yuzu"
}

export const vegetables = {
    Artichoke:"Artichoke",
    Eggplant:"Aubergine (Eggplant)",
    Amrud:"Amrud",
    Asparagus:"Asparagus",
    Legumes:"Legumes",
    Alfalfa_Sprouts:"Alfalfa Sprouts",
    Azuki_Beans:"Azuki Beans (or Adzuki)",
    Bean_Sprouts:"Bean Sprouts",
    Black_Beans:"Black Beans",
    Black_Eyed_Peas:"Black-Eyed Peas",
    Borlotti_Bean:"Borlotti Bean",
    Broad_Beans:"Broad Beans",
    Chickpeas:"Chickpeas, Garbanzos, or Ceci Beans",
    Green_Beans:"Green Beans",
    Kidney_Beans:"Kidney Beans",
    Lentils:"Lentils",
    Lima_Beans_or_Butter_Bean:"Lima Beans or Butter Bean",
    Mung_Beans:"Mung Beans",
    Navy_Beans:"Navy Beans",
    Pinto_Beans:"Pinto Beans",
    Runner_Beans:"Runner Beans",
    Split_Peas:"Split Peas",
    Soy_Beans:"Soy Beans",
    Peas:"Peas",
    Mangetout_or_nap_Peas:"Mangetout or Snap Peas",
    Broccoflower:"Broccoflower (Hybrid)",
    Broccoli:"Broccoli (Calabrese)",
    Brussels_Sprouts:"Brussels Sprouts",
    Cabbage:"Cabbage",
    Kohlrabi:"Kohlrabi",
    Cauliflower:"Cauliflower",
    Celery:"Celery",
    Endive:"Endive",
    Fiddleheads:"Fiddleheads",
    Frisee:"Frisee",
    Fennel:"Fennel",
    Greens:"Greens",
    Beet_Greens:"Beet Greens (Chard)",
    Bok_Choy:"Bok Choy",
    Chard:"Chard (Beet Greens)",
    Collard_Greens:"Collard Greens",
    Kale:"Kale",
    Mustard_Greens:"Mustard Greens",
    Spinach:"Spinach",
    Quinoa:"Quinoa",
    Herbs_And_Spices:"Herbs And Spices",
    Anise:"Anise",
    Basil:"Basil",
    Caraway:"Caraway",
    Cilantro :"Cilantro (Coriander)"
}

/*
********************************* Clothing ****************************************
*/

export const clothes = [
    "Dress",
    "Swimwear",
    "Pajamas",
    "Slippers",
    "Robe",
    "Blouse",
    "Sunglasses",
    "Cummerbund",
    "Swimming Shorts",
    "Polo Shirt",
    "Lingerie",
    "Shawl",
    "Scarf",
    "Skirt",
    "Boxers",
    "Top",
    "Jacket",
    "Tights",
    "Suit",
    "Shoes",
    "Thong",
    "Shorts",
    "Tie",
    "Socks",
    "Briefs",
    "Blazer",
    "Poncho",
    "Cargos",
    "Boots",
    "Tracksuit",
    "Gown",
    "Sweatshirt",
    "Hat",
    "Sarong",
    "Shirt",
    "Cardigan",
    "Bikini",
    "Dinner Jacket",
    "Coat",
    "Cufflinks",
    "Hoody",
    "Waistcoat",
    "Bra",
    "Overalls",
    "Underwear",
    "Tankini",
    "Stockings",
    "Jogging Suit",
    "Belt",
    "Jeans",
    "Corset",
    "Camisole",
    "T-Shirt",
    "Gloves",
    "Fleece",
    "Sandals",
    "Nightgown",
    "Knickers",
    "Cravat",
    "Bow Tie",
    "Kilt",
]

export const alcohols = {
    corona:"Corona", goldstar:"Goldstar", goldstarUnfiltered:"Goldstar Unfiltered", heineken:"Heineken",
    greyGoose:"Grey Goose", vanGogh:"Van Gogh"
}

export const smoking = {
    camel: "Camel Red 100's Cigarettes",
    marlboro: "Marlboro Light Cigarettes",
    pallMall: "Pall Mall Blue Cigarettes",
    rizla: "Rizla Ultra Thin Rolling Papers",
    bali: "Bali Shag Blue Rolling Tobacco",
    filters: "cigarete filters"
}


const sb: StateBuilder = new StateBuilder();

const pushItems = (category:string, productNames:any, itemsAcc:storeItemState[]):void => {
    Object.values(productNames).forEach((name) => {
        itemsAcc.push(sb.storeItem(String(name),[category],10, 100));
    });   
}

const getInventory = () => {
    const items:storeItemState[] = [];

    //items.push(sb.storeItem(GOLDSTAR,[foodCategories.BEVERAGES], 10, 100));

    pushItems(categories.ALCOHOL, alcohols, items);
    pushItems(categories.SMOKE, smoking, items);

    pushItems(electronicsCategories.VIDEO_GAMES, videoGames, items);
   
    tvs.forEach(tv => items.push(sb.storeItem(tv,[electronicsCategories.TVS], 10, 20)));
    desktops.forEach(desktop => items.push(sb.storeItem(desktop, [computerCategories.DESKTOPS], 10, 25)));
    laptops.forEach(laptop => items.push(sb.storeItem(laptop,[computerCategories.LAPTOPS],10,40)));
    cellphones.forEach(phone => items.push(sb.storeItem(phone, [electronicsCategories.CELL_PHONES], 10, 15)));
    printers.forEach(item => items.push(sb.storeItem(item, [electronicsCategories.PRINTERS], 10, 10)));
    accessories.forEach(item => items.push(sb.storeItem(item, [electronicsCategories.ACCESSORIES], 10, 65)));

    pushItems(foodCategories.SNACKS, snacks, items);
    pushItems(foodCategories.BEVERAGES, beverages, items);
    pushItems(foodCategories.CEREAL, cereals, items);
    pushItems(foodCategories.FRUIT, fruit, items);
    pushItems(foodCategories.VEGETABLES, vegetables, items);

    clothes.forEach(item => items.push(sb.storeItem(item, [categories.CLOTHING], 10, 12)));

    return items;    
}

const getCatefories = ():categoryState[] => {
   return [
       sb.category(categories.ALCOHOL),
       sb.category(categories.SMOKE),
       sb.category(categories.CLOTHING),
       sb.category(categories.FOOD,[
           sb.category(foodCategories.BEVERAGES),sb.category(foodCategories.CEREAL),
           sb.category(foodCategories.FRUIT),sb.category(foodCategories.VEGETABLES),
           sb.category(foodCategories.SNACKS)
       ]),
       sb.category(categories.ELECTRONICS,[
           sb.category(electronicsCategories.COMPUTERS,[
               sb.category(computerCategories.DESKTOPS),sb.category(computerCategories.LAPTOPS)
           ]),
           sb.category(electronicsCategories.TVS),
           sb.category(electronicsCategories.CELL_PHONES),
           sb.category(electronicsCategories.PRINTERS),
           sb.category(electronicsCategories.VIDEO_GAMES),
           sb.category(electronicsCategories.ACCESSORIES),
       ])
   ]
}
export const INVENTORY :storeItemState[] = getInventory();
export const CATEGORIES :categoryState[] = getCatefories();