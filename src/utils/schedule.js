class Task {
  constructor(name, rank, duration) {
    this.name = name;
    this.rank = rank;
    this.duration = duration; // duration in hours
  }
}

class Event {
  constructor(start, end, title) {
    this.title = title;
    this.start = new Date(start);
    this.end = new Date(end);
  }
}

const scheduleTasks = (tasks, events) => {
    // Sort tasks by rank (higher rank first)
    tasks.sort((a, b) => b.rank - a.rank);
    events.sort((a, b) => a.start - b.start);
  
    // Create a list of available time slots based on events
    const availableSlots = [];
    let currentTime = events[0].start;
  
    for (const event of events) {
      if (new Date(currentTime.getTime() + 30 * 60 * 1000)  < event.start) {
        // Add available slot before the event
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        availableSlots.push([currentTime, event.start]);
      }
      currentTime = event.end;
    }
  
    const midnight = new Date(currentTime);
    midnight.setHours(24, 0, 0, 0); // Set to the next day's midnight
  
    // Add any remaining time after the last event
    if (currentTime < midnight) {
        // add 30 min buffer to currentTime
        currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
      availableSlots.push([currentTime, midnight]);
    }
  
    // Create a schedule to track assigned tasks
    const schedule = [...events];
  
    // Try to assign tasks to the available time slots
    for (const task of tasks) {
      for (let i = 0; i < availableSlots.length; i++) {
        const [slotStart, slotEnd] = availableSlots[i];
        const slotDuration = (slotEnd - slotStart) / (1000 * 60 * 60); // Convert ms to hours
  
        // Check if the task fits in the current slot
        if (slotDuration >= task.duration) {
          // Assign the task to this time slot
          const taskStart = new Date(slotStart); // Use the start of the slot for task start
          const taskEnd = new Date(taskStart.getTime() + task.duration * 60 * 60 * 1000); // Calculate task end
  
          // Add the task to the schedule
          schedule.push({ title: task.name, start: taskStart, end: taskEnd });
  
          // Update the available slots
          availableSlots.splice(i, 1); // Remove the filled slot
          // If the slot is partially filled, add the remaining part back to availableSlots
          if (taskEnd < slotEnd) {
            availableSlots.push([taskEnd, slotEnd]);
          }
          break; // Move on to the next task
        }
      }
    }
  
    return schedule;
  };  

module.exports = {
  Task,
  Event,
  scheduleTasks,
};
