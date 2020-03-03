const $ = ( element ) => document.querySelector( element )

const numbersSection = $( '#numbers' )
const numbersEnd = 100

const numbersReserveds = [ 47,23,9,81 ]

const numbersHTML = ( number, reserved = numbersReserveds ) => {
    const node = document.createElement( `div` )
    node.setAttribute( 'id', `num_${ number }` )
     
    reserved.indexOf( number ) > -1 
        ? node.setAttribute( 'class', `reserved` )
        : node.setAttribute( 'class', `open` ) 

    
    node.innerHTML = 
        `<input type="checkbox" class="numbers-checkbox" id="${ number }">
        <label for="number">${ number }</label>`
    return node
}


const createNumbers = ( total = numbersEnd, element = numbersSection, reserved = numbersReserveds ) => {

    for( let i = 0; i <= total; i++ ){
        element.appendChild( numbersHTML( i ) )
    }
}
createNumbers( )

const addClass = ( className, id ) => {
    const element = $( `#num_${ id }` )
    element.setAttribute( 'class', className )
}

const getClassName = ( element ) => $( `#num_${ element }` ).className

numbersSection.addEventListener('mousedown', ( element ) => {
    const tag = element.toElement.localName
    const text = element.toElement.innerText
    if( tag === 'div' || tag === 'label' ){

        switch( getClassName( text ) ){
            case 'selected':
                addClass( 'open', text )
            break
            case 'open':
            case 'pending':
                addClass( 'selected', text )
            break

        }


    }
} )