import { createConnection } from "net";
import { HandshakeRequest } from "protocol/src/packets/setup/HandshakeRequest";
import { HandshakeResponse } from "protocol/src/packets/setup/HandshakeResponse";
import { Packet } from "protocol/src/packets/Packet";
import { Reader } from "protocol/src/util/Reader";

const connection = createConnection({
    host: "127.0.0.1",
    port: 6000
});
const reader = new Reader(connection);
enum State {
    Handshake,
    WindowPrep,
    Running
}

let state = State.Handshake;

async function read() {
    reader.resetOffset();
    switch (state) {
        case State.Handshake:
            console.log(await Packet.deserialize(HandshakeResponse, reader));
            break;
        case State.WindowPrep:

            break;
        case State.Running:
            break;
    }
}

connection.on("end", () => {
    console.log("Closed");
})

connection.write(new HandshakeRequest(
    11,
    0,
    "hello",
    "world"
).serialize().toUint8Array());

await read();