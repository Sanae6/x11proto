import { Writer } from "../../util/Writer";
import { ClientPacket } from "../ClientPacket";

export class HandshakeRequest implements ClientPacket {
    constructor(
        public majorVersion: number,
        public minorVersion: number,
        public authName: string,
        public authData: string
    ) {
    }

    serialize(): Writer {
        return new Writer()
            .writeUint8(0x6C)
            .writeUint8(0x00)
            .writeUint16(this.majorVersion)
            .writeUint16(this.minorVersion)
            .writeUint16(this.authName.length)
            .writeUint16(this.authData.length)
            .writeUint16(0)
            .writeString(this.authName)
            .pad()
            .writeString(this.authData)
            .pad();
    }
}