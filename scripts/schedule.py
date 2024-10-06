import json
from typing import List, Tuple
from datetime import datetime, timedelta
import sys

# Define the Task and Event structures
class Task:
    def __init__(self, name: str, rank: int, duration: timedelta):
        self.name = name
        self.rank = rank
        self.duration = duration

class Event:
    def __init__(self, start: datetime, end: datetime):
        self.start = start
        self.end = end

def schedule_tasks(tasks: List[Task], events: List[Event]) -> List[Tuple[str, datetime, datetime]]:
    # Sort tasks by rank (higher rank first)
    tasks.sort(key=lambda x: x.rank, reverse=True)
    events.sort(key=lambda x: x.start)

    # Create a list of available time slots based on events
    available_slots = []
    current_time = events[0].start

    for event in events:
        if current_time < event.start:
            # Add available slot before the event
            available_slots.append((current_time, event.start))
        current_time = event.end

    midnight = (current_time + timedelta(days=1)).replace(hour=0, minute=0, second=0, microsecond=0)

    # Add any remaining time after the last event
    if current_time < midnight:  # Assuming a 24-hour day
        available_slots.append((current_time, midnight))

    # Create a schedule to track assigned tasks
    schedule = []

    # Try to assign tasks to the available time slots
    for task in tasks:
        for slot in available_slots:
            slot_start, slot_end = slot
            # Check if the task fits in the current slot
            if (slot_end - slot_start) >= task.duration:
                # Assign the task to this time slot
                schedule.append((task.name, slot_start, slot_start + task.duration))
                # Update the slot
                available_slots.remove(slot)
                # If the slot is partially filled, add the remaining part back to available_slots
                if (slot_end - slot_start) > task.duration:
                    available_slots.append((slot_start + task.duration, slot_end))
                break  # Move on to the next task

    return schedule

def main():
    # Read input from stdin (expecting JSON)
    print("Reading input from stdin")
    input_data = json.load(sys.stdin)
    print(input_data)
    
    tasks_data = input_data.get('tasks', [])
    events_data = input_data.get('events', [])

    # Parse tasks
    tasks = []
    for task_data in tasks_data:
        name = task_data['name']
        rank = int(task_data['rank'])
        duration = timedelta(hours=int(task_data['duration']))
        tasks.append(Task(name, rank, duration))

    # Parse events
    events = []
    for event_data in events_data:
        start = datetime.strptime(event_data['start'], '%Y-%m-%d %H:%M')
        end = datetime.strptime(event_data['end'], '%Y-%m-%d %H:%M')
        events.append(Event(start, end))

    # Schedule the tasks
    scheduled_tasks = schedule_tasks(tasks, events)

    # Prepare and return output as JSON
    result = [
        {
            'task': task[0],
            'start': task[1].strftime('%Y-%m-%d %H:%M'),
            'end': task[2].strftime('%Y-%m-%d %H:%M')
        }
        for task in scheduled_tasks
    ]

    json.dump(result, sys.stdout)

if __name__ == "__main__":
    main()
