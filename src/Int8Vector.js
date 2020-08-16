/*
    Int8Vector CONSTRUCTOR

    seed parameter
    - if seed is a number, we validate that it's a positive integer
      - if it is we initialize according to the specified length
    - if seed is an object, we validate it is either an Int8Array, 
    an ArrayBuffer, or another Int8Vector
        - if it is, we read the data from the old data structure and 
        write it to the initialized member variables accordingly.
*/
function Int8Vector(seed){
    switch(typeof seed){
        case "number": {
            if(seed % 1 !== 0){
                throw new Exception("Int8Vector when instantiated with a single number must receive an integer value.");
            } else if(seed < 0){
                throw new Exception("Int8Vector when instantiated with a single number must receive a positive integer value.");
            } else {
                if(seed < 1){
                    this._buffer = null;
                    this._view = null;
                    this.size = 0;
                    this.capacity = 0;
                } else {
                    this._buffer = new ArrayBuffer(seed);
                    this._view = new DataView(this._buffer);
                    this.size = seed;
                    this.capacity = seed;
                }
            }
            break;
        }
        case "object": {
            if(seed instanceof Int8Array){
                this._buffer = new ArrayBuffer(seed.length);
                this._view = new DataView(this._buffer);
                for(let i = 0; i < seed.length; i++){
                    this._view.setInt8(i,seed[i]);
                }
                this.size = seed.length;
                this.capacity = seed.length;
            } else if(seed instanceof ArrayBuffer) {
                this._buffer = new ArrayBuffer(seed.byteLength);
                this._view = new DataView(this._buffer);
                const seedView = new DataView(seed);
                for(let i = 0; i < seed.byteLength; i++){
                    this._view.setInt8(i,seedView.getInt8(i));
                }
                this.size = seed.byteLength;
                this.capacity = seed.byteLength;
            } else if(seed instanceof Int8Vector) {
                this._buffer = new ArrayBuffer(seed.size);
                this._view = new DataView(this._buffer);
                this.size = seed.size;
                this.capacity = seed.size;
            } else {
                throw new Exception('Invalid object passed to Int8Array constructor. Try passing an ArrayBuffer, Int8Array, or another Int8Vector.');
            }
            break;
        }
    }
}

