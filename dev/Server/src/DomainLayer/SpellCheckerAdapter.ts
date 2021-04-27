import {SpellChecker} from './apis/spellchecker';


export class SpellCheckerAdapter
{
    spellChecker: SpellChecker;

    constructor()
    {
        this.spellChecker = new SpellChecker(
            ['elad',
             'alad',
             'eladl',
             'edad',
             'yatzhaek',
             'lplpl',
             'dlsadlasd',
             'sweet',
             'ijij',
             'moopa'
            ],
            3);
    }

    find_similar(word:string)
    {
        return this.spellChecker.find_similar(word, 0.5)
    }

    add_word(word: string)
    {
        this.spellChecker.add_word_to_world_list(word);
    }

}