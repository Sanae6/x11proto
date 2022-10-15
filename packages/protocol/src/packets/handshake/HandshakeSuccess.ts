import { Writer } from "../../util/Writer";
import { Reader } from "../../util/Reader";

export class HandshakeSuccess {
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
        public pixelFormats: SuccessPixelFormat[],
        public screens: SuccessScreen[]
    ) {
    }

    static async deserialize(reader: Reader) {
        await reader.skip(1);
        const majorVersion = await reader.readUint16();
        const minorVersion = await reader.readUint16();
        let padLength = await reader.readUint16() - 8;
        const releaseNum = await reader.readUint32();
        const resourceIdBase = await reader.readUint32();
        const resourceIdMask = await reader.readUint32();
        const motionBufferSize = await reader.readUint32();
        const vendorLen = await reader.readUint16();
        const maxRequestLen = await reader.readUint16();
        let numScreens = await reader.readUint8();
        let numPixelFormats = await reader.readUint8();
        const imageMsbFirst = await reader.readBool();
        const bitmapMsbFirst = await reader.readBool();
        const bitmapScanUnit = await reader.readUint8();
        const bitmapScanPad = await reader.readUint8();
        const minKeycode = await reader.readUint8();
        const maxKeycode = await reader.readUint8();
        console.log("amonges", numScreens, numPixelFormats);
        await reader.skip(4);
        const vendor = await reader.readString(vendorLen);
        console.log("amongelas", vendor);
        await reader.skipPad(vendorLen)

        padLength -= 2 * numPixelFormats;
        padLength *= 4;
        padLength -= vendorLen;
        console.log("pad left:", padLength);

        const pixelFormats: SuccessPixelFormat[] = [];
        const screens: SuccessScreen[] = [];

        while (numPixelFormats-- > 0) {
            pixelFormats.push(await reader.deserialize(SuccessPixelFormat));
        }

        while (numScreens-- > 0) {
            screens.push(await reader.deserialize(SuccessScreen));
        }

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
            pixelFormats,
            screens
        );
    }

    serialize(): Writer {
        throw new Error("Not implemented.");
    }
}

export class SuccessPixelFormat {
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

export class SuccessScreen {
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
        public backingStores: number, // todo backingStores enum
        public saveUnder: boolean,
        public rootDepth: number,
        public depths: SuccessDepth[],
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
        let numDepths = await reader.readUint8();
        const depths: SuccessDepth[] = [];

        while (numDepths-- > 0) {
            depths.push(await reader.deserialize(SuccessDepth))
        }

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
            rootDepth,
            depths
        );
    }
}

export class SuccessDepth {
    constructor(
        public depth: number,
        public visualTypes: SuccessVisualType[]
    ) {
    }

    static async deserialize(reader: Reader) {
        const depth = await reader.readUint8();
        await reader.skip(1);
        let visualTypeCount = await reader.readUint16();
        await reader.skip(4);

        const visualTypes: SuccessVisualType[] = [];

        while (visualTypeCount-- > 0) {
            visualTypes.push(await reader.deserialize(SuccessVisualType));
        }

        return new SuccessDepth(
            depth,
            visualTypes
        );
    }
}

export class SuccessVisualType {
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
        const [visualId, classType, bpp, colorMapEntries, redMask, greenMask, blueMask] = [await reader.readUint32(), await reader.readUint8(), await reader.readUint8(), await reader.readUint16(), await reader.readUint32(), await reader.readUint32(), await reader.readUint32()];
        await reader.skip(4);

        return new SuccessVisualType(
            visualId,
            classType,
            bpp,
            colorMapEntries,
            redMask,
            greenMask,
            blueMask
        );
    }
}