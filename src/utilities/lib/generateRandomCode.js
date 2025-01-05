export function generateRandomCode(codeSize = 16) {
  let code = "";
  for (let i = 0; i < codeSize; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}
