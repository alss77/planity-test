import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState, useRef } from 'react';
import styled from "styled-components";
import { DATA } from './data';

const EVENT_COLORS = [
  '#FF7F50',
  '#6A5ACD',
  '#40E0D0',
  '#FFD700',
  '#8FBC8F',
  '#9370DB',
  '#FFA500',
  '#00CED1',
  '#FF69B4',
  '#008080',
]

const Row = styled.div`
  display: 'flex';
  flex-direction: 'row';
`;

function App() {
  const [events, setEvents] = useState(DATA);
  const divRefs = useRef([]);
  const startMinutes = 9 * 60;
  const endMinutes = 12 * 60;
  const ratio = window.innerHeight / endMinutes;

  useEffect(() => {
    divRefs?.current.forEach((ref) => {
      console.log('REF', ref?.current)
      if (ref?.current) {
        const divPosition = ref.current.getBoundingClientRect();
        const padding = divPosition.y + divPosition.height; // Calculate padding based on position

        // Apply the padding to the div
        //  ref.current.style.paddingBottom = `${padding}px`;
      }
    });
  }, []);

  useEffect(() => {
    console.log('DATA:', DATA);
    let newData = DATA.map((event) => {
      const [eventHours, eventMinutes] = event.start.split(':');
      event.startValue = parseInt(eventHours) * 60 + parseInt(eventMinutes);
      event.endValue = event.startValue + event.duration;
      // event.marginTop = (event.startValue - startMinutes) * ratio;
      event.marginTop = 0;
      event.height = event.duration * ratio;
      event.diff = (event.endValue - event.startValue);
      return event;
    })
    newData = newData.sort((a, b) => a.startValue - b.startValue)
    console.log('newData ordered:', newData);
    console.log('startMinutes:', startMinutes);
    console.log('endMinutes:', endMinutes);
    console.log('calculation ratio:', endMinutes * ratio);
    console.log('calculation start ratio :', startMinutes * ratio );
    console.log('window.innerHeight:', window.innerHeight);
    let neighbors;
    let pastNeighbors;
    newData = newData.map((event) => {
      neighbors = 0;
      pastNeighbors = 0;
      for (const currentEvent of newData) {
        if (event.id === 7 && currentEvent.id === 6) {
        console.log('currentEvent.id:', currentEvent.id, '& event.id:', event.id)
        console.log('currentEvent.startValue:', currentEvent.startValue)
        console.log('event.startValue:', event.startValue, '& event.endValue:', event.endValue)
        console.log('condition:', currentEvent.startValue >= event.startValue
          && currentEvent.startValue <= event.endValue)
        }
      if (currentEvent.id !== event.id) {
          if ((currentEvent.startValue >= event.startValue
            && currentEvent.startValue <= event.endValue)) {
            neighbors += 1;
            console.log('event.id:', event.id, 'fits with:', currentEvent.id)
          } else if ((event.startValue >= currentEvent.startValue
            && event.startValue <= currentEvent.endValue)) {
            pastNeighbors += 1;
          }
        }
      }
      return { ...event, neighbors, pastNeighbors, width: pastNeighbors && !neighbors ? `${100 / (pastNeighbors + 1)}%` : 0}
    });
    console.log('newData with neighbors:', newData);
    const rows = [];
    for (let i = 0; i < newData.length; i++) {
      const row = newData.slice(i, i + newData[i].neighbors + 1);
      rows.push(row);
      i = i + newData[i].neighbors;
    }
    console.log('ROWS', rows)
    setEvents(rows);
  }, [DATA]);

  function adaptPadding(event, rowIndex) {
    const row = document.getElementById(`row-${rowIndex}`);

    // Get the offset position of the navbar
    const offset = row.offsetTop;
    return ((event.startValue - startMinutes) * ratio) - offset;
  }

  return (
    <>
      {events?.length ? (
            <>
              {events?.map((row, index) => (
                <div id={`row-${index}`} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
                  {row.length && row?.map((event) => (
                    <div style={{ marginTop: adaptPadding(event, index), height: event.height, width: event.width || '100%', borderWidth: 1, borderStyle: 'solid', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', background: EVENT_COLORS[index]}}>
                      {event.start}
                    </div>
                  ))}
                </div>
              ))}
            </>
          ) : null}
    </>
  );
}

export default App;
