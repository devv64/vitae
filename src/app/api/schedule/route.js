// src/app/api/schedule/route.js

import { scheduleTasks, Task, Event } from '@/utils/schedule';

export async function POST(request) {
    console.log('POST request to /api/schedule');
    try {
      const { tasks, events } = await request.json();

      console.log('tasks:', tasks);
        console.log('events:', events);
  
      // Check if tasks and events are defined and are arrays
      if (!Array.isArray(tasks) || !Array.isArray(events)) {
        return new Response('Invalid input format', { status: 400 });
      }
  
      // Convert incoming tasks and events to the appropriate format
      const formattedTasks = tasks.map(task => 
        new Task(task.name, task.rank, task.duration)
      );
  
      console.log('event!!#UON#!UI!: ', events);
      const formattedEvents = events.map(event => 
        new Event(new Date(event.start), new Date(event.end), event.title)
      );
  
      // Schedule the tasks
      const scheduledTasks = scheduleTasks(formattedTasks, formattedEvents);
  
      return new Response(JSON.stringify(scheduledTasks), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error scheduling tasks:', error);
      return new Response('Failed to schedule tasks', { status: 500 });
    }
  }
  