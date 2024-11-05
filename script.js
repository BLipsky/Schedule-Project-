var btn = $('#submitDay');

// Fixed bell schedule times based on box position (not period)
const bellSchedule = {
    1: { start: '8:24 AM', end: '9:31 AM' },
    2: { start: '9:36 AM', end: '10:43 AM' },
    3: { start: '10:48 AM', end: '11:55 AM' },
    lunch: { start: '11:55 AM', end: '12:36 PM' },
    4: { start: '12:41 PM', end: '1:48 PM' },
    5: { start: '1:53 PM', end: '3:00 PM' }
};
// Filter didn't work so instead use this to make sure correct periods appear right for each day 
const dailyPeriods = {
    A: [1, 2, 3, "Lunch", 5, 6],
    B: [4, 1, 2, "Lunch", 7, 5],
    C: [3, 4, 1, "Lunch", 6, 6],
    D: [2, 3, 4, "Lunch", 5, 6],
    E: [1, 2, 3, "Lunch", 7, 5],
    F: [4, 1, 2, "Lunch", 6, 7],
    G: [3, 4, 7, "Lunch", 5, 6]
};
// Select Day from Dropdown
btn.on("click", () => {
    var selectedDay = $('#dayInput').val();
    $.ajax({
      url: `https://api.npoint.io/22bb26e45d4697fb3609`,
      method: "GET",
      success: (data) => {
// Access jSon and pull each individual class and put it to the write day
        const schedule = data.schedule; 
        const daySchedule = dailyPeriods[selectedDay];
        $('#scheduleList').empty();
        let bellIndex = 1;
        daySchedule.forEach((period) => {
// Create and display constant "lunchtime" element (always 4th box)
          if (period === "Lunch") {
            const lunchTime = bellSchedule.lunch;
            $('#scheduleList').append(`
              <tr>
                <td>Lunch</td>
                <td>${lunchTime.start} - ${lunchTime.end}</td>
                <td colspan="3">Lunch Break</td>
              </tr>
            `);
          } else {
//function to display every other period - pull info from jSon and find which period loops through each day
            const periodData = schedule.find(item => item.period === period && item.days.includes(selectedDay));
            if (periodData) {
// Create every other block 
              const time = bellSchedule[bellIndex];
              $('#scheduleList').append(`
                <tr class="centerall">
                  <td>${period}</td>
                  <td>${time.start} - ${time.end}</td>
                  <td>${periodData.class}</td>
                  <td>${periodData.teacher}</td>
                  <td>${periodData.room}</td>
                </tr>
              `);
              bellIndex++;
            }
          }
        });
      },
// Error message if all else fails
      error: () => {
        console.log("We connected to the server, but it returned an error.");
      },
    });
});