/*
* Methods.
*/

/*
* length: simply increases the initial counter in each iteration over the list.
*/
function length(list) {
    const getRecursiveLength = (len, list) => {
        const recursiveLengthReducer = (x, list) => getRecursiveLength(++len, list);
        return list(recursiveLengthReducer, len);
    }
    return getRecursiveLength(0, list);
}

/*
* head: returns the first value, no recursive calls needed here.
*/
function head(list) {
    const headReducer = x => x; // Returns first element of the list directly
    return list(headReducer, null);
}

/*
* last: same as head after reversing the list.
*/
function last(list) {
    const reverseList = list => {
        // Same logic as for appendReducer,  calls itself recursively on the rest of the list after appending the current value.
        const reverseListReducer = (prevList, nextList) => append(prevList, reverseList(nextList));
        return list(reverseListReducer, emptyList);
    }
    const rList = reverseList(list);
    return head(rList);
}

/*
* append: uses prepend and calling itself recursively to rebuild the existing list recursively, starting from a list that contains its own element ('x'), instead of starting with an empty list.
*/
function append(x, list) {
    const appendReducer = (prevList, nextList) => prepend(prevList, append(x, nextList));
    return list(appendReducer, prepend(x, emptyList));
}

/*
* prepend: returns a list computed with the reducer given as an argument.
* It is the critical part to understand how reducers can be called recursively on each items of the list to satisfy their own purpose while accessing the current value (x), and rest of the list (list) if necessary.
*/
function prepend(x, list) {
    return (red, acc) => red(x, list);
}

/*
* Helpers.
*/
function emptyList(red, acc) {
    return acc;
}

/*
* Execution Examples.
*/
console.log(last(emptyList), ' => last(emptyList)'); // => [].pop() => null
console.log(length(emptyList), ' => length(emptyList)'); // => [].length = 0
console.log(length(prepend(2, emptyList)), ' => length(prepend(2, emptyList))'); // [2].length => 1
console.log(length(append(4, prepend(1, emptyList))), ' => length(append(4, prepend(1, emptyList)))'); // [1, 4].length => 2
console.log(head(prepend(2, emptyList)), ' => head(prepend(2, emptyList))'); // [2] => 2
console.log(last(prepend(2, emptyList)), ' => last(prepend(2, emptyList))'); // [2] => 2
console.log(head(append(1, emptyList)), ' => head(append(1, emptyList))'); // [1] => 1
console.log(last(append(1, emptyList)), ' => last(append(1, emptyList))'); // [1] => 1
console.log(last(append(4, (append(2, append(1, emptyList))))), ' => last(append(4, (append(2, append(1, emptyList)))))'); // => [1, 2, 4] => 4
console.log(head(append(4, (append(2, append(1, emptyList))))), ' => head(append(4, (append(2, append(1, emptyList)))))'); // => [1, 2, 4] => 1
console.log(head(prepend(4, (append(2, append(1, emptyList))))), ' => head(prepend(4, (append(2, append(1, emptyList)))))'); // => [4, 1, 2] => 4
console.log(last(prepend(4, (append(2, append(1, emptyList))))), ' => last(prepend(4, (append(2, append(1, emptyList)))))'); // => [4, 1, 2] => 2
