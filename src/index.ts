// WordPress dependencies
import { subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

// Internal dependencies
import { addAttributeToCurrentLink,
	createTooltipInputElement,
	findCurrentLink,
	createTooltipLabelElement } from './helpers';

// Style. We import them just to build the bundle in /build, but they are enqueued in plugin.php
import './style.css';

// Types
export type NullableHTMLElement = null | HTMLElement;
type NullableString = null | string;

// Internal constants and vars
export const BLOCKS = [ 'core/paragraph' ];
// we keep the relation HTMLElement => observer in our map to access to it anytime.
const observersForPopups: Map<HTMLElement, MutationObserver> = new Map();

// selectors
const editPencilBtnSelector = 'button[aria-label="Edit link"]';
const advancedPanelSelector = '.block-editor-link-control__drawer-inner';
const saveBtnSelector = 'button.block-editor-link-control__search-submit';
export const newInputId = 'inspector-input-control-tooltip';

export const ATTRIBUTE = 'data-tooltip';

// we will init the values of the edited link as we click on the pencil
let currentLinkText: NullableString = null;
let currentLinkURL: NullableString = null;

// The logic:
// On page load. We could do it as a plugin as well, or a filter.
domReady( () => {
	// 1. We use subscribe to listen until we find the `.popover` that will contain the link options.
	const unsubscribeSubscribe = subscribe( () => {
		const popups = Array.from( document.querySelectorAll( '.popover-slot' ) );
		if ( popups.length > 0 ) {
			// page loaded. DOM Ready, so we stop listening
			unsubscribeSubscribe();

			// 2. now, we add a mutation observer for the popups (there are several of them
			// in the DOM, and normally the second one will be the one that contains the link options)
			// for every popups, we check every change until we find the edit button.
			// @TODO: we should just listen until we see the Advanced panel
			const observer = new MutationObserver( ( mutationsList: MutationRecord[], obs: MutationObserver ) => {
				// capture the
				const observedElement: HTMLElement | undefined = [ ...observersForPopups.keys() ].
					find( ( key ) => observersForPopups.get( key ) === observer );

				if ( ! observedElement ) {
					return;
				}

				// console.log( '%cObserved ELEMENT:', 'font-size:1.5rem', obs, observedElement.childNodes, observersForPopups );

				for ( const mutation of mutationsList ) {
					if ( mutation.type === 'childList' ) {
						// console.log( '>>>CLASSLIST', mutation.target );
						const container: HTMLElement = mutation.target as HTMLElement;
						if ( ! container.querySelector( editPencilBtnSelector ) ) {
							continue;
						}
						// console.log( '%c>>>Pencil found', 'font-size:2rem;', editPencilBtnSelector );

						if ( ! container ) {
							// console.error( 'the container with the link options has not been detected', container );
							return;
						}
						// console.log( '%Mutation indeed:', 'font-size:1.5rem', mutation.addedNodes, container );
						const editPencilBtn: NullableHTMLElement = container?.
							querySelector( editPencilBtnSelector ); // first button is the edit one.

						if ( editPencilBtn && ( ! editPencilBtn.getAttribute( 'data-listenerTooltip' ) ) ) {
							// 3. Found the pencil button, when clicked, we add the input for the tooltip

							// console.log( '%cEdit button found.ADding listener', 'font-size:2rem; background:yellow', editPencilBtn );

							editPencilBtn.addEventListener( 'click', ( e: MouseEvent ) => {
								setTimeout( () => {
									// console.log( '%cClicked pencil bttn triggers custom event', 'font-size:2rem; background:yellow', editPencilBtn );

									// Save the inital values for text and url, so we can find the HMTL link in the content.
									currentLinkText = ( container?.
										querySelector( '.components-text-control__input' ) as HTMLInputElement )?.value;
									currentLinkURL = ( container?.
										querySelector( '.components-input-control__input' ) as HTMLInputElement )?.value;

									if ( ! currentLinkText || ! currentLinkURL ) {
										console.error( 'No previous values for link url and content', currentLinkText, currentLinkURL );
										return;
									}

									const advancedContainer: NullableHTMLElement = container.querySelector( advancedPanelSelector );
									// console.log( '%c>>>>Pencil CLICKKK', 'background:yellow;font-size:3rem;', e.currentTarget, advancedContainer );
									if ( advancedContainer ) {
										const saveBtn: NullableHTMLElement = container?.querySelector( saveBtnSelector );

										const _label: HTMLElement = createTooltipLabelElement();
										const tooltipInput: HTMLInputElement = createTooltipInputElement( container, saveBtn );

										// init the input with the current title attribute
										const [ link ] = findCurrentLink( currentLinkURL!, currentLinkText! );
										if ( link ) {
											tooltipInput.value = link.getAttribute( ATTRIBUTE ) || '';
										}

										advancedContainer.appendChild( _label );
										advancedContainer.appendChild( tooltipInput );

										if ( saveBtn && ! saveBtn.getAttribute( 'data-listenerTooltip' ) ) {
											// on save, we assign the value of the input to the
											saveBtn.addEventListener( 'click', ( ev: MouseEvent ) => {
												// @TODO: apply only if the button is not disabled.
												const tootipValue = container?.querySelector( `#${ newInputId }` )?.value || '';

												// console.log( '%cSave button CLICKEED>>>>>', 'color:blue', tootipValue, currentLinkURL, currentLinkText );

												// We need timeout before we update the code editor, so it's not overwritten
												// by the default update of gutenberg.
												setTimeout( () => {
													addAttributeToCurrentLink( tootipValue, currentLinkURL || '', currentLinkText || '' );
												}, 1000 );
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

