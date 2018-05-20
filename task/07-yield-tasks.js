'use strict';

/********************************************************************************************
 *                                                                                          *
 * Plese read the following tutorial before implementing tasks:                             *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/yield        *
 *                                                                                          *
 ********************************************************************************************/

/**
 * Returns the lines sequence of "99 Bottles of Beer" song:
 *
 *  '99 bottles of beer on the wall, 99 bottles of beer.'
 *  'Take one down and pass it around, 98 bottles of beer on the wall.'
 *  '98 bottles of beer on the wall, 98 bottles of beer.'
 *  'Take one down and pass it around, 97 bottles of beer on the wall.'
 *  ...
 *  '1 bottle of beer on the wall, 1 bottle of beer.'
 *  'Take one down and pass it around, no more bottles of beer on the wall.'
 *  'No more bottles of beer on the wall, no more bottles of beer.'
 *  'Go to the store and buy some more, 99 bottles of beer on the wall.'
 *
 * See the full text at
 * http://99-bottles-of-beer.net/lyrics.html
 *
 * NOTE: Please try to complete this task faster then original song finished:
 * https://www.youtube.com/watch?v=Z7bmyjxJuVY   :)
 *
 *
 * @return {Iterable.<string>}
 *
 */
function* get99BottlesOfBeer() {
    let currBottlesOfBeer = 99;

    while (currBottlesOfBeer > 2) {
        yield `${currBottlesOfBeer} bottles of beer on the wall, ${currBottlesOfBeer} bottles of beer.`;
        yield `Take one down and pass it around, ${currBottlesOfBeer - 1} bottles of beer on the wall.`;
        currBottlesOfBeer--;
    }

    yield '2 bottles of beer on the wall, 2 bottles of beer.';
    yield 'Take one down and pass it around, 1 bottle of beer on the wall.';

    yield '1 bottle of beer on the wall, 1 bottle of beer.';
    yield 'Take one down and pass it around, no more bottles of beer on the wall.';

    yield 'No more bottles of beer on the wall, no more bottles of beer.';
    yield 'Go to the store and buy some more, 99 bottles of beer on the wall.';    
}

/**
 * Returns the Fibonacci sequence:
 *   0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, ...
 *
 * See more at: https://en.wikipedia.org/wiki/Fibonacci_number
 *
 * @return {Iterable.<number>}
 *
 */
function* getFibonacciSequence() {
    let prevNumber = 0;
    let currNumber = 1;
    let nextNumber = 1;

    yield prevNumber;
    yield currNumber;

    while (true) {
        nextNumber = prevNumber + currNumber;
        yield nextNumber;
        prevNumber = currNumber;
        currNumber = nextNumber;
    }   
}

/**
 * Traverses a tree using the depth-itemFirst strategy
 * See details: https://en.wikipedia.org/wiki/Depth-first_search
 *
 * Each treeNode have child treeNodes in treeNode.children array.
 * The leaf treeNodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree treeNodes in depth-itemFirst order
 * @example
 *
 *   var node1 = { n:1 }, node2 = { n:2 }, node3 = { n:3 }, node4 = { n:4 },
 *       node5 = { n:5 }, node6 = { n:6 }, node7 = { n:7 }, node8 = { n:8 };
 *   node1.children = [ node2, node6, node7 ];
 *   node2.children = [ node3, node4 ];
 *   node4.children = [ node5 ];
 *   node7.children = [ node8 ];
 *
 *     source tree (root = 1):
 *            1
 *          / | \
 *         2  6  7
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       3   4     8
 *           |
 *           5
 *
 *  depthTraversalTree(node1) => node1, node2, node3, node4, node5, node6, node7, node8
 *
 */
function* depthTraversalTree(root) {
    let treeNode = [root];
    while(treeNode.length) {
        let currentTreeNode = treeNode.pop();
        yield currentTreeNode;
        if(currentTreeNode.children){
            treeNode = treeNode.concat(currentTreeNode.children.reverse());
        }
    }
}


/**
 * Traverses a tree using the breadth-itemFirst strategy
 * See details: https://en.wikipedia.org/wiki/Breadth-first_search
 *
 * Each treeNode have child treeNodes in treeNode.children array.
 * The leaf treeNodes do not have 'children' property.
 *
 * @params {object} root the tree root
 * @return {Iterable.<object>} the sequence of all tree treeNodes in breadth-itemFirst order
 * @example
 *     source tree (root = 1):
 *
 *            1
 *          / | \
 *         2  3  4
 *        / \     \            =>    { 1, 2, 3, 4, 5, 6, 7, 8 }
 *       5   6     7
 *           |
 *           8
 *
 */
function* breadthTraversalTree(root) {
    let treeNodes = [root];
    for (let i = 0; i < treeNodes.length; i++) {
        yield treeNodes[i];
        if ('children' in treeNodes[i]) {
            for (let j = 0; j < treeNodes[i].children.length; j++) {
                treeNodes.push(treeNodes[i].children[j]);
            }
        }
    }
}


/**
 * Merges two yield-style sorted sequences into the one sorted sequence.
 * The result sequence consists of sorted items from source iterators.
 *
 * @params {Iterable.<number>} source1
 * @params {Iterable.<number>} source2
 * @return {Iterable.<number>} the merged sorted sequence
 *
 * @example
 *   [ 1, 3, 5, ... ], [2, 4, 6, ... ]  => [ 1, 2, 3, 4, 5, 6, ... ]
 *   [ 0 ], [ 2, 4, 6, ... ]  => [ 0, 2, 4, 6, ... ]
 *   [ 1, 3, 5, ... ], [ -1 ] => [ -1, 1, 3, 5, ...]
 */
function* mergeSortedSequences(source1, source2) {
    let sequenceFirst = source1(), sequenceSecond = source2();
    let itemFirst = sequenceFirst.next().value, itemSecond = sequenceSecond.next().value;

    while (itemFirst != undefined || itemSecond != undefined) {
        if (itemFirst != undefined && itemSecond != undefined) {
            if (itemFirst < itemSecond) {
                yield itemFirst;
                itemFirst = sequenceFirst.next().value;
            } else {
                yield itemSecond;
                itemSecond = sequenceSecond.next().value;
            }
        } else if (itemFirst != undefined) {
            yield itemFirst;
            itemFirst = sequenceFirst.next().value;
        } else if (itemSecond != undefined) {
            yield itemSecond;
            itemSecond = sequenceSecond.next().value;
        }
    }  
}

module.exports = {
    get99BottlesOfBeer: get99BottlesOfBeer,
    getFibonacciSequence: getFibonacciSequence,
    depthTraversalTree: depthTraversalTree,
    breadthTraversalTree: breadthTraversalTree,
    mergeSortedSequences: mergeSortedSequences
};
