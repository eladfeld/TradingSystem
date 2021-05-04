import {SpellChecker} from './apis/spellchecker';


export class SpellCheckerAdapter
{
    productSpellCheck: SpellChecker;
    categorySpellChecker: SpellChecker;
    storeSpellChecker: SpellChecker;
    usernameSpellChcker: SpellChecker;

//TODO: make sure to apply case insensative 
    constructor()
    {
        this.productSpellCheck = new SpellChecker(
            [
                'banana',
                'ball',
                'orange',
                'car',
                'pc',
                'battle',
                'calculator',
                'shirt',
                'pen',
                'bici'
            ],
            6
        );

        this.categorySpellChecker = new SpellChecker(
            [
                'SHIRT',
                'PANTS',
                'SPORT',
                'ELECTRIC',
                'COMPUTER',
                'SWEET'
            ],
            6
        )

        this.storeSpellChecker = new SpellChecker([], 6)
        this.usernameSpellChcker = new SpellChecker([], 6)
    }

    find_similar_product(productName: string)
    {
        return this.productSpellCheck.find_similar(productName, 0.5)
    }

    add_productName(productName: string)
    {
        this.productSpellCheck.add_word_to_world_list(productName);
    }



    find_similar_category(category: string)
    {
        return this.categorySpellChecker.find_similar(category, 0.5)
    }

    add_category(category: string)
    {
        this.categorySpellChecker.add_word_to_world_list(category);
    }



    find_similar_storeName(storeName: string)
    {
        return this.storeSpellChecker.find_similar(storeName, 0.5)
    }

    add_storeName(storeName: string)
    {
        this.storeSpellChecker.add_word_to_world_list(storeName);
    }



    find_similar_username(username: string)
    {
        return this.usernameSpellChcker.find_similar(username, 0.5)
    }

    add_username(username: string)
    {
        this.usernameSpellChcker.add_word_to_world_list(username);
    }

}