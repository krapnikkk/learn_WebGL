var gl = null;
var ext = null;
const compressedTextureType = ['s3tc', 'etc1', 'pvrtc'];
// COMPRESSED_RGB_PVRTC_4BPPV1_IMG
// COMPRESSED_RGB_PVRTC_2BPPV1_IMG
// COMPRESSED_RGBA_PVRTC_4BPPV1_IMG
// COMPRESSED_RGBA_PVRTC_2BPPV1_IMG
const compressedTextureTypeEnumKey = ['COMPRESSED_RGB_S3TC_DXT1_EXT', 'COMPRESSED_RGB_ETC1_WEBGL',
    'COMPRESSED_RGB_PVRTC_4BPPV1_IMG'];
var supportedCompressedTexture = false;
var currentCompressedTextureFormat = '';
var currentCompressedTextureType = 'image';

function initContext(glContext) {
    gl = glContext;
}

function getSupportedCompressedTextureType() {
    supportedCompressedTexture = false;
    var availableExtensions = gl.getSupportedExtensions();
    for (var i = 0; i < availableExtensions.length; i++) {
        for (var j = 0; j < compressedTextureType.length; j++) {
            if (availableExtensions[i].indexOf(compressedTextureType[j]) > 0) {
                supportedCompressedTexture = true;
                ext = gl.getExtension(availableExtensions[i]);
                // gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS) 必须在getExtension之后调用
                var formats = gl.getParameter(gl.COMPRESSED_TEXTURE_FORMATS);
                console.log("formats:", formats);
                for (var key in ext) {
                    for (var k = 0; k < compressedTextureTypeEnumKey.length; k++) {
                        // console.log(key);
                        if (key === compressedTextureTypeEnumKey[k]) {
                            currentCompressedTextureFormat = ext[key];
                            break;
                        }
                    }
                }
                currentCompressedTextureType = compressedTextureType[j];
            }
        }
    }
    return currentCompressedTextureType;
}


// for DDS texture
// All values and structures referenced from:
// http://msdn.microsoft.com/en-us/library/bb943991.aspx/
var DDS_MAGIC = 0x20534444;

var DDSD_CAPS = 0x1,
    DDSD_HEIGHT = 0x2,
    DDSD_WIDTH = 0x4,
    DDSD_PITCH = 0x8,
    DDSD_PIXELFORMAT = 0x1000,
    DDSD_MIPMAPCOUNT = 0x20000,
    DDSD_LINEARSIZE = 0x80000,
    DDSD_DEPTH = 0x800000;

var DDSCAPS_COMPLEX = 0x8,
    DDSCAPS_MIPMAP = 0x400000,
    DDSCAPS_TEXTURE = 0x1000;

var DDSCAPS2_CUBEMAP = 0x200,
    DDSCAPS2_CUBEMAP_POSITIVEX = 0x400,
    DDSCAPS2_CUBEMAP_NEGATIVEX = 0x800,
    DDSCAPS2_CUBEMAP_POSITIVEY = 0x1000,
    DDSCAPS2_CUBEMAP_NEGATIVEY = 0x2000,
    DDSCAPS2_CUBEMAP_POSITIVEZ = 0x4000,
    DDSCAPS2_CUBEMAP_NEGATIVEZ = 0x8000,
    DDSCAPS2_VOLUME = 0x200000;

var DDPF_ALPHAPIXELS = 0x1,
    DDPF_ALPHA = 0x2,
    DDPF_FOURCC = 0x4,
    DDPF_RGB = 0x40,
    DDPF_YUV = 0x200,
    DDPF_LUMINANCE = 0x20000;

function FourCCToInt32(value) {
    return value.charCodeAt(0) +
        (value.charCodeAt(1) << 8) +
        (value.charCodeAt(2) << 16) +
        (value.charCodeAt(3) << 24);
}

function Int32ToFourCC(value) {
    return String.fromCharCode(
        value & 0xff,
        (value >> 8) & 0xff,
        (value >> 16) & 0xff,
        (value >> 24) & 0xff
    );
}

var FOURCC_DXT1 = FourCCToInt32("DXT1");
var FOURCC_DXT5 = FourCCToInt32("DXT5");

var headerLengthInt = 31; // The header length in 32 bit ints

// Offsets into the header array
var off_magic = 0;

var off_size = 1;
var off_flags = 2;
var off_height = 3;
var off_width = 4;

var off_mipmapCount = 7;

var off_pfFlags = 20;
var off_pfFourCC = 21;


function loadBinaryData(url) {

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: "get",
            responseType: "arrayBuffer"
        }).then((res) => {
            return res.arrayBuffer();
        }).then((data) => {
            resolve(data);
        }).catch((e) => {
            reject(e);
        })
    })
}

