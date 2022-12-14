import { Reader } from "../../util/Reader";

export class HandshakeRefusal {
    constructor(
        public majorVersion: number, public minorVersion: number, public reason: string) {
    }

    static async deserialize(reader: Reader) {
        const reasonLen = await reader.readUint8();
        const majorVersion = await reader.readUint16(),
            minorVersion = await reader.readUint16();
        const padLen = await reader.readUint16();
        const reason = await reader.readString(reasonLen);
        await reader.skipPad(padLen * 4 - reasonLen);
        return new HandshakeRefusal(
            majorVersion,
            minorVersion,
            reason
        );
    }
}