/**
 * Detect the number
 * @param {Array} list - List of events (need sorted list by time)
 * @returns List with the number of conflicts
 */
export const findConflicts = (list) => {
  const updatedEvents = [...list];

  for (let i = 0; i < updatedEvents.length; i++) {
    const currentEvent = updatedEvents[i];
    const nextConflicts = updatedEvents.filter((event, index) => {
      // Check for events that start at the same time
      if (currentEvent.id !== event.id && currentEvent.startValueInMinutes === event.startValueInMinutes) {
        return i < index;
      }
      // Check for events that start during the current event
      return currentEvent.id !== event.id && event.startValueInMinutes >= currentEvent.startValueInMinutes && event.startValueInMinutes < currentEvent.endValueInMinutes;
    }).length;
    const prevConflicts = updatedEvents.filter((event, index) => {
      // Check for events that start at the same time
      if (currentEvent.id !== event.id && currentEvent.startValueInMinutes === event.startValueInMinutes) {
        return i > index;
      }
      // Check the current event starts during a previous event
      return currentEvent.id !== event.id && currentEvent.startValueInMinutes >= event.startValueInMinutes && currentEvent.startValueInMinutes < event.endValueInMinutes
    }).length;
    // Represent the number of next conflicts
    currentEvent.nextConflicts = nextConflicts;
    // Represent the number of previous conflicts
    currentEvent.prevConflicts = prevConflicts;
    // Represent the sum of conflicts
    currentEvent.sumOfConflicts = nextConflicts + prevConflicts;
    console.log(currentEvent.id, 'has', nextConflicts, 'next conflicts and', prevConflicts, 'prev conflicts');
  }
  return updatedEvents;
}

/**
 * Get a divider and multiplier to apply to the styling to positionate the event 
 * @param {Array} list - List of events (need sorted list by time)
 * @returns List with a divider and multiplier to apply to the styling to positionate the event
 */
export const adaptStyling = (list) => {
  for (let i = 0; i < list.length; i++) {
    const currentEvent = list[i];
    const { prevConflicts, nextConflicts, sumOfConflicts } = currentEvent;
    const DEFAULT_DIVIDER = sumOfConflicts + 1;
    const DEFAULT_MULTIPLIER = prevConflicts;

    currentEvent.widthDivider = DEFAULT_DIVIDER;
    // Will positionate the event depending on the number or previous events
    currentEvent.leftPositionMultiplier = DEFAULT_MULTIPLIER;  

    if (prevConflicts && nextConflicts) {
      // Check if all events are conflicting between each other or not
      if (list[i - 1].sumOfConflicts !== sumOfConflicts || list[i + 1].sumOfConflicts !== sumOfConflicts) {
        currentEvent.widthDivider = sumOfConflicts;
      }
    } else if (prevConflicts) {
      // Check if current previous conflicts equals previous next conflicts
      // BUT previous event has more conflicts than the current event
      if (prevConflicts === list[i - 1].nextConflicts && sumOfConflicts !== list[i - 1].sumOfConflicts) {
        currentEvent.leftPositionMultiplier = prevConflicts - 1;  
      }
    } else if (nextConflicts) {
      // Check if current event has multiple upcomming small conflicts
      if (nextConflicts > list[i + 1].prevConflicts && sumOfConflicts > list[i + 1].sumOfConflicts) {
        currentEvent.widthDivider = sumOfConflicts;
      }
    }
  }
  return list;
}

/**
  * Function that will sort a list by minutes or duration
  * @param {Array} list - List of events
  * @returns sorted list by minutes
  */
export const sortByMinutes = (list) => {
  return list.sort((a, b) => {
    if (a.startValueInMinutes === b.startValueInMinutes)
      return a.duration - b.duration;
    return a.startValueInMinutes - b.startValueInMinutes;
  })
}

/**
  * Function that will convert a time (with synthax "12:00") into minutes
  * @param {Array} list - List of events
  * @returns list with converted time in minutes
  */
export const convertHoursInMinutes = (list) => {
  return list.map((event) => {
    const [eventHours, eventMinutes] = event.start.split(':');
    event.startValueInMinutes = parseInt(eventHours) * 60 + parseInt(eventMinutes);
    event.endValueInMinutes = event.startValueInMinutes + event.duration;
    return event;
  })
}