function loadETCTexture(url, width, height) {
    return new Promise((resolve, reject) => {
        loadBinaryData(url).then((data) => {
            let texture = texImage2D(currentCompressedTextureFormat, width, height, new Uint8Array(data, 16));
            resolve(texture);
        }).catch((e) => {
            console.warn(e);
            reject(e);
        });
    })
}

function loadS3TCTexture(url) {
    return new Promise((resolve, reject) => {
        loadBinaryData(url).then((data) => {
            let texture = uploadDDSLevels(data);
            resolve(texture);
        }).catch((e) => {
            console.warn(e);
            reject(e);
        });
    })
}

// Little reminder for myself where the above values come from
/*DDS_PIXELFORMAT {
    int32 dwSize; // offset: 19
    int32 dwFlags;
    char[4] dwFourCC;
    int32 dwRGBBitCount;
    int32 dwRBitMask;
    int32 dwGBitMask;
    int32 dwBBitMask;
    int32 dwABitMask; // offset: 26
};

DDS_HEADER {
    int32 dwSize; // 1
    int32 dwFlags;
    int32 dwHeight;
    int32 dwWidth;
    int32 dwPitchOrLinearSize;
    int32 dwDepth;
    int32 dwMipMapCount; // offset: 7
    int32[11] dwReserved1;
    DDS_PIXELFORMAT ddspf; // offset 19
    int32 dwCaps; // offset: 27
    int32 dwCaps2;
    int32 dwCaps3;
    int32 dwCaps4;
    int32 dwReserved2; // offset 31
};*/

/**
 * Parses a DDS file from the given arrayBuffer and uploads it into the currently bound texture
 *
 * @param {TypedArray} arrayBuffer Array Buffer containing the DDS files data
 * @param {boolean} [loadMipmaps] If false only the top mipmap level will be loaded, otherwise all available mipmaps will be uploaded
 *
 * @returns {number} Number of mipmaps uploaded, 0 if there was an error
 */
function uploadDDSLevels(arrayBuffer, loadMipmaps) {
    var header = new Int32Array(arrayBuffer, 0, headerLengthInt),
        fourCC, blockBytes, internalFormat,
        width, height, dataLength, dataOffset,
        byteArray, mipmapCount, i;

    if (header[off_magic] != DDS_MAGIC) {
        console.error("Invalid magic number in DDS header");
        return 0;
    }

    if (!header[off_pfFlags] & DDPF_FOURCC) {
        console.error("Unsupported format, must contain a FourCC code");
        return 0;
    }

    fourCC = header[off_pfFourCC];
    switch (fourCC) {
        case FOURCC_DXT1:
            blockBytes = 8;
            internalFormat = ext.COMPRESSED_RGBA_S3TC_DXT1_EXT || ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
            break;

        case FOURCC_DXT5:
            blockBytes = 16;
            internalFormat = ext.COMPRESSED_RGBA_S3TC_DXT5_EXT || ext.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
            break;

        default:
            console.error("Unsupported FourCC code:", Int32ToFourCC(fourCC));
            return null;
    }

    mipmapCount = 1;
    if (header[off_flags] & DDSD_MIPMAPCOUNT && loadMipmaps !== false) {
        mipmapCount = Math.max(1, header[off_mipmapCount]);
    }

    width = header[off_width];
    height = header[off_height];
    dataOffset = header[off_size] + 4;

    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    for (i = 0; i < mipmapCount; ++i) {
        dataLength = Math.max(4, width) / 4 * Math.max(4, height) / 4 * blockBytes;
        byteArray = new Uint8Array(arrayBuffer, dataOffset, dataLength);
        console.log("internalFormat:", internalFormat);
        gl.compressedTexImage2D(gl.TEXTURE_2D, i, internalFormat, width, height, 0, byteArray);
        dataOffset += dataLength;
        width *= 0.5;
        height *= 0.5;
    }
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmapCount > 1 ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
    return texture;
}

function loadPVRTCTexture(url) {
    return new Promise((resolve, reject) => {
        loadBinaryData(url).then((data) => {
            console.log('currentCompressedTextureFormat 1', currentCompressedTextureFormat, '0x' + currentCompressedTextureFormat.toString(16));
            let PVRInfo = parsePVR(data);
            let { width, height, pvrtcData } = PVRInfo;
            let texture = texImage2D(currentCompressedTextureFormat, width, height, pvrtcData);
            resolve(texture);
        }).catch((e) => {
            console.warn(e);
            reject(e);
        });
    })
}

// http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_pvrtc/
var COMPRESSED_RGB_PVRTC_4BPPV1_IMG = 0x8C00;
var COMPRESSED_RGB_PVRTC_2BPPV1_IMG = 0x8C01;
var COMPRESSED_RGBA_PVRTC_4BPPV1_IMG = 0x8C02;
var COMPRESSED_RGBA_PVRTC_2BPPV1_IMG = 0x8C03;

