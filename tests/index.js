import Int8VectorTests from "./Int8Vector.test.js"

function Test() { 
    let res;
    let passes = 0;
    let fails = 0;

    res = Int8VectorTests();
    console.log("/END_TESTS");

    console.log("Passing Tests: " + passes);
    console.log("Failing Tests: " + fails);

    if(fails > 0){
        let errString = fails + " test(s) failed.";
        throw new Error(errString);
    } else {
        let passString = "All " + passes + " tests passed.";
        console.log(passString);
    }
}

Test();