const formatNumber = ( value ) => {
    const result = []
    value.forEach( number => {
        const numbers = number.toString().split('')
        const lengthNumber = numbers.length-1
        const res = [ ]
        for( let i = 0; i < 3; i++ ){
            numbers[ i ]
                ? res[ lengthNumber - i] = `${numbers[ i ]}`
                : res[i] = "0"
        }
        result.push( res.reduce( (current, next) => next+current ) )
    } )
    return result
}

console.log( formatNumber( [1,23,456] ) )