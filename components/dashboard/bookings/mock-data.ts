export type BookingStatus = "Confirmed" | "Pending" | "Cancelled";
export type PaymentStatus = "Paid" | "Unpaid" | "Refunded";

export interface Booking {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar?: string;
    initials?: string;
  };
  space: {
    name: string;
    type: string;
  };
  dateTime: {
    date: string;
    time: string;
  };
  duration: string;
  status: BookingStatus;
  payment: PaymentStatus;
}

export const BOOKINGS_DATA: Booking[] = [
  {
    id: "booking-1",
    customer: {
      name: "Marcus Sterling",
      email: "marcus@fintech.io",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCmA3NdS8hybvrAoBmOkihHhDU5oBEg6MbYnoyDXcGNQ7nt443I2aa15PrbojRP_IuGK2K8fCPn5tGlfYUEDdsDS0j15Xt_MdhgEeCFT3mge2uupT_G5H14r9eu1oOnv9NDnehxVTuJrQt0KgUb00wYFjq0dKUjais1EOytTcKr2bqrvhZitVxVq3qSGM1jMAJXHDVG0waBm-jQ2wB5tyBhBdcqiam9tYyrpj_iwqepk2T5SKHP-3NU2MxW0WNbvnRVzU5Sz34pVBs",
    },
    space: {
      name: "Studio 4B",
      type: "Meeting Room",
    },
    dateTime: {
      date: "Oct 14, 2023",
      time: "09:00 AM - 11:30 AM",
    },
    duration: "2.5 Hours",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "booking-2",
    customer: {
      name: "Elena Rodriguez",
      email: "elena.r@designhub.com",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDyvX_pSn4FQqnZGUcbl4VuZkImXpQ9GQi4nkDoYQxEis_Fm--x08W-7yC5ONBZuyjOYTASTCId2KiggjYXNTI8pR_VrfujB0QcNQtZ5bWLAo2x6eU-MOg8t_xdnWWdTXyf3qKNPmQ-K7Kn3ZjxIkJqxi4etORSKQXt2It8O06kTEkRfT6g5sZ4vTuTfMlau7PTza0-inqXtB2KJkbLElmh1e0vwY2F9ISDTCSMyK9GFFzv4jWktIzrMjnbF3tPIXM3uqUpntXdViA",
    },
    space: {
      name: "Desk H-12",
      type: "Hot Desk",
    },
    dateTime: {
      date: "Oct 14, 2023",
      time: "Full Day",
    },
    duration: "8 Hours",
    status: "Pending",
    payment: "Unpaid",
  },
  {
    id: "booking-3",
    customer: {
      name: "James Harrison",
      email: "james@nexus.tech",
      initials: "JH",
    },
    space: {
      name: "Executive Suite 2",
      type: "Private Office",
    },
    dateTime: {
      date: "Oct 15, 2023",
      time: "02:00 PM - 05:00 PM",
    },
    duration: "3 Hours",
    status: "Confirmed",
    payment: "Paid",
  },
  {
    id: "booking-4",
    customer: {
      name: "Sarah Jenkins",
      email: "s.jenkins@freelance.com",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCrvsSevqxqdMT_Kk1qYH7IxIL3sLG5ZfyM2Jx4j-i5ACdLdTYyFo8Urr8vAk8IGGnB8YXrwqyENmsp5Vw5Auy2581FcUHqINxta9Zo9kauvHahVdbdz26nvk3jXqXQfP4sj3rrRpaJFpUwbNK8UdXK8JxBNHpL_Xh5A8bBb391yWlrKKU2fTUzAIn8lrv5o7Un8VNB2W1RAjsPF6t6DESpaDMHDEaaITvHkjUOhChVq20Ls9OrStM2QOIpZL0Nx6PSVN3PfrUh6Ks",
    },
    space: {
      name: "Desk G-01",
      type: "Hot Desk",
    },
    dateTime: {
      date: "Oct 15, 2023",
      time: "Full Day",
    },
    duration: "8 Hours",
    status: "Cancelled",
    payment: "Refunded",
  },
];
