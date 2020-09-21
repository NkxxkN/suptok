/*
We want to implement a class that can be used for locking inside an async function.

Even though NodeJS is single threaded, the reason for needing locking is to synchronise
code that happens across many awaits

You need to implement the functions of the Locking class below.
*/

/*
* Consts.
*/
const DELAY = 500;

/*
* Class
*/
class Locking {
    /*
    * Singleton instance.
    */
    static instance = null


    /*
    * Hash representing locking keys currently in use, using FIFO (First-In-First-Out) queues to handle locking/unlocking mechanisms.
    * locks['anyValue'] can either be:
    *   - null: the lock is ready to be acquired.
    *   - []: An empty array means that the lock has been acquired but there are no other methods waiting.
    *   - [resolve , ...]: An array of promises waiting in line to acquire the lock next and resolve their respective waiting methods.
    */
    locks = {}

    static getInstance() {
        if (Locking.instance !== null)
            return Locking.instance;

        return Locking.instance = new Locking();
    }

    isLocked = (key) => {
        return (!!this.locks[key]);
    }

    lock = (key) => {
        // If already locked, add a new promise to waiting list and wait for it to resolve.
        if (this.isLocked(key))
            return new Promise(resolve => this.locks[key].push(resolve));

        // Otherwise, if not locked, acquire the lock by initializing an empty waiting list and return directly.
        this.locks[key] = [];
        return;
    }

    unlock = async (key) => {
        // If not locked, simply return.
        if (!this.isLocked(key))
            return;
        
        // Otherwise, if waiting list is not empty, resolve the next function.
        if (this.locks[key].length > 0) {
            const nextResolve = this.locks[key].shift();
            nextResolve();
            return;
        }

        // Otherwise, no other functions in the waiting list, release the lock.
        delete this.locks[key];
        return;
    }

}

/*
* Helpers.
*/
async function exampleUsage(n) {
    console.log('Start::exampleUsage', n)
    let lock = Locking.getInstance()

    await lock.lock("someKey");

    await API1(n)

    await API2(n)

    // ...

    /*
    Due to the lock, there will never be a case when API1 is called 2 times 
    in a row without API2 being called - even in the case when exampleUsage() is
    called from different async functions which are not synchronised.
    */

    console.log(lock.isLocked("someKey")) // true
    console.log(lock.isLocked("someKey2")) // false

    lock.unlock("someKey");
}

async function API1(n) {
    console.log('API1', n);
    await delay(DELAY);
}

async function API2(n) {
    console.log('API2', n);
    await delay(DELAY);
}

async function delay(n) {
    return new Promise(resolve => setTimeout(resolve, n));
}

/*
* Exec.
*/
exampleUsage(1);
exampleUsage(2);
exampleUsage(3);
exampleUsage(4);
exampleUsage(5);