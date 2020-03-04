const $ = ( element ) => document.querySelector( element )

const sendButton = $( '#send-numbers' )
const numbersSection = $( '#numbers' )
const emailInput = $( '#email_user' )
const nameInput = $( '#name_user' )

const numbersEnd = 100

const numbersReserveds = async () => {
    const url = 'https://us-central1-rifa-99freelas.cloudfunctions.net/app/buyer/numbers-reserved'
    let res = [] ;
    await fetch( url, { method: 'GET' } ).then( async response => {
       const test = await response.json().then( value => value.numbers )
       res = test
    } )
    return res
}

const numbersHTML = ( number, reserved = [] ) => {
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


const createNumbers = async ( total = numbersEnd, element = numbersSection, reserved ) => {
    reserved = await numbersReserveds()
    console.log( reserved )

    for( let i = 0; i <= total; i++ ){
        element.appendChild( numbersHTML( i, reserved ) )
    }
}
createNumbers( )

const addClass = ( className, id ) => {
    const element = $( `#num_${ id }` )
    element.setAttribute( 'class', className )
}

const getClassName = ( element ) => $( `#num_${ element }` ).className

const numbersSelected = []

const addNumberSelected = ( number ) => {
    numbersSelected.push( number )
    addClass( 'selected', number )
}

const removeNumberSelected = ( number ) => {
    const index = numbersSelected.indexOf( number )
    numbersSelected.splice( index, 1 )
    addClass( 'open', number )
}

numbersSection.addEventListener('mousedown', ( element ) => {
    const tag = element.toElement.localName
    const number = parseInt(element.toElement.innerText)
    if( tag === 'div' || tag === 'label' ){

        switch( getClassName( number ) ){
            case 'selected':
                removeNumberSelected( number )
            break
            case 'open':
            case 'pending':
                addNumberSelected( number )
            break

        }
    }
} )

const testEmail = (email) => {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

sendButton.addEventListener( 'click', async ( element ) => {
    element.preventDefault()
    
    const url = "https://us-central1-rifa-99freelas.cloudfunctions.net/app/buyer/add"
    const options = {
        method: 'POST',
        body: JSON.stringify( {
            email: emailInput.value,
            name: nameInput.value,
            numbers: numbersSelected
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    
    if(testEmail( emailInput.value ) && nameInput.value){ 
        await fetch( url, options)
        console.log( 'OK' )
        if( confirm( 'Seu numeros foram reservados!' ) )document.location.reload(true)
    }else{ 
        console.log( 'Nome ou email invalido' )
    }
})