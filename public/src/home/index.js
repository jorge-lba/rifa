const numbersSection = document.querySelector( '#numbers' )
const numbersEnd = 100

const numbersHTML = ( number ) => {
    const node = document.createElement( `div` )
    node.setAttribute( 'id', `${ number }` )
    node.innerHTML = 
        `<div id="${ number }">
            <input type="checkbox" name="number" id="${ number }">
            <label for="number">${ number }</label>
        </div>`
    return node
}


const createNumbers = ( total = numbersEnd, element = numbersSection ) => {

    for( let i = 0; i <= total; i++ ){
        element.appendChild( numbersHTML( i ) )
    }
}

createNumbers( )