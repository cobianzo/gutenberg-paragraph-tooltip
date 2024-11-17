import { select, subscribe, useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { addAttributeToCurrentLink, findCurrentLink } from './helpers';

import domReady from '@wordpress/dom-ready';

import './style.css';

type NullableHTMLElement = null | HTMLElement;
type NullableString = null | string;

const withSelectEvents = createHigherOrderComponent( ( BlockListBlock ) => {
	return ( props ) => {
		const { clientId, name, isSelected, setAttributes } = props;
		const { hasSelectedBlock, selectedBlockClientId } = useSelect( ( select ) => {
			const {
				hasSelectedBlock,
				getSelectedBlockClientId,
			} = select( 'core/block-editor' );
			return {
				hasSelectedBlock: hasSelectedBlock(),
				selectedBlockClientId: getSelectedBlockClientId(),
			};
		} );

		const { replaceBlock } = useDispatch( 'core/block-editor' );

		useEffect( () => {
			console.log( '%c 1. UseEffect ', 'background:pink;', name );
			if ( name === 'core/paragraph' ) {
				if ( isSelected ) {
					console.log( '%c 2. isSelected ', 'background:green;color:white;', props );

					// Aquí puedes agregar el código para cuando se selecciona el bloque
					const currentContent = props.attributes.content;
					console.log( '%c CurrentCONTENT: ', 'background:blue;color:white;', currentContent );

					console.log( '%c Adding Observer ', 'background:blue;color:white;' );
					addObserverToAdvancedLinkOptionsPopup().then( ( element ) => {
						console.log( 'Elemento encontrado:', element );

						// Crear un nuevo input de tipo texto
						const newInput = document.createElement( 'input' );
						newInput.type = 'text';
						newInput.placeholder = 'Nuevo campo de texto';

						// Añadir el input al elemento encontrado
						element.appendChild( newInput );

						console.log( 'Nuevo input añadido:', newInput );
					} ).catch( ( error ) => {
						console.error( 'Error:', error );
					} );
				} else if ( selectedBlockClientId !== clientId ) {
					const currentContent = props.attributes.content;
					console.log( '%c 3. Deselecting block (update?) ', 'background:lightgray;', currentContent );
					// console.log( 'Block deselected, update HTML with replaceBlock:', currentContent );
					// const newContent = currentContent.originalHTML.replaceAll( 'strong>', 'em>' );
					// Modifiy the content with
					// replaceBlock( clientId, { ...props, attributes:
					// 		{ ...props.attributes, content: 'asdfsa' },
					// } );
				}
			}
			return ( props ) => {
				console.log( '%c 3. useEffect return ', 'background:gray;', props );
			};
		}, [ isSelected ] );

		return <BlockListBlock { ...props } />;
	};
}, 'withSelectEvents' );

// addFilter( 'editor.BlockListBlock', 'coco/add-edit-tooltip-events', withSelectEvents );

// Sin filtros ni historias

let previousSelectedBlockId = null;
const counterStuff = 0;
const unsubscribe = wp.data.subscribe( () => {
	// console.log( '%c El estado ha cambiado', 'text-size:1.5rem;', counterStuff++ );
	const currentSelectedBlockId = select( 'core/block-editor' ).getSelectedBlockClientId(); if ( currentSelectedBlockId !== previousSelectedBlockId ) {
		previousSelectedBlockId = currentSelectedBlockId; if ( currentSelectedBlockId ) {
			console.log( 'Se ha seleccionado un nuevo bloque:', currentSelectedBlockId ); const selectedBlock = select( 'core/block-editor' ).getBlock( currentSelectedBlockId ); console.log( 'Contenido del bloque seleccionado:', selectedBlock.attributes.content );
		} else {
			console.log( 'No hay ningún bloque seleccionado' );
		}
	}
} );

// Para dejar de escuchar los cambios, llama a la función devuelta por `subscribe`
// unsubscribe();

// On page load
domReady( () => {
	// 1. We use subscribe to listen until we find the `.popover` that will contain the link options.
	const observersForPopups = new Map(); // @TODO: delete this logic.
	const editPencilBtnSelector = 'button[aria-label="Edit link"]';
	let currentLinkText = null;
	let currentLinkURL = null;
	const unsubscribeSubscribe = subscribe( () => {
		const popups = Array.from( document.querySelectorAll( '.popover-slot' ) );
		if ( popups.length > 0 ) {
			console.log( '%cDomREADY: observind:', 'font-size:1.5rem', popups );
			unsubscribeSubscribe(); // stop listening

			// 2. now, we add a mutation observer for the popups (there are two in the DOM, and
			// the second one will be the one that contains the link options)
			// for every popups, we check every change until we find the edit button.
			const observer = new MutationObserver( ( mutationsList: MutationRecord[], obs: MutationObserver ) => {
				const observedElement: HTMLElement = [ ...observersForPopups.keys() ].find( ( key ) => observersForPopups.get( key ) === observer );
				console.log( '%cObserved ELEMENT:', 'font-size:1.5rem', obs, observedElement.childNodes, observersForPopups );

				for ( const mutation of mutationsList ) {
					if ( mutation.type === 'childList' ) {
						console.log( '>>>CLASSLIST', mutation.target );
						if ( ! mutation.target.querySelector( editPencilBtnSelector ) ) {
							continue;
						}
						console.log( '%c>>>Pencil found', 'font-size:2rem;', editPencilBtnSelector );
						const container: HTMLElement = mutation.target;
						if ( ! container ) {
							console.error( 'the container with the link options has not been detected', container );
							return;
						}
						console.log( '%Mutation indeed:', 'font-size:1.5rem', mutation.addedNodes, container );
						const editPencilBtn: NullableHTMLElement = container?.querySelector( editPencilBtnSelector ); // first button is the edit one.
						if ( editPencilBtn ) {
							// 3. Found the pencil button, when clicked, we add the input for the tooltip

							if ( ! editPencilBtn.getAttribute( 'data-listenerTooltip' ) ) {
								console.log( '%cEdit button found.ADding listener', 'font-size:2rem; background:yellow', editPencilBtn );
								editPencilBtn.addEventListener( 'click', ( e: MouseEvent ) => {
									setTimeout( () => {
										console.log( '%cClicked pencil bttn triggers custom event', 'font-size:2rem; background:yellow', editPencilBtn );

										// Save the inital values for text and url, so we can find the HMTL link in the content.
										currentLinkText = container?.querySelector( '.components-text-control__input' )?.value;
										currentLinkURL = container?.querySelector( '.components-input-control__input' )?.value;

										if ( ! currentLinkText || ! currentLinkURL ) {
											console.error( 'No previous values for link url and content', currentLinkText, currentLinkURL );
											return;
										}

										const advancedContainer: NullableHTMLElement = container.querySelector(
											'.block-editor-link-control__drawer-inner, .block-editor-link-control__tools' );
										console.log( '%c>>>>Pencil CLICKKK', 'background:yellow;font-size:3rem;', e.currentTarget, advancedContainer );
										if ( advancedContainer ) {
											const saveBtn: NullableHTMLElement = container?.querySelector( '.block-editor-link-control__search-submit' );

											const tooltipInput: HTMLInputElement = document.createElement( 'input' );
											tooltipInput.type = 'text';
											tooltipInput.placeholder = 'Enter tooltip text';
											tooltipInput.id = 'inspector-input-control-tooltip';
											tooltipInput.className = 'tooltip-input';

											const [ link, doc, clientId, currentTooltip ] = findCurrentLink( currentLinkURL!, currentLinkText! );
											if ( link ) {
												tooltipInput.value = link.getAttribute( 'title' ) || '';
											}

											tooltipInput.addEventListener( 'input', ( ev: Event ) => {
												// trick to trigger the Save button activation
												saveBtn?.setAttribute( 'aria-disabled', 'false' );

												saveBtn?.addEventListener( 'click', ( ev: MouseEvent ) => {
													setTimeout( () => {
														// look for the cancel button, if ist still there after 500 secs,
														// it means that the Save btn didnt close the popup
														const cancelBtn = container?.querySelector( '.block-editor-link-control__search-actions button' );
														if ( cancelBtn ) {
															cancelBtn.click();
														}
													}, 500 );
												} );
												// const firstCheckbox = advancedContainer.querySelector( 'input[type="checkbox"]' );
												// const urlInput = container?.querySelector( '.block-editor-link-control__search-input-container input' );
												// if ( firstCheckbox && urlInput ) {
												// 	debugger;
												// 	urlInput.value += ' ';
												// 	firstCheckbox.click();
												// 	firstCheckbox.click();
												// }
												console.log( '%cInput changed', 'background:yellow;font-size:2rem;', ev );
											} );

											advancedContainer.appendChild( tooltipInput );

											if ( saveBtn && ! saveBtn.getAttribute( 'data-listenerTooltip' ) ) {
												// on save, we assign the value of the input to the
												saveBtn.addEventListener( 'click', ( ev: MouseEvent ) => {
													// @TODO: apply only if the button is not disabled.
													const tootipValue = container?.querySelector( '#inspector-input-control-tooltip' ).value!;
													console.log( '%cSave button CLICKEED>>>>>', 'color:blue', tootipValue, currentLinkURL, currentLinkText );

													// Find the current value for the link and put it in the input
													addAttributeToCurrentLink( tootipValue, currentLinkURL, currentLinkText );
												} );
												saveBtn.setAttribute( 'data-listenerTooltip', 'true' );
											} else {
												console.error( 'Save button not found' );
											}
										} else {
											console.error( 'Advanced container not found', container );
										}
									}, 1000 );
								} );
								editPencilBtn.setAttribute( 'data-listenerTooltip', 'true' );
							} else {
								console.log( '|||||  ALREADY LISTENING in theory' );
							}
						} else {
							console.error( 'button edit (pencil) not found' );
						}
					}
				}
			} );

			popups.forEach( ( popupEl ) => {
				observer.observe( popupEl, { childList: true, subtree: true } );
				observersForPopups.set( popupEl, observer );
			} );
			console.log( '>>>>>>', observersForPopups );
		}
	} );
} );
