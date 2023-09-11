//JSON Data Pass To Array

import dataJson from '../JSON/studentData.json' assert { type: "json" };
for(let element of dataJson.data){
    jsonDataArr.push(element);   //All objects are added in array
}