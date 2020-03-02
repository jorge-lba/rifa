const numbersSection = document.querySelector( '#numbers' )
const numbersEnd = 100

const numbersHTML = ( number ) => {
    const node = document.createElement( `div` )
    node.setAttribute( 'id', `${ number }` )
    node.innerHTML = 
        `<input type="checkbox" class="numbers-checkbox" id="${ number }">
        <label for="number">${ number }</label>`
    return node
}


const createNumbers = ( total = numbersEnd, element = numbersSection ) => {

    for( let i = 0; i <= total; i++ ){
        element.appendChild( numbersHTML( i ) )
    }
}

createNumbers( )