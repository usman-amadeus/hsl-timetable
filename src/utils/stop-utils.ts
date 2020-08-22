import { get, sortBy, map, uniq } from 'lodash';
import { TimetableRow, Stop } from '../app/App';


export const parseStop = (stop: any, stopId?: string): Stop => {
  const id = get(stop, 'id') || stopId || '';
  return {
    id,
    code: get(stop, 'code') || id,
    name: get(stop, 'name') || 'Stop',
    platform: get(stop, 'platform'),
  };
};

export const createStopData = (data: any, stopId: string) => {
  const stopData = get(data, 'stop');
  if (stopData) {
    const stop = parseStop(stopData, stopId);
    const allLines = (get(stopData, 'lines') || []).map(
      (lineres: any) => get(lineres, 'details.number') || ''
    );
    const lines: string[] = sortBy(uniq(allLines), [
      (line: string) => parseInt(line),
      (line: string) => line,
    ]);
    const timetable: TimetableRow[] = map(
      get(stopData, 'timetable'),
      (timetableres: any): TimetableRow => ({
        realtime: get(timetableres, 'realtime') || false,
        scheduledDeparture: get(timetableres, 'scheduledDeparture'),
        realtimeDeparture: get(timetableres, 'realtimeDeparture'),
        destination:
          get(timetableres, 'destination') ||
          get(timetableres, 'trip.line.destination') ||
          '',
        line: get(timetableres, 'trip.line.details.number') || '',
      })
    );
    
    return {
      stop,
      lines,
      timetable,
    };
  }
};
