import moment from "moment";
import { momentLocalizer, Views } from "react-big-calendar";
import { AppointmentEvent } from "../AppointmentEvent";

const localizer = momentLocalizer(moment);

const components: any = {
  event: ({ event }: any) => {
    const data = event?.data;
    if (data?.appointment)
      return <AppointmentEvent appointment={data?.appointment} />;
    return null;
  },
};

export const props = {
  components,
  localizer,
  defaultView: Views.WEEK,
  max: moment("2024-06-28T23:00:00").toDate(),
  min: moment("2024-06-28T07:00:00").toDate(),
};
