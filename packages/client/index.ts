import { createConnection } from "net";
import { HandshakeRequest } from "protocol/src/packets/handshake/HandshakeRequest";
import { HandshakeReply } from "protocol/src/packets/handshake/HandshakeReply";
import { Reader } from "protocol/src/util/Reader";
import * as util from "util";
import { HandshakeSuccess } from "protocol/src/packets/handshake/HandshakeSuccess";

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
        case State.Handshake: {
            const handshakePacket = await reader.deserialize(HandshakeReply);
            console.log(util.inspect(handshakePacket, {
                depth: 10,
                colors: true
            }));
            if (handshakePacket instanceof HandshakeSuccess) {
                state = State.Running;
                break;
            }
            connection.end();
            break;
        }
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
    "My",
    "Nuts"
).serialize().toUint8Array());

await read();
