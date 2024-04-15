export function arrayBufferUtilities(r1: ArrayBuffer|undefined) {
  let binary = '';
  let r = new Uint8Array(r1?r1:new ArrayBuffer(0))
  const len = r.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(r[i]);
  }
  console.log(window.btoa(binary))
  return "data:application/pdf;base64,"+window.btoa(binary);
}

