// WordPress dependencies
import { subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';

// Internal dependencies
import { addAttributeToCurrentLink,
	createTooltipInputElement,
	findPopupContainer,
	findCurrentLink,
	createTooltipLabelElement } from './helpers';

// Style. We import them just to build the bundle in /build, but they are enqueued in plugin.php
import './style.css';

// Types
export type NullableHTMLElement = null | HTMLElement;
type NullableString = null | string;

// we keep the relation HTMLElement => observer in our map to access to it anytime.
const observersForPopups: Map<HTMLElement, MutationObserver> = new Map();

// selectors
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
			const observer = new MutationObserver( ( mutationsList: MutationRecord[] ) => {
				// capture the DOM element that has just been observed (because it applies to more than one)
				const observedElement: HTMLElement | undefined = [ ...observersForPopups.keys() ].
					find( ( key ) => observersForPopups.get( key ) === observer );

				if ( ! observedElement ) {
					return;
				}

				for ( const mutation of mutationsList ) {
					if ( mutation.type === 'childList' ) {
						// Validations to indentify is we are in the mutation that has created the panel
						// with the Advanced options for the link. If not, we skip it.
						const container: NullableHTMLElement = findPopupContainer();
						if ( ! container ) {
							return;
						}

						const fieldSetOptionsContainer = container instanceof HTMLElement
							? container.querySelector( 'fieldset.block-editor-link-control__settings' ) : null;

						if ( ! fieldSetOptionsContainer ) {
							return;
						}

						// check if the input has been already created, if so, we skip it
						if ( container.querySelector( `input#${ newInputId }` ) ) {
							return;
						}
						if ( fieldSetOptionsContainer.getAttribute( 'data-observerTooltip' ) === 'true' ) {
							return;
						}
						fieldSetOptionsContainer.setAttribute( 'data-observerTooltip', 'true' );

						// 3. the visibility of the panel takes some ms, so we wait to append our artificial input.
						setTimeout( () => {
							// Save the inital values for text and url, so we can find the HMTL link in the content.
							currentLinkText = ( container?.
								querySelector( '.components-text-control__input' ) as HTMLInputElement )?.value;
							currentLinkURL = ( container?.
								querySelector( '.components-input-control__input' ) as HTMLInputElement )?.value;

							if ( ! currentLinkText || ! currentLinkURL ) {
								// eslint-disable-next-line no-console
								console.error( 'No previous values for link url and content', currentLinkText, currentLinkURL );
								return;
							}

							const saveBtn: NullableHTMLElement = container?.querySelector( saveBtnSelector );

							const _label: HTMLElement = createTooltipLabelElement();
							const tooltipInput: HTMLInputElement = createTooltipInputElement( container, saveBtn );

							// init the input with the current title attribute inside the editor
							const [ link ] = findCurrentLink( currentLinkURL!, currentLinkText! );
							if ( link ) {
								tooltipInput.value = link.getAttribute( ATTRIBUTE ) || '';
							}

							fieldSetOptionsContainer.appendChild( _label );
							fieldSetOptionsContainer.appendChild( tooltipInput );

							if ( saveBtn && ! saveBtn.getAttribute( 'data-listenerTooltip' ) ) {
								// on save, we assign the value of the input to the
								saveBtn.addEventListener( 'click', () => {
									// @TODO: apply only if the button is not disabled.
									const tootipValue = container?.querySelector( `#${ newInputId }` )?.value || '';

									// We need timeout before we update the code editor, so it's not overwritten
									// by the default update of gutenberg.
									setTimeout( () => {
										addAttributeToCurrentLink( tootipValue, currentLinkURL || '', currentLinkText || '' );
									}, 1000 );
								} );
								saveBtn.setAttribute( 'data-listenerTooltip', 'true' );
							} else {
								// eslint-disable-next-line no-console
								console.error( 'Save button not found' );
							}
						}, 1000 );
					}
				}
			} );

			popups.forEach( ( popupEl ) => {
				observer.observe( popupEl, { childList: true, subtree: true } );
				observersForPopups.set( popupEl, observer );
			} );
		}
	} );
} );

