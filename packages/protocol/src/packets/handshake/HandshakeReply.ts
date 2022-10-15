import { Reader } from "../../util/Reader";
import { HandshakeRefusal } from "./HandshakeRefusal";
import { HandshakeSuccess } from "./HandshakeSuccess";
import { HandshakeRequireAuth } from "./HandshakeRequireAuth";

export abstract class HandshakeReply {
    static async deserialize(reader: Reader) {
        const responseType = await reader.readUint8();
        switch (responseType) {
            case 0:
                return await reader.deserialize(HandshakeRefusal);
            case 1:
                return await reader.deserialize(HandshakeSuccess);
            case 2:
                return await reader.deserialize(HandshakeRequireAuth);
            default:
                throw new Error(`Handshake response type ${responseType} not supported`)
        }
    }
}