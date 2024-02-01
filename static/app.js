
const slots = ["-", "-", "-", "-", "-"];
const jobs = [];
const deadlines = [];
const profits = [];


function openAddJobModal() {
  document.getElementById("addJobModal").style.display = "block";
}

function closeAddJobModal() {
  document.getElementById("jobModal").style.display = "none";
}

function openDeleteJobModal() {
  document.getElementById("deleteJobModal").style.display = "block";
}

function closeDeleteJobModal() {
  document.getElementById("deleteJobModal").style.display = "none";
}

if (performance.getEntriesByType("navigation")[0].type === "reload") {
  // Page is being refreshed
  console.log("Page is refreshed");
  window.location.href = "/"; // Redirect to the home page
} else {
  console.log("Page is loaded for the first time or other navigation types");
}

function openJobModal() {
  document.getElementById("jobModal").style.display = "flex";
}








function updateTable(tableId, data, header) {
  const table = document.getElementById(tableId);


  while (table.rows.length > 0) {
    table.deleteRow(0);
  }


  const headerRow = table.insertRow(0);
  const indexCell = headerRow.insertCell(0);
  indexCell.innerHTML = '<th><b>Index</b></th>';
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

function addNewSlot() {
  slots.push("-");

  updateTable("tableSlots", slots, "Data");
  
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


  const result = new Array(N).fill('-');


  for (let i = 0; i < N; i++) {
      for (let j = Math.min(N, deadlines[indices[i]]) - 1; j >= 0; j--) {
          if (result[j] === '-') {
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
      cell.innerHTML = '-';
    }

    for (let i = 0; i < schedule.length; i++) {
      const cell = existingRow.cells[i + 1];
      if (cell.innerHTML === '-') {
        cell.innerHTML = schedule[i] !== '-' ? schedule[i] : '-';
      }
    }
  } else {
    const row = table.insertRow(2);

    const headerCell = row.insertCell(0);
    headerCell.innerHTML = `<b>Data</b>`;

    for (let i = 0; i < schedule.length; i++) {
      const cell = row.insertCell(i + 1);
      cell.innerHTML = schedule[i] !== '-' ? schedule[i] : '-';
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



function openSortDataModal() {
  document.getElementById("sortDataModal").style.display = "flex";
}

function closeSortDataModal() {
  document.getElementById("sortDataModal").style.display = "none";
}