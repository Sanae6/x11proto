import { TypedArrayLike } from "./TypedArrayLike";

export class Writer {
    private static encoder = new TextEncoder();
    private view: DataView;
    public offset: number = 0;

    constructor(backingBuffer?: TypedArrayLike | ArrayBufferLike, private littleEndian: boolean = true) {
        if (backingBuffer === undefined)
            this.view = new DataView(new ArrayBuffer(1));
        else if (backingBuffer instanceof ArrayBuffer || backingBuffer instanceof SharedArrayBuffer)
            this.view = new DataView(backingBuffer)
        else
            this.view = new DataView(backingBuffer.buffer);
    }

    /**
     * Return the current offset and advance by provided amount
     * @param size to advance by
     * @private
     * @returns the current offset
     */
    private advance(size: number): number {
        this.resize(size);
        const preOffset = this.offset;
        this.offset += size;
        return preOffset;
    }

    private resize(size: number) {
        if (this.offset + size <= this.view.byteLength) return;

        const newBuffer = new ArrayBuffer(this.offset + size);
        const u8View = new Uint8Array(newBuffer);
        u8View.set(new Uint8Array(this.view.buffer), 0);
        this.view = new DataView(newBuffer);
    }

    public writeInt8(value: number) {
        const offset = this.advance(1);
        console.log("Writing at offset", offset);
        this.view.setInt8(offset, value);

        return this;
    }

    public writeUint8(value: number) {
        const offset = this.advance(1);
        console.log("Writing at offset", offset);
        this.view.setUint8(offset, value);

        return this;
    }

    public writeInt16(value: number) {
        const offset = this.advance(2);
        console.log("Writing at offset:", offset);
        this.view.setInt16(offset, value, this.littleEndian);

        return this;
    }

    public writeUint16(value: number) {
        const offset = this.advance(2);
        console.log("Writing at offset:", offset);
        this.view.setUint16(offset, value, this.littleEndian);

        return this;
    }

    public writeInt32(value: number) {
        const offset = this.advance(4);
        console.log("Writing at offset:", offset);
        this.view.setInt32(offset, value, this.littleEndian);

        return this;
    }

    public writeUint32(value: number) {
        const offset = this.advance(4);
        console.log("Writing at offset:", offset);
        this.view.setUint32(offset, value, this.littleEndian);

        return this;
    }

    public writeBytes(value: TypedArrayLike) {
        const offset = this.advance(value.byteLength);
        console.log("Writing at offset:", offset, value.byteLength);
        new Uint8Array(this.view.buffer).set(new Uint8Array(value.buffer), offset);

        return this;
    }

    public writeString(value: string) {
        this.writeBytes(Writer.encoder.encode(value));

        return this;
    }

    public pad() {
        this.advance((4 - (this.offset % 4)) % 4);

        return this;
    }

    public toUint8Array() {
        return new Uint8Array(this.view.buffer);
    }
}