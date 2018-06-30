const months: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
const dayOfWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var isSelected, isMoving, isResizing, initSize, initPosition, initX, offsetLeft;

interface Tasks {
  name: string,
  startDate: string,
  duration?: number,
  endDate?: string,
}

interface Options {
  target: string,
  start: any,
  end: any,
  color?: string,
}

interface SelectDate {
  date: number,
  month: string,
  year: number,
  day: string,
  fullDate: Date
}

var startDate: Date = new Date();
var endDate: Date = new Date();
endDate.setDate(endDate.getDate() + 30);
var defaults: Options = {
  target: '#gantt',
  start: startDate,
  end: endDate,
  color: '#2980b9'
}
// Only one project and displays the tasks - not color coordinated
function initChart(tasks: Tasks, options: Options = defaults): void {
  var targetDiv = document.querySelector(options.target);
  var start, end, color;
  targetDiv.innerHTML = `<div class="tasks-container"><h2>Task Container</h2></div><div class="gantt-container"><h3>Gantt Container</h3></div>`;
  var tasksDiv = document.querySelector('.tasks-container'),
      chartDiv = document.querySelector('.gantt-container');
  var selectedDates: SelectDate[] = [];
  var datesHTML: any = ``;


  if (options.color == undefined) {
    color = defaults.color;
  } else {
    color = options.color;
  }
  if (options.start == undefined) {
    start = new Date(defaults.start);
  } else {
    start = new Date(options.start);
  }
  if (options.end == undefined) {
    end = new Date(defaults.end);
  } else {
    end = new Date(options.end);
  }

  var days: number = Math.ceil(Math.abs(end - start) / (1000 * 3600 * 24));
  for (let i = 0; i <= (days); i++) {
    let newDate: Date = new Date(months[start.getMonth()] + '-' + start.getDate() + '-' + start.getFullYear());
    newDate.setDate(newDate.getDate() + i);
    var dateObj: SelectDate = {
      date: newDate.getDate(),
      month: months[newDate.getMonth()],
      year: newDate.getFullYear(),
      day: dayOfWeek[newDate.getDay()],
      fullDate: newDate
    }
    selectedDates.push(dateObj);
    chartDiv.innerHTML += `<div class="gantt-date">${dateObj.month}<br>${dateObj.date}</div>`;
    console.log(dateObj.fullDate)
    newDate.setDate(newDate.getDate() - i);

  }
}
