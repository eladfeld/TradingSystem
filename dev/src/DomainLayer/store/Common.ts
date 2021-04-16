// Use:
//
//     var privateID = ID();
export var ID = function () {
    return Date.now();
  };

export enum Rating {
  DREADFUL = 1,
  BAD      = 2,
  OK       = 3,
  GOOD     = 4,
  AMAZING  = 5,
}