// ETC1 format, from:
// http://www.khronos.org/registry/webgl/extensions/WEBGL_compressed_texture_etc1/
var COMPRESSED_RGB_ETC1_WEBGL = 0x8D64;

var PVR_FORMAT_2BPP_RGB = 0;
var PVR_FORMAT_2BPP_RGBA = 1;
var PVR_FORMAT_4BPP_RGB = 2;
var PVR_FORMAT_4BPP_RGBA = 3;
var PVR_FORMAT_ETC1 = 6;
var PVR_FORMAT_DXT1 = 7;
var PVR_FORMAT_DXT3 = 9;
var PVR_FORMAT_DXT5 = 5;

var PVR_HEADER_LENGTH = 13; // The header length in 32 bit ints.
var PVR_MAGIC = 0x03525650; //0x50565203;

// Offsets into the header array.
var PVR_HEADER_MAGIC = 0;
var PVR_HEADER_FORMAT = 2;
var PVR_HEADER_HEIGHT = 6;
var PVR_HEADER_WIDTH = 7;
var PVR_HEADER_MIPMAPCOUNT = 11;
var PVR_HEADER_METADATA = 12;

// Parse a PVR file and provide information about the raw texture data it contains to the given callback.
function parsePVR(arrayBuffer) {
    // Callbacks must be provided.
    // if (!callback || !errorCallback) { return; }

    // Get a view of the arrayBuffer that represents the DDS header.
    var header = new Int32Array(arrayBuffer, 0, PVR_HEADER_LENGTH);

    // Do some sanity checks to make sure this is a valid DDS file.
    if (header[PVR_HEADER_MAGIC] != PVR_MAGIC) {
        // errorCallback("Invalid magic number in PVR header");
        console.error("Invalid magic number in PVR header");
        return 0;
    }

    // Determine what type of compressed data the file contains.
    var format = header[PVR_HEADER_FORMAT];
    var internalFormat;
    switch (format) {
        case PVR_FORMAT_2BPP_RGB:
            internalFormat = COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
            break;

        case PVR_FORMAT_2BPP_RGBA:
            internalFormat = COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
            break;

        case PVR_FORMAT_4BPP_RGB:
            internalFormat = COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
            break;

        case PVR_FORMAT_4BPP_RGBA:
            internalFormat = COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
            break;

        case PVR_FORMAT_ETC1:
            internalFormat = COMPRESSED_RGB_ETC1_WEBGL;
            break;

        case PVR_FORMAT_DXT1:
            internalFormat = COMPRESSED_RGB_S3TC_DXT1_EXT;
            break;

        case PVR_FORMAT_DXT3:
            internalFormat = COMPRESSED_RGBA_S3TC_DXT3_EXT;
            break;

        case PVR_FORMAT_DXT5:
            internalFormat = COMPRESSED_RGBA_S3TC_DXT5_EXT;
            break;

        default:
            // errorCallback("Unsupported PVR format: " + format);
            // return;
            break;
    }
    // Gather other basic metrics and a view of the raw the DXT data.
    var width = header[PVR_HEADER_WIDTH];
    var height = header[PVR_HEADER_HEIGHT];
    var levels = header[PVR_HEADER_MIPMAPCOUNT];
    var dataOffset = header[PVR_HEADER_METADATA] + 52;
    var pvrtcData = new Uint8Array(arrayBuffer, dataOffset);

    // Pass the PVRTC information 
    return {
        width, height, levels, dataOffset, pvrtcData
    }
}

function loadImageTexture(url) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.src = url;
        image.onload = () => {
            let texture = texImage2D(image)
            resolve(texture);
            image = null;
        }
        image.onerror = (err) => {
            reject(err);
            image = null;
        }
    })
}

async function loadTexture(url, width, height) {
    let texture;
    switch (currentCompressedTextureType) {
        case 's3tc':
            texture = await loadS3TCTexture(url, width, height);
            break;
        case 'etc1':
            texture = await loadETCTexture(url, width, height);
            break;
        case 'pvrtc':
            texture = await loadPVRTCTexture(url, width, height);
            break;
        default:
            texture = await loadImageTexture(url);
            break;
    }
    return texture;
};


function texImage2D(source, type, width, height) {
    console.log("texImage2D:", type);

    var texture = gl.createTexture();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    gl.activeTexture(gl.TEXTURE0);//开启0号纹理单元
    gl.bindTexture(gl.TEXTURE_2D, texture);
    
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    // void gl.compressedTexImage2D(target, level, internalformat, width, height, border, ArrayBufferView? pixels);
    if (supportedCompressedTexture) {
        gl.compressedTexImage2D(gl.TEXTURE_2D, 0, type, width, height, 0, source);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, source);
    }

    return texture;
}
