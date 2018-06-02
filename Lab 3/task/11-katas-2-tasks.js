'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {    
    let floors = bankAccount.split('\n');

    let resultString = '';
    for (let i = 0; i < floors[0].length; i += 3) {
        if ((floors[1][i + 1] === ' ') && (floors[2][i + 1] === '_')) {
            resultString += '0';
        } else if ((floors[0][i + 1] === ' ') && (floors[1][i + 1] === ' ')) {
            resultString += '1';
        } else if (floors[2][i + 2] === ' ') {
            resultString += '2';
        } else if ((floors[1][i] === ' ') && (floors[1][i + 1] === '_')) {
            resultString += '3';
        } else if ((floors[0][i + 1] === ' ') && (floors[1][i + 1] === '_')) {
            resultString += '4';
        } else if ((floors[1][i + 2] === ' ') && (floors[2][i] === ' ')) {
            resultString += '5';
        } else if ((floors[1][i + 2] === ' ') && (floors[2][i] === '|')) {
            resultString += '6';
        } else if ((floors[0][i + 1] === '_') && (floors[2][i + 1] === ' ')) {
            resultString += '7';
        } else if (floors[2][i] === ' ') {
            resultString += '9';            
        } else {
            resultString += '8';
        }
    }

    return Number(resultString);
}

/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {    
    let wordsFromSourceText = text.split(' ');
    let correctLengthLine = '';    

    while (wordsFromSourceText.length > 0) {
        correctLengthLine = wordsFromSourceText.shift();        
        while ((wordsFromSourceText.length > 0) && (correctLengthLine.length + 1 + wordsFromSourceText[0].length <= columns)) {
            correctLengthLine += ' ' + wordsFromSourceText.shift();
        }
        yield correctLengthLine;
    }
}

/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    function getRand(hand)
    {
        const RANKS = 'A234567891JQKA',
            fits = [],
            ranks = {
                count: [],
                values: [],
                sorted: []
            };

        for (let v of hand)
        {
            if (ranks.values.indexOf(v[0]) < 0)
            {
                ranks.values.push(v[0]);
                ranks.count.push(1);
            }
            else
            {
                ranks.count[ranks.values.indexOf(v[0])]++;
            }

            if (fits.indexOf(v.slice(-1)) < 0)
            {
                fits.push(v.slice(-1));
            }
        }
        ranks.sorted = ranks.values.sort((a, b) => RANKS.indexOf(a) - RANKS.indexOf(b));
        if (ranks.sorted[0] === 'A' && ranks.sorted[1] !== '2')
        {
            ranks.sorted.splice(0, 1);
            ranks.sorted.push('A');
        }

        this.getCount = function (cnt)
        {
            let result = 0;
            for (let v of ranks.count)
            {
                if (v === cnt)
                {
                    result++;
                }
            }
            return result;
        }

        this.isFlush = function()
        {
            return fits.length === 1;
        };

        this.isStraight = function() {
            if (ranks.sorted.length < 5)
            {
                return false;
            }
            for (let i = 1; i < 5; i++)
            {
                if (
                    RANKS.indexOf(ranks.sorted[i - 1]) + 1 !== RANKS.indexOf(ranks.sorted[i]) &&
                    RANKS.indexOf(ranks.sorted[i - 1]) + 1 !== RANKS.lastIndexOf(ranks.sorted[i])
                )
                {
                    return false;
                }
            }
            return true;
        };
    }

    hand = new getRand(hand);

    if (hand.isFlush() && hand.isStraight())
        return PokerRank.StraightFlush;
    else if (hand.getCount(4))
        return PokerRank.FourOfKind;
    else if (hand.getCount(3) && hand.getCount(2))
        return PokerRank.FullHouse;
    else if (hand.isFlush())
        return PokerRank.Flush;
    else if (hand.isStraight())
        return PokerRank.Straight;
    else if (hand.getCount(3))
        return PokerRank.ThreeOfKind;
    else if (hand.getCount(2) == 2)
        return PokerRank.TwoPairs;
    else if (hand.getCount(2))
        return PokerRank.OnePair;
    else
        return PokerRank.HighCard;
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    figure = figure.split('\n');

    function processing(row, col, _row, _col, s) {
        let i;
        if (_row)
            for (i = row + _row; i < figure.length && i >= 0; i += _row)
                if (figure[i][col] === '+' && (figure[i][col - _row] === '+' || figure[i][col - _row] === s))
                    return i;
                else if (figure[i][col] === ' ')
                    return false;
        if (_col && figure[row + _col])
            for (i = col + _col; i < figure[row].length && i >= 0; i += _col)
                if (figure[row][i] === '+' && (figure[row + _col][i] === '+' || figure[row + _col][i] === s))
                    return i;
                else if (figure[row][i] === ' ')
                    return false;
        return false;
    }

    function rec(row, col) {
        let _col,
            _row,
            resultCol,
            resultRow;

        _col = processing(row, col, 0, 1, '|');
        if (_col === false) return false;
        _row = processing(row, _col, 1, 0, '-');
        if (_row === false) return false;
        resultCol = _col;
        resultRow = _row;

        _col = processing(_row, _col, 0, -1, '|');
        if (_col === false) return false;
        _row = processing(_row, _col, -1, 0, '-');
        if (_row === false) return false;

        if (_row === row && _col === col) {
            return {
                width: resultCol - col + 1,
                height: resultRow - row + 1
            };
        } else
            return false;
    }

    function getFigure(obj) {
        var line = '+' + '-'.repeat(obj.width - 2) + '+\n',
            result  = line;
        result += ('|' + ' '.repeat(obj.width - 2) + '|\n').repeat(obj.height - 2);
        return result + line;
    }

    for (let i = 0; i < figure.length; i++)
        for (let j = 0; j < figure[i].length; j++)
            if (
                figure[i][j] === '+' &&
                figure[i + 1] && (figure[i + 1][j] === '|' || figure[i + 1][j] === '+') &&
                (figure[i][j + 1] === '-' || figure[i][j + 1] === '+')
            ) {
                let obj = rec(i, j);
                if (obj)
                    yield getFigure(obj);
            }
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
