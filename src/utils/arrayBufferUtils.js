export const base64ToArrayBuffer = (base64) => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    console.log('Length of binary string:', len);
    
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('Uint8Array bytes:', bytes);
    return bytes.buffer;
};
