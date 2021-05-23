import {SpellChecker} from './apis/spellchecker';


export class SpellCheckerAdapter
{
    static instance : SpellCheckerAdapter = undefined; 
    productSpellCheck: SpellChecker;
    categorySpellChecker: SpellChecker;
    storeSpellChecker: SpellChecker;
    usernameSpellChcker: SpellChecker;

//TODO: make sure to apply case insensative 
    private constructor()
    {
        this.productSpellCheck = new SpellChecker(
            [
                
            ],
            6
        );

        this.categorySpellChecker = new SpellChecker(
            [
                
            ],
            6
        )

        this.storeSpellChecker = new SpellChecker([], 6)
        this.usernameSpellChcker = new SpellChecker([], 6)
    }

    static get_instance()
    {
        if (SpellCheckerAdapter.instance === undefined)
        {
            SpellCheckerAdapter.instance = new SpellCheckerAdapter()
        }
        return SpellCheckerAdapter.instance;
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
        console.log("added category to spell chacker!");
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

    get_all_categories() : string[]
    {
        return this.categorySpellChecker.get_valid_word_list();
    }

    get_all_product_names() : string[]
    {
        return this.productSpellCheck.get_valid_word_list();
    }

    get_all_keywords() : string[]
    {
        let keywords= this.categorySpellChecker.get_valid_word_list().concat(this.productSpellCheck.get_valid_word_list())
        return keywords;
    }

    get_all_store_names() : string[]
    {
        let keywords= this.storeSpellChecker.get_valid_word_list()
        return keywords;
    }

}