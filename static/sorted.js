const slots = ["-", "-", "-", "-", "-"];
const jobs = [];
const deadlines = [];
const profits = [];

function populateTables() {
  for (let i = 0; i < 5; i++) {
    // (a-e)
    const randomJobName = String.fromCharCode(97 + i);

    // 1-5
    const randomDeadline = Math.floor(Math.random() * 5) + 1;

    //1-100
    const randomProfit = Math.floor(Math.random() * 100) + 1;

    jobs.push(randomJobName);
    deadlines.push(randomDeadline);
    profits.push(randomProfit);
  }

  updateTables();
}

function updateTable(tableId, data, header) {
  const table = document.getElementById(tableId);

  while (table.rows.length > 0) {
    table.deleteRow(0);
  }

  const headerRow = table.insertRow(0);
  const indexCell = headerRow.insertCell(0);
  indexCell.innerHTML = "<th><b>Index</b></th>";
  for (let i = 0; i < data.length; i++) {
    const cell = headerRow.insertCell(i + 1);
    cell.innerHTML = `<th>${i}</th>`;
  }

  const row = table.insertRow(1);

  const headerCell = row.insertCell(0);
  headerCell.innerHTML = `<b>${header}</b>`;

  for (let i = 0; i < data.length; i++) {
    const cell = row.insertCell(i + 1);
    cell.innerHTML = data[i];
  }
}
function openJobModal() {
  document.getElementById("jobModal").style.display = "flex";
}

function closeJobModal() {
  document.getElementById("jobModal").style.display = "none";
}

function addNewJob() {
  const jobName = document.getElementById("jobName").value;
  const jobDeadline = document.getElementById("jobDeadline").value;
  const jobProfit = document.getElementById("jobProfit").value;

  jobs.push(jobName);
  deadlines.push(jobDeadline);
  profits.push(jobProfit);

  updateTables();

  closeJobModal();
}

const maxSlots = 8; // Set your desired maximum number of slots

function addNewSlot() {
  if (slots.length < maxSlots) {
    slots.push("-");
    updateTable("tableSlots", slots, "Data");
  } else {
    alert("Maximum number of slots reached!");
  }
}


function updateTables() {
  updateTable("tableJobs", jobs, "Job Name");

  updateTable("tableDeadlines", deadlines, "Deadline");

  updateTable("tableProfits", profits, "Profit");

  updateTable("tableSlots", slots, "Data");
}
function sortJobs() {
  const sortedSchedule = greedyJobScheduling(jobs, deadlines, profits);

  updateTable("tableSlots", sortedSchedule, "Data");
}