/*
    _reallocate function

    This function is meant to be private. From the outside, it has the 
    effect of doubling the vector's capcity while keeping the size the 
    same. Practically, this is not an instantaneous operation. If the old 
    vector held n items, this operation is O(n) time complexity due to the 
    need to copy all the data from the old buffer to a new temporary one 
    (and then reassign the newly created buffer and view to the member vars).

    Takes no parameters.

    Returns nothing.
*/
Int8Vector.prototype._reallocate = () => {
    const tmpb = new ArrayBuffer((this.capacity * 2));
    const tmpv = new DataView(tmpb);
    for(let i = 0; i < this._view.byteLength; i++){
        tmpv.setInt8(i, this._view.getInt8(i));
    }
    this._buffer = tmpb;
    this._view = tmpv;
    this.capacity *= 2;
}
/*
    validateIndex function

    This function takes a numerical index value and 
    returns a boolean. It validates the index value 
    is valid for vector.
*/
Int8Vector.prototype.validateIndex = (idx, limit) => {
    let res = false;
    if(typeof idx !== 'number'){
        throw new Exception("Int8Vector function validateIndex cannot receive an index parameter that is not a number.");
    } else if(idx < 0){
        throw new Exception("Int8Vector function validateIndex cannot take a negative index.");
    } else if(idx > limit){
        throw new Exception("Attempted to access out of bounds vector index.");
    } else if(idx % 1 != 0){
        throw new Exception("The index passed to safeGet must be a non-negative integer.");
    } else {
        res = true;
    }
    return res;
}
/*
    validateValue function

    this function takes a numerical parameter value and
    checks whether it is a valid signed 8-bit integer. Returns 
    a boolean.
*/
Int8Vector.prototype.validateValue = (val) => {
    let res = false;
    if(val < -127){
        errString = `Argument '${val}' is too small for Int8 data type.`;
        throw new Exception(errString);
    } else if(val > 127){
        errString = `Argument '${val}' is too big for Int8 data type.`;
        throw new Exception(errString);
    } else if(val % 1 != 0){
        errString = `Argument '${val}' is not an integer.`;
        throw new Exception(errString);
    } else if(typeof val !== "number"){
        errString = `Argument '${val}' must be a number.`;
        throw new Exception(errString);
    } {
        res = true;
    }
    return res;
}
/*
    get function

    receives a numerical index value parameter. 
    If the value is within range of the vector, an error is not thrown.
    If the value is less than the vector's size, the value stored 
    at that index is returned. 
*/
Int8Vector.prototype.get = (idx) => {
    if(idx >= this.size){
        throw new Exception("Attempted to access out of bounds vector index.");
    }
    return this._view.getInt8(idx);
}
/*
    safeGet function

    same as get function, but provides additional error checking 
    functionality via validateIndex function.
*/
Int8Vector.prototype.safeGet = (idx) => {
    if(this.validateIndex(idx, (this.size - 1))){
        return this._view.getInt8(idx);
    }
}
/*
    set function

    set a value (val) and specified index (idx).

    This function will not allow you to set a value greater than the 
    vector's size. For that, you can use push_back. This function 
    is for mutating an already set value within the vector.
*/
Int8Vector.prototype.set = (idx, val) => {
    if(idx > this.size - 1){
        throw new Error("Attempted to access out of bounds vector index.");
    }
    this._view.setInt8(idx,val);
}
/*
    safeset function

    same as above, but provides additional error checking via 
    validateValue and validateIndex.
*/
Int8Vector.prototype.safeSet = (idx, val) => {
    if(this.validateValue(val) && this.validateIndex(idx, (this.size - 1))){
        this._view.setInt8(idx, val);
    } 
}
/*
    pushBack function

    receives a value to add to the back of the vector. 
    If the size and capacity are already equivalent 
    (i.e. vector is full), then vector capacity is doubled 
    via _reallocate before the value is added to end and size 
    incremented.
*/
Int8Vector.prototype.pushBack = (val) => {
    if(this.size == this.capacity){
        this._reallocate();
    }
    this._view.setInt8(this.size, val);
    this.size++;
}
/*
    safePushBack function 

    Same as pushBack, but provides additional error checking
    via validateValue function.
*/
Int8Vector.prototype.safePushBack = (val) => {
    if(this.validateValue(val)){
        if(this.size == this.capacity){
            this._reallocate();
        }
        this._view.setInt8(this.size, val);
        this.size++;
    } 
}
/*
    popBack function

    returns the last element in the vector and then decrements size.
    capacity is not reduced.
*/
Int8Vector.prototype.popBack = () => {
    this.size--;
    return this._view.getInt8(this.size);
}
/*
    safePopBack function

    same as popBack function, but additionally validates you are 
    not trying to access the last element of an empty vector.
*/
Int8Vector.prototype.safePopBack = () => {
    if(this.size == 0 || this.capacity == 0){
        throw Exception("Attempted to access last element in an empty Int8Vector.");
    } else {
        this.size--;
        return this._view.getInt8(this.size);
    }
}
/*
    clear function

    simply resets the size to 0. From the outside, this has the effect of 
    emptying the vector quickly. This is accomplished in O(1) time. However,
    the arraybuffer still contains all the data and capacity is not reduced.
*/
Int8Vector.prototype.clear = () => {
    this.size = 0;
}
/*
    resize function

    not to be confused with the "private" _reallocate function. 
    This function allows the user to specify a size and a 
    value. 
    
    If the current capacity is less than the specified 
    size, the _reallocate function is called until capacity is 
    adequate.

    Next, starting with the next vector element after the 
    last used element (i.e. slot at index which equals old size), 
    all remaining slots in the vector are initialized to 
    the value passed to this function.
*/
Int8Vector.prototype.resize = (size, val = 0) => {
    while(this.capacity < size){
        this._reallocate();
    }
    const tmpv = new DataView(this._buffer, this.size);
    for(let i = 0; i < tmpv.byteLength; i++){
        tmpv.setInt8(i,val);
    }
    this.size = size;
}
/*
    safeResize function

    same as resize function, but with additional error checking.

    value passed is validated to make sure it is a valid signed Int8.

    new size is validated to make sure it is larger than current size, 
    as passing a new size value than is less than current size could 
    result in odd behavior. also passed size values must be valid 
    integers.
*/
Int8Vector.prototype.safeResize = (size, val = 0) => {
    if(this.validateValue(val) && size % 1 == 0 && size > this.size){
        while(this.capacity < size){
            this._reallocate();
        }
        const tmpv = new DataView(this._buffer,this.size);
        for(let i = 0; i < tmpv.byteLength; i++){
            tmpv.setInt8(i,val);
        }
        this.size = size;
    }
}
/*
    swap function

    This function will actually reduce size of vector capacity.
    This means, for instance, if you have a vector with capacity of 
    100 slots, but size is 10 because only indexes 0 through 9 are 
    in use, this function will take the ten values from the old vector's
    buffer and put them in this vector's buffer variable after 
    setting the buffer variable to exactly the needed length.

    It receives another vector, validating that it is one, and then 
    it runs through the in-use range of the vector (i.e. beginning 
    index through size - 1 index) and reinitializes this vector's 
    buffer and view to be exactly the needed sizes.

*/
Int8Vector.prototype.swap = (vector) =>{
    if(!vector instanceof Int8Vector){
        throw new Error("Int8Vector method 'swap' can only receive an instance of Int8Vector.");
    } else {
        const tmpb = new ArrayBuffer(vector.size);
        const tmpv = new DataView(tmpb);
        for(let i = 0; i < vector.size; i++){
            tmpv.setInt8(i, vector._view.getInt8(i));
        }
        this._buffer = tmpb;
        this._view = tmpv;
        this.size = vector.size;
        this.capacity = vector.capacity;
    }
}

