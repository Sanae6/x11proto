import { Reader } from "../util/Reader";
import { Writer } from "../util/Writer";

type Parameters<T> = T extends (...args: infer T) => any ? T : never;

export type PacketArg<T extends Packet, A extends any[]> = { deserialize: (reader: Reader, ...args: A) => Promise<T> } & (new(...args: any[]) => T);

export abstract class Packet {
    static deserialize<T extends Packet, A extends any[]>(type: PacketArg<T, A>, reader: Reader, ...args: A) {
        return type.deserialize(reader, ...args);
    }

    abstract serialize(): Writer;
}