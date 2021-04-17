// Use:
//
//     var privateID = ID();
let current_id: number = 0 //TODO: get biggest id from DB
export var ID = function () {
    return current_id++;
  };

export enum Rating {
  DREADFUL = 1,
  BAD      = 2,
  OK       = 3,
  GOOD     = 4,
  AMAZING  = 5,
}

export enum Category {
  SHIRT         = 1,
  PANTS         = 2,
  SPORT         = 3,
  ELECTRIC      = 4,
  COMPUTER      = 5,
  SWEET         = 6,
}