function quickSortJobs() {
    const indices = Array.from({ length: jobs.length }, (_, i) => i);
    quickSortHelper(indices, 0, indices.length - 1);
  
    const sortedJobs = indices.map(index => jobs[index]);
    updateTable("tableSlots", sortedJobs, "Data");
  }
  
  function quickSortHelper(arr, low, high) {
    if (low < high) {
      const pivotIndex = partition(arr, low, high);
      quickSortHelper(arr, low, pivotIndex - 1);
      quickSortHelper(arr, pivotIndex + 1, high);
    }
  }
  
  function partition(arr, low, high) {
    const pivot = deadlines[arr[high]];
    let i = low - 1;
  
    for (let j = low; j < high; j++) {
      if (deadlines[arr[j]] <= pivot) {
        i++;
        swap(arr, i, j);
      }
    }
  
    swap(arr, i + 1, high);
    return i + 1;
  }
  
  function swap(arr, i, j) {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  


  function bubbleSortJobs() {
    openConfirmationModal();
  }

// function bubbleSortJobs() {
//     const indices = Array.from({ length: jobs.length }, (_, i) => i);
  
//     bubbleSort1(indices, (a, b) => deadlines[a] - deadlines[b]);
  
//     const sortedJobs = indices.map(index => jobs[index]);
//     const sortedDeadlines = indices.map(index => deadlines[index]);
//     const sortedProfits = indices.map(index => profits[index]);
  
//     updateTable("tableSlots", sortedJobs, "Data");
//   }

  function openConfirmationModal() {
    document.getElementById("confirmationModal").style.display = "flex";
  }
  

function bubbleSort1(arr, compareFunction) {
    const N = arr.length;
    for (let i = 0; i < N - 1; i++) {
      for (let j = 0; j < N - i - 1; j++) {
        if (compareFunction(arr[j], arr[j + 1]) > 0) {  // Change here to use '>' instead of '<'
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
        }
      }
    }
    return arr;  // Add this line to return the sorted array
  }
  

function bubbleSort(arr, compareFunction) {
  const N = arr.length;
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < N - i - 1; j++) {
      if (compareFunction(arr[j], arr[j + 1]) < 0) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

function greedyJobScheduling(jobNames, deadlines, profits) {
  const N = deadlines.length;

  const indices = Array.from({ length: N }, (_, i) => i);

  bubbleSort(indices, (a, b) => profits[a] - profits[b]);

  const result = new Array(N).fill("-");

  for (let i = 0; i < N; i++) {
    for (let j = Math.min(N, deadlines[indices[i]]) - 1; j >= 0; j--) {
      if (result[j] === "-") {
        result[j] = jobNames[indices[i]];
        break;
      }
    }
  }

  return result;
}

function performStep(sortedSchedule) {
  if (stepIndex < sortedSchedule.length) {
    const currentJob = sortedSchedule[stepIndex];

    highlightColumn("tableJobs", currentJob);
    highlightColumn("tableDeadlines", currentJob);
    highlightColumn("tableProfits", currentJob);

    updateSlotsTable(sortedSchedule.slice(0, stepIndex + 1));

    setTimeout(() => {
      removeColumnHighlight("tableJobs", currentJob);
      removeColumnHighlight("tableDeadlines", currentJob);
      removeColumnHighlight("tableProfits", currentJob);

      stepIndex++;
      performStep(sortedSchedule);
    }, 2000);
  }
}

let stepIndex = 0;

function playAlgorithm() {
  const sortedSchedule = greedyJobScheduling(jobs, deadlines, profits);

  stepIndex = 0;

  performStep(sortedSchedule);
}

function stepForward() {
  const sortedSchedule = greedyJobScheduling(jobs, deadlines, profits);

  if (stepIndex < sortedSchedule.length) {
    const currentJob = sortedSchedule[stepIndex];
    highlightColumn("tableJobs", currentJob);
    highlightColumn("tableDeadlines", currentJob);
    highlightColumn("tableProfits", currentJob);

    stepIndex++;

    updateSlotsTable(sortedSchedule.slice(0, stepIndex));
  }
}
function stepBackward() {
  if (stepIndex > 0) {
    stepIndex--;
    const sortedSchedule = greedyJobScheduling(jobs, deadlines, profits);
    const currentJob = sortedSchedule[stepIndex];

    removeColumnHighlight("tableJobs", currentJob);
    removeColumnHighlight("tableDeadlines", currentJob);
    removeColumnHighlight("tableProfits", currentJob);

    updateSlotsTable(sortedSchedule.slice(0, stepIndex));
  }
}
function updateSlotsTable(schedule) {
  const table = document.getElementById("tableSlots");

  const existingRow = table.querySelector("tr:nth-child(2)");

  if (existingRow) {
    for (let i = 0; i < existingRow.cells.length - 1; i++) {
      const cell = existingRow.cells[i + 1];
      cell.innerHTML = "-";
    }

    for (let i = 0; i < schedule.length; i++) {
      const cell = existingRow.cells[i + 1];
      if (cell.innerHTML === "-") {
        cell.innerHTML = schedule[i] !== "-" ? schedule[i] : "-";
      }
    }
  } else {
    const row = table.insertRow(2);

    const headerCell = row.insertCell(0);
    headerCell.innerHTML = `<b>Data</b>`;

    for (let i = 0; i < schedule.length; i++) {
      const cell = row.insertCell(i + 1);
      cell.innerHTML = schedule[i] !== "-" ? schedule[i] : "-";
    }
  }
}

function highlightColumn(tableId, value) {
  const table = document.getElementById(tableId);

  for (let i = 1; i < table.rows.length; i++) {
    const cell = table.rows[i].cells;
    for (let j = 1; j < cell.length; j++) {
      if (cell[j].innerHTML === value) {
        cell[j].style.backgroundColor = "yellow";
      }
    }
  }
}

function removeColumnHighlight(tableId, value) {
  const table = document.getElementById(tableId);

  for (let i = 1; i < table.rows.length; i++) {
    const cell = table.rows[i].cells;
    for (let j = 1; j < cell.length; j++) {
      if (cell[j].innerHTML === value) {
        cell[j].style.backgroundColor = "";
      }
    }
  }
}