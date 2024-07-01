import moment from "moment";
import { useCallback, useState, useRef } from "react";
import { EVENTS } from "../../constants";

import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { Calendar as BigCalendar, stringOrDate } from "react-big-calendar";
import { Appointment, EventItem } from "../../types";
import { props } from "./props";
import "./index.css";
import { Box, Flex } from "@chakra-ui/react";
import { OutsideEvent } from "../OutsideEvent";
import { AppointmentEvent } from "../AppointmentEvent";

const DnDCalendar = withDragAndDrop<EventItem>(BigCalendar);




export default function DragAndDrop() {
  const [events, setEvents] = useState(EVENTS);
  const clickRef = useRef(null);

  const onChangeEventTime = useCallback(
    ({
      event,
      start,
      end,
      resourceId,
    }: {
      event: EventItem;
      start: stringOrDate;
      end: stringOrDate;
      resourceId: number;
    }) => {
      setEvents((prevEvents) =>
        prevEvents.map((prevEvent) =>
          prevEvent?.data?.appointment?.id === event?.data?.appointment?.id
            ? { ...event, start, end, resourceId }
            : prevEvent
        )
      );
    },
    []
  );


// Define a function to handle day styling
const dayStyleGetter = (date) => {
  const startDate = moment('2024-06-01');
  const endDate = moment('2024-06-10');

  // Check if the date is within the range
  if (moment(date).isBetween(startDate, endDate, null, '[]')) {
    return {
      className: 'custom-range-bg', // Apply custom CSS class
    };
  }
  return {};
};


  const [draggedEvent, setDraggedEvent] = useState<
    Appointment | "undroppable"
  >();

  const onDroppedFromOutside = useCallback(
    ({
      start,
      end,
      resource,
    }: {
      start: stringOrDate;
      end: stringOrDate;
      resource: number;
    }) => {
      if (draggedEvent === "undroppable") return;
      setEvents((prevEvents) => [
        ...prevEvents,
        {
          start,
          end,
          resourceId: resource,
          data: { appointment: draggedEvent },
          isDraggable: true,
          isResizable: true,
        },
      ]);
    },
    [draggedEvent]
  );
    const second_appointment = {
    id: 2,
    status: "CI",
    location: "Materia",
    resource: "Matematicas Remedial I",
    address: "Clave: H1002",
  };

  const dummyAppointment = {
    id: 1,
    status: "CI",
    location: "Materia",
    resource: "Ingles Remedial I",
    address: "Clave: H1001",
  };

    const third_appointment = {
    id: 3,
    status: "CI",
    location: "Materia",
    resource: " Fundamentos de la escritura ",
    address: "Clave: H1015",
  };
    const fourth_appointment = {
    id: 4,
    status: "CI",
    location: "Materia",
    resource: " Introducción a la computación ",
    address: "Clave: TC1001",
  };


  const appointments = [second_appointment,dummyAppointment, third_appointment, fourth_appointment ]


  const onDoubleClickEvent = useCallback((calEvent) => {
    /**
     * Notice our use of the same ref as above.
     */
    window.clearTimeout(clickRef?.current)
    clickRef.current = window.setTimeout(() => {
      window.alert("event")
    }, 250)
  }, [])

  
  return (
    <Flex p={2} gap={4} height="100%" width="100%" direction={"row"}>
      <Box flex="1" overflow="auto" width="100%">
        <DnDCalendar
          {...props}
          events={events}
          draggableAccessor={(event) => !!event.isDraggable}
          resizableAccessor={"isResizable"}
          onEventDrop={onChangeEventTime}
          onEventResize={onChangeEventTime}
          onDropFromOutside={onDroppedFromOutside}
          dayPropGetter={dayStyleGetter} // Apply dayPropGetter to style days
          onDoubleClickEvent={onDoubleClickEvent}
        />
      </Box>
      <Box>
        <Flex gap={4} direction="column">
          {
              appointments.map(appointment => {
                return(
                  <Box
                    width={400}
                    cursor="pointer"
                    onDragStart={() => setDraggedEvent(appointment)}
                    draggable
                    key={appointment.id}
                  >
                    <AppointmentEvent appointment={appointment} />
                  </Box>
                )
              })
          }
        </Flex>
      </Box>
    </Flex>
  );
}
