import React from "react";
import { isEmpty } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StopData } from "./App";
import {
  faBus,
  faSign,
  faClock,
  faStopwatch,
} from "@fortawesome/free-solid-svg-icons";
import "../assets/Timetable.scss";
import { timeDiff, parseTime } from "../utils/time-utils";

export interface Props {
  rows: StopData;
}

const Timetable = ({ rows }: Props) => (
  <table className="timetable">
    <thead className="small">
      <tr>
        <th className="fit" aria-label="Leaves at" title="Leaves at">
          <FontAwesomeIcon icon={faClock} />
        </th>
        <th className="fit" aria-label="Time remaining" title="Time remaining">
          <FontAwesomeIcon icon={faStopwatch} />
        </th>
        <th className="fit" aria-label="Bus number" title="Bus number">
          <FontAwesomeIcon icon={faBus} />
        </th>
        <th className="fit" aria-label="Platform" title="Platform">
          <FontAwesomeIcon icon={faSign} />
        </th>
        <th className="fit">Destination</th>
      </tr>
    </thead>
    <tbody>
      {!isEmpty(rows) ? (
        rows.timetable.map((row) => {
          const mins = timeDiff(row.realtimeDeparture);
          const gone = mins < 0;
          return (
            <tr
              key={`${row.line}-${row.scheduledDeparture}-${
                row.direction || ""
              }`}
              className={`data-row${gone ? " gone" : ""}`}
            >
              <td className="time">
                <span>{parseTime(row.scheduledDeparture)}</span>
                <span className="realtime small">
                  {row.realtime &&
                    " (" + parseTime(row.realtimeDeparture) + ")"}
                </span>
              </td>
              <td className="min">
                {gone ? "-" : mins}{" "}
                {!gone && <span className="small">{" min"}</span>}
              </td>
              <td className="line">{row.line}</td>
              <td className="platform">
                {rows && <span>{rows.stop.name}</span>}
              </td>
              <td className="dest small">{row.destination}</td>
            </tr>
          );
        })
      ) : (
        <tr className="no-rows small">
          <td colSpan={5}>
            No times to show at this time. Please choose another stop.
          </td>
        </tr>
      )}
    </tbody>
  </table>
);

export default Timetable;
