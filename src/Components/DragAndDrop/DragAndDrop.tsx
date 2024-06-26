import moment from "moment";
import { useCallback, useState } from "react";
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

  const dummyAppointment = {
    id: 3,
    status: "CI",
    location: "Materia",
    resource: "Ingles Remedial I",
    address: "Clave: H1001",
  };
  
  return (
    <Flex p={2} gap={4} height="100%" width="100%" direction={"column"}>
      <Box>
        <Flex gap={4}>
          <Box
            width={200}
            cursor="pointer"
            onDragStart={() => setDraggedEvent(dummyAppointment)}
            draggable
          >
            <AppointmentEvent appointment={dummyAppointment} />
          </Box>
          <OutsideEvent
            onDragStart={() => setDraggedEvent(dummyAppointment)}
            draggable
          >
            Draggable but not for calendar.
          </OutsideEvent>
        </Flex>
      </Box>

      <Box flex="1" overflow="auto" width="100%">
        <DnDCalendar
          {...props}
          events={events}
          draggableAccessor={(event) => !!event.isDraggable}
          resizableAccessor={"isResizable"}
          onEventDrop={onChangeEventTime}
          onEventResize={onChangeEventTime}
          onDropFromOutside={onDroppedFromOutside}
        />
      </Box>
    </Flex>
  );
}
