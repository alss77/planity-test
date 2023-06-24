import { EVENT_COLORS, CALENDAR_START, CALENDAR_END } from '../utils/data';

export const Event = ({ event, index, windowWidth, windowHeight }) => {
  const { id, start, startValueInMinutes, duration, widthDivider, leftPositionMultiplier } = event;

  const windowTopPositionInMinutes = CALENDAR_START * 60;
  const windowEndPositionInMinutes = (CALENDAR_END - CALENDAR_START) * 60;
  const ratio = windowHeight / windowEndPositionInMinutes;

  const top = (startValueInMinutes - windowTopPositionInMinutes) * ratio;
  const height = duration * ratio;
  const width = windowWidth / widthDivider;
  const left = width * leftPositionMultiplier;

  const style = {
    display: 'flex',
    position: 'absolute',
    fontSize: '2vw',
    top: `${top}px`,
    left: `${left}px`,
    height: `${height}px`,
    width: width ? `${width}px` : '100%',
    background: EVENT_COLORS[index],
    border: '1px solid grey',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  };
  
  return <div style={style}>Event {id} starts at {start}</div>;
}