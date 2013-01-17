define([], function () {
    function notCalled() {
        return 'this is never called';
    }
    
    return function () {
        return 'foo';
    };
});