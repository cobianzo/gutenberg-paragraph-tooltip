import { select, dispatch } from '@wordpress/data';

// Example usage
// addAttributeToCurrentLink('https://example.com', 'Link Text');

export const findCurrentLink = ( href: string, linkText: string ) => {
	const selectedBlockClientId = select( 'core/block-editor' ).getSelectedBlockClientId();
	let block = null;

	let theLink = null;
	let theDom = null;

	if ( selectedBlockClientId ) {
		block = select( 'core/block-editor' ).getBlock( selectedBlockClientId );
	} else {
		console.log( 'No block selected to modify link attribute' );
		return;
	}

	if ( block && block.name === 'core/paragraph' ) {
		const { attributes } = block;
		const content = attributes.content;
		const parser = new DOMParser();
		theDom = parser.parseFromString( content, 'text/html' );
		const links = theDom.querySelectorAll( 'a' );

		links.forEach( ( link ) => {
			if ( link.href.replace( /\/$/, '' ) === href && link.textContent === linkText ) {
				console.log( '>>>>> FOUND LINK with the content and href' );
				theLink = link;
			}
		} );
	}
	return [ theLink, theDom, selectedBlockClientId ];
};

//
export const addAttributeToCurrentLink = ( tootipValue: string, href: string, linkText: string ) => {
	// Get the currently selected block
	const [ link, doc, clientId ] = findCurrentLink( href, linkText );

	if ( ! link || ! doc ) {
		console.error( 'nada que updatear' );
		return;
	}

	link.setAttribute( 'title', tootipValue );

	// Serializar el contenido actualizado de vuelta a HTML
	const serializer = new XMLSerializer();
	const newContent = serializer.serializeToString( doc.body );

	// Asegurar que el nuevo contenido sigue la estructura válida del bloque
	const validContent = newContent
		.replace( /<(\/?)body(.*?)>/g, '' ) // Eliminar las etiquetas <body> generadas por el parser
		.trim(); // Eliminar espacios innecesarios

	// Update the block content with the new HTML
	dispatch( 'core/block-editor' ).updateBlockAttributes( clientId, { content: validContent } );
};
