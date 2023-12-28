
const express = require("express");
const cors = require("cors");
const app = express();
const { format } = require("date-fns");

app.use(cors());
app.use(express.json());


const rooms = [
  {
    roomName: "theatre",
    roomId: "01",
    seats: 100,
    amenities: "wifi,projector,AC",
    price: 1500,
  },
  {
    roomName: "Meeting hall",
    roomId: "02",
    seats: 150,
    amenities: "speaker,projector,AC",
    price: 2000,
  },
  {
    roomName: "Auditorium ",
    roomId: "03",
    seats: 75,
    amenities: "wifi,projector,AC,tables",
    price: 1250,
  },
];
const bookings = [
  {
    bookingId: 1,
    customerName: "vallathan",
    roomId: "01",
    date: format(new Date("01-12-2024"), "dd-MMM-yyyy"),
    start: "08:00",
    end: "09:00",
    status: "confirmed",
  },
  {
    bookingId: 2,
    customerName: "ashok",
    roomId: "02",
    date: format(new Date("01-30-2024"), "dd-MMM-yyyy"),
    start: "08:00",
    end: "09:00",
    status: "waiting for confirmation",
  },
  {
    bookingId: 3,
    customerName: "adhi",
    roomId: "03",
    date: format(new Date("12-31-2023"), "dd-MMM-yyyy"),
    start: "08:00",
    end: "09:00",
    status: "confirmed",
  },
];


app.get("/", (req, res) => {
  res.send("<h1>Hall Booking</h1>");
});

app.get("/rooms", (req, res) => {
  res.json(rooms);
});


app.post("/rooms", (req, res) => {
  const { roomName, seats, amenities, price } = req.body;
  const room = { roomName, roomId: rooms.length + 1, seats, amenities, price };
  rooms.push(room);
  res.status(201).json({ message: "room added sucessfully" });
});


app.get("/bookings", (req, res) => {
  res.json(bookings);
});


app.post("/bookings", (req, res) => {
  const { customerName, date, start, end, roomId, status } = req.body;
  const bookingFilter = bookings.find(
    (room) => room.date == date && room.roomId == roomId && room.start == start
  );
  if (bookingFilter) {
    return res.status(404).json({ message: "Room already booked" });
  }
  let roomIdVerify = rooms.map((room) => (room = room.roomId));
  if (!roomIdVerify.includes(roomId)) {
    return res
      .status(404)
      .json({ message: "Requested room N/A, Kinldy check Other rooms" });
  }
  const booking = {
    bookingId: bookings.length + 1,
    customerName,
    date,
    start,
    end,
    roomId,
    status,
  };
  bookings.push(booking);
  res.status(201).json({ message: "booked sucessfully" });
});


app.get("/bookedRooms", (req, res) => {
  const BookedRoomDetails = bookings.map((book) => {
    roomsData = rooms.find((room) => room.roomId == book.roomId);
    if (book.status == "confirmed") {
      return {
        "Room Name": `${roomsData.roomName}`,
        "Booked Status": `${book.status}`,
        "Customer Name": `${book.customerName}`,
        Date: `${book.date}`,
        "Start Time": `${book.start}`,
        "End Time": `${book.end}`,
      };
    }
  });
  res.json(BookedRoomDetails.filter((e) => e != null));
});


app.get("/customers", (req, res) => {
  const customerData = bookings.map((book) => {
    roomsData = rooms.find((room) => room.roomId == book.roomId);
    return {
      "Customer Name": `${book.customerName}`,
      "Room Name": `${roomsData.roomName}`,
      Date: `${book.date}`,
      "Start Time": `${book.start}`,
      "End Time": `${book.end}`,
    };
  });
  res.json(customerData);
});


app.get("/customers/:name", (req, res) => {
  const customerName = req.params.name;
  let allData = bookings.filter((book) => book.customerName == customerName);
  allData = allData.map((data) => {
    let room = rooms.find((e) => e.roomId == data.roomId);
    return {
      "Customer Name": `${data.customerName}`,
      "Room Name": `${room.roomName}`,
      Date: `${data.date}`,
      "Start Time": `${data.start}`,
      "End Time": `${data.end}`,
      "Booking id": `${data.bookingId}`,
      "Booking date": `${data.date}`,
      "Booking Status": `${data.status}`,
    };
  });
  if (allData.length) {
    res.json(allData);
  } else {
    res.status(404).json({
      message: "Request Customer details N/A or customer not yet booked rooms",
    });
  }
});

app.listen(3002, () => {
  console.log("server is running");
});
