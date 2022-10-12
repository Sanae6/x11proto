export interface TypedArrayLike {
    readonly byteLength: number;
    readonly byteOffset: number;
    readonly buffer: ArrayBufferLike;

    readonly [n: number]: number;
}