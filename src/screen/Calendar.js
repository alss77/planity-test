import React, { useEffect, useState, } from 'react';
import { CALENDAR_INPUT } from '../utils/data';
import { convertHoursInMinutes, sortByMinutes, findConflicts, adaptStyling } from '../utils/helpers';
import { Event } from './components';

function Calendar() {
  const [events, setEvents] = useState(CALENDAR_INPUT);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener('resize', handleResize)
  })

  useEffect(() => {
    if (CALENDAR_INPUT.length) {
      let list = convertHoursInMinutes(CALENDAR_INPUT);
      list = sortByMinutes(list);
      list = findConflicts(list);
      list = adaptStyling(list);
      console.log('FINAL LIST:', list);
      setEvents(list);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [CALENDAR_INPUT]);

  return (
    <>
      {events?.map((event, index) =>
        <Event
          index={index}
          event={event}
          windowWidth={windowWidth}
          windowHeight={windowHeight}
        />)}
    </>
  );
}

export default Calendar;