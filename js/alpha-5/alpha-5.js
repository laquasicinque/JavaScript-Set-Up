export { 
    encode, decode, BIT_LENGTH, ALPHABET_LENGTH,// public
    _0To31NumberFromCharacter,
    _0To31NumbersFromString,
    _compactUInt8ArrayFrom0To31Numbers,
};


const UTF_OFFSET_A = 97;
const ALPHABET_LENGTH = 26;
const EXTRAS = [
    ` `,
    `.`,
    `,`,
    `?`,
    `\n`,
    undefined, // empty
];
const BIT_LENGTH = 5;
const BYTE = 8;

const _0To31NumberFromCharacter = character => {
    const numberRepresentation = character.charCodeAt(0) - UTF_OFFSET_A;
    if (numberRepresentation >= ALPHABET_LENGTH || numberRepresentation < 0) {
        if (EXTRAS.includes(character)) {
            return EXTRAS.indexOf(character) + ALPHABET_LENGTH;
        }
        return undefined;
    }
    return numberRepresentation;
};

const _0To31NumbersFromString = string => {
    return string.split(``).map(_0To31NumberFromCharacter).filter(number => {
        return number !== undefined;
    });
};

const stringFrom0To31Numbers = numbers => {
    return numbers.map(numberRepresentation => {
        if (numberRepresentation >= ALPHABET_LENGTH) {
            return EXTRAS[numberRepresentation - ALPHABET_LENGTH];
        }
        return String.fromCharCode(numberRepresentation + UTF_OFFSET_A);
    }).join(``);
};

const addNumberIntoByte = (number, existingByte = 0, offset, BitLength = BIT_LENGTH) => {

};

const _compactUInt8ArrayFrom0To31Numbers = _0To31Numbers => {
    const byteLength = Math.ceil((_0To31Numbers.length * BIT_LENGTH) / BYTE);
    const compactUInt8Array = new Uint8Array(byteLength);

    let bitPosition = 0;
    let currentByte = 0;
    let byteIndex = 0;
    let lastPrintNeeded = false;
    const saveByte = (number) => {
        console.log(`save ${number} (${number.toString(2)})`)
        compactUInt8Array[byteIndex] = number;
        byteIndex += 1;
        currentByte = 0;
        bitPosition = 0;
    };
    _0To31Numbers.forEach(number => {
        if (bitPosition + BIT_LENGTH < BYTE) { // can fit at once
            const toShift = BYTE - BIT_LENGTH - bitPosition;
            currentByte += number << toShift;
            bitPosition += BIT_LENGTH;
            
            if (bitPosition === BYTE) {
                saveByte(currentByte);
            }
        } else { // cannot fit at once
            const shiftRight = -BYTE + bitPosition + BIT_LENGTH; // 2
            const missedBits = BIT_LENGTH - shiftRight; // 3
            const clamped = number >> shiftRight;
            currentByte += clamped;
            
            saveByte(currentByte);
            
            const substractHead = clamped << shiftRight;
            const rest = number - substractHead;
            currentByte += rest << (BYTE+1) - missedBits;
            bitPosition += missedBits;
        }
    });
    // todo handle all cases
    console.log(90,currentByte)
    if (currentByte) {
        saveByte(currentByte);
    } //else {
        //     compactUInt8Array[byteIndex] = remainder;
        // }
        console.log(96,compactUInt8Array)
    return compactUInt8Array;
};

const _0To31NumbersFromCompactUInt8Array = compactUInt8Array => {
    const byteLength = compactUInt8Array.length;
    const _0To31Numbers = [];
    const enoughSpace = BYTE - BIT_LENGTH;

    const masks = [
        0b11111111,
        0b01111111,
        0b00111111,
        0b00011111,
        0b00001111,
        0b00000111,
        0b00000011,
        0b00000001,
    ];
    let offset = 0;
    let remainder = 0;
    let bitsScanned = 0;
    compactUInt8Array.forEach((uInt8, i) => {
        console.log(i, uInt8, 'uInt8')
        while (offset !== BYTE && !(i === byteLength - 1 && offset > enoughSpace)) {
            if (BIT_LENGTH - bitsScanned <= BYTE - offset) {
                let number;
                if (bitsScanned === 0) {
                    number = (uInt8 & masks[offset]) >> (enoughSpace - offset);
                    offset += BIT_LENGTH;
                    // console.log(number, offset)
                    console.log(i, number, 'full')
                } else {
                    const scanning = BIT_LENGTH - bitsScanned;
                    number = remainder + (uInt8 >> (BYTE - scanning));
                    offset += scanning;
                    console.log(i, number, 'rest', (uInt8 >> (BYTE - scanning)))
                    remainder = 0;
                    bitsScanned = 0;
                }
                _0To31Numbers.push(number);
            } else {
                bitsScanned = BYTE - offset;
                remainder = (uInt8 & masks[offset]) << (BIT_LENGTH - bitsScanned);
                offset += bitsScanned;
                console.log(i, 'scanning +', remainder);
            }
        }
        offset = 0;
    });

    return _0To31Numbers;
};

const encode = string => {
    const _0To31Numbers = _0To31NumbersFromString(string);
    const uInt8Array = _compactUInt8ArrayFrom0To31Numbers(_0To31Numbers);
    return uInt8Array;
};


const decode = uInt8Array => {
    const _0To31Numbers = _0To31NumbersFromCompactUInt8Array(uInt8Array);
    const string = stringFrom0To31Numbers(_0To31Numbers);
    return string;
};

console.log(37,_compactUInt8ArrayFrom0To31Numbers([1,2,3]))
console.log(38,Uint8Array.from([
    0b00001000, // 1-2
    0b10000110, // 2-3
]))
// console.log(encode('abc def zxw aaa zzz'));
// console.log(encode('a - z'));
// console.log(encode('a'));
// console.log(encode('ab'));
// console.log(encode('z'));
// console.log(encode('aa'));
// console.log(encode('zz'));
// console.log(encode('\n\n'));

// console.log(decode(encode('a')));
// console.log(decode(encode('z')));
// console.log(decode(encode('?')));

// console.log(decode(encode('aa')));
// console.log(decode(encode('a - z')));
// console.log()
// console.log()
// console.log(decode(encode('abc def zxw aaa zzz')));
// console.log()
// console.log()
// console.log(decode(encode('ab   ')));
