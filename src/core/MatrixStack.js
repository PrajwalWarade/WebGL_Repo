
// Matrix Stack
var matrixStack = [];

function pushMatrixOur(matrix) {
    matrixStack.push(matrix.slice(0));
}
function popMatrixOur() {
    return matrixStack.pop();
}
