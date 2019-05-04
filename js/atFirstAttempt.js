const addSequence = () => {
    const sequenceArray = (((document.getElementById("sequence").value).toLowerCase())).replace(/\s/g, '').split('');
    return sequenceArray;
};
const addRange = () => {
    let text = Number(document.getElementById("range").value);
    return text;
}
const addStep = () => {
    let text = Number(document.getElementById("step").value);
    return text;
}
const stepToPositions = (array, step) => { 
    let positions = [];
    for (i = 0; i < array.length; i += step){
        positions.push(i);
    }
    return positions;
}
const atPairPercent = (array,start,range) => {
    let countAT = 0;
    for (i = start; i < (start + range); i++){
        if ((array[i] === 'a') || (array[i] === 't')){
            countAT++
        }
    }
    return (countAT/range)*100;
} 
const returnEndResult = (array, range) =>{
    let endResult = [];
    let positions = stepToPositions(addSequence(),addStep());
    for (const position of positions){
        endResult.push(atPairPercent(array, position, range));
    };
    return endResult;
}
const returnEndResultTrunc = () => {
    const sequenceArray = addSequence();
    let endResultTrunc = returnEndResult(addSequence(),addRange());
    let division = Math.floor(addRange()/addStep())
    if ((addRange() === addStep()) && (sequenceArray % addRange() !== 0)) {
        endResultTrunc.pop();
        endResultTrunc.push(atPairPercent(sequenceArray, sequenceArray[sequenceArray.length - addRange()], addRange()));
    } else if (addRange() > addStep()) {
        endResultTrunc.splice((endResultTrunc.length - division), division);
        endResultTrunc.push(atPairPercent(sequenceArray, sequenceArray.length - addRange(), addRange()));
        if (endResultTrunc[endResultTrunc.length-2] === endResultTrunc[endResultTrunc.length-1]){
            endResultTrunc.pop();
        };
    }
    return endResultTrunc;
}
const returnPositionsTrunc = () => {
    const sequenceArray = addSequence();
    let positionsTrunc = stepToPositions(addSequence(),addStep());
    let division = Math.floor(addRange()/addStep())
    if ((addRange() === addStep()) && (sequenceArray % addRange() !== 0)) {
        positionsTrunc.pop();
        positionsTrunc.push((sequenceArray.length - 1) - (addRange() - 1));
    } else if (addRange() > addStep()) {
        positionsTrunc.splice((positionsTrunc.length - division), division);
        positionsTrunc.push((sequenceArray.length - 1) - (addRange() - 1));
        if (positionsTrunc[positionsTrunc.length-2] === positionsTrunc[positionsTrunc.length-1]){
            positionsTrunc.pop();
        };
    }
    return positionsTrunc; 
}
displayEndResult = () => {
    let displayEndResult = ''
    let endResultTrunc = returnEndResultTrunc();
    let positionsTrunc = returnPositionsTrunc();
    for (i = 0; i < endResultTrunc.length; i++){
        displayEndResult += `<br> ${endResultTrunc[i]}-${positionsTrunc[i]}-${positionsTrunc[i] + addRange()}`
    };
    displayEndResult += '<br>'
    return displayEndResult;
}
displayTable = (resultRow, positionsRow, range) => {
    let html = `<table border='1'>`;
    html+='<tr>';
    for (let i = 0; i < resultRow.length; i++) {       
        html+='<td>'+resultRow[i]+'</td>';
    }
    html+='<tr>';
    for (let i = 0; i < positionsRow.length; i++) {       
        html+="<td>"+positionsRow[i]+' - '+(positionsRow[i]+(range-1))+"</td>";
    }
    html+="</table>";
    return html
}
const calc = () => {
    document.getElementById("results").innerHTML += displayTable(returnEndResultTrunc(),returnPositionsTrunc(),addRange());
}
