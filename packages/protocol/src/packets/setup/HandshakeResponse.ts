import { Packet } from "../Packet";
import { Writer } from "../../util/Writer";
import { Reader } from "../../util/Reader";
import { HandshakeRefusal } from "./HandshakeRefusal";
import { HandshakeSuccess } from "./HandshakeSuccess";
import { HandshakeRequireAuth } from "./HandshakeRequireAuth";

export class HandshakeResponse implements Packet {
    constructor(public packet: HandshakeRefusal | HandshakeSuccess | HandshakeRequireAuth) {
    }

    static async deserialize(reader: Reader) {
        const responseType = await reader.readUint8();
        switch (responseType) {
            case 0:
                console.log("refusal");
                return new HandshakeResponse(await Packet.deserialize(HandshakeRefusal, reader));
            case 1:
                return new HandshakeResponse(await Packet.deserialize(HandshakeSuccess, reader));
            case 2:
                return new HandshakeResponse(await Packet.deserialize(HandshakeRequireAuth, reader));
            default:
                throw new Error(`Handshake response type ${responseType} not supported`)
        }
    }

    serialize(): Writer {
        throw new Error("Not implemented.");
    }
}