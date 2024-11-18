// WordPress dependencies
import { select, dispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

// Internal dependencies
import { type NullableHTMLElement, newInputId, ATTRIBUTE } from './index';

// define consts (selectors)
const popupContainerSelector = '.components-popover__content';
const advanceFieldsetSelector = '.block-editor-link-control__settings';
const cancelBtnSelector = '.block-editor-link-control__search-actions button';

/**
 * Finds the container of the popup, which is the parent of the advanced options fieldset.
 * The container is the first parent with the class 'components-popover__content'.
 * If it doesn't exist, it will return null.
 *
 * @return {HTMLElement | null} The container of the popup, or null if it doesn't exist.
 */
export const findPopupContainer = () : NullableHTMLElement => {
	const container = document.querySelector( `${ popupContainerSelector } ${ advanceFieldsetSelector }` );
	if ( container ) {
		return container.closest( popupContainerSelector ) as HTMLElement;
	}
	return null;
};

/**
 * Find the link, so we can edit it in the selected block.
 *
 * @param {string} href     - the url of the link that we are searching
 * @param {string} linkText - the text inside of <a></a>
 * @return {[HTMLElement|null, Document|null, string|null]} - an array with [ link: HTMLElement, doc: Document, clientId: string ]
 */
export const findCurrentLink = ( href: string, linkText: string )
	: [ HTMLElement | null, Document | null, string | null ] => {
	const selectedBlockClientId = select( 'core/block-editor' ).getSelectedBlockClientId();
	let block = null;
	let theLink = null;
	let theDom = null;

	if ( selectedBlockClientId ) {
		block = select( 'core/block-editor' ).getBlock( selectedBlockClientId );
	} else {
		return [ null, null, null ];
	}

	if ( block ) {
		const { attributes } = block;
		const content = attributes.content;
		const parser = new DOMParser();
		theDom = parser.parseFromString( content, 'text/html' );
		const links = theDom.querySelectorAll( 'a' );

		links.forEach( ( link ) => {
			if ( link.href.replace( /\/$/, '' ) === href.replace( /\/$/, '' ) &&
				link.textContent === linkText ) {
				theLink = link;
			}
		} );
	}

	return [ theLink, theDom, selectedBlockClientId ];
};

/**
 * Adds the title attribute to the selected link in the current block
 * @param tootipValue the value for the tooltip
 * @param href
 * @param linkText
 */
export const addAttributeToCurrentLink = ( tootipValue: string, href: string, linkText: string ) : void => {
	// Get the currently selected block
	const [ link, doc, clientId ] = findCurrentLink( href, linkText );
	if ( ! link || ! doc ) {
		// console.error( 'nada que updatear' );
		return;
	}

	if ( tootipValue === '' ) {
		link.removeAttribute( ATTRIBUTE );
	} else {
		link.setAttribute( ATTRIBUTE, tootipValue );
	}

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

export const createTooltipInputElement = ( container: NullableHTMLElement, saveButton: NullableHTMLElement )
	: HTMLInputElement => {
	const tooltipInput: HTMLInputElement = document.createElement( 'input' );
	tooltipInput.type = 'text';
	tooltipInput.placeholder = 'Enter tooltip text';
	tooltipInput.autocomplete = 'off';
	tooltipInput.id = newInputId;
	tooltipInput.className = 'tooltip-input';

	tooltipInput.addEventListener( 'input', () => {
		// trick to trigger the Save button activation
		saveButton?.setAttribute( 'aria-disabled', 'false' );

		saveButton?.addEventListener( 'click', () => {
			setTimeout( () => {
				// hacky solution: if, afteer clicking 'Sace', the cancel button is still there after 500 secs,
				// it means that the Save btn didnt close the popup, (thi shappens when there are no changes in
				// any other field) so we need to close the popup with 'Cancel' click
				const cancelBtn: HTMLButtonElement | null | undefined = container?.querySelector( cancelBtnSelector );
				if ( cancelBtn ) {
					cancelBtn.click();
				}
			}, 500 );
		} );
	} );

	return tooltipInput;
};

export const createTooltipLabelElement = () => {
	const tooltipLabel: HTMLLabelElement = document.createElement( 'label' );
	tooltipLabel.textContent = __( 'Special tooltip', 'gutenberg-tooltip' );
	tooltipLabel.setAttribute( 'for', newInputId );
	tooltipLabel.className = 'components-base-control__label';

	return tooltipLabel;
};
