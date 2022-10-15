import { Reader } from "../../util/Reader";

export class HandshakeRequireAuth {
    static async deserialize(reader: Reader) {
        return new HandshakeRequireAuth();
    }
}