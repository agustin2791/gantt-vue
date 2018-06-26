<template>
  <div class="">
    <h3>{{ duration }}</h3>
    Start: <input type="date" name="dateStart" v-model="initDate"><br>
    End: <input type="date" name="endDate" v-model="endDate"><br>
    <button @click="chartDates(initDate, endDate)" type="button">Chart</button>
    Start: {{ initDate }} | End: {{ endDate }}
    <div class="container">
      <div class="calendar" id="calendar" v-if="dateSelected != null">
        <div class="date-data"  v-for="(date, index) in dateSelected" :key="index" :data-date="date.date0">
          {{ date.month }}<br>{{ date.date }}
        </div>
        <div v-for="(t, index) in tasks">
          <div :style="{width: t.duration * 50 + (t.duration * 2) + 'px'}" class="duration" :data-key-selector="index">{{ t.duration }}
            <div class="mover" @mousedown="initMoving($event, index)"></div>
            <div class="resizer" @mousedown="initResize(index)"></div></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  data () {
    return {
      tasks: [
        {
          task: 'task 1',
          duration: 4,
          startDate: new Date('06-13-2018'),
        },
        {
          task: 'task 2',
          duration: 4,
          startDate: new Date('06-25-2018'),
        },
        {
          task: 'task 3',
          duration: 4,
          startDate: new Date('07-01-2018'),
        }
      ],
      duration: 4,
      isDragging: false,
      isMoving: false,
      selected: null,
      initSize: 0,
      initPos: 0,
      initX: 0,
      initDate: '2018-06-11',
      endDate: '2018-07-11',
      dateSelected: null,
      selectedShow: false,
      offsetLeft: null,
      months: ['January', 'February','March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  },
  methods: {
    chartDates(start, end) {
      let dateStart = new Date(start),
          dateEnd = new Date(end);
      let days = Math.ceil(Math.abs(dateStart - dateEnd) / (1000 * 3600 * 24));
      let selected = [];
      for (let i = 1; i <= (days + 1); i++) {
          let newDate = new Date(dateStart.setDate(dateStart.getDate() + i));
          dateStart.setDate(dateStart.getDate() - i)
          selected.push({
            date: newDate.getDate(),
            month: this.months[newDate.getMonth()],
            year: newDate.getYear(),
            day: newDate.getDay(),
            date0: this.months[newDate.getMonth()] + '-' + newDate.getDate() + '-' + newDate.getYear()
          });
      }
      this.dateSelected = selected;
      setTimeout(function() {
        this.taskLocator()
      }.bind(this))
    },
    taskLocator() {
      let duration = document.querySelectorAll('div.duration');
      if (duration != null) {
        for (let i = 0; i < this.tasks.length; i++) {
          let offset = document.querySelector('[data-date="' + this.months[this.tasks[i].startDate.getMonth()] + '-' + this.tasks[i].startDate.getDate() + '-' + this.tasks[i].startDate.getYear() + '"]').offsetLeft;
          document.querySelector('[data-key-selector="'+ i +'"]').style.position = 'absolute';
          document.querySelector('[data-key-selector="'+ i +'"]').style.left = offset + 'px';
          document.querySelector('[data-key-selector="'+ i +'"]').style.position = 'relative';
        }
      }

    },
    resizer(event) {
      let resizeDiv = document.querySelector('[data-key-selector="' + this.selected + '"]'),
          initSize = resizeDiv.style.width;
      if (this.isDragging) {
        resizeDiv.style.width = (event.clientX - resizeDiv.offsetLeft) + 'px';
      }
      let endSize = resizeDiv.style.width;
    },
    stopResize() {
      this.isDragging = false;
      if (this.selected != null) {
        let resizeDiv = document.querySelector('[data-key-selector="' + this.selected + '"]');
        let initSize = parseInt(this.initSize.slice(0, -2));
        let endSize = parseInt(resizeDiv.style.width.slice(0, -2));
        if (endSize - initSize != 0) {
          if (endSize - initSize < 0 ) {
            let diff = endSize - initSize;
            if (diff % 50 != 0) {
              while (diff % 50 != 0) {
                diff--;
              }
              this.tasks[this.selected].duration += diff / 50;
            } else {
              this.tasks[this.selected].duration += diff / 50;
            }
          } else if (endSize - initSize > 0) {
            let diff = endSize - initSize;
            if (diff % 50 != 0) {
              while (diff % 50) {
                diff++;
              }
              this.tasks[this.selected].duration += diff / 50;
              this.initSize = endSize;
            } else {
              this.tasks[this.selected].duration += diff / 50;
              this.initSize = endSize;
            }
          }
        }
        this.initSize = resizeDiv.style.width;
        window.removeEventListener('mousemove', this.resizer, false);
        window.removeEventListener('mouseup', this.stopResize, false);
        this.selected = null;
      }
    },
    initResize(key) {
      this.isDragging = true;
      this.selected = key;
      let resizeDiv = document.querySelector('[data-key-selector="' + this.selected + '"]');
      this.initSize = resizeDiv.style.width;
      window.addEventListener('mousemove', this.resizer, false);
      window.addEventListener('mouseup', this.stopResize, false);
    },
    initMoving(event, key) {
      this.isMoving = true;
      this.selected = key;
      let moveDiv = document.querySelector('[data-key-selector="' + this.selected + '"]');
      this.initPos = event.clientX;
      this.initX = moveDiv.offsetLeft;
      window.addEventListener('mousemove', this.mover, false);
      window.addEventListener('mouseup', this.stopMoving, false);
    },
    mover(event) {
      let moveDiv = document.querySelector('[data-key-selector="' + this.selected + '"]'),
          initPos = moveDiv.offsetLeft;
      moveDiv.style.position = 'absolute';
      if (this.isMoving) {
        let diff = event.clientX - this.initPos;
        moveDiv.style.left = this.initX + diff + 'px';
      }
      moveDiv.style.position = 'relative';
    },
    stopMoving() {
      this.isMoving = false;
      if (this.selected != null) {
        let positionOne = this.initX;
        let positionTwo = document.querySelector('[data-key-selector="' + this.selected + '"]').offsetLeft;
        let diff = positionTwo - positionOne;
        let originalDate = new Date(this.tasks[this.selected].startDate);
        let ticks;
        if (diff < 0) {
          while(diff % 50 != 0) {
            diff--;
          }
          ticks = diff / 50;
        } else if (diff >= 0) {
          if (diff % 50 > 40) {

            while (diff % 50 != 0) {
              diff++;
            }
          } else {
            while (diff % 50 != 0) {
              diff--;
            }
          }

          ticks = diff / 50;
        }
        originalDate.setDate(originalDate.getDate() + ticks);
        this.tasks[this.selected].startDate = originalDate;
        this.taskLocator();
      }
      window.removeEventListener('mousemove', this.mover, false);
      window.removeEventListener('mouseup', this.stopMoving, false);
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.duration {
  height: 50px;
  background-color: #0ff;
  position: relative;
  margin-bottom: 5px;
}
.resizer {
  height: 50px;
  width:10px;
  background: #f00;
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 5;
}
.mover {
  height: 10px;
  width: 80%;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translate(-50%, -10px);
  background: #5DD;
  border-top-right-radius: 50px;
  border-top-left-radius: 50px;
}
.container {
  width: 100%;
  position: relative;
  overflow-x: scroll;
  background-image: url('../assets/background.jpg');
  background-repeat: repeat;
  background-position: 0 0;
  background-attachment: local;
}
.calendar {
  position: relative;
  display: block;
  white-space: nowrap;
}
.date-data {
  position: relative;
  display: inline-block;
  width: 50px;
  background: #f99;
  border: solid thin #f77;
}
</style>
