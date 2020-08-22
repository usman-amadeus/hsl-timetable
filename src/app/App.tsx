import React, { useState, useEffect } from "react";
import "./App.css";
import Timetable from "./Timetable";
import { createStopData } from "../utils/stop-utils";

const API_URL =
  "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql";

const REFRESH_INTERVAL = 20000;

export interface StopData {
  stop: Stop;
  lines: string[];
  timetable: TimetableRow[];
}

export interface Stop {
  id: string;
  code: string;
  name: string;
  platform?: string;
}

export interface TimetableRow {
  line: string;
  realtime: boolean;
  realtimeDeparture: number;
  scheduledDeparture: number;
  destination: string;
  stop?: Stop;
  direction?: string;
}

const fetchStop = (query: string) => {
  return fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ query }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) => (json && json.data) || {})
    .catch((err) => console.error(err));
};

export const fetchStopData = (): Promise<StopData | undefined> => {
  const now = new Date();
  const start = Math.floor(now.getTime() / 1000) - 60;
  const timeRange = 3600;
  const rowLimit = 35;
  const stopId = "HSL:1130113";
  const query = `{
    stop(id: "${stopId}") {
      id:gtfsId
      name
      code
      platform:platformCode
      lines:patterns {
        details:route {
          number:shortName
        }
      }
      timetable:stoptimesWithoutPatterns(startTime: ${start}, timeRange: ${timeRange}, numberOfDepartures: ${rowLimit}) {
        scheduledDeparture
        realtime
        realtimeDeparture
        destination:headsign
        trip {
          line:pattern {
            details:route {
              number:shortName
            }
            destination:headsign
          }
        }
      }
    }
  }`;
  return fetchStop(query).then((data) => {
    return createStopData(data, stopId);
  });
};

function App() {
  const [stop, setStop] = useState({} as any);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(false);

  function getStopData() {
    setError(false);
    try {
      fetchStopData().then((result) => {
        if (result) {
          setStop({ ...stop, ...result });
        }
      });
    } catch (error) {
      setError(true);
    }
    setIsInitialized(true);
  }

  useEffect(() => {
    if (!isInitialized) {
      getStopData();
      const interval = setInterval(() => {
        getStopData();
      }, REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, []);
  return (
    <div className="homepage">
      {isInitialized ? (
        <div>
          <Timetable rows={stop}/>
        </div>
      ) : (
        <h4 style={{ textAlign: "center" }}>Loading...</h4>
      )}

      {error && (
        <h4 style={{ color: `red`, textAlign: "center" }}>
          Oops, error occured!
        </h4>
      )}
    </div>
  );
}

export default App;
