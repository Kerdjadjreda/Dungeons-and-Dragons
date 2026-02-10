const rollD20 = (() =>{
    function roll() {
        return Math.floor(Math.random() * 20) + 1;
    }

    return function () {
        return roll();
    };
})();


module.exports = rollD20;