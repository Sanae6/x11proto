import { Packet } from "../Packet";
import { Writer } from "../../util/Writer";
import { Reader } from "../../util/Reader";

export class HandshakeRequireAuth implements Packet {
    static async deserialize(reader: Reader) {
        return new HandshakeRequireAuth();
    }
    serialize(): Writer {
        throw new Error("Not implemented.");
    }

}