/*
    empty function

    Returns true if the vector's size is zero, else false.
    Note this will return true if size is zero but capacity is 
    greater than zero.
*/
Int8Vector.prototype.empty = () => {
    if(this.size == 0){
        return true;
    } else {
        return false;
    }
}
/*
    reserve function

    First we validate that p is a valid integer size for 
    a Vector data type (i.e. not a fraction, etc). 

    Then there are essentially six scenarios that are valid for this 
    reserve function:

    1) size == 0 and capacity == 0
        No exceptions will be thrown, _buffer and _view will be allocated 
        according to size of p. This happens in constant time (or whatever 
        time complexity is under the hood for allocating arraybuffers and 
        dataviews).
    2) size == 0 and capacity > 0 and p < capacity
        No exceptions will be thrown, but no reallocation will happen. 
        Capacity will remain the same. This happens in constant time.
    3) size == 0 and capacity > 0 and p > capacity
        No exceptions will be thrown, but a new _buffer and _view will 
        be allocated. This happens in constant time (or whatever 
        time complexity is under the hood for allocating arraybuffers and 
        dataviews).
    4) size > 0 and capacity > 0 and p < size
        No exceptions will be thrown, but DATA LOSS WILL OCCUR. 
        The constant time operation of resetting the size member 
        variable will happen, and the capacity will simply remain 
        the same.
    5) size > 0 and capacity > 0 and p > size and p < capacity
        No exceptions will be thrown, and no data loss occurs.
        No reallocation or resizing occurs.
    6) size > 0 and capacity > 0 and p > size and p > capacity
        No exceptions will be thrown, and no data loss occurs.
        However, the linear time operation of copying all data 
        from old buffer to new buffer will occur. Capacity will 
        be size p after this, and size will be the same.
            
*/
Int8Vector.prototype.reserve = (p) => {
    if(this.size !== 0){
        throw Exception("Cannot ")
    }

}
export default Int8Vector