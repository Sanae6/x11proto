import { TypedArrayLike } from "./TypedArrayLike";

export class Reader {
    private static decoder = new TextDecoder("utf8");
    public offset: number = 0;

    constructor(private socket: NodeJS.Socket) {

    }

    public resetOffset() {
        this.offset = 0;
    }

    public readBytes(size: number): Promise<Buffer> {
        const chunk = <Buffer | null>this.socket.read(size)
        if (chunk === null) {
            return new Promise((resolve) => {
                this.socket.once("readable", async () => {
                    resolve(await this.readBytes(size));
                });
            });
        }

        // console.log("chunk", chunk)

        this.offset += chunk.byteLength;

        return Promise.resolve(chunk);
    }

    public async readInt8(): Promise<number> {
        const buffer = await this.readBytes(1);
        return buffer.readInt8(0);
    }

    public async readUint8(): Promise<number> {
        const buffer = await this.readBytes(1);
        return buffer.readUint8(0);
    }

    public async readBool(): Promise<boolean> {
        return (await this.readUint8()) != 0;
    }

    public async readInt16(): Promise<number> {
        const buffer = await this.readBytes(2);
        return buffer.readInt16LE(0);
    }

    public async readUint16(): Promise<number> {
        const buffer = await this.readBytes(2);
        return buffer.readUint16LE(0);
    }

    public async readInt32(): Promise<number> {
        const buffer = await this.readBytes(4);
        return buffer.readInt32LE(0);
    }

    public async readUint32(): Promise<number> {
        const buffer = await this.readBytes(4);
        return buffer.readUint32LE(0);
    }

    public async skipPad(n: number): Promise<this> {
        const readAmount = n % 4;
        if (readAmount == 0) return this;
        await this.readBytes(readAmount);

        return this;
    }

    public async skip(size: number): Promise<this> {
        if (size == 0) return this;
        await this.readBytes(size);

        return this;
    }

    public async readString(size: number): Promise<string> {
        if (size == 0) return "";
        return Reader.decoder.decode(await this.readBytes(size));
    }
}