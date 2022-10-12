import { Packet } from "../Packet";
import { Writer } from "../../util/Writer";
import { Reader } from "../../util/Reader";

export class HandshakeSuccess implements Packet {
    constructor(
        public majorVersion: number,
        public minorVersion: number,
        public releaseNum: number,
        public resourceIdBase: number,
        public resourceIdMask: number,
        public motionBufferSize: number,
        public maxRequestLen: number,
        public imageMsbFirst: boolean,
        public bitmapMsbFirst: boolean,
        public bitmapScanUnit: number,
        public bitmapScanPad: number,
        public minKeycode: number,
        public maxKeycode: number,
        public vendor: string,
        public pixelFormats: SuccessPixelFormat[]
    ) {
    }

    static async deserialize(reader: Reader) {
        await reader.skip(1);
        const majorVersion = await reader.readUint8();
        const minorVersion = await reader.readUint8();
        const padLength = await reader.readUint16() - 8;
        const releaseNum = await reader.readUint32();
        const resourceIdBase = await reader.readUint32();
        const resourceIdMask = await reader.readUint32();
        const motionBufferSize = await reader.readUint32();
        const vendorLen = await reader.readUint16();
        const maxRequestLen = await reader.readUint8();
        const numScreens = await reader.readUint8();
        const numPixelFormats = await reader.readUint8();
        const imageMsbFirst = await reader.readBool();
        const bitmapMsbFirst = await reader.readBool();
        const bitmapScanUnit = await reader.readUint8();
        const bitmapScanPad = await reader.readUint8();
        const minKeycode = await reader.readUint8();
        const maxKeycode = await reader.readUint8();
        const vendor = await reader.readString(vendorLen);
        const pixelFormats: SuccessPixelFormat[] = [];
        while (numPixelFormats-- > 0)

            return new HandshakeSuccess(
                majorVersion,
                minorVersion,
                releaseNum,
                resourceIdBase,
                resourceIdMask,
                motionBufferSize,
                maxRequestLen,
                imageMsbFirst,
                bitmapMsbFirst,
                bitmapScanUnit,
                bitmapScanPad,
                minKeycode,
                maxKeycode,
                vendor,
                pixelFormats
            );
    }

    serialize(): Writer {
        throw new Error("Not implemented.");
    }
}

export class SuccessPixelFormat implements Packet {
    constructor(
        public depth: number,
        public bpp: number,
        public scanline: number
    ) {
    }

    static async deserialize(reader: Reader) {
        const [depth, bpp, scanline] = [await reader.readUint8(), await reader.readUint8(), await reader.readUint8()];
        await reader.skip(5);

        return new SuccessPixelFormat(
            depth,
            bpp,
            scanline
        );
    }

    serialize(): Writer {
        return undefined;
    }

}

export class SuccessScreen implements Packet {
    constructor(
        public root: number,
        public defaultColorMap: number,
        public white: number,
        public black: number,
        public currentInputMask: number, // todo: SETofEVENT enum
        public width: number,
        public height: number,
        public widthMillis: number,
        public heightMillis: number,
        public minInstalledMaps: number,
        public maxInstalledMaps: number,
        public rootVisual: number,
        public backingStores: number, // todo enum
        public saveUnder: boolean,
        public rootDepth: number,
    ) {
    }

    static async deserialize(reader: Reader) {
        const root = await reader.readUint32();
        const defaultColorMap = await reader.readUint32();
        const white = await reader.readUint32();
        const black = await reader.readUint32();
        const currentInputMask = await reader.readUint32();
        const width = await reader.readUint16();
        const height = await reader.readUint16();
        const widthMillis = await reader.readUint16();
        const heightMillis = await reader.readUint16();
        const minInstalledMaps = await reader.readUint16();
        const maxInstalledMaps = await reader.readUint16();
        const rootVisual = await reader.readUint32();
        const backingStores = await reader.readUint8();
        const saveUnder = await reader.readBool();
        const rootDepth = await reader.readUint8();
        const numDepths = await reader.readUint8();

        return new SuccessScreen(
            root,
            defaultColorMap,
            white,
            black,
            currentInputMask,
            width,
            height,
            widthMillis,
            heightMillis,
            minInstalledMaps,
            maxInstalledMaps,
            rootVisual,
            backingStores,
            saveUnder,
            rootDepth
        );
    }

    serialize(): Writer {
        return undefined;
    }
}

export class SuccessDepth implements Packet {
    constructor() {
    }

    static async deserialize(reader: Reader) {
        const [depth, bpp, scanline] = [await reader.readUint8(), await reader.readUint8(), await reader.readUint8()];
        await reader.skip(5);

        return new SuccessPixelFormat(
            depth,
            bpp,
            scanline
        );
    }

    serialize(): Writer {
        return undefined;
    }
}

export class SuccessVisualType implements Packet {
    constructor(
        public visualId: number,
        public classType: number,
        public bpp: number,
        public colorMapEntries: number,
        public redMask: number,
        public greenMask: number,
        public blueMask: number,
    ) {
    }

    static async deserialize(reader: Reader) {
        const [depth, bpp, scanline] = [await reader.readUint8(), await reader.readUint8(), await reader.readUint8()];
        await reader.skip(5);

        return new SuccessPixelFormat(
            depth,
            bpp,
            scanline
        );
    }

    serialize(): Writer {
        return undefined;
    }
}