// Created by Michael Wehar


export class SpellChecker
{
    valid_word_list: string[];
    max_size: number

    constructor(word_list?: string[], max_size?: number)
    {
        if(word_list)
            this.set_valid_word_list(word_list)
        else
            this.valid_word_list = [];
        if(max_size)
            this.set_max_size(max_size)
        else
            this.max_size = 10;
    }

    set_max_size(n: number)
    {
        this.max_size = n;
    }

    set_valid_word_list(word_list: string[]){
        this.valid_word_list = word_list;
    }

    add_word_to_world_list(word: string)
    {
        this.valid_word_list.push(word);
    }

    find_similar(word: string, score_thresh: number){
        let top_words: string[] = [];
        let top_scores: number[] = [];
    
        for(var i = 0; i < this.valid_word_list.length; i++){
            // compute score
            let element: string = this.valid_word_list[i];
            var temp_score = this.score(word, element);
            
            if(score_thresh < temp_score){
                // check if it is a top score
                var index = this.getListIndex(top_scores, temp_score);
                if(index < this.max_size){
                    top_words.splice(index, 0, element);
                    top_scores.splice(index, 0, temp_score);
                    
                    if(top_words.length > this.max_size){
                        top_words.pop();
                        top_scores.pop();
                    }
                }
            }
        }
        
        return [top_words, top_scores];
    }

    getListIndex(scores: number[], x: number){
        for(var i = 0; i < scores.length; i++){
            if(x > scores[i]) return i;
        }
        return scores.length;
    }

    score(x: string, y: string){
        var length_weight = 0.3;
        var match_weight = 0.5;
        var shift_weight = 0.2;
        
        return length_weight * this.length_score(x,y) + match_weight * this.match_score(x,y)
                                                 + shift_weight * this.shift_score(x,y);
    }

    length_score(x: string, y: string){
        var diff = Math.abs(x.length - y.length);
        return Math.max(1.0 - diff / 4, 0);
    }
    
    match_score(x: string, y: string){
        var length = Math.min(x.length, y.length);
        if(length <= 0) return 0.0; 
        
        var total = 0;
        for(var i = 0; i < length; i++){
            if(x.charAt(i) == y.charAt(i)) total++;
        }
        
        var diff = length - total;
        return Math.max(1.0 - diff / 5, 0);
    }
    
    shift_score(x: string, y: string){
        var l2 = this.match_score(x.substring(2), y);
        var l1 = this.match_score(x.substring(1), y);
        var c = this.match_score(x, y);
        var r1 = this.match_score(x, y.substring(1));
        var r2 = this.match_score(x, y.substring(2));
        
        return Math.max(l2, l1, c, r1, r2);
    }
    
}










