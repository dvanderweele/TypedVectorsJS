import Int8Vector from "../lib/Int8Vector.js"

function Int8VectorTests(){
    const testResults = {
        passes: 0,
        fails: 0
    };


    console.log("Testing Int8Vector Class");

    const vec = new Int8Vector();
    vec instanceof Int8Vector ? testResults.passes++ : testResults.fails++;

    if (testResults.fails > 0){
        let logString = testResults.fails + " out of " 
        + (testResults.passes + testResults.fails) 
        + " tests for Int8Vector Class failed.";
        console.log(logString);
    } else {
        let logString = "All " + testResults.passes + " tests for Int8Vector Class passed.";
        console.log(logString);
    }

    return testResults;
}

export default Int8VectorTests