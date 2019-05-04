let inputSequences = '';
window.onload = function () {
    const fileInput = document.getElementById('fileInput');
    fileInput.addEventListener('change', function (e) {
        const file = fileInput.files[0];
        const textType = /text.*/;
        if (file.type.match(textType)) {
            let reader = new FileReader();
            reader.onload = function (e) {
                inputSequences = reader.result;
            }
            reader.readAsText(file);
        } else {
            document.getElementById('sequence').innerText = "File not supported!"
        }
    });
}
const addSequences = () => {
    let arrayOfSequences = (inputSequences.toLowerCase()).split('>')
    arrayOfSequences.shift();
    for (i = 0; i < arrayOfSequences.length; i++) {
        arrayOfSequences[i] = arrayOfSequences[i].slice(arrayOfSequences[i].search(/\r?\n|\r/g));
        arrayOfSequences[i] = arrayOfSequences[i].trim().replace(/\r?\n\s|\r\s/g, '');
    }
    return arrayOfSequences;
};
const addTitles = () => {
    let arrayOfTitles = (inputSequences.toLowerCase()).split('>')
    arrayOfTitles.shift();
    for (i = 0; i < arrayOfTitles.length; i++) {
        arrayOfTitles[i] = arrayOfTitles[i].substring(0, arrayOfTitles[i].search(/\r?\n|\r/g)).trim();

    }
    return arrayOfTitles;
}
const addRange = () => {
    let num = Number(document.getElementById("range").value);
    return num;
}
const addStep = () => {
    let text = Number(document.getElementById("step").value);
    return text;
}
const stepToPositions = (array, step) => {
    let positions = [];
    for (let i = 0; i < array.length; i += step) {
        positions.push(i);
    }
    return positions;
}
const atPairPercent = (array, start, range) => {
    let countAT = 0;
    for (let i = start; i < (start + range); i++) {
        if ((array[i] === 'a') || (array[i] === 't')) {
            countAT++
        }
    }
    return (countAT / range) * 100;
}
const returnEndResult = (array, range, counter) => {
    let endResult = [];
    let positions = stepToPositions(addSequences()[counter], addStep());
    for (const position of positions) {
        endResult.push(atPairPercent(array, position, range));
    };
    return endResult;
}
const returnEndResultTrunc = (counter) => {
    const sequenceArray = addSequences()[counter];
    let endResultTrunc = returnEndResult(addSequences()[counter], addRange(), counter);
    let division = Math.ceil(addRange() / addStep())
    if ((addRange() === addStep()) && (sequenceArray % addRange() !== 0)) {
        endResultTrunc.pop();
        endResultTrunc.push(atPairPercent(sequenceArray, (sequenceArray.length - 1) - addRange(), addRange()));
    } else if (addStep() <= 1) {
        endResultTrunc.splice((endResultTrunc.length - division), division);
    } else if (addStep() > 1) {
        endResultTrunc.splice((endResultTrunc.length - division), division);
        endResultTrunc.push(atPairPercent(sequenceArray, (sequenceArray.length - 1) - addRange(), addRange()));
    }
    return endResultTrunc;
}
const returnPositionsTrunc = (counter) => {
    const sequenceArray = addSequences()[counter];
    let positionsTrunc = stepToPositions(addSequences()[counter], addStep());
    let division = Math.ceil(addRange() / addStep())
    if ((addRange() === addStep()) && (sequenceArray % addRange() !== 0)) {
        positionsTrunc.pop();
        positionsTrunc.push((sequenceArray.length - 1) - addRange());
    } else if (addStep() <= 1) {
        positionsTrunc.splice((positionsTrunc.length - division), division);
    } else if (addStep() > 1) {
        positionsTrunc.splice((positionsTrunc.length - division), division);
        positionsTrunc.push((sequenceArray.length - 1) - addRange());
    }
    return positionsTrunc;
}
const atPairCount = (array, start, range) => {
    let countAT = 0;
    for (let i = start; i < (start + range); i++) {
        if ((array[i] === 'a') || (array[i] === 't')) {
            countAT++
        }
    }
    return countAT;
}
const returnEndCount = (array, range, counter) => {
    let endCount = [];
    let positions = stepToPositions(addSequences()[counter], addStep());
    for (const position of positions) {
        endCount.push(atPairCount(array, position, range));
    };
    return endCount;
}
const returnEndCountTrunc = (counter) => {
    const sequenceArray = addSequences()[counter];
    let endCountTrunc = returnEndCount(addSequences()[counter], addRange(), counter);
    let division = Math.ceil(addRange() / addStep())
    if ((addRange() === addStep()) && (sequenceArray % addRange() !== 0)) {
        endCountTrunc.pop();
        endCountTrunc.push(atPairCount(sequenceArray, (sequenceArray.length - 1) - addRange(), addRange()));
    } else if (addStep() <= 1) {
        endCountTrunc.splice((endCountTrunc.length - division), division);
    } else if (addStep() > 1) {
        endCountTrunc.splice((endCountTrunc.length - division), division);
        endCountTrunc.push(atPairCount(sequenceArray, (sequenceArray.length - 1) - addRange(), addRange()));
    }
    return endCountTrunc;
}
const displayEndResult = (counter) => {
    let displayEndResult = ''
    let endResultTrunc = returnEndResultTrunc(counter);
    let positionsTrunc = returnPositionsTrunc(counter);
    for (let i = 0; i < endResultTrunc.length; i++) {
        displayEndResult += `<br> ${endResultTrunc[i]}-${positionsTrunc[i]}-${positionsTrunc[i] + addRange()}`
    };
    displayEndResult += '<br>'
    return displayEndResult;
}
const displayRow = (title, resultRow) => {
    let html = ``;
    html += `<tr><td>${title}</td>`;
    for (let i = 0; i < resultRow.length; i++) {
        html += '<td>' + resultRow[i] + '</td>';
    }
    html += '</tr>'
    return html
}
const loadingBar = () => {
    let elem = document.getElementById("progressBar");
    let width = 1;
    let frame = () => {
        if (width >= 100) {
            clearInterval(id);
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
    let id = setInterval(frame, 0.1);
}
const calcAll = () => {
    let data = [];
    for (let i = 0; i < addSequences().length; i++) {
        data.push(
            trace = {
                x: returnPositionsTrunc(i),
                y: returnEndResultTrunc(i),
                type: 'scatter',
                name: `${addTitles()[i]}`,
                mode: 'lines+markers'
            });
    }
    var layout = {
        title: 'AT content',
        xaxis: {
            title: 'Position of range beginning [bp]',
        },
        yaxis: {
            title: 'AT content [%]',
        }
    };
    Plotly.newPlot('plot', data, layout);
    loadingBar();
}
const calcAvg = () => {
    let countSum = [];
    let countAvg = [];
    for (let a = 0; a < returnEndCountTrunc(0).length; a++) {
        countSum.push(0);
    }
    for (let i = 0; i < addSequences().length; i++) {
        for (let j = 0; j < returnEndCountTrunc(i).length; j++) {
            countSum[j] += returnEndCountTrunc(i)[j];
        }
    }
    for (count of countSum) {
        countAvg.push(((count / addSequences().length) / addRange()) * 100)
    }
    let trace = {
        x: returnPositionsTrunc(0),
        y: countAvg,
        type: 'scatter',
        name: 'Average AT content',
        mode: 'lines+markers'
    }
    let data = [trace];
    var layout = {
        title: 'Average AT content',
        xaxis: {
            title: 'Position of first nucleotide from each chosen range [bp]',
        },
        yaxis: {
            title: 'AT content [%]',
        }
    };
    Plotly.newPlot('plot', data, layout);
    loadingBar();
}